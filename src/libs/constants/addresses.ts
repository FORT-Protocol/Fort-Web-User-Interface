import { BigNumber } from "ethers";
import {
  TokenBTC,
  TokenETH,
  TokenFORT,
  TokenNest,
  TokenPRC,
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
  sigmaSQ?: BigNumber;
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
    },
    sigmaSQ: BigNumber.from('45659142400')
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
      56: "0x46893c30fBDF3A5818507309c0BDca62eB3e1E6b",
      97: "0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B"
    },
    pairIndex: {
      56: '2',
      97: '2'
    },
    sigmaSQ: BigNumber.from('31708924900')
  },
  PRC: {
    symbol: "PRC",
    Icon: TokenPRC,
    decimals: 18,
    addresses: {
      56: "0xf43A71e4Da398e5731c9580D11014dE5e8fD0530",
      97: "0x6c0cC0e354c12B7c0aceCC45424e9Ee1334bda24"
    },
    pairIndex: {
      56: '',
      97: ''
    },
    sigmaSQ: BigNumber.from('0')
  },
  NEST: {
    symbol: "NEST",
    Icon: TokenNest,
    decimals: 18,
    addresses: {
      56: "0x98f8669F6481EbB341B522fCD3663f79A3d1A6A7",
      97: "0x821edD79cc386E56FeC9DA5793b87a3A52373cdE"
    },
    pairIndex: {
      56: '',
      97: ''
    },
    sigmaSQ: BigNumber.from('0')
  },
};

export const FortEuropeanOptionContract: AddressesType = {
  56: "0x284935F8C571d054Df98eDA8503ea13cde5fd8Cc",
  97: "0x19465d54ba7c492174127244cc26dE49F0cC1F1f"
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

export const FortPRC : AddressesType = {
  56: '0xf43A71e4Da398e5731c9580D11014dE5e8fD0530',
  97: '0x6c0cC0e354c12B7c0aceCC45424e9Ee1334bda24'
}

export const PVMPayBackContract : AddressesType = {
  56: '0x8AA36CF9CD7e88b63F32c53C66BFaDd409367B2f',
  97: '0x0F1cb2bB372edd39624bf1763FE4830DAFcf9139'
}