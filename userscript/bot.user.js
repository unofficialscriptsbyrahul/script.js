// ==UserScript==
// @name         Wallet Automation
// @namespace    wallet-bot
// @version      1.0
// @description  Firebase Realtime Automation Base
// @match        *://*/*
// @grant        none
// ==/UserScript==

(async function () {

  console.log("Wallet Automation Loaded");

  // =========================
  // LOAD FIREBASE SDK
  // =========================

  const appScript =
    document.createElement("script");

  appScript.src =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";

  document.body.appendChild(appScript);

  const dbScript =
    document.createElement("script");

  dbScript.src =
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";

  document.body.appendChild(dbScript);

  // =========================
  // FIREBASE READY
  // =========================

  dbScript.onload = () => {

    console.log("Firebase SDK Loaded");

    // =========================
    // FIREBASE CONFIG
    // =========================

    const firebaseConfig = {

      apiKey:
        "AIzaSyBq_EeGjwmyx1Y9z-8M9oy6KoGFa7pNuC8",

      authDomain:
        "wallet-automation-75a22.firebaseapp.com",

      projectId:
        "wallet-automation-75a22",

      storageBucket:
        "wallet-automation-75a22.firebasestorage.app",

      messagingSenderId:
        "49734789897",

      appId:
        "1:49734789897:web:64ca55d6c6efc591e841d8"

    };

    // =========================
    // INIT FIREBASE
    // =========================

    firebase.initializeApp(
      firebaseConfig
    );

    const db =
      firebase.firestore();

    console.log(
      "Firestore Connected"
    );

    // =========================
    // GLOBAL BOT STATE
    // =========================

    const BOT = {

      active: false,

      selectedAmount: "100",

      logs: [],

      observer: null

    };

    // =========================
    // LOG FUNCTION
    // =========================

    async function log(message) {

      console.log("[BOT]", message);

      BOT.logs.push({
        message,
        time: Date.now()
      });

      try {

        await db
          .collection("logs")
          .add({

            message,

            createdAt:
              Date.now()

          });

      } catch (err) {

        console.log(err);

      }

    }

    // =========================
    // FLOATING UI PANEL
    // =========================

    function createPanel() {

      const panel =
        document.createElement("div");

      panel.id =
        "wallet-bot-panel";

      panel.innerHTML = `

        <div id="wallet-header">
          Wallet Automation
        </div>

        <input
          id="amountInput"
          placeholder="Amount"
          value="100"
        />

        <button id="startBtn">
          START
        </button>

        <button id="stopBtn">
          STOP
        </button>

        <div id="walletLogs"></div>

      `;

      document.body.appendChild(panel);

      injectStyles();

      setupButtons();

    }

    // =========================
    // PANEL STYLE
    // =========================

    function injectStyles() {

      const style =
        document.createElement("style");

      style.innerHTML = `

        #wallet-bot-panel{

          position:fixed;
          right:20px;
          bottom:20px;

          width:240px;

          background:white;

          border-radius:14px;

          padding:14px;

          z-index:999999;

          box-shadow:
          0 10px 30px rgba(0,0,0,.2);

          font-family:sans-serif;

        }

        #wallet-header{

          font-weight:bold;
          margin-bottom:10px;

        }

        #wallet-bot-panel input,
        #wallet-bot-panel button{

          width:100%;

          padding:10px;

          margin-top:10px;

          border-radius:10px;

          border:1px solid #ddd;

        }

        #walletLogs{

          margin-top:10px;

          max-height:120px;

          overflow:auto;

          font-size:12px;

        }

      `;

      document.head.appendChild(style);

    }

    // =========================
    // BUTTON EVENTS
    // =========================

    function setupButtons() {

      const startBtn =
        document.querySelector(
          "#startBtn"
        );

      const stopBtn =
        document.querySelector(
          "#stopBtn"
        );

      const amountInput =
        document.querySelector(
          "#amountInput"
        );

      startBtn.onclick = () => {

        BOT.active = true;

        BOT.selectedAmount =
          amountInput.value;

        startObserver();

        log(
          "Bot Started"
        );

      };

      stopBtn.onclick = () => {

        BOT.active = false;

        stopObserver();

        log(
          "Bot Stopped"
        );

      };

    }

    // =========================
    // VISIBILITY CHECK
    // =========================

    function isVisible(el) {

      if (!el) return false;

      const rect =
        el.getBoundingClientRect();

      return (

        rect.width > 0 &&
        rect.height > 0 &&

        rect.top <
        window.innerHeight &&

        rect.bottom > 0

      );

    }

    // =========================
    // FILTER LOGIC
    // =========================

    function filterAmounts() {

      if (!BOT.active) return;

      document
        .querySelectorAll("*")
        .forEach(el => {

          if (
            el.innerText?.includes("₹")
          ) {

            if (
              el.innerText.includes(
                `₹${BOT.selectedAmount}`
              )
            ) {

              el.style.outline =
                "2px solid green";

            }

          }

        });

    }

    // =========================
    // OBSERVER
    // =========================

    function startObserver() {

      if (BOT.observer) return;

      BOT.observer =
        new MutationObserver(() => {

          filterAmounts();

        });

      BOT.observer.observe(
        document.body,
        {

          childList: true,
          subtree: true

        }
      );

    }

    // =========================
    // STOP OBSERVER
    // =========================

    function stopObserver() {

      if (
        BOT.observer
      ) {

        BOT.observer.disconnect();

        BOT.observer = null;

      }

    }

    // =========================
    // REALTIME SETTINGS LISTENER
    // =========================

    db.collection("settings")
      .onSnapshot(snapshot => {

        snapshot.forEach(doc => {

          const data =
            doc.data();

          BOT.active =
            data.active;

          BOT.selectedAmount =
            data.selected_amount;

          console.log(
            "Realtime Settings",
            data
          );

        });

      });

    // =========================
    // INITIALIZE UI
    // =========================

    createPanel();

    log(
      "System Initialized"
    );

  };

})();
