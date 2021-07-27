import firebase from 'firebase/app'
import 'firebase/storage' ;
const firebaseConfig = {
  apiKey: "AIzaSyDBVquYL98pW-TlVvfbZzPz_gy4urz-rBk",
  authDomain: "mern-social-media-fc108.firebaseapp.com",
  projectId: "mern-social-media-fc108",
  storageBucket: "mern-social-media-fc108.appspot.com",
  messagingSenderId: "1094651168268",
  appId: "1:1094651168268:web:5c061c2624c5b2dd959029",
  measurementId: "G-JSG0Q8X3BC"
};
const firebaseApp = firebase.initializeApp(firebaseConfig); 
  const storage = firebaseApp.storage();
  
  export {storage,firebase as default};