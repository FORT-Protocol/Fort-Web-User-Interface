import { BigNumber } from "ethers";
import { useCallback } from "react";
import { FortLeverContract } from "../../libs/constants/addresses";
import { FortLever } from "../../libs/hooks/useContract";
import { addGasLimit, PRICE_FEE } from "../../libs/utils";

const contract = FortLever(FortLeverContract)

export function useFortLeverBuy(
    tokenAddress: string, 
    lever: BigNumber, 
    orientation: boolean, 
    fortAmount: BigNumber
) {
    const txPromise = useCallback(
        async ():Promise<void> => {
            if (!contract) {
                throw new Error('useFortLeverBuy:!contract')
            }
            const estimatedGas = await contract.estimateGas.buy(
                tokenAddress, 
                lever.toString(), 
                orientation, 
                fortAmount.toString(), { value: PRICE_FEE })
            return contract.buy(
                tokenAddress, 
                lever.toString(), 
                orientation, 
                fortAmount.toString(), { 
                    value: PRICE_FEE, 
                    gasLimit: addGasLimit(estimatedGas)
                }
            )
        }, [fortAmount, lever, orientation, tokenAddress]
    )
    return txPromise
}

export function useFortLeverSell(
    leverAddress: string, 
    amount: string
) {
    const txPromise = useCallback(
        async ():Promise<void> => {
            if (!contract) {
                throw new Error('useFortLeverSell:!contract')
            }
            const estimatedGas = await contract.estimateGas.sell(
                leverAddress, 
                amount, { value: PRICE_FEE })
            return contract.sell(
                leverAddress, 
                amount, { 
                    value: PRICE_FEE,
                    gasLimit: addGasLimit(estimatedGas)
                }
            )
        }, [amount, leverAddress]
    )
    return txPromise
}

