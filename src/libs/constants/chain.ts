type Chain = {
  name: string;
  chainId: number;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  rpc: Array<string>;
  infoURL: string;
};

export const Polygon = {
  name: "Polygon",
  chainId: 137,
  tokenName: "MATIC",
  tokenSymbol: "MATIC",
  tokenDecimals: 18,
  rpc: [
    `https://polygon-rpc.com/`,
    `https://rpc-mainnet.matic.network`,
  ],
  infoURL: "https://polygonscan.com/",
};

export const Mumbai = {
  name: "Mumbai",
  chainId: 80001,
  tokenName: "MATIC",
  tokenSymbol: "MATIC",
  tokenDecimals: 18,
  rpc: [
    `https://rpc-mumbai.matic.today`,
    `https://matic-mumbai.chainstacklabs.com`,
    `https://rpc-mumbai.maticvigil.com`
  ],
  infoURL: "https://mumbai.polygonscan.com/",
};

export const SupportedChains: Array<Chain> = [Polygon];
