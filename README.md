# webflare-backend

Step to run this locally:




## FireBase

First you have to set up your firebase account fllow these steps:

- Create a Firebase account at firebase.google.com
- Create a new project in Firebase Console
- Set up Firestore Database
- Get your Firebase configuration (Settings > Project Settings > Your Apps > SDK setup and configuration)
- Get the configuration for your app

## env

-Create a .evn file in your root directory add add this to your .env file:

- FIREBASE_API_KEY=Replace this with your config
- FIREBASE_AUTH_DOMAIN=Replace this with your config
- FIREBASE_PROJECT_ID=Replace this with your config
- FIREBASE_STORAGE_BUCKET=Replace this with your config
- FIREBASE_MESSAGING_SENDER_ID=Replace this with your config
- FIREBASE_APP_ID=Replace this with your config
- FIREBASE_MEASUREMENT_ID=Replace this with your config


## npm

Use npm to install packages. if you dont have npm please follow the instruction from this: https://nodejs.org/en/download
After install npm run this command:
`npm install express cors firebase dotenv`

After that run the program with this command:
`node server,js`
