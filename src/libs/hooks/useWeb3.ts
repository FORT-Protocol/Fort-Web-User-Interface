import { createContainer } from "unstated-next";
import { useWeb3React } from "@web3-react/core";

const _useWeb3 = <Web3Provider>() => {
    return useWeb3React<Web3Provider>()
}

const Web3 = createContainer(_useWeb3)

export const Provider = Web3.Provider

const useWeb3 = () => {
    return Web3.useContainer()
}

export default useWeb3