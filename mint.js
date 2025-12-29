// -------------------------------
// MUSEUMEME NFT MINT SYSTEM
// SOLANA MAINNET + NFT.STORAGE
// -------------------------------

// Metaplex SDK
import {
    Metaplex,
    keypairIdentity,
    bundlrStorage,
} from "https://esm.sh/@metaplex-foundation/js";

// Solana web3
import {
    Connection,
    clusterApiUrl,
    PublicKey
} from "https://esm.sh/@solana/web3.js";

// Connection — MAINNET
const connection = new Connection("https://api.mainnet-beta.solana.com");

// Metaplex Setup
let metaplex;

// Cüzdan bağlandığında Metaplex hazır olsun
async function setupMetaplex() {
    const wallet = window.solana;

    metaplex = Metaplex.make(connection)
        .use(keypairIdentity(wallet))
        .use(bundlrStorage({
            address: "https://node1.bundlr.network",
            providerUrl: "https://api.mainnet-beta.solana.com",
            timeout: 60000,
        }));
}



// -------------------------------
// NFT MINT FUNCTION
// -------------------------------
window.mintNFT = async function () {

    const wallet = window.solana;

    if (!wallet || !wallet.isConnected) {
        alert("Lütfen önce cüzdanınızı bağlayın.");
        return;
    }

    await setupMetaplex();

    const fileInput = document.getElementById("fileInput");
    const nftName = document.getElementById("nftName").value;
    const nftDesc = document.getElementById("nftDesc").value;

    if (!fileInput.files.length) {
        alert("Lütfen bir fotoğraf yükleyin.");
        return;
    }
    if (!nftName) {
        alert("NFT adı boş olamaz.");
        return;
    }

    const file = fileInput.files[0];
    const buffer = await file.arrayBuffer();

    try {
        // 1 – Fotoğrafı yükleme (Metaplex + Bundlr)
        const uploadedImage = await metaplex.storage().upload(buffer);

        // 2 – Metadata oluşturma
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: nftName,
            description: nftDesc,
            image: uploadedImage,
        });

        // 3 – MINT işlemi
        const { nft } = await metaplex.nfts().create({
            uri: uri,
            name: nftName,
            sellerFeeBasisPoints: 200,  // %2 komisyon
        });

        alert("NFT başarıyla oluşturuldu! Mint Adresi:\n" + nft.address.toBase58());
    }

    catch (err) {
        console.error(err);
        alert("Mint işlemi sırasında hata oluştu: " + err.message);
    }

}
