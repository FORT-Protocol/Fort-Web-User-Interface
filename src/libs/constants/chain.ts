type Chain = {
  name: string;
  chainId: number;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  rpc: Array<string>;
  infoURL: string;
};

export const KCCTest = {
  name: "KCCTest",
  chainId: 322,
  tokenName: "KCSTest",
  tokenSymbol: "KCS",
  tokenDecimals: 18,
  rpc: [
    `https://rpc-testnet.kcc.network`
  ],
  infoURL: "https://scan-testnet.kcc.network/",
};

export const KCC = {
  name: "KCC",
  chainId:321,
  tokenName: "KCS",
  tokenSymbol: "KCS",
  tokenDecimals: 18,
  rpc: [
    `https://rpc-mainnet.kcc.network`
  ],
  infoURL: "https://scan.kcc.io/cn/",
};

export const SupportedChains: Array<Chain> = [KCC];
