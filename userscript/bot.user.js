// ==UserScript==
// @name Wallet Automation
// @match *://*/*
// @grant none
// ==/UserScript==

(async function(){

  console.log(
    "Wallet Automation Loaded"
  );

  // LOAD FIREBASE APP
  const appScript =
  document.createElement("script");

  appScript.src =
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";

  document.body.appendChild(appScript);

  // LOAD FIRESTORE
  const dbScript =
  document.createElement("script");

  dbScript.src =
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";

  document.body.appendChild(dbScript);

  dbScript.onload = () => {

    // FIREBASE CONFIG
    const firebaseConfig = {

      apiKey: "AIzaSyBq_EeGjwmyx1Y9z-8M9oy6KoGFa7pNuC8",

      authDomain: "wallet-automation-75a22.firebaseapp.com",

      projectId: "wallet-automation-75a22",

      storageBucket: "wallet-automation-75a22.firebasestorage.app",

      messagingSenderId:
      "49734789897",

      appId: "1:49734789897:web:64ca55d6c6efc591e841d8"

    };

    // INIT FIREBASE
    firebase.initializeApp(
      firebaseConfig
    );

    const db =
    firebase.firestore();

    console.log(
      "Firestore Connected"
    );

    // TEST LOG INSERT
    db.collection("logs")
    .add({

      message:"Bot Started",

      createdAt:Date.now()

    });

  };

})();
