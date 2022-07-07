import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import { message } from "antd";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ChooseType from "../../components/ChooseType";
import { HoldLine } from "../../components/HoldLine";
import InfoShow from "../../components/InfoShow";
import { LeverChoose } from "../../components/LeverChoose";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import PerpetualsList from "../../components/PerpetualsList";
import { DoubleTokenShow, SingleTokenShow } from "../../components/TokenShow";
import { useFortLeverBuy } from "../../contracts/hooks/useFortLeverTransation";
import {
  FortLeverContract,
  tokenList,
  TokenType,
} from "../../libs/constants/addresses";
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
  BASE_2000ETH_AMOUNT,
  BASE_AMOUNT,
  bigNumberToNormal,
  checkWidth,
  formatInputNum,
  normalToBigNumber,
} from "../../libs/utils";
import "./styles";
import { Tooltip } from "antd";
import { Contract } from "@ethersproject/contracts";
import { Popup } from "reactjs-popup";
import PerpetualsNoticeModal from "./PerpetualsNoticeModal";
import PerpetualsListMobile from "../../components/PerpetualsList/PerpetualsListMobile";
import { PutDownIcon } from "../../components/Icon";
import UpdateNoticeModal from "../Shared/UpdateNoticeModal";

export type LeverListType = {
  index: BigNumber;
  tokenAddress: string;
  lever: BigNumber;
  orientation: boolean;
  balance: BigNumber;
  basePrice: BigNumber;
  baseBlock: BigNumber;
};

