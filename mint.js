import {
    Connection,
    PublicKey
} from "https://cdn.jsdelivr.net/npm/@solana/web3.js@1.89.0/+esm";

import {
    Metaplex,
    walletAdapterIdentity,
    irysStorage
} from "https://esm.sh/@metaplex-foundation/js@0.19.5";

// Wallet çek
function getWallet() {
    return localStorage.getItem("wallet");
}

// -----------------------------
//  NFT MINT
// -----------------------------
async function mintNFT() {

    const mintStatus = document.getElementById("mintStatus");
    mintStatus.innerText = "";

    const walletPub = getWallet();
    if (!walletPub) return alert("Önce Phantom bağlayın!");

    const fileInput = document.getElementById("fileInput");
    const name = document.getElementById("nftName").value;
    const desc = document.getElementById("nftDesc").value;

    if (!fileInput.files.length) return alert("Fotoğraf yüklemelisiniz!");

    const file = fileInput.files[0];
    const imgBuffer = new Uint8Array(await file.arrayBuffer());

    mintStatus.innerText = "⏳ NFT yükleniyor...";

    const connection = new Connection("https://api.mainnet-beta.solana.com");

    const wallet = window.solana;

    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(irysStorage({
            address: "https://node1.irys.xyz",
            providerUrl: "https://api.mainnet-beta.solana.com",
            timeout: 60000
        }));

    try {
        // 1) Metadata upload
        const { uri } = await metaplex.nfts().uploadMetadata({
            name,
            description: desc,
            image: {
                buffer: imgBuffer,
                fileName: file.name,
                contentType: file.type
            }
        });

        // 2) NFT mint
        const { nft } = await metaplex.nfts().create({
            uri,
            name,
            sellerFeeBasisPoints: 200,
            seller: new PublicKey(walletPub)
        });

        mintStatus.innerText =
            "🎉 NFT Mint Başarılı!\n" + nft.address.toString();

        alert("NFT oluşturuldu!");

    } catch (err) {
        console.error(err);
        mintStatus.innerText = "❌ Hata: " + err.message;
        alert("NFT mint sırasında hata oluştu.");
    }
}

// Buton tetikleyici
window.addEventListener("load", () => {
    document.getElementById("mintBtn").addEventListener("click", mintNFT);
});
