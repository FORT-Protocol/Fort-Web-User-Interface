import { BigNumber } from "ethers";
import { CofixSwapContract } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
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
            '1',
            to,
            rewardTo,
            BigNumber.from(deadline.toString())]
        )
    }
    const value = () => {
        return 0;
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