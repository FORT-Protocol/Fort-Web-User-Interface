import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { t, Trans } from "@lingui/macro";
import { Tooltip } from "antd";
import classNames from "classnames";
// import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import { ExchangeIcon } from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import { SingleTokenShow } from "../../components/TokenShow";
import { useERC20Approve } from "../../contracts/hooks/useERC20Approve";
import { usePVMPayBack } from "../../contracts/hooks/usePVMPayBackTransaction";
import {
  PVMPayBackContract,
  tokenList,
  TokenType,
} from "../../libs/constants/addresses";
import {
  getERC20Contract,
  NestPriceContract,
} from "../../libs/hooks/useContract";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  BASE_AMOUNT,
  bigNumberToNormal,
  formatInputNum,
  normalToBigNumber,
} from "../../libs/utils";
import "./styles";

type SwapTokenType = {
  src: string;
  dest: string;
};

type SwapTokenBalanceType = {
  src: BigNumber;
  dest: BigNumber;
};

const Swap: FC = () => {
  const classPrefix = "swap";
  const { chainId, account, library } = useWeb3();
  const [inputValue, setInputValue] = useState<string>();
  const [priceValue, setPriceValue] = useState<BigNumber>();
  const [swapToken, setSwapToken] = useState<SwapTokenType>({
    src: "DCU",
    dest: "NEST",
  });
  const [srcAllowance, setSrcAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [swapTokenBalance, setSwapTokenBalance] =
    useState<SwapTokenBalanceType>();
  const [destValue, setDestValue] = useState<BigNumber>();
  const { pendingList, txList } = useTransactionListCon();
  const priceContract = NestPriceContract();
  // balance
  const getBalance = useCallback(async () => {
    if (!chainId || !account || !library) {
      return;
    }
    const srcTokenBalance = await getERC20Contract(
      tokenList[swapToken.src].addresses[chainId],
      library,
      account
    )?.balanceOf(account);
    const destTokenBalance = await getERC20Contract(
      tokenList[swapToken.dest].addresses[chainId],
      library,
      account
    )?.balanceOf(account);
    setSwapTokenBalance({ src: srcTokenBalance, dest: destTokenBalance });
  }, [account, chainId, library, swapToken]);
  useEffect(() => {
    getBalance();
  }, [account, chainId, getBalance, library, swapToken]);
  useEffect(() => {
    if (!txList || txList.length === 0) {
      return;
    }
    const latestTx = txList[txList.length - 1];
    if (
      latestTx.txState === 1 &&
      (latestTx.type === 4 || latestTx.type === 9)
    ) {
      setTimeout(() => {
        getBalance();
      }, 4000);
    }
  }, [getBalance, txList]);
  // approve
  useEffect(() => {
    if (!chainId || !account || !library) {
      return;
    }
    const srcToken = getERC20Contract(
      tokenList[swapToken.src].addresses[chainId],
      library,
      account
    );
    if (!srcToken) {
      setSrcAllowance(BigNumber.from("0"));
      return;
    }
    (async () => {
      const allowance = await srcToken.allowance(
        account,
        PVMPayBackContract[chainId]
      );
      setSrcAllowance(allowance);
    })();
  }, [account, chainId, library, swapToken, txList]);

  const path = useCallback(() => {
    if (swapToken.src === "USDT") {
      if (swapToken.dest === "DCU") {
        return ["USDT", "DCU"];
      }
    } else if (swapToken.src === "DCU") {
      if (swapToken.dest === "USDT") {
        return ["DCU", "USDT"];
      } else if (swapToken.dest === "NEST") {
        return ["DCU", "NEST"];
      }
    }
    return [swapToken.src, swapToken.dest];
  }, [swapToken]);
  // 价格和预估
  useEffect(() => {
    if (!chainId || !library || !account) {
      return;
    }

    const swapDCUToNEST = async (amountIn: BigNumber) => {
      return amountIn.mul(33).div(10);
    };

    const swapXY = async (
      srcName: string,
      destName: string,
      amountIn: BigNumber
    ) => {
      // const k = BigNumber.from("200000000000000000000000").mul(
      //   BigNumber.from("868616188258191063223411")
      // );
      // const srcTokenBalance: BigNumber = await getERC20Contract(
      //   tokenList[srcName].addresses[chainId],
      //   library,
      //   account
      // )?.balanceOf(SwapAddress[chainId]);
      // const destTokenBalance: BigNumber = await getERC20Contract(
      //   tokenList[destName].addresses[chainId],
      //   library,
      //   account
      // )?.balanceOf(SwapAddress[chainId]);
      // const amountOut = destTokenBalance.sub(
      //   k.div(srcTokenBalance.add(amountIn))
      // );
      return BigNumber.from(0);
    };
    (async () => {
      const usePath = path();
      const checkInputValue =
        inputValue && normalToBigNumber(inputValue).gt(BigNumber.from("0"));
      var amount = checkInputValue
        ? normalToBigNumber(inputValue!)
        : BASE_AMOUNT;
      for (let index = 0; index < usePath.length - 1; index++) {
        if (
          (usePath[index] === "USDT" && usePath[index + 1] === "DCU") ||
          (usePath[index] === "DCU" && usePath[index + 1] === "USDT")
        ) {
          amount = await swapXY(usePath[index], usePath[index + 1], amount);
        } else if (usePath[index] === "DCU" && usePath[index + 1] === "NEST") {
          amount = await swapDCUToNEST(amount)
        }
      }
      setDestValue(checkInputValue ? amount : undefined);
      setPriceValue(
        checkInputValue
          ? amount
              .mul(BASE_AMOUNT)
              .div(inputValue ? normalToBigNumber(inputValue) : BASE_AMOUNT)
          : amount
      );
    })();
  }, [account, chainId, library, swapToken, inputValue, path, priceContract]);

  const getSelectedSrcToken = (token: TokenType) => {
    setSwapToken({ src: token.symbol, dest: swapToken.dest });
  };
  const getSelectedDestToken = (token: TokenType) => {
    setSwapToken({ src: swapToken.src, dest: token.symbol });
  };

  const tokenListShow = (top: boolean) => {
    const allToken = ["DCU", "NEST",];
    const showToken = [swapToken.src, swapToken.dest];
    if (top) {
      const leftToken = allToken.filter(
        (item: string) => showToken.indexOf(item) === -1
      );
      const tokenName = [swapToken.src].concat(leftToken);
      return tokenName.map((item) => {
        return tokenList[item];
      });
    } else {
      const leftToken = allToken.filter(
        (item: string) => showToken.indexOf(item) === -1
      );
      const tokenName = [swapToken.dest].concat(leftToken);
      return tokenName.map((item) => {
        return tokenList[item];
      });
    }
  };

  const checkBalance = () => {
    if (!swapTokenBalance) {
      return false;
    }
    if (!inputValue) {
      return true;
    }
    if (normalToBigNumber(inputValue).gt(swapTokenBalance.src)) {
      return false;
    }
    return true;
  };
  const checkAllowance = () => {
    if (!inputValue) {
      return true;
    }
    if (srcAllowance.lt(normalToBigNumber(inputValue))) {
      return false;
    }
    return true;
  };
  const checkButton = () => {
    if (!checkAllowance()) {
      return true;
    }
    if (
      !inputValue ||
      !destValue ||
      normalToBigNumber(inputValue).eq(BigNumber.from("0"))
    ) {
      return false;
    }
    if (checkBalance()) {
      return true;
    }
    return false;
  };
  const approve = useERC20Approve(
    swapToken.src,
    MaxUint256,
    chainId ? PVMPayBackContract[chainId] : undefined
  );
  // const amountOutMin = destValue
  //   ? destValue.sub(destValue.mul(5).div(100))
  //   : MaxUint256;
  // const addressPath = () => {
  //   if (!chainId) {
  //     return [];
  //   }
  //   return path().map((item) => tokenList[item].addresses[chainId]);
  // };

  const swap = usePVMPayBack(
    normalToBigNumber(inputValue ? inputValue : ""),
  );
  const mainButtonState = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.swap
    );
    return pendingTransaction.length > 0 ? true : false;
  };

  // const specialTop = () => {
  //   if (
  //     (swapToken.src === "USDT" && swapToken.dest === "DCU") ||
  //     (swapToken.src === "DCU" && swapToken.dest === "USDT")
  //   ) {
  //     return false;
  //   }
  //   return true;
  // };
  return (
    <div className={`${classPrefix}`}>
      <MainCard classNames={`${classPrefix}-card`}>
        <InfoShow
          topLeftText={t`From`}
          bottomRightText={
            t`Balance` +
            `:${
              swapTokenBalance
                ? bigNumberToNormal(swapTokenBalance.src, 18, 6)
                : "---"
            } ${swapToken.src}`
          }
          tokenSelect={false}
          tokenList={tokenListShow(false)}
          getSelectedToken={getSelectedSrcToken}
          balanceRed={!checkBalance()}
        >
          <div className={`${classPrefix}-card-selected`}>
            <SingleTokenShow tokenNameOne={swapToken.src} isBold />
            {/* <p>
              {specialTop() ? (<PutDownIcon />) : (<></>)}
            </p> */}
          </div>

          <input
            placeholder={t`Input`}
            className={"input-middle"}
            value={inputValue}
            maxLength={32}
            onChange={(e) => setInputValue(formatInputNum(e.target.value))}
            onBlur={(e: any) => {}}
          />
          <button
            className={"max-button"}
            onClick={() =>
              setInputValue(
                bigNumberToNormal(
                  swapTokenBalance?.src || BigNumber.from("0"),
                  18,
                  18
                )
              )
            }
          >
            MAX
          </button>
        </InfoShow>
        <button
          className={classNames({
            [`${classPrefix}-card-exchange`]: true,
            [`disable`]: true
          })}
          onClick={() => {
            return
            // exchangeSwapTokens()
          }}
        >
          <ExchangeIcon />
        </button>
        <InfoShow
          topLeftText={t`To(Estimated)`}
          bottomRightText={
            t`Balance` +
            `:${
              swapTokenBalance
                ? bigNumberToNormal(swapTokenBalance.dest, 18, 6)
                : "---"
            } ${swapToken.dest}`
          }
          tokenSelect={false}
          tokenList={tokenListShow(false)}
          getSelectedToken={getSelectedDestToken}
        >
          <div className={`${classPrefix}-card-selected`}>
            <SingleTokenShow tokenNameOne={swapToken.dest} isBold />
            {/* <p>
              <PutDownIcon />
            </p> */}
          </div>
          <p className={"showValue"}>
            {destValue ? bigNumberToNormal(destValue, 18, 6) : undefined}
          </p>
        </InfoShow>
        <div className={`${classPrefix}-card-trading`}>
          <Tooltip
            placement="leftBottom"
            color={"#ffffff"}
            title={t`Trading price displayed on the page will be different from the actual price. If your actual price is 5% higher than the current page, the transaction will be rejected.`}
          >
            <span>
              <Trans>Trading Price</Trans>
            </span>
          </Tooltip>
          <p>{`1 ${swapToken.src} = ${
            priceValue ? bigNumberToNormal(priceValue, 18, 10) : "---"
          } ${swapToken.dest}`}</p>
        </div>
        <MainButton
          disable={!checkButton() || mainButtonState()}
          onClick={() => {
            if (!checkButton() || mainButtonState()) {
              return;
            }
            if (checkAllowance()) {
              swap();
            } else {
              approve();
            }
          }}
          loading={mainButtonState()}
        >
          {checkAllowance() ? <Trans>Swap</Trans> : <Trans>Approve</Trans>}
        </MainButton>
      </MainCard>
      {/* <MainCard classNames={`${classPrefix}-card`}>
        <div className={`${classPrefix}-card-title `}>
          <p className={`infoView-topLeft`}>Trading Price of DCU</p>
        </div>
        <PriceChart />
      </MainCard> */}
    </div>
  );
};

export default Swap;
