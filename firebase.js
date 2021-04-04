import firebase from 'firebase'


  const firebaseConfig = {
    apiKey: process.env.DB_APIKEY,
    authDomain: process.env.DB_AD,
    projectId: process.env.DB_PI,
    storageBucket: process.env.DB_SB,
    messagingSenderId: process.env.DB_MS,
    appId: process.env.DB_APPID
  };

  // Initialize Firebase
  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig): firebase.app();
  //access to the database
  const db = app.firestore()
    //accss to authenication
  const auth = app.auth()

  const provider = new firebase.auth.GoogleAuthProvider()

  export {db, auth, provider}