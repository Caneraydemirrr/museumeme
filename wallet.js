async function connectWallet() {
    if (window.solana && window.solana.isPhantom) {
        const resp = await window.solana.connect();
        localStorage.setItem("wallet", resp.publicKey.toString());
        alert("Cüzdan bağlandı: " + resp.publicKey.toString());
    } else {
        alert("Lütfen Phantom Wallet yükleyin.");
    }
}
// Headerdaki butonu güncelle
function updateWalletButton(pubkey) {
    const btn = document.querySelector(".btn");

    if (!btn) return;

    if (pubkey) {
        btn.innerText = pubkey.substring(0, 4) + "..." + pubkey.slice(-4);
    } else {
        btn.innerText = "Cüzdan Bağla";
    }
}

// Cüzdan bağlanınca güncelle
window.connectWallet = async function () {
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect();
            const pubKey = resp.publicKey.toString();

            localStorage.setItem("wallet", pubKey);
            updateWalletButton(pubKey);

            alert("Cüzdan bağlandı: " + pubKey);

        } catch (err) {
            alert("Cüzdan bağlama reddedildi.");
        }
    } else {
        alert("Lütfen Phantom Wallet kurun.");
    }
};

// Sayfa açılınca cüzdan kontrolü
window.onload = function () {
    const saved = localStorage.getItem("wallet");
    if (saved) {
        updateWalletButton(saved);
    }
};
