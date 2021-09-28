import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { SupportedChains } from "../constants/chain";

export const connector = new WalletConnectConnector({
  rpc: SupportedChains.reduce((m, c) => {
    m[c.chainId] = c.rpc[0];
    return m;
  }, Object.create(null)),
  supportedChainIds: SupportedChains.map((c) => c.chainId),
  qrcode: true,
});

export const id = "wallet-connect";
export const Icon = "";
export const name = "Wallet Connect";
export const result = { id, connector, Icon, name };

export default result;
