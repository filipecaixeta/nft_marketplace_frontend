import { ethers, logger } from "ethers"


export const providersConfig = {
    local: {
        url: "http://127.0.0.1:7545",
        api: "http://127.0.0.1:5000",
        id: 1337,
        name: "local",
        wallet_add_ethereum_chain: {
            chainId: '0x539',
            chainName: 'Local',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['http://127.0.0.1:7545'],
        }
    },
    matic: {
        url: "https://polygon-rpc.com/",
        api: "https://market-place-server-prod-36okcil5ia-uc.a.run.app",
        id: 137,
        name: "matic",
        alchemyapi_key: "fnKSznc5UpD9G4W6sK6DhfrGNTP-SGbt",
        wallet_add_ethereum_chain: {
            chainId: '0x89',
            chainName: 'Matic Mainnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com/']
        }
    },
    test: {
        url: "https://eth-rinkeby.alchemyapi.io/v2/Zap1FqVTL5kFcAkdmxaJnClnr3isGO1I",
        api: "https://market-place-server-36okcil5ia-uc.a.run.app",
        id: 4,
        name: "rinkeby",
        alchemyapi_key: "Zap1FqVTL5kFcAkdmxaJnClnr3isGO1I",
        wallet_add_ethereum_chain: {
            chainId: '0x4',
            chainName: 'Rinkeby Test Network',
            nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18
            },
            rpcUrls: ['https://rinkey.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
            blockExplorerUrls: ['https://rinkey.etherscan.io']
        }
    }
}

export const network = getNetworkName()
export const providerConfig = providersConfig[network]
export const roProvider = createROProvider()
export const roSigner = roProvider

function getNetworkName() {
    // This is because github pages has no support for subdomains
    let qs = window.location.search.split("=")
    if (qs.length == 2) {
        if (qs[0] == "?network") {
            return qs[1]
        }
    }

    let subdomain = window.location.host.split('.')[0]
    let network = ["local", "rinkeby", "test"].includes(subdomain)?subdomain:"matic"
    if (network == "rinkeby")
        network = "test"
    return network
}

function createROProvider() {
    if (network == "local") {
        return new ethers.providers.JsonRpcProvider(providerConfig.url)
    } else {
        try {
            return ethers.providers.AlchemyProvider.getWebSocketProvider(providerConfig.name, providerConfig.alchemyapi_key)  
        } catch (error) {
            return new ethers.providers.AlchemyProvider(providerConfig.name, providerConfig.alchemyapi_key)
        }
    }
}

export function getROProvider() {
    return roProvider
}

export function getROSigner() {
    return roSigner
}