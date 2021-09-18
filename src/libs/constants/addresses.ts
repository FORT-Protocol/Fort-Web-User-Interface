import { TokenETH, TokenFORT, TokenLeverDown, TokenLeverUp, TokenUSDT } from "../../components/Icon"
import { ZERO_ADDRESS } from "../utils"

export type AddressesType = {
    [key: number]: string
}

export type TokenType = {
    symbol: string
    Icon: typeof TokenETH
    decimals: number
    addresses: AddressesType
}

export const tokenList: {[key: string]: TokenType} = {
    "ETH": {
        symbol: 'ETH',
        Icon: TokenETH,
        decimals: 18,
        addresses: {
            1: ZERO_ADDRESS,
            2: ZERO_ADDRESS,
            4: ZERO_ADDRESS
        }
    },
    "USDT": {
        symbol: 'USDT',
        Icon: TokenUSDT,
        decimals: 6,
        addresses: {
            1: '',
            2: '',
            4: '0x2d750210c0b5343a0b79beff8F054C9add7d2411'
        }
    },
    "DCU": {
        symbol: 'DCU',
        Icon: TokenFORT,
        decimals: 18,
        addresses: {
            1: '',
            2: '',
            4: '0xDB7b4FdF99eEE8E4Cb8373630c923c51c1275382'
        }
    },
    "HBTC": {
        symbol: 'HBTC',
        Icon: TokenETH,
        decimals: 18,
        addresses: {
            1: ZERO_ADDRESS,
            2: ZERO_ADDRESS,
            4: '0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B'
        }
    },
    "Margin-ETH1L": {
        symbol: 'Margin-ETH1L',
        Icon: TokenLeverUp,
        decimals: 18,
        addresses: {
            1: '',
            2: '',
            4: '0x1BcD7C075C6b94ef4D6a1aEE4496828d61B5f5F1'
        }
    },
    "Margin-ETH2L": {
        symbol: 'Margin-ETH2L',
        Icon: TokenLeverUp,
        decimals: 18,
        addresses: {
            1: '',
            2: '',
            4: '0x1B7D9daDBE37Eb6dF32c8682Ee3090b630D24F3e'
        }
    },
    "Margin-ETH5L": {
        symbol: 'Margin-ETH5L',
        Icon: TokenLeverUp,
        decimals: 18,
        addresses: {
            1: '',
            2: '',
            4: '0x6A308373912a73Fe17AB40637061A5eeeDD16975'
        }
    },
    "Margin-ETH1S": {
        symbol: 'Margin-ETH1S',
        Icon: TokenLeverDown,
        decimals: 18,
        addresses: {
            1: '',
            2: '',
            4: '0x9a1Aea23230447Da01E66Caa9D0D96c039805f89'
        }
    },
    "Margin-ETH2S": {
        symbol: 'Margin-ETH2S',
        Icon: TokenLeverDown,
        decimals: 18,
        addresses: {
            1: '',
            2: '',
            4: '0x502eAfEB2e8b14C22118e0F5a15427Edc4D3B2bB'
        }
    },
    "Margin-ETH5S": {
        symbol: 'Margin-ETH5S',
        Icon: TokenLeverDown,
        decimals: 18,
        addresses: {
            1: '',
            2: '',
            4: '0xD46880A5bA1cA2167D71582d8f2D5acdB441aBD5'
        }
    }
}

export const LeverTokenList = [
    tokenList['Margin-ETH1L'],
    tokenList['Margin-ETH1S'],
    tokenList['Margin-ETH2L'],
    tokenList['Margin-ETH2S'],
    tokenList['Margin-ETH5L'],
    tokenList['Margin-ETH5S']]

export const FortEuropeanOptionContract: AddressesType = {
    1: '',
    2: '',
    4: '0x5bA7CBD3cC7C3ced0f94FC3CFd331260569E19Ca',
}

export const FortLeverContract: AddressesType = {
    1: '',
    2: '',
    4: '0x1820A4c392d71B65C3C32c1a6E8d94A3FB785fae',
}

export const FortVaultForStakingContract: AddressesType = {
    1: '',
    2: '',
    4: '0xF06Ca516B6e11AB7843FB0B1a7eECBf0e57B3B64',
}

export const NestPrice: AddressesType = {
    1: '',
    2: '',
    4: '0x40C3EB032f27fDa7AdcF1B753c75B84e27f26838',
}

