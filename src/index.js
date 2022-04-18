import { connectWalletBtn, initializeConnection } from './connect'
import { NFTTrader } from './contract'


const nftTrader = new NFTTrader()
window.nftTrader = nftTrader

async function buyNFT(itemIndex, price) {
    let modal = document.getElementById("buy-method-modal")

    document.getElementById("buy-with-pix").onclick = async ()=>{myModal.hide(); await nftTrader.buyWithFiat(itemIndex, price)}
    document.getElementById("buy-with-crypto").onclick = async ()=>{myModal.hide(); await nftTrader.buyWithCrypto(itemIndex, price)}
    var myModal = new bootstrap.Modal(modal, {});
    myModal.show();
}

function getButton(tokenIndex) {
    let div = document.getElementById(`token-${tokenIndex}`)
    if (!div)
        return
    let btn = div.getElementsByClassName("buy-btn")
    if (btn.length === 1)
        return btn[0]
}

function newListing(listing) {
    return `
    <div class="col" id="token-${listing.itemIndex}">
        <div class="card shadow-sm">
        <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
        <div class="card-body">
            <p class="card-text">Contract: ${listing.nftContract}<br>\nToken: ${listing.tokenId}</p>
            <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-warning buy-btn" onclick="buyNFT(${listing.itemIndex}, ${listing.price})">Comprar</button>
            </div>
            <small class="text-muted">R$ ${listing.price}</small>
            </div>
        </div>
        </div>
    </div>
    `
}

function createAlbum(listings) {
    let div = document.getElementById("album-container")
    let html = ""
    for (let i = 0; i < listings.length; i++) {
        html += newListing(listings[i])
    }
    div.innerHTML = html
}

async function main() {
    setTimeout(initializeConnection(), 0)    
    let listings = await nftTrader.getAllListings()
    createAlbum(listings)
}

// export functions to the global scope to make them avaiable in the HTML
window.connectWalletBtn = connectWalletBtn
window.buyNFT = buyNFT
window.getButton = getButton

main()
    .then()
    .catch()

