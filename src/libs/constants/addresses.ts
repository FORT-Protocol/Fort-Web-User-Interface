import { TokenETH, TokenFORT, TokenUSDT } from "../../components/Icon"

export type AddressesType = {
    [key: number]: string
}

type TokenType = {
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
            1: '0x0',
            2: '',
            4: '0x0'
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
    "FORT": {
        symbol: 'FORT',
        Icon: TokenFORT,
        decimals: 18,
        addresses: {
            1: '',
            2: '',
            4: '0x6747972f3Fc6f4A4fC9c8a1fF4C2899dc83c4DF7'
        }
    },
}

export const FortEuropeanOptionContract: AddressesType = {
    1: '',
    2: '',
    4: '0x66bD0139b6216B740820a54a71a2CDFf2070e76B',
}

export const FortLeverContract: AddressesType = {
    1: '',
    2: '',
    4: '0xc5086B5a9AC3A4036416690E382AbD7808DC307c',
}

