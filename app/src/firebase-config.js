// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: 'AIzaSyCScHbuaCEpI3icOAfzHI8Aol3DGTHp-qk',
    authDomain: 'iotprojectbillingstore.firebaseapp.com',
    databaseURL: 'https://iotprojectbillingstore-default-rtdb.firebaseio.com',
    projectId: 'iotprojectbillingstore',
    storageBucket: 'iotprojectbillingstore.appspot.com',
    messagingSenderId: '1058934529602',
    appId: '1:1058934529602:web:da413f00f6e39a71d717db',
    measurementId: 'G-RSLVLFWEH2',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
