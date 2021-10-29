import { BigNumber } from "@ethersproject/bignumber";
import { Trans } from "@lingui/macro";
import { FC, useRef, useState } from "react";
import Popup from "reactjs-popup";
import { BASE_AMOUNT } from "../../libs/utils";
import { FarmCard } from "./FarmCard";
import FarmNoticeModal from "./FarmNoticeModal";
import "./styles";

const Farm: FC = () => {
  const classPrefix = "farm";
  const [showNotice, setShowNotice] = useState(false)
  const modal = useRef<any>();
  const showNoticeModal = () => {
    var cache = localStorage.getItem("FarmFirst");
    if (cache !== '1') {
      setShowNotice(true)
      return true
    }
    return false
  };
  const farms = [
    { name: "NEST", time: 24, total: BigNumber.from('3600000').mul(BASE_AMOUNT) },
    { name: "NEST", time: 1, total: BigNumber.from('200000').mul(BASE_AMOUNT) },
    { name: "CoFi", time: 1, total: BigNumber.from('50000').mul(BASE_AMOUNT) },
    { name: "PETH", time: 1, total: BigNumber.from('50000').mul(BASE_AMOUNT) },
    { name: "NHBTC", time: 1, total: BigNumber.from('50000').mul(BASE_AMOUNT) },
    { name: "PUSD", time: 1, total: BigNumber.from('50000').mul(BASE_AMOUNT) },
  ].map((item) => {
    return (
      <li key={item.name + item.time.toString()}>
        <FarmCard name={item.name} time={item.time} total={item.total} showNotice={showNoticeModal}/>
      </li>
    );
  });
  return (
    <div className={classPrefix}>
      <p className={'farmNotice'}><Trans>Locked position mining has ended, return the locked assets and DCU after taking out the operation</Trans></p>
      {showNotice ? (<Popup
          ref={modal} open onClose={() => {setShowNotice(false)}}><FarmNoticeModal onClose={() => modal.current.close()}></FarmNoticeModal></Popup>) : null}
      <ul>{farms}</ul>
    </div>
  );
};

export default Farm;
