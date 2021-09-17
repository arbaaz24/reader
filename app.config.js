import 'dotenv/config';
export default{
  "expo": {
    "name": "reader",
    "slug": "reader",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./app/assets/icon.png",
    "splash": {
      "image": "./app/assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./app/assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "versionCode": 1
    },
    "web": {
      "favicon": "./app/assets/favicon.png"
    },
    "extra":{
      apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.PROJECT_ID,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
    }
  }
};
