import {
    Connection,
    PublicKey
} from "https://cdn.jsdelivr.net/npm/@solana/web3.js@1.89.0/+esm";

import {
    Metaplex,
    walletAdapterIdentity,
    irysStorage
} from "https://esm.sh/@metaplex-foundation/js@0.19.5";

// Cüzdan public key çek
function getWallet() {
    return localStorage.getItem("wallet");
}

// NFT Mint fonksiyonu
window.mintNFT = async function () {

    const mintStatus = document.getElementById("mintStatus");
    mintStatus.innerText = "";

    const walletPubKey = getWallet();

    if (!walletPubKey) {
        alert("Önce Phantom cüzdan bağlayın!");
        return;
    }

    const fileInput = document.getElementById("fileInput");
    const name = document.getElementById("nftName").value;
    const desc = document.getElementById("nftDesc").value;

    if (!fileInput.files.length) {
        alert("Fotoğraf yüklemelisiniz!");
        return;
    }

    const file = fileInput.files[0];
    const imgBuffer = await file.arrayBuffer();

    mintStatus.innerText = "⏳ NFT yükleniyor... Lütfen bekleyin.";

    // Solana bağlantısı
    const connection = new Connection("https://api.mainnet-beta.solana.com");

    // Phantom adaptörü
    const wallet = window.solana;

    // Metaplex başlat
    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(irysStorage({
            address: "https://node1.irys.xyz",
            providerUrl: "https://api.mainnet-beta.solana.com",
            timeout: 60000
        }));

    try {
        // 1- Metadata + Görsel yükle
        const { uri } = await metaplex.nfts().uploadMetadata({
            name,
            description: desc,
            image: {
                buffer: new Uint8Array(imgBuffer),
                fileName: file.name,
                contentType: file.type
            }
        });

        // 2- NFT Mint et
        const { nft } = await metaplex.nfts().create({
            uri,
            name,
            sellerFeeBasisPoints: 200, // %2 komisyon
            seller: new PublicKey(walletPubKey)
        });

        mintStatus.innerText =
            "🎉 NFT Mint Başarılı!\nMint Address: " + nft.address.toString();

        alert("NFT başarıyla oluşturuldu!");

    } catch (err) {
        console.error(err);
        mintStatus.innerText = "❌ Hata oluştu: " + err.message;
        alert("NFT oluşturulurken hata oluştu.");
    }
};

// Butona tıklanabilirlik fix
document.getElementById("mintBtn").addEventListener("click", window.mintNFT);
