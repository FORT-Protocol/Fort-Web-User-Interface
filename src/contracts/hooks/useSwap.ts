import { BigNumber } from "ethers";
import { tokenList } from "../../libs/constants/addresses";
import { SwapContract } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function useSwap(
    srcName: string,
    destName: string,
    amountIn: BigNumber,
    to: string,
    payback: string
) {
    const { account, chainId } = useWeb3()
    var contract = SwapContract()
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('swap', [
            tokenList[srcName].addresses[chainId],
            tokenList[destName].addresses[chainId],
            amountIn,
            to,
            payback]
        )
    }
    const value = srcName === 'ETH' ? PRICE_FEE.add(amountIn) : PRICE_FEE
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: value
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Swap`, info:'', type: TransactionType.swap})
    return txPromise
}

export function useSwapExactDCU(
    dctAmount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = SwapContract()
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('swapExactDCU', [
            dctAmount]
        )
    }
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Swap`, info:'', type: TransactionType.swap})
    return txPromise
}

export function useSwapExactNEST(
    nestAmount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = SwapContract()
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('swapExactNEST', [
            nestAmount]
        )
    }
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Swap`, info:'', type: TransactionType.swap})
    return txPromise
}