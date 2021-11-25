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
      56: ZERO_ADDRESS,
      97: ZERO_ADDRESS
    },
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 18,
    addresses: {
      56: "0xdac17f958d2ee523a2206206994597c13d831ec7",
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
  NEST: {
    symbol: "NEST",
    Icon: TokenNest,
    decimals: 18,
    addresses: {
      56: "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
      97: "0x821edD79cc386E56FeC9DA5793b87a3A52373cdE"
    },
  }
};

export const FortEuropeanOptionContract: AddressesType = {
  56: "0x6C844d364c2836f2111891111F25C7a24da976A9",
  97: "0x19465d54ba7c492174127244cc26dE49F0cC1F1f"
};

export const FortLeverContract: AddressesType = {
  56: "0x622f1CB39AdE2131061C68E61334D41321033ab4",
  97: "0xFD42E41B96BC69e8B0763B2Ed75CD50347b9778D"
};

export const NestPrice: AddressesType = {
  56: "0xB5D2890c061c321A5B6A4a4254bb1522425BAF0A",
  97: "0xF2f9E62f52389EF223f5Fa8b9926e95386935277"
};

export const SwapAddress: AddressesType = {
  56: '0x6e7fd4BA02A5a7a75Ea3CcE37e221dC144D606Dd',
  97: '0xD83C860d3A27cC5EddaB68EaBFCF9cc8ad38F15D'
};

export const CofixSwapAddress: AddressesType = {
  56: '0x4A448cBb12e449D7031f36C8122eCE6dDdf9cc84',
  97: '0x4A448cBb12e449D7031f36C8122eCE6dDdf9cc84'
};

export const CofixNestUsdtPoolAddress: AddressesType = {
  56: '0x8eFFbf9CA7dB20481cE9C25EA4B410b3B835D70E',
  97: '0xF9e8D1C6Ed54295a4a630085E6D982a37d9d2f85'
};

export const ETHUSDTPriceChannelId: {[key: number] : string} = {
  56: '0',
  97: '0',
}

export const NESTUSDTPriceChannelId: {[key: number] : string} = {
  56: '1',
  97: '1',
}