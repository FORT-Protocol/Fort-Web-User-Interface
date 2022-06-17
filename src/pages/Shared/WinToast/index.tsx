import { BigNumber } from "ethers";
import { FC } from "react";
import { toast } from "react-toastify";
import MainButton from "../../../components/MainButton";
import { useFortPRCClaim } from "../../../contracts/hooks/useFortPRCTransation";
import { bigNumberToNormal } from "../../../libs/utils";
import './styles'

export type WinToastProps = {
  gained: BigNumber;
  leftTime: String;
  index: BigNumber
};
export const WinToast: FC<WinToastProps> = ({ ...props }) => {
  const classPrefix = "winToast";
  const claim = useFortPRCClaim(
    props.index
  );
  const titleString = BigNumber.from('0').eq(props.gained) ? 'Lose' : 'Win'
  const infoString = BigNumber.from('0').eq(props.gained) ? 'You did not win DCU ！' : `You win ${bigNumberToNormal(props.gained, 18 ,6)} DCU ！`
  const winTimeAndACT = BigNumber.from('0').eq(props.gained) ? (<></>) : (
    <div className={`${classPrefix}-win`}>
      <p className={`${classPrefix}-win-time`}>{`remaining claim time ${props.leftTime}`}</p>
      <MainButton onClick={claim}>Claim</MainButton>
    </div>
  )
  return (
    <div className={classPrefix}>
      <p className={`${classPrefix}-title`}>{titleString}</p>
      <p className={`${classPrefix}-info`}>{infoString}</p>
      {winTimeAndACT}
    </div>
  )
};

export default WinToast;

export const notifyWinToast = (resultInfo: WinToastProps) => {
  toast(
    <WinToast
      gained={resultInfo.gained}
      leftTime={resultInfo.leftTime}
      index={resultInfo.index}
    />,
    {
      position: toast.POSITION.TOP_RIGHT,
      closeOnClick: true,
      hideProgressBar: true,
      autoClose: 30000
    }
  );
};
