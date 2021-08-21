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
    const { account, chainId } = useWeb3()
    if (!chainId || !contract) {return}
    const callData = contract?.interface.encodeFunctionData('approve', [
        tokenList[tokenName].addresses[chainId], 
        to, 
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
