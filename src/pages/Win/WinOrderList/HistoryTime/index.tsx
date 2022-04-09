import { BigNumber } from "ethers";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import useWeb3 from "../../../../libs/hooks/useWeb3";

type HistoryTimeProps = {
    blockNum: number;
}
export const HistoryTime: FC<HistoryTimeProps> = ({ ...props }) => {
  const classPrefix = "winOrderList";
  const { library } = useWeb3();
  const [timeString, setTimeString] = useState("---");

  useEffect(() => {
    (async () => {
        if (!library) { return }
    const blockInfo = await library.getBlock(
      BigNumber.from(props.blockNum.toString()).toNumber()
    );
      setTimeString(moment(Number(blockInfo["timestamp"]) * 1000).format(
        "YYYY[-]MM[-]DD HH:mm"
      ))
    return 
      })();
  }, [library, props.blockNum])
  return <div className={`${classPrefix}-historyList-left`}>{timeString}</div>;
};
