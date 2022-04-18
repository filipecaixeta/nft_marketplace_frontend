import { ethers } from "ethers"
import * as NFTTraderJson from '../assets/contracts/NFTTrader.json'
import { getROSigner } from './network'
import { getRWProvider, getRWSigner } from './connect'
import { callConversionRatio, callBuyWithFiat } from './api'

export class NFTTrader {
    constructor() {
        this.contract = this.roContract()
        // window.nftTrader = contract
        this.contract.on("Sale" , this.saleEvent)
    }

    roContract() {
        return new ethers.Contract(NFTTraderJson.address, NFTTraderJson.abi, getROSigner())
    }

    rwContract() {
        return new ethers.Contract(NFTTraderJson.address, NFTTraderJson.abi, getRWSigner())
    }

    async saleEvent(contract, tokenId, from, to, tokenIndex, price) {
        let event = {
            contract: contract,
            tokenId: tokenId.toNumber(),
            from: from,
            to: to,
            tokenIndex: tokenIndex.toNumber(),
            price: price.toNumber()
        }
        let btn = getButton(event.tokenIndex)
        if (btn) {
            btn.classList.remove("btn-warning")
            btn.classList.add("btn-outline-secondary")
            btn.innerText = "Vendido"
            btn.onclick = ()=>{}
        }
    }

    async buyWithCrypto(itemIndex, price) {
        price = BigInt(price)
        let btn = getButton(itemIndex)
        
        if (getRWProvider()) {
            let rwcontract = this.rwContract()
            let data = await callConversionRatio()
            
            let args = [
                itemIndex,
                data.ratio,
                data.expireTimestamp,
                data.signature,
                {
                    value: price*data.ratio
                }
            ]
            try {
                let estimate = await rwcontract.estimateGas.purchase(...args)
                args[args.length-1].gasLimit = estimate.toNumber()*2

                let tx = await rwcontract.purchase(...args)
                console.log(tx)

                if (btn) {
                    btn.innerText = "Processando"
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            alert("Conecte a carteira para comprar")
        }
    }

    async buyWithFiat(itemIndex, price) {
        price = BigInt(price)
        let btn = getButton(itemIndex)
        if (getRWProvider()) {
            let r = await callBuyWithFiat(itemIndex, getRWSigner())
            // TODO get the PIX QR-code and display
            if (btn) {
                btn.innerText = "Processando"
            }
        } else {
            alert("Conecte a carteira para comprar")
        }
    }

    async getAllListings() {
        return await this.contract.getAllListings()
    }
}