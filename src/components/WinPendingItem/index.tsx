import { Tooltip } from "antd";
import { BigNumber } from "ethers";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFortPRCClaim } from "../../contracts/hooks/useFortPRCTransation";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import MainButton from "../MainButton";
import PendingClock from "./PendingClock";
import "./styles";

type WinPendingItemType = {
  nowBlock: number;
  gained: BigNumber;
  openBlock: BigNumber;
  index: BigNumber;
};

export const WinPendingItem: FC<WinPendingItemType> = ({ ...props }) => {
  const classPrefix = "winPendingItem";
  const { pendingList } = useTransactionListCon();
  const [timeString, setTimeString] = useState<String>("");
  const [countNum, setCountNum] = useState<number>(0);
  const [nowBlock, setNowBlock] = useState<number>(0);
  const [leftTimeClock, setLeftTimeClock] = useState<number>(0);

  const claim = useFortPRCClaim(props.index);
  const allTime = 256 * 3;
  const loadingButton = () => {
    const claimTx = pendingList.filter(
      (item) =>
        item.info === props.index.toString() &&
        item.type === TransactionType.prcclaim
    );
    return claimTx.length > 0 ? true : false;
  };

  setTimeout(() => {
    if (props.nowBlock !== nowBlock) {
      setCountNum(0);
      setNowBlock(props.nowBlock);
    } else {
      setCountNum(countNum + 1);
    }
  }, 1000);

  useEffect(() => {
    var leftTime =
      allTime -
      BigNumber.from(props.nowBlock).sub(props.openBlock).toNumber() * 3;
    
    const thisLeftTime = leftTime - countNum;
    if (thisLeftTime <= 0) {
      setTimeString("0:00");
      setLeftTimeClock(0);
      return;
    }
    setLeftTimeClock(thisLeftTime);
    const minTime = parseInt(
      (parseInt(thisLeftTime.toString()) / 60).toString()
    );
    var secondString = (thisLeftTime - minTime * 60).toString();
    if (secondString.length === 1) {
      secondString = "0" + secondString;
    }
    const time = minTime.toString() + ":" + secondString;
    setTimeString(time);
    
  }, [allTime, countNum, nowBlock, props.nowBlock, props.openBlock]);

  const buttonState = () => {
    if (BigNumber.from("0").eq(props.gained) || loadingButton()) {
      return true;
    }
    return false;
  };

  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-left`}>
        <MainButton
          onClick={() => {
            if (buttonState()) {
              return;
            }

            claim();
            toast.dismiss(props.index.toNumber());
          }}
          disable={buttonState()}
          loading={loadingButton()}
        >
          Claim
        </MainButton>
      </div>
      <div className={`${classPrefix}-right`}>
        <Tooltip
          placement="right"
          color={"#ffffff"}
          title={`Remaining claim time:${timeString}`}
        >
          <span>
            <PendingClock
              leftTime={leftTimeClock}
              allTime={allTime}
              index={props.index.toNumber()}
            />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};
