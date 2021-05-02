const createPictureComponent = (img) => {
  const canvas = document.createElement("canvas");

  canvas.width = 480;
  canvas.height = 360;

  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
};

const canvasFromArrayBuffer = (arrayBuffer) => {
  const canvas = document.createElement("canvas");

  canvas.width = 480;
  canvas.height = 360;

  const context = canvas.getContext("2d");

  const imageData = context.createImageData(canvas.width, canvas.height);
  imageData.data.set(arrayBuffer);

  context.putImageData(imageData, 0, 0);

  return canvas;
};

const sendPicture = (pc, addMSG) => {
  console.log("Sending picture");
  const channel = pc.createDataChannel("image");
  channel.binaryType = "arraybuffer";
  const picture = createPictureComponent(videoElement);
  const imageBuffer = picture
    .getContext("2d")
    .getImageData(0, 0, picture.width, picture.height).data.buffer;

  console.log(picture.toDataURL());

  channel.onopen = () => {
    for (let i = 0; i < imageBuffer.byteLength; i += MAX_IMAGE_SIZE) {
      channel.send(imageBuffer.slice(i, i + MAX_IMAGE_SIZE));
    }
    channel.send(EOF_FLAG);
  };

  addMSG(picture, "picture");
};

function dcInit(dc, addMSG) {
  dc.onopen = function () {
    $("textarea").attr("disabled", true);
    addMSG("CONNECTED!", "info");
  };

  if (dc.label === "chat") {
    textChannel = dc;

    dc.onmessage = function (e) {
      console.log("Message received", e);
      if (e.data) addMSG(e.data, "other");
    };
  }

  const rxBuffers = [];

  if (dc.label === "image") {
    dc.onmessage = (event) => {
      if (event.data !== EOF_FLAG) {
        rxBuffers.push(event.data);
      } else {
        const arrayBuffer = rxBuffers.reduce((acc, arrayBuffer) => {
          const tmp = new Uint8ClampedArray(
            acc.byteLength + arrayBuffer.byteLength
          );
          tmp.set(new Uint8ClampedArray(acc), 0);
          tmp.set(new Uint8ClampedArray(arrayBuffer), acc.byteLength);
          return tmp;
        }, new Uint8ClampedArray());

        const canvas = canvasFromArrayBuffer(arrayBuffer);

        addMSG(canvas, "picture");

        dc.close();
      }
    };
  }
}
