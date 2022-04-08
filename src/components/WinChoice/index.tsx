import { Tooltip } from "antd";
import classNames from "classnames";
import { BigNumber } from "ethers";
import { FC } from "react";
import { bigNumberToNormal } from "../../libs/utils";
import "./styles";

type WinChoiceProps = {
  DCUAmount: BigNumber;
  selected: BigNumber | null | undefined;
  callBack: (num: BigNumber) => void;
};

const WinChoice: FC<WinChoiceProps> = ({ ...props }) => {
  const classPrefix = "winChoice";
  const DCUAmountNormal = bigNumberToNormal(props.DCUAmount, 18, 1);
  return (
    <div
      className={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-selected`]:
          props.DCUAmount.toString() === props.selected?.toString()
            ? true
            : false,
      })}
      onClick={() => {
        props.callBack(props.DCUAmount);
      }}
    >
      <p className={`${classPrefix}-topNum`}>
        <Tooltip
          placement="top"
          color={"#ffffff"}
          title={"Amount of DCU that 1 PRC can win"}
        >
          {DCUAmountNormal}
        </Tooltip>
      </p>
      <div className={`${classPrefix}-bottomBg`}>
        <p className={`${classPrefix}-bottomBg-num`}>
        <Tooltip
          placement="top"
          color={"#ffffff"}
          title={`Probability of winning ${DCUAmountNormal} DCU`}
        >
          {`${
          100 / parseFloat(DCUAmountNormal)
        } %`}</Tooltip></p>
        
      </div>
    </div>
  );
};

export default WinChoice;
