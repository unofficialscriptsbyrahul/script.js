// ==UserScript==
// @name         Diamond Automation
// @match        *://*/*
// @grant        none
// ==/UserScript==

(async function () {

    const SUPABASE_URL =
        "https://drxsofkrssxslczjsjvi.supabase.co/rest/v1/";

    const API_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyeHNvZmtyc3N4c2xjempzanZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTEzMzYsImV4cCI6MjA5NTM4NzMzNn0.2Z4LSse-LtNoqyU_uVBxSyS3iWoT5tz8QAHLYekkPpY";

    const uid = "26866223";

    let autoClicker = null;

    // =========================
    // FETCH USER CONFIG
    // =========================

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/members?uid=eq.${uid}`,
        {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        }
    );

    const data = await response.json();

    console.log("Supabase Data:", data);

    if (!data.length) {
        console.log("Unauthorized");
        return;
    }

    const user = data[0];

    if (!user.active) {
        console.log("Inactive user");
        return;
    }

    console.log("Authorized User:", user);

    // =========================
    // CREATE CONTROL PANEL
    // =========================

    const panel =
        document.createElement("div");

    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.background = "white";
    panel.style.padding = "15px";
    panel.style.borderRadius = "10px";
    panel.style.boxShadow =
        "0 0 10px rgba(0,0,0,0.3)";
    panel.style.zIndex = "999999";
    panel.style.fontFamily = "Arial";

    panel.innerHTML = `
        <h3>Diamond Automation</h3>

        <button id="startAutomation">
            Start
        </button>

        <button id="stopAutomation">
            Stop
        </button>

        <div id="status">
            Status: Idle
        </div>
    `;

    document.body.appendChild(panel);

    const status =
        document.getElementById("status");

    // =========================
    // START BUTTON
    // =========================

    document
    .getElementById("startAutomation")
    .onclick = () => {

        if (autoClicker) return;

        status.innerText =
            "Status: Running";

        autoClicker = setInterval(() => {

            // Target first visible button
            const buttons =
                document.querySelectorAll(
                    "button"
                );

            buttons.forEach(btn => {

                const visible =
                    btn.offsetParent !== null;

                if (visible) {

                    btn.click();

                    console.log(
                        "Clicked:",
                        btn.innerText
                    );

                }

            });

        }, user.click_delay);

    };

    // =========================
    // STOP BUTTON
    // =========================

    document
    .getElementById("stopAutomation")
    .onclick = () => {

        clearInterval(autoClicker);

        autoClicker = null;

        status.innerText =
            "Status: Stopped";

        console.log("Automation stopped");

    };

})();
