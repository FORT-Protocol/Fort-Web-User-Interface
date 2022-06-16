import { Tooltip } from "antd";
import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { tokenList, TokenType } from "../../libs/constants/addresses";
import useWeb3 from "../../libs/hooks/useWeb3";
import { AddTokenIcon } from "../Icon";
import "./styles";

type Props = {
  topLeftText: string;
  bottomRightText: string;
  balanceRed?: boolean;
  tokenSelect?: boolean;
  tokenList?: Array<TokenType>;
  showUSDT?: boolean;
  dataSelect?: boolean;
  dataList?: Array<DataType>;
  getSelectedData?: (token: string) => void;
  getSelectedToken?: (token: TokenType) => void;
  popText?: string;
};

export type DataType = {
  title: string;
  value: string;
};

const InfoShow: FC<Props> = ({ children, ...props }) => {
  const classPrefix = "infoView";
  const selectRef = useRef(null);
  const [isShowSelect, setIsShowSelect] = useState(false);
  const { chainId } = useWeb3();
  var dataLi: JSX.Element[] | undefined;
  if (props.tokenSelect) {
    dataLi = props.tokenList?.map((item) => {
      const TokenIcon = item.Icon;
      return (
        <li
          key={item.symbol}
          onClick={() => {
            if (props.getSelectedToken) {
              props.getSelectedToken(item);
            }
          }}
        >
          <TokenIcon />
          <p>
            {item.symbol}
            {`${props.showUSDT ? "/USDT" : ""}`}
          </p>
        </li>
      );
    });
  } else if (props.dataSelect) {
    dataLi = props.dataList?.map((item: DataType, index) => {
      return (
        <li
          key={item.title + index.toString()}
          onClick={() => {
            if (props.getSelectedData) {
              props.getSelectedData(item.title);
            }
          }}
        >
          <p className={"dataSelect"}>{item.title}</p>
        </li>
      );
    });
  }

  const tokenSelectUl = (
    <ul
      className={classNames({
        [`${classPrefix}-tokenSelect`]: true,
        [`isShow`]: isShowSelect,
      })}
    >
      {dataLi}
    </ul>
  );

  useEffect(() => {
    if (isShowSelect) {
      document.addEventListener("click", clickCallback, false);
      return () => {
        document.removeEventListener("click", clickCallback, false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowSelect]);

  function clickCallback(event: any) {
    if (props.tokenSelect || props.dataSelect) {
      const current: any = selectRef.current;
      if (!current.contains(event.target)) {
        setIsShowSelect(false);
        return;
      }
    }
  }

  function clickSelect(event: any) {
    if (
      props.tokenSelect &&
      event.target.className !== "input-right" &&
      event.target.className !== "input-middle" &&
      event.target.className !== "max-button" &&
      event.target.className !== "infoView-mainView-maxView"
    ) {
      setIsShowSelect(!isShowSelect);
    }

    if (props.dataSelect) {
      setIsShowSelect(!isShowSelect);
    }
  }

  const bottomRight = () => {
    const { ethereum } = window;
    const addToken = async (tokenName: string) => {
      if (!chainId) {
        return;
      }
      var imageURL = "";
      if (tokenName === "DCU") {
        imageURL =
          "https://raw.githubusercontent.com/FORT-Protocol/Fort-Web-User-Interface/2e289cd29722576329fae529c2bfaa0a905f0148/src/components/Icon/svg/TokenFORT.svg";
      } else if (tokenName === "PRC") {
        imageURL =
          "https://raw.githubusercontent.com/FORT-Protocol/Fort-Web-User-Interface/2e289cd29722576329fae529c2bfaa0a905f0148/src/components/Icon/svg/TokenPRC.svg";
      }
      await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenList[tokenName].addresses[chainId], // The address that the token is at.
            symbol: tokenName, // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
            image: imageURL, // A string url of the token logo
          },
        },
      });
    };
    if (
      props.bottomRightText.toLowerCase().indexOf("balance") >= 0 &&
      (props.bottomRightText.toLowerCase().indexOf("dcu") >= 0 ||
        props.bottomRightText.toLowerCase().indexOf("prc") >= 0)
    ) {
      var tokenName: string = "";
      if (props.bottomRightText.toLowerCase().indexOf("dcu") >= 0) {
        tokenName = "DCU";
      } else {
        tokenName = "PRC";
      }
      return (
        <Tooltip
          placement="right"
          color={"#ffffff"}
          title={
            <button
              className={`${classPrefix}-balance-add`}
              onClick={() => addToken(tokenName)}
            >
              <AddTokenIcon />
              <p>{`Add ${tokenName} to your wallet`}</p>
            </button>
          }
        >
          <p
            className={classNames({
              [`${classPrefix}-bottomRight`]: true,
              [`balanceRed`]: props.balanceRed,
              [`underLine`]: true,
            })}
          >
            <span>{props.bottomRightText}</span>
          </p>
        </Tooltip>
      );
    } else if (props.popText != null) {
      return (
        <Tooltip placement="right" color={"#ffffff"} title={props.popText}>
          <p
            className={classNames({
              [`${classPrefix}-bottomRight`]: true,
              [`balanceRed`]: props.balanceRed,
              [`underLine`]: true,
            })}
          >
            <span>{props.bottomRightText}</span>
          </p>
        </Tooltip>
      );
    } else {
      return (
        <p
          className={classNames({
            [`${classPrefix}-bottomRight`]: true,
            [`balanceRed`]: props.balanceRed,
          })}
        >
          <span>{props.bottomRightText}</span>
        </p>
      );
    }
  };

  return (
    <div className={classPrefix}>
      <p className={`${classPrefix}-topLeft`}>{props.topLeftText}</p>
      <div
        className={classNames({
          [`${classPrefix}-mainView`]: true,
          [`noSelect`]: !props.tokenSelect && !props.dataSelect,
        })}
        onClick={(e) => {
          clickSelect(e);
        }}
        ref={selectRef}
      >
        {children}
      </div>
      {props.tokenSelect || props.dataSelect ? tokenSelectUl : null}
      {bottomRight()}
    </div>
  );
};

export default InfoShow;
