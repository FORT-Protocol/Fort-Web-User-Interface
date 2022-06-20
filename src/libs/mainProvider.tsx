import * as ethers from "ethers";
import { Web3Provider as TypeWeb3Provider } from "@ethersproject/providers";
import { FC } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider as Web3Provider } from "./hooks/useWeb3";
import { Provider as I18nProvider } from "./i18nConfig";
import { Provider as TransactionProvider } from "./hooks/useTransactionInfo";
import "../../src/styles/ant.css";
import useEagerConnect from "./hooks/useEagerConnect";
import useInactiveListener from "./hooks/useInactiveListener";
import { Provider as ThemesProvider } from "./hooks/useThemes";

function getLibrary(provider: any): TypeWeb3Provider {
  const library = new ethers.providers.Web3Provider(provider);
  return library;
}

const Inner: FC = ({ children }) => {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);
  return <>{children}</>;
};

const MainProvider: FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemesProvider>
        <Web3Provider>
          <I18nProvider>
            <TransactionProvider>
              <Inner>
                {children}
              </Inner>
            </TransactionProvider>
          </I18nProvider>
        </Web3Provider>
      </ThemesProvider>
    </Web3ReactProvider>
  );
};

export default MainProvider;
