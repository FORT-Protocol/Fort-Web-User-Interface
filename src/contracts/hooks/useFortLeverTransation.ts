import { LeverIndex } from './../../libs/constants/addresses';
import { BigNumber } from "ethers";
import { FortLeverContract } from "../../libs/constants/addresses";
import { FortLever } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function useFortLeverBuy(
    tokenName: string,
    leverNum: number,
    isLong: boolean,
    fortAmount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = FortLever(FortLeverContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        const leverIndex = LeverIndex[tokenName][chainId][isLong?1:0][leverNum]
        callData = contract?.interface.encodeFunctionData('buyDirect', [
            leverIndex, 
            fortAmount]
        )
    }
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Buy Leveraged Token`, info:'', type: TransactionType.buyLever})
    return txPromise
}

export function useFortLeverSell(
    index: BigNumber, 
    amount: BigNumber
) {
    const { account, chainId } = useWeb3()
    var contract = FortLever(FortLeverContract)
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('sell', [
            index, 
            amount]
        )
    }
    const tx = {
        from: account,
        to: contract?.address,
        data: callData,
        value: PRICE_FEE
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Sell Leveraged Token`, info:'', type: TransactionType.closeLever})
    return txPromise
}

