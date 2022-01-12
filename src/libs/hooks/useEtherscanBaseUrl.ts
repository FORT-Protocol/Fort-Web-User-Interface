import { useMemo } from "react";
import useWeb3 from "./useWeb3";

export function useEtherscanBaseUrl(): string {
  const { chainId } = useWeb3();
  return useMemo(() => {
    if (chainId) {
      if (chainId === 137) {
        return "https://polygonscan.com/tx/";
      } else if (chainId === 80001) {
        return "https://mumbai.polygonscan.com/tx/";
      }
    }
    return "";
  }, [chainId]);
}
