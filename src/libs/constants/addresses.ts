import {
  TokenETH,
  TokenFORT,
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
      56: ZERO_ADDRESS,
      97: ZERO_ADDRESS
    },
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 18,
    addresses: {
      56: "0x55d398326f99059ff775485246999027b3197955",
      97: "0xDd4A68D8236247BDC159F7C5fF92717AA634cBCc"
    },
  },
  DCU: {
    symbol: "DCU",
    Icon: TokenFORT,
    decimals: 18,
    addresses: {
      56: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      97: "0x5Df87aE415206707fd52aDa20a5Eac2Ec70e8dbb"
    },
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
  56: '0x2Cd1Bf9345E969b5DFc6D88000475aD6d487363A',
  97: '0xc61409835E6A23e31f2fb06F76ae13A1b4c5fD26'
};

export const CofixSwapAddress: AddressesType = {
  56: '0xb29A8d980E1408E487B9968f5E4f7fD7a9B0CaC5',
  97: '0x4A448cBb12e449D7031f36C8122eCE6dDdf9cc84'
};

export const ETHUSDTPriceChannelId: {[key: number] : string} = {
  56: '0',
  97: '0',
}

export const NESTUSDTPriceChannelId: {[key: number] : string} = {
  56: '1',
  97: '1',
}