import { BigNumber } from "@ethersproject/bignumber";
import { FC, useRef } from "react";
import Popup from "reactjs-popup";
import { BASE_AMOUNT } from "../../libs/utils";
import { FarmCard } from "./FarmCard";
import FarmNoticeModal from "./FarmNoticeModal";
import "./styles";

const Farm: FC = () => {
  const classPrefix = "farm";
  const farms = [
    { name: "NEST", time: 24, total: BigNumber.from('36000000').mul(BASE_AMOUNT) },
    { name: "NEST", time: 1, total: BigNumber.from('2000000').mul(BASE_AMOUNT) },
    { name: "CoFi", time: 1, total: BigNumber.from('500000').mul(BASE_AMOUNT) },
    { name: "PETH", time: 1, total: BigNumber.from('500000').mul(BASE_AMOUNT) },
    { name: "NHBTC", time: 1, total: BigNumber.from('500000').mul(BASE_AMOUNT) },
    { name: "PUSD", time: 1, total: BigNumber.from('500000').mul(BASE_AMOUNT) },
  ].map((item) => {
    return (
      <li key={item.name + item.time.toString()}>
        <FarmCard name={item.name} time={item.time} total={item.total}/>
      </li>
    );
  });
  var cache = localStorage.getItem("FarmFirst");
  const modal = useRef<any>();
  return (
    <div className={classPrefix}>
      {cache !== '1' ? (<Popup
          ref={modal} open closeOnDocumentClick={false}><FarmNoticeModal onClose={() => modal.current.close()}></FarmNoticeModal></Popup>) : null}
      <ul>{farms}</ul>
    </div>
  );
};

export default Farm;
