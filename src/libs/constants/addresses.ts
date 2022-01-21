import {
  TokenETH,
  TokenFORT,
  TokenNest,
  TokenUSDT,
} from "../../components/Icon";
import { ZERO_ADDRESS } from "../utils";

export type AddressesType = {
  [key: number]: string;
};

export type TokenType = {
  symbol: string;
  Icon: typeof TokenETH;
  decimals: number;
  addresses: AddressesType;
};

export const tokenList: { [key: string]: TokenType } = {
  ETH: {
    symbol: "ETH",
    Icon: TokenETH,
    decimals: 18,
    addresses: {
      137: ZERO_ADDRESS,
      80001: ZERO_ADDRESS
    },
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 18,
    addresses: {
      137: "0x55d398326f99059ff775485246999027b3197955",
      80001: "0xd32502b39da054dfF448AaBc1cb8210C756535f6"
    },
  },
  DCU: {
    symbol: "DCU",
    Icon: TokenFORT,
    decimals: 18,
    addresses: {
      137: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      80001: "0x51EFE1E589354e1f24C7d4533D21F74f973c6eED"
    },
  },
  NEST: {
    symbol: "NEST",
    Icon: TokenNest,
    decimals: 18,
    addresses: {
      137: "0x98f8669F6481EbB341B522fCD3663f79A3d1A6A7",
      80001: "0x58694D405C8Cd917880FC1E23729fc0B90B7732c"
    },
  }
};

export const FortEuropeanOptionContract: AddressesType = {
  137: "0x284935F8C571d054Df98eDA8503ea13cde5fd8Cc",
  80001: "0x6636F38F59Db0d3dD2f53e6cA4831EB2B5A1047c"
};

export const FortLeverContract: AddressesType = {
  137: "0x8c5052f7747D8Ebc2F069286416b6aE8Ad3Cc149",
  80001: "0x8f89663562dDD4519566e590C18ec892134A0cdD"
};

export const NestPrice: AddressesType = {
  137: "0x09CE0e021195BA2c1CDE62A8B187abf810951540",
  80001: "0xD3E0Effa6A9cEC78C95c1FD0BbcCCA5929068B83"
};

export const SwapAddress: AddressesType = {
  137: '0x2Cd1Bf9345E969b5DFc6D88000475aD6d487363A',
  80001: '0xD83C860d3A27cC5EddaB68EaBFCF9cc8ad38F15D'
};

export const CofixSwapAddress: AddressesType = {
  137: '0xb29A8d980E1408E487B9968f5E4f7fD7a9B0CaC5',
  80001: '0x4A448cBb12e449D7031f36C8122eCE6dDdf9cc84'
};

export const CofixNestUsdtPoolAddress: AddressesType = {
  137: '0x278f5d08bEa1989BEfcC09A20ad60fB39702D556',
  80001: '0xF9e8D1C6Ed54295a4a630085E6D982a37d9d2f85'
};

export const ETHUSDTPriceChannelId: {[key: number] : string} = {
  137: '0',
  80001: '0',
}

export const NESTUSDTPriceChannelId: {[key: number] : string} = {
  137: '1',
  80001: '1',
}