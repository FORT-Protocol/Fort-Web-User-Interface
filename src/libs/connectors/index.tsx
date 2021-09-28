import injected from "./injected";
import walletConnect from "./wallet-connect";
import { AbstractConnector } from "@web3-react/abstract-connector";

export type Connector = {
  id: string;
  name: string;
  Icon: string;
  connector: AbstractConnector;
};

export const SupportedConnectors: Array<Connector> = [injected, walletConnect];
