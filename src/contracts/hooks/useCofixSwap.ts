import { BigNumber } from "ethers";
import { CofixSwapContract } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE, ZERO_ADDRESS } from "../../libs/utils";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function useSwapExactTokensForTokens(
    path: Array<string>,
    amountIn: BigNumber,
    amountOut: BigNumber,
    deadline: number,
    to: string | null | undefined,
    rewardTo: string | null | undefined
) {
    const { account, chainId } = useWeb3()
    var contract = CofixSwapContract()
    var callData: string | undefined
    if (!chainId || !to || !rewardTo) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('swapExactTokensForTokens', [
            path,
            amountIn,
            amountOut,
            to,
            rewardTo,
            BigNumber.from(deadline.toString())]
        )
    }
    const value = () => {
        if (path.length === 2) {
            return 0
        } else {
            return path[0] === ZERO_ADDRESS ? amountIn.add(PRICE_FEE) : PRICE_FEE
        }
    }
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: value()
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Swap`, info:'', type: TransactionType.swap})
    return txPromise
}