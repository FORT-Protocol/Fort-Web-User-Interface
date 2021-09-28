import { Web3Provider } from "@ethersproject/providers";
import { createContainer } from "unstated-next";
import { useWeb3React } from "@web3-react/core";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";

function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> {
  const context = useWeb3React<Web3Provider>();
  return context;
}

const Web3 = createContainer(useActiveWeb3React);

export const Provider = Web3.Provider;

function useWeb3(): Web3ReactContextInterface<Web3Provider> {
  return Web3.useContainer();
}

export default useWeb3;
