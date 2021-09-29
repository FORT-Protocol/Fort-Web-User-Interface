import { FC } from "react";
import "./styles";
import { LongIcon, LongIconWhite, ShortIcon, ShortIconWhite } from "../Icon";
import classNames from "classnames";

type Props = {
  callBack: (isLong: boolean) => void;
  isLong: boolean;
  textArray:Array<string>
};

const ChooseType: FC<Props> = ({ ...props }) => {
  const classPrefix = "chooseType";
  const left = () => {
    return (
      <div
        className={classNames({
          [`${classPrefix}-left`]: true,
          [`selected`]: props.isLong,
        })}
      >
        <div>
          {props.isLong ? <LongIconWhite /> : <LongIcon />}
          <p>{props.textArray[0]}</p>
        </div>
      </div>
    );
  };
  const right = () => {
    return (
      <div
        className={classNames({
          [`${classPrefix}-right`]: true,
          [`selected`]: !props.isLong,
        })}
      >
        <div>
          {props.isLong ? <ShortIcon /> : <ShortIconWhite />}
          <p>{props.textArray[1]}</p>
        </div>
      </div>
    );
  };
  return (
    <div className={classPrefix}>
      <div onClick={() => props.callBack(true)}>{left()}</div>
      <div onClick={() => props.callBack(false)}>{right()}</div>
    </div>
  );
};

export default ChooseType;
