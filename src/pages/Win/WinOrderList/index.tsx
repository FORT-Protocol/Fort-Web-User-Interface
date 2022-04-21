import { Tooltip } from "antd";
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
    // const itemAmount = BigNumber.from(item.m.toString()).div(BigNumber.from('10000'))
    const showNum = 100 / (parseFloat(item.m.toString()) / 10000)
    return (
      <li key={item.owner + item.index.toString()}>
        <HistoryTime
          blockNum={BigNumber.from(item.openBlock.toString()).toNumber()}
        />
        <p className={`${classPrefix}-historyList-right`}>
          {/* {BigNumber.from("0").eq(item.n) ? itemAmount.toString() : 0} DCU */}
          {`${showNum} %`}
        </p>
      </li>
    );
  });
  const pendingLi = props.pendingList.map((item) => {
    return (
      <li key={item.owner + item.index.toString() + "p"}>
        <Tooltip
          placement="bottom"
          color={"#ffffff"}
          title={"Estimated remaining claimable time"}
        >
          <span>
            <WinPendingItem
              nowBlock={props.nowBlock}
              gained={item.gained}
              openBlock={item.openBlock}
              index={item.index}
            />
          </span>
        </Tooltip>
      </li>
    );
  });

  const listView = isHistory ? (
    props.historyList.length > 0 ? (
      <ul className={`${classPrefix}-historyList`}>{historyLi}</ul>
    ) : (
      <></>
    )
  ) : props.pendingList.length > 0 ? (
    <ul className={`${classPrefix}-pendingList`}>{pendingLi}</ul>
  ) : (
    <></>
  );
  return (
    <div className={classPrefix}>
      <MainCard classNames={`${classPrefix}-card`}>
        <div className={`${classPrefix}-card-topShow`}>
          <p className={`${classPrefix}-card-topShow-title`}>
            {isHistory ? "History" : "Waiting list"}
          </p>
          <button
            className={`${classPrefix}-card-topShow-bottom`}
            onClick={() => {
              setIsHistory(!isHistory);
            }}
          >
            {isHistory ? "< Waiting list" : "History >"}
          </button>
        </div>
        {listView}
      </MainCard>
    </div>
  );
};

export default WinOrderList;
