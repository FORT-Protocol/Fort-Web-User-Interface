import {t, Trans} from "@lingui/macro";
import {BigNumber, Contract} from "ethers";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {PutDownIcon} from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainCard from "../../components/MainCard";
import {DoubleTokenShow, SingleTokenShow} from "../../components/TokenShow";
import {CofixSwapAddress, FortEuropeanOptionContract, tokenList, TokenType,} from "../../libs/constants/addresses";
import {ERC20Contract, FortEuropeanOption, getERC20Contract, NestPriceContract,} from "../../libs/hooks/useContract";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  BASE_2000ETH_AMOUNT,
  BASE_AMOUNT,
  bigNumberToNormal,
  checkWidth,
  formatInputNum,
  normalToBigNumber,
  ZERO_ADDRESS,
} from "../../libs/utils";
import {DatePicker} from "antd";
import "../../styles/ant.css";
import "./styles";
import {HoldLine} from "../../components/HoldLine";
import moment from "moment";
import {useFortEuropeanOptionOpen} from "../../contracts/hooks/useFortEuropeanOptionTransation";
import OptionsList from "../../components/OptionsList";
import useTransactionListCon from "../../libs/hooks/useTransactionInfo";
import MainButton from "../../components/MainButton";

export type HedgeListType = {
  index: BigNumber;
  tokenAddress: string;
  strikePrice: BigNumber;
  orientation: boolean;
  exerciseBlock: BigNumber;
  balance: BigNumber;
  owner: string;
};

