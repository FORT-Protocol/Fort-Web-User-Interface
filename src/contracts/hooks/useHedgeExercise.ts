import {PRICE_FEE} from "../../libs/utils";
import {FortLPGuaranteeContract} from "../../libs/hooks/useContract";
import useWeb3 from "../../libs/hooks/useWeb3";
import {useSendTransaction} from "../../libs/hooks/useSendTransaction";
import {TransactionType} from "../../libs/hooks/useTransactionInfo";

const useHedgeOpen = (index: number) => {
  let contract = FortLPGuaranteeContract()
  const {account, chainId} = useWeb3()
  
  let callData: string | undefined;
  if (!chainId || !index) {
    contract = null
  } else {
    callData = contract?.interface.encodeFunctionData('exercise', [
        index,
      ]
    )
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
    value: PRICE_FEE
  }
  return useSendTransaction(contract, tx, {title: `Strike hedge`, info: index.toString(), type: TransactionType.strikeHedge})
}

export default useHedgeOpen