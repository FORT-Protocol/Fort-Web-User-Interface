import { Tooltip } from "antd";
import classNames from "classnames";
import { FC } from "react";
import "./styles";

type Props = {
  title: string;
  under?: boolean;
  underText?: string;
};

const MobileListInfo: FC<Props> = ({ children, ...props }) => {
  const classPrefix = "mobileListInfo";
  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-title`}>
        {props.under ? (
          <Tooltip
            placement="topRight"
            color={"#ffffff"}
            title={props.underText}
          >
            <span
              className={classNames({
                [`underLine`]: props.under,
              })}
            >
              {props.title}
            </span>
          </Tooltip>
        ) : (
          <span
            className={classNames({
              [`underLine`]: props.under,
            })}
          >
            {props.title}
          </span>
        )}
      </div>
      {children}
    </div>
  );
};

export default MobileListInfo;
