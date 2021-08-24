import { BigNumber } from "ethers";
import { FortLeverContract, tokenList } from "../../libs/constants/addresses";
import { FortLever } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";

export function useFortLeverBuy(
    tokenName: string, 
    lever: BigNumber, 
    orientation: boolean, 
    fortAmount: BigNumber
) {
    const { account, chainId } = useWeb3()
    const contract = FortLever(FortLeverContract)
    const callData = contract?.interface.encodeFunctionData('buy', [
        tokenList[tokenName].addresses[chainId ? chainId : 1], 
        lever, 
        orientation, 
        fortAmount]
    )
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:'授权', info:'我授权你'})
    return txPromise
}

export function useFortLeverSell(
    leverAddress: string, 
    amount: string
) {
    const { account } = useWeb3()
    const contract = FortLever(FortLeverContract)
    const callData = contract?.interface.encodeFunctionData('buy', [
        leverAddress, 
        amount]
    )
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const txPromise = useSendTransaction(contract, tx, {title:'授权', info:'我授权你'})
    return txPromise
}

