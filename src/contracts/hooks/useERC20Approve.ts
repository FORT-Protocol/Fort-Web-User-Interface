import { BigNumber } from "ethers";
import { tokenList } from "../../libs/constants/addresses";
import { ERC20Contract } from "../../libs/hooks/useContract";
import { useSendTransaction } from "../../libs/hooks/useSendTransaction";
import useWeb3 from "../../libs/hooks/useWeb3";
import { PRICE_FEE } from "../../libs/utils";

export function useERC20Approve(
    tokenName: string, 
    to: string, 
    amount: BigNumber
) {
    const contract = ERC20Contract(tokenList[tokenName].addresses)
    const { account } = useWeb3()
    const callData = contract?.interface.encodeFunctionData('approve', [
        to, 
        amount]
    )
    const tx = {
        from: account,
        to: contract?.address,
        data: callData
    }
    const txPromise = useSendTransaction(contract, tx, {title:'授权', info:'我授权你'})
    return txPromise
}
