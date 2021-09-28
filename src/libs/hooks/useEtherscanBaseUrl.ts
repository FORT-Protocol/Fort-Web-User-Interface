import { useMemo } from "react";
import useWeb3 from "./useWeb3";

export function useEtherscanBaseUrl(): string {
  const { chainId } = useWeb3();
  return useMemo(() => {
    if (chainId) {
      if (chainId === 1) {
        return "https://etherscan.io/tx/";
      } else if (chainId === 4) {
        return "https://rinkeby.etherscan.io/tx/";
      } else if (chainId === 3) {
        return "https://ropsten.etherscan.io/tx/";
      }
    }
    return "";
  }, [chainId]);
}
