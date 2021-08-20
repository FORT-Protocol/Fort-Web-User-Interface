import { TokenETH, TokenUSDT } from "../../components/Icon"

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
        symbol: 'NEST',
        Icon: TokenUSDT,
        decimals: 18,
        addresses: {
            1: '0x04abeda201850ac0124161f037efd70c74ddc74c',
            2: '',
            4: '0x8d6b97c482ecc00d83979dac4a703dbff04fd84f'
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

