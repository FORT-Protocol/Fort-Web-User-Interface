import * as ethers from 'ethers'
import { Web3Provider as TypeWeb3Provider } from '@ethersproject/providers'
import { FC, useEffect } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import useWeb3, { Provider } from './hooks/useWeb3';
import injected from './connectors/injected';
import { Provider as I18nProvider } from './i18nConfig';

function getLibrary(provider:any): TypeWeb3Provider {
    const library = new ethers.providers.Web3Provider(provider)
    return library
}

const Inner: FC = ({children}) => {
    const { account ,activate } = useWeb3()
    useEffect(() => {
      (async () => {
        try {
          const isAuthorized = await injected.connector.isAuthorized()
          if (isAuthorized) {
            activate(injected.connector, undefined, true)
          }
        } finally {
          
        }
      })()
    }, [account, activate])
    return <>{children}</>
}

const MainProvider: FC = ({children}) => {
    return (
        <I18nProvider>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Provider>
                    <Inner>
                        {children}
                    </Inner>
                </Provider>
            </Web3ReactProvider>
        </I18nProvider>
    )
}

export default MainProvider