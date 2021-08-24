import { useCallback } from 'react';
import { Contract } from "ethers";
import useWeb3 from "./useWeb3";
import { addGasLimit } from '../utils';
import useTransactionList, { TransactionBaseInfoType, TransactionState } from './useTransactionInfo';

export function useSendTransaction(contract: Contract | null, tx: any, txInfo: TransactionBaseInfoType) {
    const { library } = useWeb3()
    const { pushTx, setShowModal } = useTransactionList()
    const txPromise = useCallback(
        async () => {
            if (!library || !contract) {
                setShowModal({isShow: true, hash: '0x0', txState:TransactionState.Revert})
                return
            }
            const estimateGas = await library.estimateGas(tx).catch(() => {return})
            if (!estimateGas) {
                setShowModal({isShow: true, hash: '0x0', txState:TransactionState.Revert})
                return
            }
            const newTx = {...tx, gasLimit: addGasLimit(estimateGas)}
            return library?.getSigner().sendTransaction(newTx).then((res) => {
                pushTx(res.hash, txInfo)
            }).catch(() => {
                setShowModal({isShow: true, hash: '0x0', txState:TransactionState.Revert})
            })
        }
        ,[contract, library, pushTx, setShowModal, tx, txInfo]
    )
    return txPromise
}