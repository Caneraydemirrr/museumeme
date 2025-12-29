// Phantom cüzdana bağlanma
window.connectWallet = async function () {
    if (window.solana && window.solana.isPhantom) {
        try {
            const resp = await window.solana.connect();
            const pubKey = resp.publicKey.toString();

            localStorage.setItem("wallet", pubKey);

            alert("Cüzdan bağlandı: " + pubKey);

        } catch (err) {
            alert("Cüzdan bağlama reddedildi.");
        }
    } else {
        alert("Lütfen Phantom Wallet kurun.");
    }
};

// Sayfa açıldığında cüzdan bağlı mı kontrol et
window.onload = function () {
    if (window.solana && window.solana.isPhantom) {
        window.solana.connect({ onlyIfTrusted: true })
            .then(res => {
                if (res.publicKey) {
                    localStorage.setItem("wallet", res.publicKey.toString());
                }
            })
            .catch(() => {});
    }
};
