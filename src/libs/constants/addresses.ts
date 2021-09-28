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
      1: "",
      3: "0xFe864063e10e5f7D99803765f28d2676A582A816",
      4: "0xDB7b4FdF99eEE8E4Cb8373630c923c51c1275382",
    },
  },
  NHBTC: {
    symbol: "NHBTC",
    Icon: TokenNHBTC,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      3: "0x4c23ad0326C8ad411643cEde15E928E39afA728F",
      4: "0xaE73d363Cb4aC97734E07e48B01D0a1FF5D1190B",
    },
  },
  NEST: {
    symbol: "NEST",
    Icon: TokenNest,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      3: "0xEa9E43FAf5e7F38525238ED4aDf650f06DF4e87F",
      4: ZERO_ADDRESS,
    },
  },
  CoFi: {
    symbol: "CoFi",
    Icon: TokenCoFiX,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      3: "0x0D73aBdb1415f77698362b8d99FD2a2eD41b0558",
      4: ZERO_ADDRESS,
    },
  },
  FOR: {
    symbol: "FOR",
    Icon: TokenFortube,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      3: "0x9bc2b3da2d2583ca489c053Df76DB2762f3aB394",
      4: ZERO_ADDRESS,
    },
  },
  PUSD: {
    symbol: "PUSD",
    Icon: TokenPUSD,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      3: "0x49FDeD8d731204998ca9e2BDe277949E57bf63b1",
      4: ZERO_ADDRESS,
    },
  },
  PETH: {
    symbol: "PETH",
    Icon: TokenPETH,
    decimals: 18,
    addresses: {
      1: ZERO_ADDRESS,
      3: "0xB3cAc06614642F614255D496302f8545Ea45f6fc",
      4: ZERO_ADDRESS,
    },
  },
  // "Margin-ETH1L": {
  //     symbol: 'Margin-ETH1L',
  //     Icon: TokenLeverUp,
  //     decimals: 18,
  //     addresses: {
  //         1: '',
  //         3: '0x8B350EE1763213a07cbFC205be496f989eC7aEe6',
  //         4: '0x1BcD7C075C6b94ef4D6a1aEE4496828d61B5f5F1'
  //     }
  // },
  // "Margin-ETH2L": {
  //     symbol: 'Margin-ETH2L',
  //     Icon: TokenLeverUp,
  //     decimals: 18,
  //     addresses: {
  //         1: '',
  //         3: '0x4385b677FE069c2Ee9846967fAf33364Bf70eB06',
  //         4: '0x1B7D9daDBE37Eb6dF32c8682Ee3090b630D24F3e'
  //     }
  // },
  // "Margin-ETH5L": {
  //     symbol: 'Margin-ETH5L',
  //     Icon: TokenLeverUp,
  //     decimals: 18,
  //     addresses: {
  //         1: '',
  //         3: '0x7E4874fc55Be4109F9Bde3220fE4FF510dEFc989',
  //         4: '0x6A308373912a73Fe17AB40637061A5eeeDD16975'
  //     }
  // },
  // "Margin-ETH1S": {
  //     symbol: 'Margin-ETH1S',
  //     Icon: TokenLeverDown,
  //     decimals: 18,
  //     addresses: {
  //         1: '',
  //         3: '0xc36C2a814BE5A9E0b739a33821c46bba9a4AF088',
  //         4: '0x9a1Aea23230447Da01E66Caa9D0D96c039805f89'
  //     }
  // },
  // "Margin-ETH2S": {
  //     symbol: 'Margin-ETH2S',
  //     Icon: TokenLeverDown,
  //     decimals: 18,
  //     addresses: {
  //         1: '',
  //         3: '0x837bEc96b89ac3386cF754e125fE26676c7B1064',
  //         4: '0x502eAfEB2e8b14C22118e0F5a15427Edc4D3B2bB'
  //     }
  // },
  // "Margin-ETH5S": {
  //     symbol: 'Margin-ETH5S',
  //     Icon: TokenLeverDown,
  //     decimals: 18,
  //     addresses: {
  //         1: '',
  //         3: '0x61764d77161F3fBd945cB19ADdd9DB49d27A9dab',
  //         4: '0xD46880A5bA1cA2167D71582d8f2D5acdB441aBD5'
  //     }
  // }
};

// export const LeverTokenList = [
//     tokenList['Margin-ETH1L'],
//     tokenList['Margin-ETH1S'],
//     tokenList['Margin-ETH2L'],
//     tokenList['Margin-ETH2S'],
//     tokenList['Margin-ETH5L'],
//     tokenList['Margin-ETH5S']]

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
        5: 3,
      },
      0: {
        1: 4,
        2: 5,
        5: 6,
      },
    },
  },
};

export const FortEuropeanOptionContract: AddressesType = {
  1: "",
  3: "0x90b5212B1CE2cCF2aDC9Af4fF7EAcd61d0A216fF",
  4: "0xAB7B4a58078A76CEBd3f9DeB7cf308C34AAb71F2",
};

export const FortLeverContract: AddressesType = {
  1: "",
  3: "0x341bA26a1c4E1c609d170574Da0abB23f7986e34",
  4: "0x269382F35b76C6d7C30980A9E835D7e6831e0D84",
};

export const FortVaultForStakingContract: AddressesType = {
  1: "",
  3: "0x74E243b3C1cCF1c6b19788314d8a852C5A86e618",
  4: "0xF06Ca516B6e11AB7843FB0B1a7eECBf0e57B3B64",
};

export const NestPrice: AddressesType = {
  1: "",
  3: "0x85723E83A7E7d88b0F3Ceb4C5bE7C853e3Ed8a82",
  4: "0x40C3EB032f27fDa7AdcF1B753c75B84e27f26838",
};
