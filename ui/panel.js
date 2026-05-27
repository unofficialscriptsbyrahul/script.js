export function createPanel(){

  const panel =
  document.createElement("div");

  panel.id = "wallet-panel";

  panel.innerHTML = `
  
    <h3>Wallet Bot</h3>

    <input
      id="amountInput"
      placeholder="Amount"
    />

    <button id="startBtn">
      Start
    </button>

    <button id="stopBtn">
      Stop
    </button>

    <div id="logs"></div>

  `;

  document.body.appendChild(panel);

}
