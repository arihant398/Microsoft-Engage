# UnIon - Arihant Singh, IIIT Delhi!


## Introduction

The aim of this project was to build a fully functional video call app where at least two people are able to communicate with each other.

To use this application visit: https://unionchat.netlify.app/
## Technologies Used

 1. [React](https://reactjs.org/)
 2. [Node.js](https://nodejs.org/en/)
 3. [Express.js](https://expressjs.com/)
 4. [MongoDB](https://www.mongodb.com/)
 5. [Socket.io](https://socket.io/)

## Features
The ultimate goal of this project was to try and build as many functionalities as I could and try to clone as much of Microsoft teams as possible.
The features that I have implemented are:
### Video Chat Screen
 1. **Multiple participants-** Up to 6 people can join a single room. More than 6 people can also join the room but it increases the load.
 2. **Chat-** An option to send and receive messages is present in the app.
	 * Users can send and receive messages before a meeting starts/before they join the meeting.
	 * Users can send and receive messages after a meeting ends once they have added the meeting to their **Personal Rooms**.
 3. **Voice To Text Messaging-** Users can send text messages to each other by using the voice-to-text feature. Users can see the message they said in text form before they send the message to other users.
 4. **Stop Mic/Video-** Users can enable/disable their microphone or camera by clicking separate buttons for both of them.
 5. **Waiting Room-** The host of the meeting can enable/disable waiting room.
	* When Enabled, the host will be notified once a new user joins the waiting room. The host will be able to see the name of the user who has joined and will get the option to let them in the meeting.
 6. **Raise Hand-** Users have the ability to notify other users by clicking on the "raise hand" button. Once a user clicks this button, this users video will have a dark orange border around it on the screens of all the other users in that meeting room.
 7. **Share Screen-** Users have the ability to share their screens. Using this feature, users can replace their video streams with streams of thier screen.
 8. **Mute Individual Participants-** Users have the option to mute individual participants from their side by clicking the speaker button that is present once they hover over a users video.
 9. **Reduce Volume of Individual Participants-** Users have the option to reduce the volume of any participant they want to from their side by hovering over the spearker button and reducing the volume bar that is displayed.
 10. **Full Screen-** Users have the option to view screen of a participant in full screen.
	 >Note: In full screen mode, the user won't be able to use any of the other features until they go to normal screen.
	 
 11. **Add Room To Personal Rooms-** Users have the option to add a room they are currently in to thier **personal rooms**.
	 >Note: This option is not visible if the current room is already a part of the personal rooms.
	 
 12. **Home Button-** Users have the option to open the home screen on a new tab while still being in the meeting by clicking this button.
 13. **End Meeting Button-** Users have the option to leave a meeting by clicking this button.

### Home Screen

 1. **Create Room Button-** On clicking this button, a new meeting room is created with the user who clicked this button as the host.
 2. **Add New Room to Personal Rooms-** Users can add a custom to their **personal rooms** which they can later access. User can set the name and specify whether waiting room should be enabled or disabled.
 3. **View Personal Rooms-** Users can view all of their **personal rooms**.
 4. **Personal Rooms-** Users can join a personal room by clicking the "JOIN" button or chat by clicking the "CHAT" button.
	 >All the previous chat in that room is saved and will be displayed once a user visits the chat room.
	 
 5. **Logout-** Users can logout by clicking this button.

### Chat Screen
 

 1.  **Access To All Personal Rooms-** Users can easily access chat and meeting rooms for all their personal rooms from the left side of their screen.
 
 2.  **Other-** All other features are same as that in the chat which is present in **video chat screen**.

### Login/Register/Guest

 1. **Register/Login-** Users have the option to register themselves on the app and use additional features like **personal rooms** and **chat rooms**.
 2. **Guest-** Users who only want to use the video call and chat feature of the app can use this option. They are not requried to create an account and can easily start a video call or join a video call if they have the link.

## Key/Unique Features

 1. **Voice To Text Messaging-** Users can send text messages to each other by using the **voice-to-text** feature. Users can see the message they said in text form before they send the message to other users.
 2. **Personal Rooms-**  These are custom rooms created by the user which they can access at the click of a button anytime they want. This reduces the hassle to create a new link and sending it to other users everytime they want to chat or have a video call.
	>The users who have access to a personal room can join both the video call and the chat screen.
	 >All the previous chat in that room is saved and will be displayed once a user visits the chat room.
3. **Mute/Reduce Volume Of Individual Participants-** Users have the option to mute individual participants and also reduce volume of indivudual participants on their side.

## Problems Faced
 1. **Adding Multiple Participants-** Creating a video call app which was waorking for more than 2 participants was a problem as I had:
	 * To create a peer connection from a participant to every other participant
	 * Whenerver a new participant left or joined the meeting, remove or add their video to screens of all other participants.
	 * Only form a peer with participants who are part of the meeting and not everyone who is in the waiting room.
 2. **Easy Access To Chat Of All Personal Rooms-** Giving the option to change the chat to any personal room was a problem at first.

## Known Issues

 1. Spamming the **raise hand** button very quicly, sometimes causes the meeting room to crash and users may need to create a new meeting room.
 2. If the users have not added the room to their **personal rooms**, they won't be able to chat in that room using the **chat screen** but they can still continue the conversation after the end of the meeting by going to the waiting room of the meeting.
 3. More than 6 participants at a time in a single meeting room might sometimes cause lag on some devices.
 4. The voice-to-text feature is not available on all browsers.
	 >Note: A list of supported browers is provided below.
### Supported Browsers For Voice-To-Text
 1. Google Chrome
 2. Microsoft Edge
 3. Safari 14.1
 4. Android Webview
 5. Samsung Internet

## Future Updates

 1. **Adding Whiteboard-** A whiteboard feature where users can draw whatever they want and communicate their thoughts with each other.
 2. **Fixing The Known Issues-** Fixing the issues mentioned above is a priority.
 3. **Improvements On Chat Room-** Improving the design and usability of the chat room for users who have not added the room to their **personal rooms**.

## Installation
Developers who want to contribute to the project or see by themselevs how the project is working, can follow the below mentioned steps to install and setup the project in their environment.

 1. Clone the project and "cd" to the root directory in your terminal.
 2.  Enter the following command ``` $ npm install``` 
 3. Create a .env file add following:
	~~~
	PORT=5000
	DATABASE=<YOUR MONGODB URL >
	TOKEN_SECRET=<YOUR SECRET KEY>
	~~~
 4. Enter following commands in terminal
	 ~~~
	 $ cd frontend
	 $ npm install
	~~~
 5. Enter following command in the root directory:
	 ``` $ node index.js```
 6. Enter following comman in the frontend directory:
	 ```$ npm start```
 7. Server will run at port 5000 while the frontend will run at port 3000 of your localhost.

## Deployment
The backend for this app is deployed on heroku while the frontend is deployed on netlify.
To deploy the backend follow the steps below:

 1. Create a heroku account.
 2. Download the heroku cli.
 3. Login to heroku from termial using ```$ heroku login``` in your terminal
 4. Create a new app in heroku using its dashboard.
 5. Follow the steps shown on the dashboard of the newly created heroku app.

To deploy the frontend follow the steps below:

 1. Go to the frontend directory on your terminal.
 2. Enter ```$ npm run build``` on your terminal.
 3. A new folder will be created in the front end directory named **build**.
 4. Open and setup your netlify account.
 5. Create a new site on netlify and drag and drop the **build** folder on netlify.
 6. Wait for the site to be published. (This will take less than a minute)
## Dependencies Used
### Backend
 1. List item