const Perpetuals: FC = () => {
  const { account, chainId } = useWeb3();
  const [showNotice, setShowNotice] = useState(false);
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);
  const modal = useRef<any>();
  const [isLong, setIsLong] = useState(true);
  const [dcuBalance, setDcuBalance] = useState<BigNumber>();
  const [kValue, setKValue] = useState<{ [key: string]: TokenType }>();
  const [leverNum, setLeverNum] = useState<number>(1);
  const [tokenPair, setTokenPair] = useState<TokenType>(tokenList["ETH"]);
  const [dcuInput, setDcuInput] = useState<string>("");
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [leverListState, setLeverListState] = useState<Array<LeverListType>>(
    []
  );
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
  // const showNoticeModal = () => {
  //   var cache = localStorage.getItem("PerpetualsFirst");
  //   if (cache !== "1") {
  //     setShowNotice(true);
  //     return true;
  //   }
  //   return false;
  // };
  const showUpdateNoticeModal = () => {
    setShowUpdateNotice(true);
    return true;
  };
  const trList = leverListState.map((item) => {
    return checkWidth() ? (
      <PerpetualsList
        className={classPrefix}
        item={item}
        key={item.index.toString() + account}
        kValue={kValue}
      />
    ) : (
      <PerpetualsListMobile
        className={classPrefix}
        item={item}
        key={item.index.toString() + account}
        kValue={kValue}
      />
    );
  });
  const getPriceAndK = async (
    contract: Contract,
    leverContract: Contract,
    token: TokenType,
    chainId: number
  ) => {
    const priceList = await contract.lastPriceList(
      0,
      token.pairIndex[chainId],
      2
    );
    const priceValue = BASE_2000ETH_AMOUNT.mul(BASE_AMOUNT).div(priceList[1]);
    const k = await leverContract.calcRevisedK(
      token.sigmaSQ,
      BASE_2000ETH_AMOUNT.mul(BASE_AMOUNT).div(priceList[3]),
      priceList[2],
      priceValue,
      priceList[0]
    );
    const tokenNew = token;
    tokenNew.nowPrice = priceValue;
    tokenNew.k = k;
    return tokenNew;
  };

  const getPrice = useCallback(
    async (contract: Contract, leverContract: Contract, chainId: number) => {
      const ETH = await getPriceAndK(
        contract,
        leverContract,
        tokenList["ETH"],
        chainId
      );
      const BTC = await getPriceAndK(
        contract,
        leverContract,
        tokenList["BTC"],
        chainId
      );
      const tokenListNew = tokenList;
      tokenListNew["ETH"] = ETH;
      tokenListNew["BTC"] = BTC;
      setKValue(tokenListNew);
    },
    []
  );
  // price
  useEffect(() => {
    if (!priceContract || !chainId || !leverContract) {
      return;
    }
    getPrice(priceContract, leverContract, chainId);
    const id = setInterval(() => {
      getPrice(priceContract, leverContract, chainId);
    }, 60 * 1000);
    intervalRef.current = id;
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [chainId, priceContract, leverContract, getPrice]);
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
    const leverList = await leverContract.find("0", "20", "20", account);
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
      setTimeout(async () => {
        if (!dcuToken || !account) {
          return;
        }
        const balance = await dcuToken.balanceOf(account);
        setDcuBalance(balance);
      }, 4000);
    }
  }, [account, dcuToken, getList, isRefresh, txList]);
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
    tokenPair,
    leverNum,
    isLong,
    normalToBigNumber(dcuInput)
  );
  const kPrice = useCallback(() => {
    if (!kValue) {
      return "---";
    }
    var price: BigNumber;
    const inputNum = normalToBigNumber(dcuInput);
    const tokenKValue = kValue[tokenPair.symbol];
    if (!tokenKValue || !tokenKValue.nowPrice || !tokenKValue.k) {
      return "---";
    }
    if (isLong) {
      price = tokenKValue.nowPrice
        .mul(
          BASE_AMOUNT.add(tokenKValue.k).add(
            inputNum.div(BigNumber.from("10000000"))
          )
        )
        .div(BASE_AMOUNT);
    } else {
      price = tokenKValue.nowPrice
        .mul(BASE_AMOUNT)
        .div(
          BASE_AMOUNT.add(tokenKValue.k).add(
            inputNum.div(BigNumber.from("10000000"))
          )
        );
    }
    return bigNumberToNormal(price, 18, 2);
  }, [dcuInput, isLong, kValue, tokenPair.symbol]);

  const pcTable = (
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
            <Trans>Lever</Trans>
          </th>
          <th>
            <Trans>Margin</Trans>
          </th>
          <th>
            <Trans>Open price</Trans>
          </th>
          <th className={"th-marginAssets"}>
            <Tooltip
              placement="top"
              color={"#ffffff"}
              title={
                "Dynamic changes in net assets, less than a certain amount of liquidation will be liquidated, the amount of liquidation is Max'{'margin*leverage*0.02, 10'}'"
              }
            >
              <span>
                <Trans>Margin assets</Trans>
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
  );

  return (
    <div>
      {showNotice ? (
        <Popup
          ref={modal}
          open
          onClose={() => {
            setShowNotice(false);
          }}
        >
          <PerpetualsNoticeModal
            onClose={() => modal.current.close()}
            action={active}
          ></PerpetualsNoticeModal>
        </Popup>
      ) : null}
      {showUpdateNotice ? (
        <Popup
          ref={modal}
          open
          onClose={() => {
            setShowUpdateNotice(false);
          }}
        >
          <UpdateNoticeModal></UpdateNoticeModal>
        </Popup>
      ) : null}
      <MainCard classNames={`${classPrefix}-card`}>
        <InfoShow
          topLeftText={t`Token pair`}
          bottomRightText={""}
          tokenSelect={true}
          tokenList={[tokenList["ETH"], tokenList["BTC"]]}
          showUSDT={true}
          getSelectedToken={setTokenPair}
        >
          <div className={`${classPrefix}-card-tokenPair`}>
            <DoubleTokenShow
              tokenNameOne={tokenPair.symbol}
              tokenNameTwo={"USDT"}
            />
            <PutDownIcon />
          </div>
          <p>
            {`${
              checkWidth() ? "1 " + tokenPair.symbol + " = " : ""
            }${bigNumberToNormal(
              kValue
                ? kValue[tokenPair.symbol].nowPrice || BigNumber.from("0")
                : BigNumber.from("0"),
              tokenList["USDT"].decimals,
              2
            )} USDT`}
          </p>
        </InfoShow>
        <p className={"kPrice"}>
          <Tooltip
            placement="right"
            color={"#ffffff"}
            title={t`The opening price is based on NEST oracle and corrected according to risk compensation.`}
          >
            <span>{t`Open price:` + kPrice() + " USDT"}</span>
          </Tooltip>
        </p>
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
            maxLength={32}
            onChange={(e) => setDcuInput(formatInputNum(e.target.value))}
            onBlur={(e: any) => {}}
          />
          <button
            className={"max-button"}
            onClick={() =>
              setDcuInput(
                bigNumberToNormal(dcuBalance || BigNumber.from("0"), 18, 18)
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
            if (normalToBigNumber(dcuInput).lt(normalToBigNumber("50"))) {
              message.error(t`Minimum input 50`);
              return;
            }
            // if (showNoticeModal()) {
            //   return;
            // }
            if (showUpdateNoticeModal()) {
              return;
            }
            // active();
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
          {checkWidth() ? pcTable : <ul>{trList}</ul>}
        </div>
      ) : null}
    </div>
  );
};

export default Perpetuals;
