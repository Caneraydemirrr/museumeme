async function connectWallet() {
    if (window.solana && window.solana.isPhantom) {
        const resp = await window.solana.connect();
        localStorage.setItem("wallet", resp.publicKey.toString());
        alert("Cüzdan bağlandı: " + resp.publicKey.toString());
    } else {
        alert("Lütfen Phantom Wallet yükleyin.");
    }
}
