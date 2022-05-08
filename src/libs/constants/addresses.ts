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
  sigmaSQ?: BigNumber;
};

export const tokenList: { [key: string]: TokenType } = {
  ETH: {
    symbol: "ETH",
    Icon: TokenETH,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      3: ZERO_ADDRESS,
      4: ZERO_ADDRESS,
    },
    pairIndex: {
      1: '1',
      3: '1',
      4: '1'
    },
    sigmaSQ: BigNumber.from('45659142400')
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 18,
    addresses: {
      1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      3: "0xc6611844fD9FAE67ABFAdB5a67E33A4fbbB00893",
      4: "0x2d750210c0b5343a0b79beff8F054C9add7d2411",
    },
    pairIndex: {
      1: '',
      3: '',
      4: ''
    },
  },
  DCU: {
    symbol: "DCU",
    Icon: TokenFORT,
    decimals: 18,
    addresses: {
      1: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      3: "0xFe864063e10e5f7D99803765f28d2676A582A816",
      4: "0xc408edF487e98bB932eD4A8983038FF19352eDbd",
    },
    pairIndex: {
      1: '',
      3: '',
      4: ''
    },
  },
  BTC: {
    symbol: "BTC",
    Icon: TokenBTC,
    decimals: 18,
    addresses: {
      1: "0x0316EB71485b0Ab14103307bf65a021042c6d380",
      3: "",
      4: "0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B"
    },
    pairIndex: {
      1: "0",
      3: "0",
      4: "0"
    },
    sigmaSQ: BigNumber.from('31708924900')
  },
  
};

export const FortEuropeanOptionContract: AddressesType = {
  1: "0x6C844d364c2836f2111891111F25C7a24da976A9",
  3: "0xa6948042D7B68b4c28907cE8B450DC0e5BBe30a5",
  4: "0x702F97D4991e2155576548989fEdEE3971705465",
};

export const FortLeverContract: AddressesType = {
  1: "0x622f1CB39AdE2131061C68E61334D41321033ab4",
  3: "0x48437856C4f6C3F60eA014110066BB440A4530D7",
  4: "0x3Db207CadA55e556ab7A8534A7a6aD9EFfc27B01",
};

export const FortVaultForStakingContract: AddressesType = {
  1: "0xE3940A3E94bca34B9175d156a5E9C5728dFE922F",
  3: "0x176D7C08e5BC8f7334a1b1A5DC2C3516F80e1195",
  4: "0x5cA5E616310c0Cca41B7E4329021C17a5a79a0F1",
};

export const NestPrice: AddressesType = {
  1: "0xE544cF993C7d477C7ef8E91D28aCA250D135aa03",
  3: "0x85723E83A7E7d88b0F3Ceb4C5bE7C853e3Ed8a82",
  4: "0xc08E6A853241B9a08225EECf93F3b279FA7A1bE7",
};

export const SwapAddress: AddressesType = {
  1: '0x6e7fd4BA02A5a7a75Ea3CcE37e221dC144D606Dd',
  3: ZERO_ADDRESS,
  4: "0x0a94eb67c4bfa14094d6aaf0d1fec8afd0e7a25b",
};

export const CofixSwapAddress: AddressesType = {
  1: '0x57F0A4ef374B35eb32B61Dd8bc68C58e886CFC84',
  3: ZERO_ADDRESS,
  4: "0x9f7997EFb0aF6f5e370dea99b1941D73330825C9",
};

export const CofixControllerAddress: AddressesType = {
  1: '0x8eFFbf9CA7dB20481cE9C25EA4B410b3B835D70E',
  3: ZERO_ADDRESS,
  4: "0x59c2EAF8FC22C10C2EB79Be3c23c2916BD0ec81e",
};
