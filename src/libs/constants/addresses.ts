import { BigNumber } from "ethers";
import {
  TokenBTC,
  TokenETH,
  TokenFORT,
  TokenUSDT,
} from "../../components/Icon";
import { ZERO_ADDRESS } from "../utils";

export type AddressesType = {
  [key: number]: string;
};

export type PairIndexType = {
  [key: number]: string;
}

export type TokenType = {
  symbol: string;
  Icon: typeof TokenETH;
  decimals: number;
  addresses: AddressesType;
  pairIndex: PairIndexType;
  nowPrice?: BigNumber;
  k?: BigNumber;
};

export const tokenList: { [key: string]: TokenType } = {
  ETH: {
    symbol: "ETH",
    Icon: TokenETH,
    decimals: 18,
    addresses: {
      56: ZERO_ADDRESS,
      97: ZERO_ADDRESS
    },
    pairIndex: {
      56: '0',
      97: '0'
    }
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 18,
    addresses: {
      56: "0x55d398326f99059ff775485246999027b3197955",
      97: "0xDd4A68D8236247BDC159F7C5fF92717AA634cBCc"
    },
    pairIndex: {
      56: '',
      97: ''
    }
  },
  DCU: {
    symbol: "DCU",
    Icon: TokenFORT,
    decimals: 18,
    addresses: {
      56: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      97: "0x5Df87aE415206707fd52aDa20a5Eac2Ec70e8dbb"
    },
    pairIndex: {
      56: '',
      97: ''
    }
  },
  BTC: {
    symbol: "BTC",
    Icon: TokenBTC,
    decimals: 18,
    addresses: {
      56: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      97: "0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B"
    },
    pairIndex: {
      56: '2',
      97: '2'
    }
  },
};

export const FortEuropeanOptionContract: AddressesType = {
  56: "0x284935F8C571d054Df98eDA8503ea13cde5fd8Cc",
  97: "0x741AD178C22b901dFEDAB44491534BD2C90Dc7Ed"
};

export const FortLeverContract: AddressesType = {
  56: "0x8c5052f7747D8Ebc2F069286416b6aE8Ad3Cc149",
  97: "0xFD42E41B96BC69e8B0763B2Ed75CD50347b9778D"
};

export const NestPrice: AddressesType = {
  56: "0x09CE0e021195BA2c1CDE62A8B187abf810951540",
  97: "0xF2f9E62f52389EF223f5Fa8b9926e95386935277"
};

export const SwapAddress: AddressesType = {
  56: '0x9484f12044b9d5707AfeaC5BD02b5E0214381801',
  97: '0xc61409835E6A23e31f2fb06F76ae13A1b4c5fD26'
};

export const CofixSwapAddress: AddressesType = {
  56: '0xb29A8d980E1408E487B9968f5E4f7fD7a9B0CaC5',
  97: '0x4A448cBb12e449D7031f36C8122eCE6dDdf9cc84'
};