const Hedge: FC = () => {
  const classPrefix = "hedge";
  const { account, chainId, library } = useWeb3();
  const [showNotice, setShowNotice] = useState(false);
  const [inputValue, setInputValue] = useState<string>();
  const modal = useRef<any>();
  const nestPriceContract = NestPriceContract();
  const fortEuropeanOption = FortEuropeanOption(FortEuropeanOptionContract);
  const fortContract = ERC20Contract(tokenList["DCU"].addresses);
  const { pendingList, txList } = useTransactionListCon();
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [latestBlock, setLatestBlock] = useState({ time: 0, blockNum: 0 });
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isLong, setIsLong] = useState(true);
  const [exercise, setExercise] = useState({ time: "", blockNum: 0 });
  const [fortNum, setFortNum] = useState("");
  const [strikePrice, setStrikePrice] = useState<string>("");
  const [tokenPair, setTokenPair] = useState<TokenType>(tokenList["ETH"]);
  const [optionsListState, setOptionsListState] = useState<
    Array<HedgeListType>
    >([]);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [priceNow, setPriceNow] = useState<{ [key: string]: TokenType }>();
  const [fortBalance, setFortBalance] = useState(BigNumber.from(0));
  const [optionTokenValue, setOptionTokenValue] = useState<BigNumber>();
  const [srcAllowance, setSrcAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  
  const { RangePicker } = DatePicker;
  
  const showNoticeModal = () => {
    const cache = localStorage.getItem("HedgeFirst");
    if (cache !== "1") {
      setShowNotice(true);
      return true;
    }
    return false;
  };
  
  const trList = optionsListState.map((item) => {
    return (
      <OptionsList
        className={classPrefix}
        key={item.index.toString() + account}
        item={item}
        blockNum={latestBlock.blockNum.toString()}
        nowPrice={priceNow}
      />
    );
  });
  
  useEffect(() => {
    setStrikePrice("");
    setFortNum("");
  }, [account]);
  
  const loadingButton = () => {
    const latestTx = pendingList.filter((item) => item.type === 2);
    return latestTx.length > 0;
  };
  useEffect(() => {
    if (fortContract) {
      fortContract.balanceOf(account).then((value: any) => {
        setFortBalance(BigNumber.from(value));
      });
      return;
    }
    setFortBalance(BigNumber.from(0));
  }, [account, fortContract]);
  
  const getPrice = async (contract: Contract, chainId: number) => {
    const price_ETH = await contract.lastPriceList(
      0,
      tokenList["ETH"].pairIndex[chainId],
      1
    );
    const priceValue_ETH = BASE_2000ETH_AMOUNT.mul(BASE_AMOUNT).div(
      price_ETH[1]
    );
    const price_BTC = await contract.lastPriceList(
      0,
      tokenList["BTC"].pairIndex[chainId],
      1
    );
    const priceValue_BTC = BASE_2000ETH_AMOUNT.mul(BASE_AMOUNT).div(
      price_BTC[1]
    );
    const tokenListNew = tokenList;
    tokenListNew["ETH"].nowPrice = priceValue_ETH;
    tokenListNew["BTC"].nowPrice = priceValue_BTC;
    setPriceNow(tokenListNew);
  };
  useEffect(() => {
    if (!nestPriceContract || !chainId) {
      return;
    }
    getPrice(nestPriceContract, chainId);
    intervalRef.current = setInterval(() => {
      getPrice(nestPriceContract, chainId);
    }, 60 * 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [chainId, nestPriceContract]);
  
  useEffect(() => {
    if (moment().valueOf() - latestBlock.time > 6000 && library) {
      (async () => {
        const latest = await library?.getBlockNumber();
        setLatestBlock({ time: moment().valueOf(), blockNum: latest || 0 });
      })();
    }
  }, [latestBlock.time, library]);
  
  const handleType = (isLong: boolean) => {
    setIsLong(isLong);
  };
  
  const onOk = useCallback(
    async (value: any) => {
      if (latestBlock.blockNum === 0) {
        return;
      }
      
      const nowTime = moment().valueOf();
      const selectTime = moment(value).valueOf();
      if (selectTime > nowTime) {
        const timeString = moment(value).format("YYYY[-]MM[-]DD");
        const blockNum = parseFloat(
          ((selectTime - nowTime) / 3000).toString()
        ).toFixed(0);
        setExercise({
          time: timeString,
          blockNum: Number(blockNum) + (latestBlock.blockNum || 0),
        });
      } else {
        const timeString = moment().format("YYYY[-]MM[-]DD");
        setExercise({ time: timeString, blockNum: latestBlock.blockNum || 0 });
      }
    },
    [latestBlock]
  );
  
  useEffect(() => {
    if (
      fortEuropeanOption &&
      strikePrice !== "" &&
      fortNum !== "" &&
      priceNow &&
      exercise.blockNum !== 0
    ) {
      (async () => {
        setShowLoading(true);
        try {
          const value = await fortEuropeanOption.estimate(
            ZERO_ADDRESS,
            priceNow[tokenPair.symbol].nowPrice,
            normalToBigNumber(
              strikePrice,
              tokenList["USDT"].decimals
            ).toString(),
            isLong,
            exercise.blockNum.toString(),
            normalToBigNumber(fortNum).toString()
          );
          setOptionTokenValue(BigNumber.from(value));
        } catch {
          setOptionTokenValue(undefined);
        }
        setShowLoading(false);
      })();
    } else {
      setOptionTokenValue(undefined);
    }
  }, [
    exercise.blockNum,
    fortEuropeanOption,
    fortNum,
    isLong,
    priceNow,
    strikePrice,
    tokenPair.symbol,
  ]);
  
  function disabledDate(current: any) {
    return current && current < moment().add(30, "days").startOf("day");
  }
  
  const active = useFortEuropeanOptionOpen(
    tokenPair,
    isLong,
    BigNumber.from(exercise.blockNum),
    normalToBigNumber(fortNum),
    strikePrice ? normalToBigNumber(strikePrice, 18) : undefined
  );
  
  const priceString = () => {
    return priceNow
      ? priceNow[tokenPair.symbol].nowPrice
        ? bigNumberToNormal(priceNow[tokenPair.symbol].nowPrice!, 18, 2)
        : "---"
      : "---";
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
  
  return (
    <div>
      <div className={classPrefix}>
        <MainCard classNames={`${classPrefix}-card`}>
          <InfoShow
            topLeftText={t`LP pair`}
            bottomRightText={""}
            tokenSelect={true}
            tokenList={[tokenList["ETH"], tokenList["BTC"]]}
            getSelectedToken={setTokenPair}
            noBottom={true}
          >
            <div className={`${classPrefix}-card-lpPair`}>
              <DoubleTokenShow
                tokenNameOne={tokenPair.symbol}
                tokenNameTwo={"USDT"}
              />
            </div>
            <p>{`${
              checkWidth() ? "1 " + tokenPair.symbol + " = " : ""
            }${priceString()} USDT`}</p>
          </InfoShow>
          <InfoShow
            topLeftText={t``}
            bottomRightText={``}
            balanceRed={
              normalToBigNumber(fortNum).gt(fortBalance)
            }
          >
            <SingleTokenShow tokenNameOne={"USDT"} isBold />
            <input
              type="text"
              placeholder={t`Input liquidity`}
              className={"input-middle"}
              value={inputValue}
              maxLength={32}
              onChange={(e) => setInputValue(formatInputNum(e.target.value))}
            />
          </InfoShow>
          <InfoShow
            topLeftText={t`Exercise period`}
            bottomRightText={''}
          >
            <RangePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              onChange={onOk}
              bordered={false}
              suffixIcon={<PutDownIcon />}
              // placeholder={"Select"}
              allowClear={false}
            />
          </InfoShow>
          <InfoShow
            topLeftText={t`Payment`}
            bottomRightText={`${t`Balance`}: ${bigNumberToNormal(
              fortBalance,
              18,
              6
            )} DCU`}
            balanceRed={
              normalToBigNumber(fortNum).gt(fortBalance)
            }
          >
            <SingleTokenShow tokenNameOne={"DCU"} isBold />
            <input
              type="text"
              placeholder={t`--`}
              className={"input-middle"}
              disabled={true}
              value={fortNum}
              maxLength={32}
              onChange={(e) => setFortNum(formatInputNum(e.target.value))}
            />
          </InfoShow>
          <MainButton
            // disable={!checkButton() || mainButtonState()}
            // onClick={() => {
            //   if (!checkButton() || mainButtonState()) {
            //     return;
            //   }
            //   if (checkAllowance()) {
            //     swap();
            //   } else {
            //     approve();
            //   }
            // }}
            // loading={mainButtonState()}
          >
            {checkAllowance() ? <Trans>Swap</Trans> : <Trans>Approve</Trans>}
          </MainButton>
        </MainCard>
      </div>
      {optionsListState.length > 0 ? (
        <div>
          <HoldLine>
            <Trans>Position</Trans>
          </HoldLine>
          {checkWidth() ? (
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
                  <Trans>Strike price</Trans>
                </th>
                <th className={`exerciseTime`}>
                  <Trans>Exercise time</Trans>
                </th>
                <th>
                  <Trans>Option shares</Trans>
                </th>
                <th>
                  <Trans>Sale earn</Trans>
                </th>
                <th>
                  <Trans>Strike earn</Trans>
                </th>
                <th>
                  <Trans>Operate</Trans>
                </th>
              </tr>
              </thead>
              <tbody>{trList}</tbody>
            </table>
          ) : (
            <ul>{trList}</ul>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Hedge;
