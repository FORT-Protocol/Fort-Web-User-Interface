import { useCallback } from "react";
import { Contract } from "ethers";
import useWeb3 from "./useWeb3";
import { addGasLimit } from "../utils";
import useTransactionListCon, {
  TransactionBaseInfoType,
} from "./useTransactionInfo";
import { TransactionModalType } from "../../pages/Shared/TransactionModal";

export function useSendTransaction(
  contract: Contract | null,
  tx: any,
  txInfo: TransactionBaseInfoType
) {
  const { library } = useWeb3();
  const { pushTx, setShowModal } = useTransactionListCon();
  const txPromise = useCallback(async () => {
    setShowModal({
      isShow: true,
      hash: "0x0",
      txType: TransactionModalType.wait,
    });
    if (!library || !contract) {
      setShowModal({
        isShow: true,
        hash: "0x0",
        txType: TransactionModalType.fail,
      });
      return;
    }
    const estimateGas = await library.estimateGas(tx).catch(() => {
      return;
    });
    if (!estimateGas) {
      setShowModal({
        isShow: true,
        hash: "0x0",
        txType: TransactionModalType.fail,
      });
      return;
    }
    const newTx = { ...tx, gasLimit: addGasLimit(estimateGas) };
    return library
      ?.getSigner()
      .sendTransaction(newTx)
      .then((res) => {
        pushTx(res.hash, txInfo);
        setShowModal({
          isShow: true,
          hash: res.hash,
          txType: TransactionModalType.success,
        });
      })
      .catch(() => {
        setShowModal({
          isShow: true,
          hash: "0x0",
          txType: TransactionModalType.fail,
        });
      });
  }, [contract, library, pushTx, setShowModal, tx, txInfo]);

  return txPromise;
}
