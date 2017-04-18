import firebase from 'firebase';
import axios from 'axios';

const cloudFunctionsAxios = axios.create({
  baseURL: 'https://us-central1-duelour.cloudfunctions.net/'
});

try {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY || 'firebase_api_key',
    authDomain: 'duelour.firebaseapp.com',
    databaseURL: 'https://duelour.firebaseio.com',
    projectId: 'duelour',
    storageBucket: 'duelour.appspot.com',
    messagingSenderId: '205349926131'
  });
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

export const normalizeFbObject = fbObject => {
  const objectKey = Object.keys(fbObject)[0];
  return { key: objectKey, ...fbObject[objectKey] };
};

export const auth = firebase.auth;
export const cloudFunctions = cloudFunctionsAxios;
export const database = firebase.database().ref('v0');
export default firebase;
