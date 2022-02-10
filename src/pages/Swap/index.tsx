import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { t, Trans } from "@lingui/macro";
import { Tooltip } from "antd";
import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import { ExchangeIcon } from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import { SingleTokenShow } from "../../components/TokenShow";
import { useSwapExactTokensForTokens } from "../../contracts/hooks/useCofixSwap";
import { useERC20Approve } from "../../contracts/hooks/useERC20Approve";
import {
  CofixSwapAddress,
  SwapAddress,
  tokenList,
} from "../../libs/constants/addresses";
import {
  CofixSwapContract,
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
    src: "USDT",
    dest: "DCU",
  });
  const [srcAllowance, setSrcAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [swapTokenBalance, setSwapTokenBalance] =
    useState<SwapTokenBalanceType>();
  const [destValue, setDestValue] = useState<BigNumber>();
  const cofixSwapContract = CofixSwapContract();
  const exchangeSwapTokens = () => {
    setSwapToken({ src: swapToken.dest, dest: swapToken.src });
    setInputValue("");
  };
  const { pendingList, txList } = useTransactionListCon();
  const priceContract = NestPriceContract();
  // 余额
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
  // 授权
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
        CofixSwapAddress[chainId]
      );
      setSrcAllowance(allowance);
    })();
  }, [account, chainId, library, swapToken, txList]);

  const path = useCallback(() => {
    if (swapToken.src === "USDT") {
      return ["USDT", "DCU"];
    }
    if (swapToken.dest === "USDT") {
      return ["DCU", "USDT"];
    }
    return [swapToken.src, swapToken.dest];
  }, [swapToken]);
  // 价格和预估
  useEffect(() => {
    if (!chainId || !library || !account) {
      return;
    }
  
    const swapXY = async (
      srcName: string,
      destName: string,
      amountIn: BigNumber
    ) => {
      const k = BigNumber.from("775269925761307568974296")
        .mul(BigNumber.from("2357000923200406848351572"));
      const srcTokenBalance: BigNumber = await getERC20Contract(
        tokenList[srcName].addresses[chainId],
        library,
        account
      )?.balanceOf(SwapAddress[chainId]);
      const destTokenBalance: BigNumber = await getERC20Contract(
        tokenList[destName].addresses[chainId],
        library,
        account
      )?.balanceOf(SwapAddress[chainId]);
      const amountOut = destTokenBalance.sub(
        k.div(srcTokenBalance.add(amountIn))
      );
      return amountOut;
    };
    (async () => {
      const usePath = path();
      const checkInputValue =
        inputValue && normalToBigNumber(inputValue).gt(BigNumber.from("0"));
      var amount = checkInputValue
        ? normalToBigNumber(inputValue!)
        : BASE_AMOUNT;
      for (let index = 0; index < usePath.length - 1; index++) {
        amount = await swapXY(usePath[index], usePath[index + 1], amount);
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
  }, [
    account,
    chainId,
    library,
    swapToken,
    inputValue,
    path,
    priceContract,
  ]);

  
  const getSelectedToken = (tokenName: string) => {
    if (swapToken.src === "DCU") {
      setSwapToken({ src: swapToken.src, dest: tokenName });
    } else {
      setSwapToken({ src: tokenName, dest: swapToken.dest });
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
    cofixSwapContract?.address
  );
  const amountOutMin = destValue
    ? destValue.sub(destValue.mul(5).div(100))
    : MaxUint256;
  const addressPath = () => {
    if (!chainId) {
      return [];
    }
    return path().map((item) => tokenList[item].addresses[chainId]);
  };

  const swap = useSwapExactTokensForTokens(
    addressPath(),
    normalToBigNumber(inputValue ? inputValue : ""),
    amountOutMin,
    parseInt((moment().valueOf() / 1000 + 600).toString()),
    account,
    account
  );
  const mainButtonState = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.swap
    );
    return pendingTransaction.length > 0 ? true : false;
  };
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
          getSelectedToken={getSelectedToken}
          balanceRed={!checkBalance()}
        >
          <div className={`${classPrefix}-card-selected`}>
            <SingleTokenShow tokenNameOne={swapToken.src} isBold />

            {/* <p>{swapToken.src === "DCU" ? <></> : <PutDownIcon />}</p> */}
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
          className={`${classPrefix}-card-exchange`}
          onClick={exchangeSwapTokens}
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
          getSelectedToken={getSelectedToken}
        >
          <div className={`${classPrefix}-card-selected`}>
            <SingleTokenShow tokenNameOne={swapToken.dest} isBold />

            {/* <p>{swapToken.dest === "DCU" ? <></> : <PutDownIcon />}</p> */}
          </div>
          <p className={"showValue"}>
            {destValue ? bigNumberToNormal(destValue, 18, 18) : undefined}
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
    </div>
  );
};

export default Swap;
