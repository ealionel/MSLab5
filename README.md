# Features implemented :

- Possiblity to send images to other end user
- Image sent over the network is a canvas UInt8ClampedArray buffer in chunks



# Requirements for streaming application
There are two options to choose from. 

Option A:
  - Capture images from camera by using WebRTC API. Basic code for chat application is provided.
  - By using RTCPeerConnection send images from camera to the client and display them.
  - You can use base64 to encode image to string and decode on client side.
  
Option B:
  - Find out how WebRTC API is designed.
  - Create client and server pages.
  - Server page should capture video from browser.
  - Client page should display stream. 
  
  
The general requirements for option A & B.
  - Test application on at least two browsers and specify in README.md which version and browser it was.
  - To pass this lab, you have to fully complete an option.  