// -----------------------------
//  GET BUTTON
// -----------------------------
function getWalletButton() {
    return document.getElementById("walletButton");
}

// -----------------------------
//  UPDATE UI
// -----------------------------
function updateWalletUI() {
    const btn = getWalletButton();
    const stored = localStorage.getItem("wallet");

    if (!btn) return;

    if (stored) {
        btn.innerHTML = `
            ${stored.substring(0, 4)}...${stored.slice(-4)}
            <span id="disconnectWallet" style="
                margin-left:10px;
                color:#ff4444;
                cursor:pointer;
                font-weight:bold;
            ">Çıkış</span>
        `;

        document
            .getElementById("disconnectWallet")
            .addEventListener("click", disconnectWallet);

    } else {
        btn.innerText = "Cüzdan Bağla";
        btn.addEventListener("click", connectWallet);
    }
}

// -----------------------------
//  CONNECT WALLET
// -----------------------------
async function connectWallet() {
    if (!window.solana || !window.solana.isPhantom) {
        alert("Lütfen Phantom Wallet kurun.");
        return;
    }

    try {
        const resp = await window.solana.connect();
        const pub = resp.publicKey.toString();

        localStorage.setItem("wallet", pub);
        updateWalletUI();

        alert("Cüzdan bağlandı: " + pub);
    } catch (e) {
        alert("Bağlantı reddedildi.");
    }
}

// -----------------------------
//  DISCONNECT WALLET
// -----------------------------
async function disconnectWallet() {
    try {
        await window.solana.disconnect();
    } catch (e) {}

    localStorage.removeItem("wallet");
    updateWalletUI();

    alert("Cüzdan bağlantısı kesildi.");
}

// -----------------------------
//  AUTO INIT
// -----------------------------
window.addEventListener("load", updateWalletUI);
