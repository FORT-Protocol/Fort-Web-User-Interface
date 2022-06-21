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
      } else if (chainId === 56) {
        return "https://bscscan.com/tx/";
      } else if (chainId ===97) {
        return "https://testnet.bscscan.com/tx/";
      }
    }
    return "";
  }, [chainId]);
}

export function useEtherscanAddressBaseUrl(): string {
  const { chainId } = useWeb3();
  return useMemo(() => {
    if (chainId) {
      if (chainId === 1) {
        return "https://etherscan.io/address/";
      } else if (chainId === 4) {
        return "https://rinkeby.etherscan.io/address/";
      } else if (chainId === 3) {
        return "https://ropsten.etherscan.io/address/";
      } else if (chainId === 56) {
        return "https://bscscan.com/address/";
      } else if (chainId ===97) {
        return "https://testnet.bscscan.com/address/";
      }
    }
    return "";
  }, [chainId]);
}
