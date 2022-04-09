import { BigNumber } from "ethers";
import { FC, useState } from "react";
import { PRCListType } from "..";
import MainCard from "../../../components/MainCard";
import { WinPendingItem } from "../../../components/WinPendingItem";
import { HistoryTime } from "./HistoryTime";
import "./styles";

type WinOrderListProps = {
  historyList: Array<PRCListType>;
  pendingList: Array<PRCListType>;
  nowBlock: number;
};

const WinOrderList: FC<WinOrderListProps> = ({ ...props }) => {
  const classPrefix = "winOrderList";
  
  const [isHistory, setIsHistory] = useState<Boolean>(false);

  const historyLi = props.historyList.map((item) => {
    return (
      <li key={item.owner + item.index.toString()}>
        <HistoryTime blockNum={BigNumber.from(item.openBlock.toString()).toNumber()}/>
        <p className={`${classPrefix}-historyList-right`}>
          {BigNumber.from('0').eq(item.n) ? item.m : 0} DCU
        </p>
      </li>
    );
  });
  const pendingLi = props.pendingList.map((item) => {
    return (
      <li key={item.owner + item.index.toString() + "p"}>
        <WinPendingItem
          nowBlock={props.nowBlock}
          gained={item.gained}
          openBlock={item.openBlock}
          index = {item.index}
        />
      </li>
    );
  });

  const listView = isHistory ? (props.historyList.length > 0 ? (
    <ul className={`${classPrefix}-historyList`}>{historyLi}</ul>
  ) : (<></>)) : (props.pendingList.length > 0 ? (
    <ul className={`${classPrefix}-pendingList`}>{pendingLi}</ul>
  ) : (<></>));
  return (
    <div className={classPrefix}>
      <MainCard classNames={`${classPrefix}-card`}>
        <p className={`${classPrefix}-card-title`}>
          {isHistory ? "History" : "Waiting list"}
        </p>
        {listView}
        <button
          className={`${classPrefix}-card-bottom`}
          onClick={() => {
            setIsHistory(!isHistory);
          }}
        >
          {isHistory ? "< Waiting list" : "History >"}
        </button>
      </MainCard>
    </div>
  );
};

export default WinOrderList;
