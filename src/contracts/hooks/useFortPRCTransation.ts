import { BigNumber } from "ethers"
import { FortPRC } from "../../libs/constants/addresses"
import { FortPRCContract } from "../../libs/hooks/useContract"
import { useSendTransaction } from "../../libs/hooks/useSendTransaction"
import { TransactionType } from "../../libs/hooks/useTransactionInfo"
import useWeb3 from "../../libs/hooks/useWeb3"


export function useFortPRCRoll(
    n: BigNumber,  
    m: BigNumber | null | undefined
) { 
    const { account, chainId } = useWeb3()
    var contract = FortPRCContract(FortPRC)
    var callData: string | undefined
    if (!chainId || !m) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('roll44', [
            n,m]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Roll`, info:'', type: TransactionType.roll})
    return txPromise
}

export function useFortPRCClaim(
    index: BigNumber
) { 
    const { account, chainId } = useWeb3()
    var contract = FortPRCContract(FortPRC)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('claim44', [
            index]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Claim`, info:index.toString(), type: TransactionType.prcclaim})
    return txPromise
}