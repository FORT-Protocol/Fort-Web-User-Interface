import {normalToBigNumber, PRICE_FEE} from "../../libs/utils";
import {FortLPGuaranteeContract} from "../../libs/hooks/useContract";
import useWeb3 from "../../libs/hooks/useWeb3";
import {useSendTransaction} from "../../libs/hooks/useSendTransaction";
import {TransactionType} from "../../libs/hooks/useTransactionInfo";

const useHedgeOpen = (index: number, x0: string | undefined, y0: string, blockNum: number) => {
  let contract = FortLPGuaranteeContract()
  const {account, chainId} = useWeb3()
  let callData: string | undefined;
  if (!chainId || !x0 || !blockNum || !y0) {
    contract = null
  } else {
    callData = contract?.interface.encodeFunctionData('open', [
        index,
        normalToBigNumber(x0),
        normalToBigNumber(y0),
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