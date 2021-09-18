import { BigNumber } from "ethers";
import { tokenList } from "../../libs/constants/addresses";
import { ERC20Contract } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import { TransactionType } from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";

export function useERC20Approve(
    tokenName: string,
    amount: BigNumber,
    to?: string, 
) {
    var contract = ERC20Contract(tokenList[tokenName].addresses)
    const { account } = useWeb3()
    if (!to) {
        contract = null
    }
    const callData = contract?.interface.encodeFunctionData('approve', [
        to, 
        amount]
    )
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Approve`, info:'', type: TransactionType.approve})
    return txPromise
}
