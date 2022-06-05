import { connectWalletBtn, initializeConnection } from './connect'
import { NFTTrader } from './contract'
import * as  axios from 'axios'


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
    let image = `<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>`
    if (listing.metadata && listing.metadata.image) {
        image = `<img src="${listing.metadata.image}" class="bd-placeholder-img card-img-top" width="100%" height="225" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"></img>`
    }
    return `
    <div class="col" id="token-${listing.itemIndex}">
        <div class="card shadow-sm">
        ${image}
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

async function getAllListings() {
    let _listings = await nftTrader.getAllListings()
    let listings = []
    let reqs = []
    for (const listing of _listings) {
        var l = {}
        Object.assign(l, listing)
        let uri = l.uri
        if (uri.includes("{id}")) {
            uri = uri.replace("{id}", l.tokenId.toHexString().substr(2).padStart(64, "0"))
            l.uri = uri.replace("ipfs://", "https://ipfs.io/ipfs/")
        }
        listings.push(l)
        reqs.push(axios.get(l.uri))
    }
    results = await Promise.all(
        reqs.map(p => p.catch(e => e))
    )
    
    for (const i in results) {
        if (results[i] instanceof Error || typeof(results[i].data)=="string") {
            continue
        }
        listings[i].metadata = results[i].data;
        if (listings[i].metadata && listings[i].metadata.image) {
            listings[i].metadata.image = listings[i].metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
        }
    }
    return listings
}

async function main() {
    setTimeout(initializeConnection(), 0)    
    listings = await getAllListings()
    createAlbum(listings)
}

// export functions to the global scope to make them avaiable in the HTML
window.connectWalletBtn = connectWalletBtn
window.buyNFT = buyNFT
window.getButton = getButton

main()
    .then()
    .catch()

