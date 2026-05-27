// ==UserScript==
// @name         Wallet Automation Base
// @namespace    wallet-automation
// @version      1.0
// @description  Firebase Realtime Automation Base
// @match        *://*/*
// @grant        none
// ==/UserScript==

(async function () {

  // =========================
  // PREVENT DOUBLE LOAD
  // =========================

  if (window.__WALLET_BOT__) return;

  window.__WALLET_BOT__ = true;

  console.log("Wallet Automation Loaded");

  // =========================
  // LOAD ERUDA
  // =========================

  const erudaScript =
    document.createElement("script");

  erudaScript.src =
    "https://cdn.jsdelivr.net/npm/eruda";

  document.body.appendChild(erudaScript);

  erudaScript.onload = () => {

    eruda.init();

    console.log("Eruda Ready");

  };

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

    firebase.initializeApp(
      firebaseConfig
    );

    const db =
      firebase.firestore();

    console.log(
      "Firestore Connected"
    );

    // =========================
    // GLOBAL STATE
    // =========================

    const BOT = {

      active: false,

      selectedAmount: "100",

      autoClick: false,

      clickDelay: 1000,

      observer: null,

      logs: []

    };

    // =========================
    // LOG FUNCTION
    // =========================

    async function log(message) {

      console.log(
        "[BOT]",
        message
      );

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

      updateLogsUI(message);

    }

    // =========================
    // UI PANEL
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

        <label>
          <input type="checkbox" id="autoClickToggle" />
          Auto Click
        </label>

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
    // STYLES
    // =========================

    function injectStyles() {

      const style =
        document.createElement("style");

      style.innerHTML = `

        #wallet-bot-panel{

          position:fixed;
          right:20px;
          bottom:20px;

          width:260px;

          background:white;

          border-radius:14px;

          padding:14px;

          z-index:999999;

          box-shadow:
          0 10px 30px rgba(0,0,0,.2);

          font-family:sans-serif;

        }

        #wallet-header{

          font-size:18px;
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

          background:#f5f5f5;

          padding:8px;

          border-radius:10px;

        }

      `;

      document.head.appendChild(style);

    }

    // =========================
    // UPDATE LOG UI
    // =========================

    function updateLogsUI(message) {

      const logBox =
        document.querySelector(
          "#walletLogs"
        );

      if (!logBox) return;

      const item =
        document.createElement("div");

      item.innerText = message;

      logBox.prepend(item);

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

      const autoClickToggle =
        document.querySelector(
          "#autoClickToggle"
        );

      startBtn.onclick = () => {

        BOT.active = true;

        BOT.selectedAmount =
          amountInput.value;

        BOT.autoClick =
          autoClickToggle.checked;

        startObserver();

        log("Bot Started");

      };

      stopBtn.onclick = () => {

        BOT.active = false;

        stopObserver();

        log("Bot Stopped");

      };

    }

    // =========================
    // ELEMENT VISIBILITY
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
    // FIND MATCHING ELEMENTS
    // =========================

    function scanAmounts() {

      if (!BOT.active) return;

      const elements =
        [...document.querySelectorAll("*")]
        .filter(el => {

          return (
            el.innerText &&
            el.innerText.includes(
              `₹${BOT.selectedAmount}`
            )
          );

        });

      elements.forEach(el => {

        el.style.outline =
          "2px solid lime";

        const button =
          findNearbyButton(el);

        if (
          button &&
          isVisible(button)
        ) {

          button.style.outline =
            "2px solid red";

          log(
            `Matched ₹${BOT.selectedAmount}`
          );

          // OPTIONAL AUTO CLICK
          // Enable carefully only in safe/testing environments.
          // if (BOT.autoClick) {
          //   setTimeout(() => {
          //     button.click();
          //     log("Button Clicked");
          //   }, BOT.clickDelay);
          // }

        }

      });

    }

    // =========================
    // FIND NEARBY BUTTON
    // =========================

    function findNearbyButton(el) {

      let parent =
        el.parentElement;

      while (parent) {

        const button =
          parent.querySelector(
            "button"
          );

        if (button) {
          return button;
        }

        parent =
          parent.parentElement;

      }

      return null;

    }

    // =========================
    // OBSERVER
    // =========================

    function startObserver() {

      if (BOT.observer) return;

      BOT.observer =
        new MutationObserver(() => {

          scanAmounts();

        });

      BOT.observer.observe(
        document.body,
        {
          childList: true,
          subtree: true
        }
      );

      scanAmounts();

    }

    // =========================
    // STOP OBSERVER
    // =========================

    function stopObserver() {

      if (BOT.observer) {

        BOT.observer.disconnect();

        BOT.observer = null;

      }

    }

    // =========================
    // REALTIME SETTINGS
    // =========================

    db.collection("settings")
      .onSnapshot(snapshot => {

        snapshot.forEach(doc => {

          const data =
            doc.data();

          console.log(
            "Realtime Settings",
            data
          );

        });

      });

    // =========================
    // INITIALIZE
    // =========================

    createPanel();

    log(
      "System Initialized"
    );

  };

})();
