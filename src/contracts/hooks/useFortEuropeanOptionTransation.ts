import { tokenList } from './../../libs/constants/addresses';
import { BigNumber } from "ethers";
import { FortEuropeanOptionContract } from "../../libs/constants/addresses";
import { FortEuropeanOption } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";

const contract = FortEuropeanOption(FortEuropeanOptionContract)
export function useFortEuropeanOptionOpen(
    tokenName: string, 
    price: BigNumber, 
    orientation: boolean, 
    endblock: BigNumber, 
    fortAmount: BigNumber
) { 
    const { account, chainId } = useWeb3()
    if (!chainId || !contract) {return}
    const callData = contract?.interface.encodeFunctionData('open', [
        tokenList[tokenName].addresses[chainId], 
        price, 
        String(orientation), 
        endblock, 
        fortAmount]
    )
    const tx = {
        from: account,
        to: contract.address,
        data: callData,
        value: PRICE_FEE
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const txPromise = useSendTransaction(contract, tx)
    return txPromise
}

export function useFortEuropeanOptionExercise(
    optionAddress: string,
    amount: BigNumber
) {
    const { account, chainId } = useWeb3()
    if (!chainId || !contract) {return}
    const callData = contract?.interface.encodeFunctionData('exercise', [
        optionAddress, 
        amount]
    )
    const tx = {
        from: account,
        to: contract.address,
        data: callData,
        value: PRICE_FEE
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const txPromise = useSendTransaction(contract, tx)
    return txPromise
}