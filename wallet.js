// -----------------------------
//  WALLET BUTTON ELEMENT
// -----------------------------
function getWalletButton() {
    return document.getElementById("walletButton");
}

// -----------------------------
//  UPDATE BUTTON UI
// -----------------------------
function updateWalletUI() {
    const btn = getWalletButton();
    const stored = localStorage.getItem("wallet");

    if (!btn) return;

    if (stored) {
        // Bağlı cüzdan görünümü
        btn.innerHTML = `
            ${stored.substring(0, 4)}...${stored.slice(-4)}
            <span id="disconnectBtn" style="
                margin-left:10px;
                cursor:pointer;
                color:#ff4444;
                font-weight:bold;
            ">Çıkış Yap</span>
        `;

        // Çıkış yapma olayı
        const dc = document.getElementById("disconnectBtn");
        if (dc) {
            dc.onclick = disconnectWallet;
        }

    } else {
        // Bağlı değilken
        btn.innerHTML = "Cüzdan Bağla";
        btn.onclick = connectWallet;
    }
}

// -----------------------------
//  CONNECT WALLET
// -----------------------------
window.connectWallet = async function () {
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect();
            const pubKey = resp.publicKey.toString();

            localStorage.setItem("wallet", pubKey);
            updateWalletUI();

            alert("Cüzdan bağlandı: " + pubKey);

        } catch (err) {
            alert("Cüzdan bağlama reddedildi.");
        }
    } else {
        alert("Lütfen Phantom Wallet kurun.");
    }
};

// -----------------------------
//  DISCONNECT WALLET
// -----------------------------
window.disconnectWallet = async function () {
    try {
        await window.solana.disconnect();
    } catch (e) {
        // Phantom eski sürümse disconnect olmayabilir
    }

    localStorage.removeItem("wallet");
    updateWalletUI();

    alert("Cüzdan bağlantısı kesildi.");
};

// -----------------------------
//  AUTO LOAD
// -----------------------------
window.onload = function () {
    updateWalletUI();
};
