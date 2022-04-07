import {t, Trans} from "@lingui/macro";
import {BigNumber, Contract} from "ethers";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {PutDownIcon} from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainCard from "../../components/MainCard";
import {DoubleTokenShow, SingleTokenShow} from "../../components/TokenShow";
import {tokenList, TokenType, FortLPGuaranteeAddress, CofixSwapAddress} from "../../libs/constants/addresses";
import {ERC20Contract, getERC20Contract, NestPriceContract, FortLPGuaranteeContract} from "../../libs/hooks/useContract";
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
import useTransactionListCon from "../../libs/hooks/useTransactionInfo";
import MainButton from "../../components/MainButton";
import HedgeList from "../../components/HedgeList";
import {useERC20Approve} from "../../contracts/hooks/useERC20Approve";
import {MaxUint256} from "@ethersproject/constants";

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
  const fortLPGuaranteeContract = FortLPGuaranteeContract();
  const fortContract = ERC20Contract(tokenList["DCU"].addresses);
  const { pendingList, txList } = useTransactionListCon();
  const [latestBlock, setLatestBlock] = useState({ time: 0, blockNum: 0 });
  const intervalRef = useRef<NodeJS.Timeout>();
  const [exercise, setExercise] = useState({ time: "", blockNum: 0 });
  const [fortNum, setFortNum] = useState("");
  const [strikePrice, setStrikePrice] = useState<string>("");
  const [tokenPair, setTokenPair] = useState<TokenType>(tokenList["ETH"]);
  const [hedgeListState, setHedgeListState] = useState<
    Array<HedgeListType>
    >([]);
  const [priceNow, setPriceNow] = useState<{ [key: string]: TokenType }>();
  const [fortBalance, setFortBalance] = useState(BigNumber.from(0));
  const [dcuAllowance, setDcuAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [dates, setDates] = useState([]);
  const { RangePicker } = DatePicker;
  
  const showNoticeModal = () => {
    const cache = localStorage.getItem("HedgeFirst");
    if (cache !== "1") {
      setShowNotice(true);
      return true;
    }
    return false;
  };
  
  const trList = hedgeListState.map((item) => {
    return (
      <HedgeList
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
  
  function disabledDate(current: any) {
    return current && current < moment().add(30, "days").startOf("day");
  }
  
  useEffect(() => {
    if (!chainId || !account || !library) {
      return;
    }
    const dcuToken = getERC20Contract(
      tokenList['DCU'].addresses[chainId],
      library,
      account
    );
    if (!dcuToken) {
      setDcuAllowance(BigNumber.from("0"));
      return;
    }
    (async () => {
      const allowance = await dcuToken.allowance(
        account,
        FortLPGuaranteeAddress[chainId]
      );
      setDcuAllowance(allowance);
    })();
  }, [account, chainId, library, txList, tokenList]);
  
  const hedge = async () => {
    console.log('hedge')
  }
  
  const approve = useERC20Approve(
    'DCU',
    MaxUint256,
    fortLPGuaranteeContract?.address
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
    return !dcuAllowance.lt(normalToBigNumber(inputValue));
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
              allowClear={false}
              onCalendarChange={(val: any) => setDates(val)}
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
            onClick={() => {
              // if (!checkButton() || mainButtonState()) {
              //   return;
              // }
              if (checkAllowance()) {
                hedge();
              } else {
                approve();
              }
            }}
            // loading={mainButtonState()}
          >
            {checkAllowance() ? <Trans>Swap</Trans> : <Trans>Approve</Trans>}
          </MainButton>
        </MainCard>
      </div>
      {hedgeListState.length > 0 ? (
        <div>
          <HoldLine>
            <Trans>Position</Trans>
          </HoldLine>
          {checkWidth() ? (
            <table>
              <thead>
              <tr className={`${classPrefix}-table-title`}>
                <th>
                  <Trans>LP pair</Trans>
                </th>
                <th>
                  <Trans>Liquidity</Trans>
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
