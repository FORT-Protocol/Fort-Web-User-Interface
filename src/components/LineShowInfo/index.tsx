import classNames from "classnames";
import { FC } from "react";
import "./styles";

type Props = {
  leftText: string;
  rightText: string;
  red?: boolean;
};

const LineShowInfo: FC<Props> = ({ ...props }) => {
  const classPrefix = "lineShowInfo";
  return (
    <div className={classPrefix}>
      <p className={`${classPrefix}-leftText`}>{props.leftText}</p>
      <p className={classNames({
        [`${classPrefix}-rightText`]: true,
        [`red`]: props.red
      })}>{props.rightText}</p>
    </div>
  );
};

export default LineShowInfo;
