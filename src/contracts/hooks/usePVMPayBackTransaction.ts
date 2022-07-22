import { BigNumber } from "ethers"
import { PVMPayBackContract } from "../../libs/constants/addresses"
import { PVMPayBack } from "../../libs/hooks/useContract"
import { useSendTransaction } from "../../libs/hooks/useSendTransaction"
import { TransactionType } from "../../libs/hooks/useTransactionInfo"
import useWeb3 from "../../libs/hooks/useWeb3"


export function usePVMPayBack(
    dcuAmount: BigNumber
) { 
    const { account, chainId } = useWeb3()
    var contract = PVMPayBack(PVMPayBackContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('swap', [
            dcuAmount]
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