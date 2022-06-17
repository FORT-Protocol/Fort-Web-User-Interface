import { BigNumber } from "ethers";
import { useCallback, useEffect } from "react";
import { notifyWinToast, WinToastProps } from "../../pages/Shared/WinToast";
import { PRCListType } from "../../pages/Win";
import { FortPRC } from "../constants/addresses";
import { ZERO_ADDRESS } from "../utils";
import { FortPRCContract } from "./useContract";
import useTransactionListCon, { TransactionType } from "./useTransactionInfo";
import useWeb3 from "./useWeb3";

const useCheckWinResult = () => {
  const fortPRCContract = FortPRCContract(FortPRC);
  const { txList } = useTransactionListCon();
  const { account, library } = useWeb3();

  const getList = useCallback(async () => {
    
    if (!fortPRCContract) {
      return;
    }

    const latest = await library?.getBlockNumber();
    if (!latest) {
      return;
    }
    const listResult = await fortPRCContract.find44("0", "3000", "3000", account);
    const result = listResult.filter(
      (item: PRCListType) => item.owner !== ZERO_ADDRESS
    );

    const latestItem = result[0];
    const allTime = 256 * 3;
    const leftTime =
      allTime - BigNumber.from(latest).sub(latestItem.openBlock).toNumber() * 3;
    const minTime = parseInt((parseInt(leftTime.toString()) / 60).toString());
    const timeString =
      minTime.toString() + ":" + (leftTime - minTime * 60).toString();
    const notifyItem: WinToastProps = {
      gained: latestItem.gained,
      leftTime: timeString,
      index: latestItem.index,
    };
    notifyWinToast(notifyItem);
  }, [account, fortPRCContract, library]);
  useEffect(() => {
    if (
      !txList ||
      txList.length === 0 ||
      txList[txList.length - 1].type !== TransactionType.roll ||
      txList[txList.length - 1].txState !== 1
    ) {
      return;
    }
    const nowTime = new Date().getTime() / 1000;
    if (nowTime - txList[txList.length - 1].addTime > 40) {
      return;
    }
    setTimeout(() => {
      getList();
    }, 13000);
  }, [getList, txList]);
};

export default useCheckWinResult;
