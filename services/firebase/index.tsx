import fb from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
// @ts-ignore
import { FIREBASE_APIKEY, FIREBASE_AUTHDOMAIN, FIREBASE_MEASUREMENTID, FIREBASE_DATABASEURL, FIREBASE_PROJECTID, FIREBASE_STORAGEBUCKET, FIREBASE_MESSAGINGSENDERID, FIREBASE_APPID } from '@env';

const firebaseConfig = {
    apiKey: FIREBASE_APIKEY,
    authDomain: FIREBASE_AUTHDOMAIN,
    databaseURL: FIREBASE_DATABASEURL,
    projectId: FIREBASE_PROJECTID,
    storageBucket: FIREBASE_STORAGEBUCKET,
    messagingSenderId: FIREBASE_MESSAGINGSENDERID,
    appId: FIREBASE_APPID,
    measurementId: FIREBASE_MEASUREMENTID
};

export const myFire = !fb.apps.length ? fb.initializeApp(firebaseConfig) : fb.app();
export const fireDb = myFire.firestore();
export const fireStorage = myFire.storage();

// Initialize Firebase
// export const firebase = () => {
//     firebase.apps.length === 0 && firebase.initializeApp(firebaseConfig)

//     if (firebase.apps.length > 0) {
//         console.log('firebase initialized')
//     }

// };
//   firebase.analytics();