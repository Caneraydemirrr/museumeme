// Kullanıcı profil sayfası

window.onload = () => {
    const addressDiv = document.getElementById("walletAddress");
    const nftDiv = document.getElementById("myNfts");

    // Cüzdan bağlandıysa localStorage'dan çek
    const wallet = localStorage.getItem("museumeme_wallet");

    if (wallet) {
        addressDiv.innerHTML = `<strong>Cüzdan:</strong> ${wallet}`;
    } else {
        addressDiv.innerHTML = "Cüzdan bağlı değil.";
    }

    // Kullanıcının sahip olduğu NFT’ler (şimdilik demo veri)
    const ownedNFTs = [
        {
            name: "My Meme NFT #1",
            image: "https://i.imgur.com/OKNQ1B2.jpeg"
        }
    ];

    ownedNFTs.forEach(nft => {
        const item = document.createElement("div");
        item.innerHTML = `
            <img src="${nft.image}" width="220" style="border-radius:12px;">
            <p>${nft.name}</p>
        `;
        nftDiv.appendChild(item);
    });
};
