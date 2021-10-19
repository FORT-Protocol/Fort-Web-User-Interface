type Chain = {
  name: string;
  chainId: number;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  rpc: Array<string>;
  infoURL: string;
};

const INFURA_API_KEY = 'be0a9832394640b090fceb2b2107993c';

export const Mainnet = {
  name: "Mainnet",
  chainId: 1,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`,
  ],
  infoURL: "https://etherscan.io/",
};

export const Ropsten = {
  name: "Ropsten",
  chainId: 3,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
    `wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}`,
  ],
  infoURL: "https://ropsten.etherscan.io/",
};

export const Rinkeby = {
  name: "Rinkeby",
  chainId: 4,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
    `wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}`,
  ],
  infoURL: "https://rinkeby.etherscan.io/",
};

export const Goerli = {
  name: "Goerli",
  chainId: 5,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    "https://rpc.goerli.mudit.blog/",
    "https://rpc.slock.it/goerli ",
    "https://goerli.prylabs.net/",
  ],
  infoURL: "https://goerli.net/#about/",
};

export const Kovan = {
  name: "Kovan",
  chainId: 42,
  tokenName: "Ether",
  tokenSymbol: "ETH",
  tokenDecimals: 18,
  rpc: [
    `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
    `wss://kovan.infura.io/ws/v3/${INFURA_API_KEY}`,
  ],
  infoURL: "https://kovan-testnet.github.io/website",
};
// export const SupportedChains: Array<Chain> = [Mainnet, Ropsten, Rinkeby, Goerli, Kovan]
export const SupportedChains: Array<Chain> = [Mainnet, Rinkeby];
