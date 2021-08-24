import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import useWeb3 from "./useWeb3";
import { toast } from "react-toastify";

export enum TransactionState {
    Pending = 0,
    Success = 1,
    Fail = 2,
    Revert = 3
}

export type TransactionBaseInfoType = {
    title: string,
    info: string
}

type TransactionInfoType = {
    title: string,
    info: string,
    hash: string,
    txState: TransactionState,
    addTime: number,
    endTime: number
}

const _useTransactionList = () => {
    const {chainId, library} = useWeb3()
    const [txList, setTxList] = useState<TransactionInfoType[]>([])
    const [showModal, setShowModal] = useState({isShow:false, hash:'0x0', txState:TransactionState.Pending})
    const [pendingList, setPendingList] = useState<TransactionInfoType[]>([])
    const [checking, setChecking] = useState(false)

    useEffect(() => {
        if (!chainId) {return}
        ;(async () => {
            var cache = localStorage.getItem("transactionList" + chainId?.toString())
            if (!cache) {return []}
            setTxList(JSON.parse(cache))
            console.log('1' + {cache})
        })()
    }, [chainId])

    useEffect(() => {
        if (txList.length === 0) {return}
        ;(async () => {
            localStorage.setItem('transactionList' + chainId?.toString(), JSON.stringify(txList))
            // 过滤pending交易
            var noResultTx: Array<TransactionInfoType> = txList.filter((item) => {return item.txState === TransactionState.Pending})
            setPendingList(noResultTx)
            console.log('2' + {txList})
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [txList])

    useEffect(() => {
        if (pendingList.length === 0 || checking) {return}
        setChecking(true)
        ;(async () => {
            console.log('3' + {pendingList})
            for (let index = 0; index < pendingList.length; index++) {
                const element = pendingList[index];
                const rec = await library?.getTransactionReceipt(element.hash)
                if (typeof rec?.status !== 'undefined') {
                    const status = rec.status ? TransactionState.Success : TransactionState.Fail
                    element.txState = status
                    updateList(element)
                    setChecking(false)
                    console.log('成功' + {index})
                    notifyTransaction(element)
                    if (element.hash === showModal.hash) {
                        setShowModal({isShow:true, hash: element.hash, txState:TransactionState.Success})
                    }
                    return
                }
                console.log('下一个' + {index})
            }
            setTimeout(() => {
                setChecking(false)
            }, 15000)
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingList, checking])

    const pushTx = (hash: string, txInfo:TransactionBaseInfoType) => {
        const nowDate = parseInt((new Date().getTime() / 1000).toString())
        const monthDate = nowDate + 86400 * 30
        const newTxInfo: TransactionInfoType = {
            title: txInfo.title,
            info: txInfo.info,
            hash: hash,
            txState: TransactionState.Pending,
            addTime: nowDate,
            endTime: monthDate
        }
        updateList(newTxInfo)
        setShowModal({isShow:false, hash: hash, txState:TransactionState.Pending})
    }

    const updateList = (item:TransactionInfoType) => {
        const index = txList.findIndex((t) => t.hash === item.hash)
        if (index > -1) {
            txList[index] = item
            setTxList([...txList])
        } else {
            setTxList(txList.concat(item))
        }
    }

    const closeModal = () => {
        setShowModal({isShow:false, hash:'0x0', txState:TransactionState.Pending})
    }

    return {txList, showModal, setShowModal, pushTx, closeModal, pendingList}
}

const notifyTransaction = (txInfo:TransactionInfoType) => {
    toast.success(txInfo.title + txInfo.info, {
        position: toast.POSITION.TOP_RIGHT
    })
}

const transactionList = createContainer(_useTransactionList)

const useTransactionList = () => {
    return transactionList.useContainer()
}

export const Provider = transactionList.Provider
  
export default useTransactionList