import { tokenList } from './../../libs/constants/addresses';
import { BigNumber } from "ethers";
import { FortForStaking } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { TransactionType } from '../../libs/hooks/useTransactionInfo';

export function useFortForStakingStake(
    tokenName: string, 
    cycle: BigNumber, 
    amount: BigNumber
) { 
    const { account, chainId } = useWeb3()
    
    var contract = FortForStaking()
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('stake', [
            tokenList[tokenName].addresses[chainId], 
            cycle, 
            amount]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Stake`, info:'', type: TransactionType.stake})
    return txPromise
}

export function useFortForStakingWithdraw(
    tokenName: string, 
    cycle: BigNumber, 
    amount: BigNumber
) { 
    const { account, chainId } = useWeb3()
    
    var contract = FortForStaking()
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('withdraw', [
            tokenList[tokenName].addresses[chainId], 
            cycle, 
            amount]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`Withdraw`, info:'', type: TransactionType.unStake})
    return txPromise
}

export function useFortForStakingGetReward(
    tokenName: string, 
    cycle: BigNumber
) { 
    const { account, chainId } = useWeb3()
    
    var contract = FortForStaking()
    var callData: string | undefined
    if (!chainId) {
        contract = null
    } else {
        callData = contract?.interface.encodeFunctionData('getReward', [
            tokenList[tokenName].addresses[chainId], 
            cycle]
        )
    }
    
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:`GetReward`, info:'', type: TransactionType.claim})
    return txPromise
}