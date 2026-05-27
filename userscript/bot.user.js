// ==UserScript==
// @name Wallet Automation
// @match *://*/*
// @grant none
// ==/UserScript==

(async function(){

  console.log(
    "Wallet Automation Loaded"
  );

  // LOAD SUPABASE SDK
  const script =
  document.createElement("script");

  script.src =
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js";

  document.body.appendChild(script);

  script.onload = async () => {

    console.log(
      "Supabase Loaded"
    );

    // CREATE CLIENT
    const client =
    supabase.createClient(

      "https://drxsofkrssxslczjsjvi.supabase.co",

      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyeHNvZmtyc3N4c2xjempzanZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTEzMzYsImV4cCI6MjA5NTM4NzMzNn0.2Z4LSse-LtNoqyU_uVBxSyS3iWoT5tz8QAHLYekkPpY"

    );

    console.log(
      "Client Connected",
      client
    );

    // TEST DATABASE
    const { data,error } =
    await client
    .from("queue")
    .select("*");

    console.log(
      "QUEUE DATA:",
      data
    );

    console.log(
      "ERROR:",
      error
    );

  };

})();
