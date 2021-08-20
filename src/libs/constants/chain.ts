
type Chain = {
    name: string
    chainId: number
    tokenName: string
    tokenSymbol: string
    tokenDecimals: number
    rpc: Array<string>
    infoURL: string
}

const INFURA_API_KEY = ''

export const Mainnet = {
    name: 'Mainnet',
    chainId: 1,
    tokenName: 'Ether',
    tokenSymbol: 'ETH',
    tokenDecimals: 18,
    rpc: [
        `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`
    ],
    infoURL: "https://etherscan.io/"
}

export const Ropsten = {
    name: 'Ropsten',
    chainId: 2,
    tokenName: 'Ether',
    tokenSymbol: 'ETH',
    tokenDecimals: 18,
    rpc: [
        `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
        `wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}`
    ],
    infoURL: "https://ropsten.etherscan.io/"
}

export const Rinkeby = {
    name: 'Rinkeby',
    chainId: 4,
    tokenName: 'Ether',
    tokenSymbol: 'ETH',
    tokenDecimals: 18,
    rpc: [
        `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
        `wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}`
    ],
    infoURL: "https://rinkeby.etherscan.io/"
}

export const SupportedChains: Array<Chain> = [Mainnet, Ropsten, Rinkeby]