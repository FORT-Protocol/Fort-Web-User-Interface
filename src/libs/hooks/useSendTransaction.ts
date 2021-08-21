import { useCallback } from 'react';
import { Contract } from "ethers";
import useWeb3 from "./useWeb3";
import { addGasLimit } from '../utils';

export function useSendTransaction(contract: Contract | null, tx: any) {
    const { library } = useWeb3()
    const txPromise = useCallback(
        async () => {
            if (!library || !contract) {return}
            const estimateGas = await library.estimateGas(tx).catch(() => {return})
            if (!estimateGas) {return}
            const newTx = {...tx, gasLimit: addGasLimit(estimateGas)}
            return library?.getSigner().sendTransaction(newTx).then().catch()
        }
        ,[contract, library, tx]
    )
    return txPromise
}

enum TransactionState {
    Pending = 0,
    Success = 1,
    Fail = 2
}

type TransactionInfoType = {
    title: string,
    info: string,
    hash: string,
    state: TransactionState,
    startTime: string,
    endTime: string
}