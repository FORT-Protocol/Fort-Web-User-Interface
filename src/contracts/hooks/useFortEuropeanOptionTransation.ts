import { tokenList } from './../../libs/constants/addresses';
import { BigNumber } from "ethers";
import { FortEuropeanOptionContract } from "../../libs/constants/addresses";
import { FortEuropeanOption } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function useFortEuropeanOptionOpen(
    tokenName: string, 
    price: BigNumber, 
    orientation: boolean, 
    endblock: BigNumber, 
    fortAmount: BigNumber
) { 
    const { account, chainId } = useWeb3()
    var contract = FortEuropeanOption(FortEuropeanOptionContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('open', [
            tokenList[tokenName].addresses[chainId], 
            price, 
            orientation, 
            endblock, 
            fortAmount]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Option Token mint`, info:'', type: TransactionType.buyOption})
    return txPromise
}

export function useFortEuropeanOptionExercise(
    optionAddress: string,
    amount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = FortEuropeanOption(FortEuropeanOptionContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('exercise', [
            optionAddress, 
            amount]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Option Token close`, info:'', type: TransactionType.closeOption})
    return txPromise
}