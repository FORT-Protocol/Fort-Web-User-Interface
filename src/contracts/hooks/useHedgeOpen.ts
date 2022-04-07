import {normalToBigNumber, PRICE_FEE} from "../../libs/utils";
import {FortLPGuaranteeContract} from "../../libs/hooks/useContract";
import useWeb3 from "../../libs/hooks/useWeb3";
import {useSendTransaction} from "../../libs/hooks/useSendTransaction";
import {TransactionType} from "../../libs/hooks/useTransactionInfo";

const useHedgeOpen = (x0: string | undefined, blockNum: number) => {
  let contract = FortLPGuaranteeContract()
  const {account, chainId} = useWeb3()
  
  let callData: string | undefined;
  if (!chainId || !x0 || !blockNum) {
    contract = null
  } else {
    callData = contract?.interface.encodeFunctionData('open', [
        0,
        normalToBigNumber(x0),
        '0',
        blockNum
      ]
    )
  }
  const tx = {
    from: account,
    to: contract?.address,
    data: callData,
    value: PRICE_FEE
  }
  return useSendTransaction(contract, tx, {title: `Hedge`, info: 'Open', type: TransactionType.openHedge})
}

export default useHedgeOpen