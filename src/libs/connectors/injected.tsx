import { InjectedConnector } from "@web3-react/injected-connector";
import { SupportedChains } from "../constants/chain";

export const connector = new InjectedConnector({
  supportedChainIds: SupportedChains.map((c) => c.chainId),
});

export const id = "metamask";
export const Icon = "";
export const name = "Metamsk";
export const result = { id, connector, Icon, name };

export default result;
