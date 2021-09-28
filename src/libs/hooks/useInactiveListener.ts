import { useEffect } from "react";
import injected from "../connectors/injected";
import useWeb3 from "./useWeb3";

const useInactiveListener = (suppress = false) => {
  const { active, error, activate } = useWeb3();

  useEffect(() => {
    const { ethereum } = window;

    if (!ethereum || !ethereum.on) {
      return;
    }

    if (active || error || suppress) {
      return;
    }

    const handleChainChanged = () => {
      // eat errors
      activate(injected.connector, undefined, true).catch((error) => {
        console.error("Failed to activate after chain changed", error);
      });
    };

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        // eat errors
        activate(injected.connector, undefined, true).catch((error) => {
          console.error("Failed to activate after accounts changed", error);
        });
      }
    };

    ethereum.on("chainChanged", handleChainChanged);
    ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("chainChanged", handleChainChanged);
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, [active, error, suppress, activate]);
};

export default useInactiveListener;
