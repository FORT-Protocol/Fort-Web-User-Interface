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
      321: ZERO_ADDRESS,
      322: ZERO_ADDRESS
    },
    pairIndex: {
      321: '0',
      322: '0'
    },
    sigmaSQ: BigNumber.from('45659142400')
  },
  USDT: {
    symbol: "USDT",
    Icon: TokenUSDT,
    decimals: 18,
    addresses: {
      321: "0x55d398326f99059ff775485246999027b3197955",
      322: "0x17322b20752cC7d6094209f6Fa73275375Cf7B27"
    },
    pairIndex: {
      321: '',
      322: ''
    }
  },
  DCU: {
    symbol: "DCU",
    Icon: TokenFORT,
    decimals: 18,
    addresses: {
      321: "0xf56c6eCE0C0d6Fbb9A53282C0DF71dBFaFA933eF",
      322: "0x934D8Ec0B9199c7742215ec803A8dcA5d98C1a02"
    },
    pairIndex: {
      321: '',
      322: ''
    }
  },
  BTC: {
    symbol: "BTC",
    Icon: TokenBTC,
    decimals: 18,
    addresses: {
      321: "0x46893c30fBDF3A5818507309c0BDca62eB3e1E6b",
      322: "0x5cbb73B367FD69807381d06BC2041BEc86d8487d"
    },
    pairIndex: {
      321: '2',
      322: '1'
    },
    sigmaSQ: BigNumber.from('31708924900')
  },
};

export const FortEuropeanOptionContract: AddressesType = {
  321: "0x284935F8C571d054Df98eDA8503ea13cde5fd8Cc",
  322: "0x5F1ae37aF4716d12E336d706E2D9bDdA710425c5"
};

export const FortLeverContract: AddressesType = {
  321: "0x8c5052f7747D8Ebc2F069286416b6aE8Ad3Cc149",
  322: "0xBa2064BbD49454517A9dBba39005bf46d31971f8"
};

export const NestPrice: AddressesType = {
  321: "0x09CE0e021195BA2c1CDE62A8B187abf810951540",
  322: "0xF331D5C0E36Cc8a575D185b1D513715be55087E4"
};

export const SwapAddress: AddressesType = {
  321: '0x9484f12044b9d5707AfeaC5BD02b5E0214381801',
  322: '0xc61409835E6A23e31f2fb06F76ae13A1b4c5fD26'
};

export const CofixSwapAddress: AddressesType = {
  321: '0xb29A8d980E1408E487B9968f5E4f7fD7a9B0CaC5',
  322: '0x4A448cBb12e449D7031f36C8122eCE6dDdf9cc84'
};