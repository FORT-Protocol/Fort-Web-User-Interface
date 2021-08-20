import { BigNumber } from "ethers";
import { useCallback } from "react";
import { tokenList } from "../../libs/constants/addresses";
import { ERC20Contract } from "../../libs/hooks/useContract";
import { addGasLimit } from "../../libs/utils";

export function useERC20Approve(
    tokenName: string, 
    to: string, 
    amount: BigNumber
): () => Promise<void> {
    const contract = ERC20Contract(tokenList[tokenName].addresses)
    const txPromise = useCallback(
        async ():Promise<void> => {
            if (!contract) {
                throw new Error('useERC20Approve:!contract')
            }
            const estimateGas = await contract.estimateGas.approve(to, amount.toString())
            return contract.approve(to, amount.toString(), {
                gasLimit: addGasLimit(estimateGas)
            }).then(() => {

            }).catch((error: Error) => {
                throw error
            })
        }, [amount, contract, to]
    )
    return txPromise
}