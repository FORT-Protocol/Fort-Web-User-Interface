import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';
import { ReceiveDcuFaucetContract } from "../../libs/hooks/useContract";

export function useWithdrawToken() {
    const { account, chainId } = useWeb3()
    var contract = ReceiveDcuFaucetContract()
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('withdrawToken')
    }
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Receive DCU`, info:'', type: TransactionType.receiveDcu})
    return txPromise
}
