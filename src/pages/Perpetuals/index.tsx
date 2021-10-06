import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import { message } from "antd";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ChooseType from "../../components/ChooseType";
import { HoldLine } from "../../components/HoldLine";
// import { PutDownIcon } from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import { LeverChoose } from "../../components/LeverChoose";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import PerpetualsList from "../../components/PerpetualsList";
import { DoubleTokenShow, SingleTokenShow } from "../../components/TokenShow";
import { useFortLeverBuy } from "../../contracts/hooks/useFortLeverTransation";
import { FortLeverContract, tokenList } from "../../libs/constants/addresses";
import {
  ERC20Contract,
  FortLever,
  NestPriceContract,
} from "../../libs/hooks/useContract";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  formatInputNum,
  normalToBigNumber,
} from "../../libs/utils";
import "./styles";
import { Tooltip } from "antd";
import { Contract } from "@ethersproject/contracts";

export type LeverListType = {
  index: BigNumber; //  编号
  tokenAddress: string; //  token地址
  lever: BigNumber; //  X倍数
  orientation: boolean; //  涨跌
  balance: BigNumber; //  保证金
  basePrice: BigNumber; //  基础价格
  baseBlock: BigNumber; //  基础区块号
};

const Perpetuals: FC = () => {
  const { account, chainId } = useWeb3();
  const [isLong, setIsLong] = useState(true);
  const [dcuBalance, setDcuBalance] = useState<BigNumber>();
  const [nowPrice, setNowPrice] = useState<BigNumber>();
  const [leverNum, setLeverNum] = useState<number>(1);
  const [dcuInput, setDcuInput] = useState<string>("");
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [leverListState, setLeverListState] = useState<Array<LeverListType>>(
    []
  );
  const [k, setK] = useState()
  const intervalRef = useRef<NodeJS.Timeout>();
  const classPrefix = "perpetuals";
  const dcuToken = ERC20Contract(tokenList["DCU"].addresses);
  const priceContract = NestPriceContract();
  const leverContract = FortLever(FortLeverContract);
  const { pendingList, txList } = useTransactionListCon();
  const handleType = (isLong: boolean) => {
    setIsLong(isLong);
  };
  const handleLeverNum = (selected: number) => {
    setLeverNum(selected);
  };
  const trList = leverListState.map((item) => {
    return (
      <PerpetualsList
        className={classPrefix}
        item={item}
        key={item.index.toString() + account}
        k={k}
        nowPrice={nowPrice}
      />
    );
  });
  const getPrice = async (contract: Contract, leverContract: Contract, tokenAddress:string, chainId: number) => {
    // const price = await contract.latestPrice(
    //   tokenList["USDT"].addresses[chainId]
    // );
    const priceList = await contract.lastPriceListAndTriggeredPriceInfo(tokenAddress, 2)
    
    const k = await leverContract.calcRevisedK(priceList[4], priceList[0][3],priceList[0][2],priceList[0][1],priceList[0][0])
    setNowPrice(priceList[0][1]);
    setK(k)
    console.log(priceList)
    console.log(`k值：${k}`)
  };
  // price
  useEffect(() => {
    if (!priceContract || !chainId || !leverContract) {
      return;
    }
    getPrice(priceContract, leverContract, tokenList['USDT'].addresses[chainId], chainId);
    const id = setInterval(() => {
      getPrice(priceContract, leverContract, tokenList['USDT'].addresses[chainId], chainId);
    }, 60 * 1000);
    intervalRef.current = id;
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [chainId, priceContract, leverContract]);
  // balance
  useEffect(() => {
    if (!dcuToken) {
      return;
    }
    (async () => {
      const balance = await dcuToken.balanceOf(account);
      setDcuBalance(balance);
    })();
  }, [dcuToken, account]);
  // list
  const getList = useCallback(async () => {
    if (!leverContract || !account) {
      return;
    }
    const leverList = await leverContract.find("0", "13", "13", account);
    console.log(leverList);
    const resultList = leverList.filter((item: LeverListType) =>
      item.balance.gt(BigNumber.from("0"))
    );
    setLeverListState(resultList);
    setIsRefresh(true);
  }, [account, leverContract]);
  useEffect(() => {
    if (!isRefresh) {
      getList();
    }
    if (!txList || txList.length === 0) {
      return;
    }
    const latestTx = txList[txList.length - 1];
    if (
      latestTx.txState === 1 &&
      (latestTx.type === 0 || latestTx.type === 1)
    ) {
      setTimeout(getList, 4000);
    }
  }, [getList, isRefresh, txList]);
  const checkDCUBalance = normalToBigNumber(dcuInput).gt(
    dcuBalance || BigNumber.from("0")
  );
  const mainButtonState = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.buyLever
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  const checkMainButton = () => {
    if (
      dcuInput === "" ||
      normalToBigNumber(dcuInput).eq(BigNumber.from("0")) ||
      checkDCUBalance ||
      mainButtonState()
    ) {
      return false;
    }
    return true;
  };
  const active = useFortLeverBuy(
    "ETH",
    leverNum,
    isLong,
    normalToBigNumber(dcuInput)
  );
  return (
    <div>
      <MainCard classNames={`${classPrefix}-card`}>
        <InfoShow topLeftText={t`Token pair`} bottomRightText={""}>
          <div className={`${classPrefix}-card-tokenPair`}>
            <DoubleTokenShow tokenNameOne={"ETH"} tokenNameTwo={"USDT"} />
            {/* <button className={"select-button"}>
              <PutDownIcon />
            </button> */}
          </div>
          <p>
            {`1 ETH = ${bigNumberToNormal(
              nowPrice || BigNumber.from("0"),
              tokenList["USDT"].decimals,
              2
            )} USDT`}
          </p>
        </InfoShow>
        <ChooseType
          callBack={handleType}
          isLong={isLong}
          textArray={[t`Long`, t`Short`]}
        />
        <LeverChoose selected={leverNum} callBack={handleLeverNum} />
        <InfoShow
          topLeftText={t`Payment`}
          bottomRightText={`${t`Balance`}: ${
            dcuBalance ? bigNumberToNormal(dcuBalance, 18, 6) : "----"
          } DCU`}
          balanceRed={checkDCUBalance}
        >
          <SingleTokenShow tokenNameOne={"DCU"} isBold />
          <input
            placeholder={t`Input`}
            className={"input-middle"}
            value={dcuInput}
            onChange={(e) => setDcuInput(formatInputNum(e.target.value))}
            onBlur={(e: any) => {}}
          />
          <button
            className={"max-button"}
            onClick={() =>
              setDcuInput(
                bigNumberToNormal(dcuBalance || BigNumber.from("0"), 18, 18, false)
              )
            }
          >
            MAX
          </button>
        </InfoShow>
        <MainButton
          className={`${classPrefix}-card-button`}
          onClick={() => {
            if (!checkMainButton()) {
              return;
            }
            if (normalToBigNumber(dcuInput).lt(normalToBigNumber("100"))) {
              message.error(t`Minimum input 100`);
              return;
            }
            active();
          }}
          disable={!checkMainButton()}
          loading={mainButtonState()}
        >
          {isLong ? <Trans>Open Long</Trans> : <Trans>Open Short</Trans>}
        </MainButton>
      </MainCard>
      {leverListState.length > 0 ? (
        <div>
          <HoldLine>
            <Trans>Positions</Trans>
          </HoldLine>
          <table>
            <thead>
              <tr className={`${classPrefix}-table-title`}>
                <th>
                  <Trans>Token pair</Trans>
                </th>
                <th>
                  <Trans>Type</Trans>
                </th>
                <th>
                  <Trans>lever</Trans>
                </th>
                <th>
                  <Trans>Margin</Trans>
                </th>
                <th>
                  <Trans>Open Price</Trans>
                </th>
                <th className={"th-marginAssets"}>
                  <Tooltip
                    placement="top"
                    color={"#ffffff"}
                    title={t`Dynamic changes in Margin Assets, less than 10 will be liquidated`}
                  >
                    <span>
                      <Trans>Margin Assets</Trans>
                    </span>
                  </Tooltip>
                </th>
                <th>
                  <Trans>Operate</Trans>
                </th>
              </tr>
            </thead>
            <tbody>{trList}</tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default Perpetuals;
