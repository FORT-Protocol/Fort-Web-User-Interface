import {
  TokenCoFiX,
  TokenETH,
  TokenFORT,
  TokenFortube,
  TokenNest,
  TokenNHBTC,
  TokenPETH,
  TokenPUSD,
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
      1: ZERO_ADDRESS,
      3: ZERO_ADDRESS,
      4: ZERO_ADDRESS,
    },
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 6,
    addresses: {
      1: "",
      3: "0xc6611844fD9FAE67ABFAdB5a67E33A4fbbB00893",
      4: "0x2d750210c0b5343a0b79beff8F054C9add7d2411",
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
  },
  NHBTC: {
    symbol: "NHBTC",
    Icon: TokenNHBTC,
    decimals: 18,
    addresses: {
      1: "0x1F832091fAf289Ed4f50FE7418cFbD2611225d46",
      3: "0x4c23ad0326C8ad411643cEde15E928E39afA728F",
      4: "0x801b69dA3210BAB7482E21085cd2A14d77b23475",
    },
  },
  NEST: {
    symbol: "NEST",
    Icon: TokenNest,
    decimals: 18,
    addresses: {
      1: "0x04abEdA201850aC0124161F037Efd70c74ddC74C",
      3: "0xEa9E43FAf5e7F38525238ED4aDf650f06DF4e87F",
      4: "0xE313F3f49B647fBEDDC5F2389Edb5c93CBf4EE25",
    },
  },
  CoFi: {
    symbol: "CoFi",
    Icon: TokenCoFiX,
    decimals: 18,
    addresses: {
      1: "0x1a23a6BfBAdB59fa563008c0fB7cf96dfCF34Ea1",
      3: "0x0D73aBdb1415f77698362b8d99FD2a2eD41b0558",
      4: "0x61EA050b28Ccca539F0faf79Fd26F6Df31b9f15B",
    },
  },
  FOR: {
    symbol: "FOR",
    Icon: TokenFortube,
    decimals: 18,
    addresses: {
      1: "0x1FCdcE58959f536621d76f5b7FfB955baa5A672F",
      3: "0x9bc2b3da2d2583ca489c053Df76DB2762f3aB394",
      4: "0x37591670bCc04af593287fbc16C58F12f0B57881",
    },
  },
  PUSD: {
    symbol: "PUSD",
    Icon: TokenPUSD,
    decimals: 18,
    addresses: {
      1: "0xCCEcC702Ec67309Bc3DDAF6a42E9e5a6b8Da58f0",
      3: "0x49FDeD8d731204998ca9e2BDe277949E57bf63b1",
      4: "0x5407cab67ad304FB8A4aC46D83b3Dd63A9dbA575",
    },
  },
  PETH: {
    symbol: "PETH",
    Icon: TokenPETH,
    decimals: 18,
    addresses: {
      1: "0x53f878Fb7Ec7B86e4F9a0CB1E9a6c89C0555FbbD",
      3: "0x49FDeD8d731204998ca9e2BDe277949E57bf63b1",
      4: "0x5407cab67ad304FB8A4aC46D83b3Dd63A9dbA575",
    },
  }
};

export const LeverIndex: { [key: string]: any } = {
  // 目标币
  ETH: {
    // 链
    4: {
      // 看涨看跌
      1: {
        // 倍数
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
      },
      0: {
        1: 6,
        2: 7,
        3: 8,
        4: 9,
        5: 10,
      },
    },
    3: {
      // 看涨看跌
      1: {
        // 倍数
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
      },
      0: {
        1: 6,
        2: 7,
        3: 8,
        4: 9,
        5: 10,
      },
    },
  },
};

export const FortEuropeanOptionContract: AddressesType = {
  1: "",
  3: "0xa6948042D7B68b4c28907cE8B450DC0e5BBe30a5",
  4: "0x702F97D4991e2155576548989fEdEE3971705465",
};

export const FortLeverContract: AddressesType = {
  1: "",
  3: "0x48437856C4f6C3F60eA014110066BB440A4530D7",
  4: "0x3Db207CadA55e556ab7A8534A7a6aD9EFfc27B01",
};

export const FortVaultForStakingContract: AddressesType = {
  1: "0xE3940A3E94bca34B9175d156a5E9C5728dFE922F",
  3: "0x176D7C08e5BC8f7334a1b1A5DC2C3516F80e1195",
  4: "0x5cA5E616310c0Cca41B7E4329021C17a5a79a0F1",
};

export const NestPrice: AddressesType = {
  1: "0xB5D2890c061c321A5B6A4a4254bb1522425BAF0A",
  3: "0x85723E83A7E7d88b0F3Ceb4C5bE7C853e3Ed8a82",
  4: "0x40C3EB032f27fDa7AdcF1B753c75B84e27f26838",
};
