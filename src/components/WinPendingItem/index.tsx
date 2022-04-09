import { BigNumber } from "ethers";
import { FC, useEffect, useState } from "react";
import { useFortPRCClaim } from "../../contracts/hooks/useFortPRCTransation";
import { bigNumberToNormal } from "../../libs/utils";
import MainButton from "../MainButton";
import PendingClock from "./PendingClock";
import './styles'

type WinPendingItemType = {
  nowBlock: number;
  gained: BigNumber;
  openBlock: BigNumber;
  index: BigNumber;
};

export const WinPendingItem: FC<WinPendingItemType> = ({ ...props }) => {
  const classPrefix = "winPendingItem";
  const [timeString, setTimeString] = useState<String>('');
  const [countNum, setCountNum] = useState<number>(0);
  const [leftTimeClock, setLeftTimeClock] = useState<number>(0);

  const claim = useFortPRCClaim(
    props.index
  );
  const allTime = 256 * 3
  var leftTime = allTime - (BigNumber.from(props.nowBlock).sub(props.openBlock).toNumber() * 3)
  
  useEffect(() => {
    const thisLeftTime = leftTime - countNum
    if (thisLeftTime <= 0) {
      setTimeString('0:00')
      setLeftTimeClock(0)
      return
    }
    setLeftTimeClock(thisLeftTime)
    const minTime = parseInt((parseInt(thisLeftTime.toString()) / 60).toString())
    var secondString = (thisLeftTime - minTime * 60).toString()
    if (secondString.length === 1) {
      secondString = "0" + secondString
    }
    const time = minTime.toString() + ":" + secondString
    setTimeString(time)
  }, [countNum, leftTime])

  useEffect(() => {
    setTimeout(() => {
      setCountNum(countNum + 1)
    }, 1000);
  }, [countNum])

  const buttonState = () => {
    if (BigNumber.from('0').eq(props.gained)) { return true}
    return false
  }

  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-left`}>
        <div className={`${classPrefix}-left-clock`}><PendingClock leftTime={leftTimeClock} allTime={allTime}/></div>
        <div className={`${classPrefix}-left-text`}>{timeString}</div>
      </div>
      <div className={`${classPrefix}-right`}>
        <div className={`${classPrefix}-right-text`}>{bigNumberToNormal(props.gained, 18, 6)} DCU</div>
        <MainButton onClick={claim} disable={buttonState()}>Claim</MainButton>
      </div>
    </div>
  );
};
