// -----------------------------------------
// Museumeme – Solana MAINNET NFT Mint System
// -----------------------------------------

import {
    Metaplex,
    walletAdapterIdentity,
    bundlrStorage
} from "https://esm.sh/@metaplex-foundation/js";

import {
    Connection
} from "https://esm.sh/@solana/web3.js";

// MAINNET bağlantısı
const connection = new Connection("https://api.mainnet-beta.solana.com");

// Metaplex client
let metaplex;

// Phantom bağlanınca Metaplex hazır olsun
async function setupMetaplex() {
    const provider = window.solana;

    metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(provider))
        .use(
            bundlrStorage({
                address: "https://node1.bundlr.network",
                providerUrl: "https://api.mainnet-beta.solana.com",
                timeout: 60000,
            })
        );
}

// -----------------------------------------
// NFT MINT
// -----------------------------------------
window.mintNFT = async function () {

    const provider = window.solana;

    if (!provider || !provider.isConnected) {
        alert("Lütfen önce Phantom cüzdanınızı bağlayın.");
        return;
    }

    await setupMetaplex();

    const fileInput = document.getElementById("fileInput");
    const nftName = document.getElementById("nftName").value;
    const nftDesc = document.getElementById("nftDesc").value;
    const status = document.getElementById("mintStatus");

    status.innerHTML = "Yükleniyor, lütfen bekleyin...";

    if (!fileInput.files.length) {
        alert("Lütfen fotoğraf yükleyin.");
        status.innerHTML = "";
        return;
    }

    if (!nftName) {
        alert("NFT adı gerekli.");
        status.innerHTML = "";
        return;
    }

    try {
        // 1) Fotoğrafı yükle
        const file = fileInput.files[0];
        const buffer = await file.arrayBuffer();

        const imageUri = await metaplex.storage().upload(buffer);

        // 2) Metadata oluştur
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: nftName,
            description: nftDesc,
            image: imageUri,
        });

        // 3) NFT mint et
        const { nft } = await metaplex.nfts().create({
            uri: uri,
            name: nftName,
            sellerFeeBasisPoints: 200,   // %2 komisyon
        });

        status.innerHTML = "NFT başarıyla oluşturuldu!<br><br>Mint Adresi:<br>" + nft.address.toBase58();
        alert("NFT MINT BAŞARILI!");

    } catch (err) {
        console.error(err);
        status.innerHTML = "HATA: " + err.message;
        alert("Mint hatası: " + err.message);
    }
};
