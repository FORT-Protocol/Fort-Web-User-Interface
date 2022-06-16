type Chain = {
  name: string;
  chainId: number;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  rpc: Array<string>;
  infoURL: string;
};

export const BSCTest = {
  name: "BSCTest",
  chainId: 97,
  tokenName: "BSCTest",
  tokenSymbol: "BNB",
  tokenDecimals: 18,
  rpc: [
    `https://data-seed-prebsc-2-s1.binance.org:8545/`
  ],
  infoURL: "https://testnet.bscscan.com/",
};

export const BSC = {
  name: "BSC",
  chainId:56,
  tokenName: "BSC",
  tokenSymbol: "BNB",
  tokenDecimals: 18,
  rpc: [
    `https://bsc-dataseed1.defibit.io/`
  ],
  infoURL: "https://bscscan.com/",
};


// export const SupportedChains: Array<Chain> = [Mainnet, Ropsten, Rinkeby, Goerli, Kovan]
export const SupportedChains: Array<Chain> = [BSCTest];
