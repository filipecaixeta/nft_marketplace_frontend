import { ethers } from "ethers"
import { providerConfig, providersConfig } from './network'
import WalletConnectProvider from "@walletconnect/web3-provider"

export var rwProvider
export var rwSigner

const connectBtn = document.getElementById("connect-btn")

const connectModal = new bootstrap.Modal(document.getElementById("connect-modal"), {});

export async function connectWalletBtn() {
    connectModal.show();
    document.getElementById("connectWalletWithMetaMask").onclick = connectWalletWithMetaMask
    document.getElementById("connectWalletWithWalletConnect").onclick = connectWalletWithWalletConnect
    window.connectModal = connectModal
}

export async function connectWalletWithMetaMask() {
    connectModal.hide()

    // Redirect to install metamask
    if (!window.ethereum) {
        window.open("https://metamask.io/download/", "_blank");
        return false
    }
    try {
        localStorage.setItem('connectWith', 'no')
        let accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length === 0) {
            connectBtn.innerText = "Conectar Carteira"
            return false
        }
        if (!accounts || accounts.length == 0) {
            connectBtn.innerText = "Conectar Carteira"
            return false
        }
        connectBtn.innerText = "Conectado " + shortAddress(accounts[0])
        localStorage.setItem('connectWith', 'MetaMask')
    } catch (err) {
        if (err.code != 4001) {
            console.error(err)
        }
        return false
    }
    rwProvider = new ethers.providers.Web3Provider(window.ethereum)
    rwSigner = rwProvider.getSigner()
    // window.rwSigner = rwSigner
    return await addNetwork()
}

export async function connectWalletWithWalletConnect(reuseConnection) {
    localStorage.setItem('connectWith', 'no')
    let rpc = {}
    rpc[providerConfig.id] = providerConfig.wallet_add_ethereum_chain.rpcUrls[0]
    
    // for (const p of Object.values(providersConfig)) {
    //     rpc[p.id] = p.wallet_add_ethereum_chain.rpcUrls[0]
    // }
    let wcprovider = new WalletConnectProvider({rpc: rpc})

    // if (reuseConnection === true) {
        wcprovider.disconnect().then(console.log).catch(console.error)
    // }
    connectModal.hide()

    try {
        await wcprovider.enable()
        rwProvider = new ethers.providers.Web3Provider(wcprovider)
        rwSigner = rwProvider.getSigner()
        // window.rwSigner = rwSigner
        connectBtn.innerText = "Conectado " + shortAddress(await rwSigner.getAddress())
        localStorage.setItem('connectWith', 'WalletConnect')
    } catch (error) {
        console.error(error)
        localStorage.setItem('connectWith', 'no')
    }
    return await addNetwork()
}

export function initializeConnection() {
    // At the first time we ask the connection from metamask
    // if the user refuses we don't ask again
    let connectWith = localStorage.getItem('connectWith')
    if (connectWith === "MetaMask") {
        connectWalletWithMetaMask().then().catch(console.error)
    }
    if (connectWith === "WalletConnect") {
        connectWalletWithWalletConnect(true).then().catch(console.error)
    }
}

export function getRWProvider() {
    return rwProvider
}

export function getRWSigner() {
    return rwSigner
}

async function addNetwork() {
    let netID = (await rwProvider.getNetwork()).chainId;
    if (providerConfig.id == netID) {
        return true
    }
    try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: "0x"+providerConfig.id.toString(16) }],
        })
        return true
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: providerConfig.wallet_add_ethereum_chain
                })
                return true
            } catch (addError) {
                console.error(addError)
            }
        }
        console.error(switchError)
    }
    return false
}

function shortAddress(address) {
    return address.substring(0, 5)+"..."+address.substring(address.length-4)
}
