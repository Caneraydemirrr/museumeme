// Basit Marketplace listeleme sistemi

const nftList = [
    {
        name: "Museumeme NFT #1",
        image: "https://i.imgur.com/OKNQ1B2.jpeg",
        price: "0.2 SOL"
    },
    {
        name: "Museumeme NFT #2",
        image: "https://i.imgur.com/Qa0CwTx.jpeg",
        price: "0.3 SOL"
    },
    {
        name: "Museumeme NFT #3",
        image: "https://i.imgur.com/6Y8R7Ux.jpeg",
        price: "0.1 SOL"
    }
];

window.onload = () => {
    const marketDiv = document.getElementById("marketItems");

    nftList.forEach(nft => {
        const item = document.createElement("div");
        item.innerHTML = `
            <img src="${nft.image}" width="250" style="border-radius:12px;">
            <h3>${nft.name}</h3>
            <p>Fiyat: ${nft.price}</p>
            <button class="btn">Satın Al</button>
        `;
        marketDiv.appendChild(item);
    });
};
