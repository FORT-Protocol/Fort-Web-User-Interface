import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { t, Trans } from "@lingui/macro";
import { Tooltip } from "antd";
import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import { ExchangeIcon, PutDownIcon } from "../../components/Icon";
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
  CofixControllerContract,
  CofixSwapContract,
  getERC20Contract,
} from "../../libs/hooks/useContract";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  BASE_AMOUNT,
  bigNumberToNormal,
  COFIX_THETA,
  formatInputNum,
  normalToBigNumber,
  PRICE_FEE,
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
    src: "NEST",
    dest: "DCU",
  });
  const [srcAllowance, setSrcAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [swapTokenBalance, setSwapTokenBalance] =
    useState<SwapTokenBalanceType>();
  const [destValue, setDestValue] = useState<BigNumber>();
  const cofixSwapContract = CofixSwapContract();
  const cofixControllerContract = CofixControllerContract();
  const exchangeSwapTokens = () => {
    setSwapToken({ src: swapToken.dest, dest: swapToken.src });
    setInputValue("");
  };
  // const priceContract = NestPriceContract();
  // 余额
  useEffect(() => {
    if (!chainId || !account || !library) {
      return;
    }
    (async () => {
      if (swapToken.src === "ETH") {
        const srcTokenBalance = await library?.getBalance(account);
        const destTokenBalance = await getERC20Contract(
          tokenList[swapToken.dest].addresses[chainId],
          library,
          account
        )?.balanceOf(account);
        setSwapTokenBalance({ src: srcTokenBalance, dest: destTokenBalance });
      } else if (swapToken.dest === "ETH") {
        const srcTokenBalance = await getERC20Contract(
          tokenList[swapToken.src].addresses[chainId],
          library,
          account
        )?.balanceOf(account);
        const destTokenBalance = await library?.getBalance(account);
        setSwapTokenBalance({ src: srcTokenBalance, dest: destTokenBalance });
      } else {
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
      }
    })();
  }, [account, chainId, library, swapToken]);
  // 授权
  useEffect(() => {
    if (!chainId || !account || !library) {
      return;
    }
    if (swapToken.src === "ETH") {
      setSrcAllowance(BigNumber.from("0"));
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
  }, [account, chainId, library, swapToken]);

  const path = useCallback(() => {
    if (swapToken.src === "ETH") {
      return ["ETH", "NEST", "DCU"];
    }
    if (swapToken.dest === "ETH") {
      return ["DCU", "NEST", "ETH"];
    }
    return [swapToken.src, swapToken.dest];
  },[swapToken]);
  // 价格和预估
  useEffect(() => {
    if (!chainId || !library || !account) {
      return;
    }
    const swapWithK = async (
      srcName: string,
      destName: string,
      amountIn: BigNumber
    ) => {
      const priceToken = srcName === "ETH" ? destName : srcName;
      const priceAndK = await cofixControllerContract?.callStatic.queryOracle(
        tokenList[priceToken].addresses[chainId],
        account,
        { value: PRICE_FEE }
      );
      const k: BigNumber = priceAndK[0];
      const tokenAmount: BigNumber = priceAndK[2];
      if (srcName === "ETH") {
        const fee = amountIn.mul(COFIX_THETA).div(BigNumber.from("10000"));
        const amountOut = amountIn
          .sub(fee)
          .mul(tokenAmount)
          .mul(BASE_AMOUNT)
          .div(BASE_AMOUNT)
          .div(
            BASE_AMOUNT.add(k).add(
              amountIn.mul(200).div(BigNumber.from("100000"))
            )
          );
        return amountOut;
      } else {
        const amountETHOut = amountIn.mul(BASE_AMOUNT).div(tokenAmount);
        const amountETHOut2 = amountETHOut
          .mul(BASE_AMOUNT)
          .div(
            BASE_AMOUNT.add(k).add(
              amountETHOut.mul(200).div(BigNumber.from("100000"))
            )
          );
        const fee = amountETHOut2.mul(COFIX_THETA).div(BigNumber.from("10000"));
        const amountETHOut3 = amountETHOut2.sub(fee);
        return amountETHOut3;
      }
    };
    const swapXY = async (
      srcName: string,
      destName: string,
      amountIn: BigNumber
    ) => {
      const k = BigNumber.from("3000000")
        .mul(BASE_AMOUNT)
        .mul(BigNumber.from("3000000").mul(BASE_AMOUNT));
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
        if (usePath[index] === "ETH" || usePath[index + 1] === "ETH") {
          amount = await swapWithK(usePath[index], usePath[index + 1], amount);
        } else {
          amount = await swapXY(usePath[index], usePath[index + 1], amount);
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
  }, [account, chainId, cofixControllerContract, library, swapToken, inputValue, path]);

  const tokenData = [tokenList["NEST"], tokenList["ETH"]];
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
    if (swapToken.src === "ETH") {
      return true;
    }
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
  return (
    <div className={`${classPrefix}`}>
      <MainCard classNames={`${classPrefix}-card`}>
        <InfoShow
          topLeftText={t`From`}
          bottomRightText={
            t`Balance` +
            `:${
              swapTokenBalance
                ? bigNumberToNormal(swapTokenBalance.src, 18, 2)
                : "---"
            } ${swapToken.src}`
          }
          tokenSelect={swapToken.src === "DCU" ? false : true}
          tokenList={swapToken.src === "DCU" ? undefined : tokenData}
          getSelectedToken={getSelectedToken}
          balanceRed={!checkBalance()}
        >
          <div className={`${classPrefix}-card-selected`}>
            <SingleTokenShow tokenNameOne={swapToken.src} isBold />

            <p>{swapToken.src === "DCU" ? <></> : <PutDownIcon />}</p>
          </div>

          <input
            placeholder={t`Input`}
            className={"input-middle"}
            value={inputValue}
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
                ? bigNumberToNormal(swapTokenBalance.dest, 18, 2)
                : "---"
            } ${swapToken.dest}`
          }
          tokenSelect={swapToken.dest === "DCU" ? false : true}
          tokenList={swapToken.dest === "DCU" ? undefined : tokenData}
          getSelectedToken={getSelectedToken}
        >
          <div className={`${classPrefix}-card-selected`}>
            <SingleTokenShow tokenNameOne={swapToken.dest} isBold />

            <p>{swapToken.dest === "DCU" ? <></> : <PutDownIcon />}</p>
          </div>
          <p className={"showValue"}>
            {destValue ? bigNumberToNormal(destValue, 18, 18) : undefined}
          </p>
        </InfoShow>
        <div className={`${classPrefix}-card-trading`}>
          <Tooltip
            placement="leftBottom"
            color={"#ffffff"}
            title={t`Trading rate displayed on the page will be different from the actual rate. If your actual rate is 5% higher than the current page, the transaction will be rejected.`}
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
          disable={!checkButton()}
          onClick={() => {
            if (!checkButton()) {
              return;
            }
            if (checkAllowance()) {
              swap();
            } else {
              approve();
            }
          }}
        >
          {checkAllowance() ? <Trans>Swap</Trans> : <Trans>Approve</Trans>}
        </MainButton>
      </MainCard>
    </div>
  );
};

export default Swap;
