import { BigNumber } from "ethers";
import { useCallback } from "react";
import { FortEuropeanOptionContract } from "../../libs/constants/addresses";
import { FortEuropeanOption } from "../../libs/hooks/useContract";
import { addGasLimit, PRICE_FEE } from "../../libs/utils";

const contract = FortEuropeanOption(FortEuropeanOptionContract)

export function useFortEuropeanOptionOpen(
    tokenAddress: string, 
    price: BigNumber, 
    orientation: boolean, 
    endblock: BigNumber, 
    fortAmount: BigNumber
) {
    const txPromise = useCallback(
        async ():Promise<void> => {
            if (!contract) {
                throw new Error('useFortEuropeanOptionOpen:!contract')
            }
            const estimatedGas = await contract.estimateGas.open(
                tokenAddress, 
                price.toString(), 
                orientation, 
                endblock.toString(),
                fortAmount.toString(), { value: PRICE_FEE })
            return contract.open(
                tokenAddress, 
                price.toString(), 
                orientation, 
                endblock.toString(),
                fortAmount.toString(), { 
                    value: PRICE_FEE, 
                    gasLimit: addGasLimit(estimatedGas) 
                }
            )
        }, [endblock, fortAmount, orientation, price, tokenAddress]
    )
    return txPromise
}

export function useFortEuropeanOptionExercise(
    optionAddress: string,
    amount: BigNumber
) {
    const txPromise = useCallback(
        async ():Promise<void> => {
            if (!contract) {
                throw new Error('useFortEuropeanOptionOpen:!contract')
            }
            const estimatedGas = await contract.estimateGas.exercise(
                optionAddress,
                amount.toString(), { value: PRICE_FEE }
            )
            return contract.exercise(
                optionAddress,
                amount.toString(), { 
                    value: PRICE_FEE, 
                    gasLimit: addGasLimit(estimatedGas) 
                }
            )
        }, [amount, optionAddress]
    )
    return txPromise
}