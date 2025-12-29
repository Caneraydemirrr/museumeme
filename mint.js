import {
    Connection,
    clusterApiUrl,
    Keypair,
    PublicKey,
} from "https://cdn.jsdelivr.net/npm/@solana/web3.js@1.89.0/+esm";

import {
    Metaplex,
    keypairIdentity,
    irysStorage
} from "https://esm.sh/@metaplex-foundation/js@0.19.5";

let walletPublicKey = null;

// Wallet bağlantısı
window.connectWallet = async function () {
    try {
        const resp = await window.solana.connect();
        walletPublicKey = resp.publicKey.toString();
        alert("Cüzdan bağlandı: " + walletPublicKey);
    } catch (err) {
        alert("Cüzdan bağlanamadı.");
    }
};


// NFT MINT
window.mintNFT = async function () {
    const fileInput = document.getElementById("fileInput");
    const name = document.getElementById("nftName").value;
    const description = document.getElementById("nftDesc").value;

    if (!walletPublicKey) {
        alert("Önce Phantom cüzdan bağlayın!");
        return;
    }

    if (fileInput.files.length === 0) {
        alert("Bir fotoğraf yüklemelisiniz!");
        return;
    }

    const file = fileInput.files[0];
    const imageBuffer = await file.arrayBuffer();

    const connection = new Connection("https://api.mainnet-beta.solana.com");

    const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(Keypair.generate()))
        .use(irysStorage({
            address: "https://node1.irys.xyz",
            providerUrl: "https://api.mainnet-beta.solana.com",
            timeout: 60000
        }));


    // ---- NFT Upload & Mint ----
    try {
        const { uri } = await metaplex.nfts().uploadMetadata({
            name,
            description,
            image: {
                buffer: Buffer.from(imageBuffer),
                filename: file.name,
                contentType: file.type
            }
        });

        const { nft } = await metaplex.nfts().create({
            uri,
            name,
            sellerFeeBasisPoints: 200, // %2 komisyon
        });

        alert("NFT başarıyla oluşturuldu!\nMint Address:\n" + nft.address.toString());

    } catch (e) {
        console.error(e);
        alert("NFT oluşturulurken hata oluştu.");
    }
}
