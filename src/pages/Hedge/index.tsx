import {t, Trans} from "@lingui/macro";
import {BigNumber, Contract} from "ethers";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {PutDownIcon} from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainCard from "../../components/MainCard";
import {DoubleTokenShow, SingleTokenShow} from "../../components/TokenShow";
import {tokenList, TokenType, FortLPGuaranteeAddress} from "../../libs/constants/addresses";
import {
  ERC20Contract,
  getERC20Contract,
  NestPriceContract,
  FortLPGuaranteeContract
} from "../../libs/hooks/useContract";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  BASE_2000ETH_AMOUNT,
  BASE_AMOUNT,
  bigNumberToNormal,
  checkWidth,
  formatInputNum,
  normalToBigNumber,
} from "../../libs/utils";
import {DatePicker} from "antd";
import "../../styles/ant.css";
import "./styles";
import {HoldLine} from "../../components/HoldLine";
import moment from "moment";
import useTransactionListCon, {TransactionType} from "../../libs/hooks/useTransactionInfo";
import MainButton from "../../components/MainButton";
import HedgeList from "../../components/HedgeList";
import {useERC20Approve} from "../../contracts/hooks/useERC20Approve";
import {MaxUint256} from "@ethersproject/constants";
import useHedgeOpen from "../../contracts/hooks/useHedgeOpen";
import {Popup} from "reactjs-popup";
import HedgeNoticeModal from "./HedgeNoticeModal";

export type HedgeListType = {
  index: BigNumber;
  x0: BigNumber;
  y0: BigNumber;
  balance: BigNumber;
  owner: string;
  exerciseBlock: number;
  tokenIndex: number;
};

const Hedge: FC = () => {
  const classPrefix = "hedge";
  const {account, chainId, library} = useWeb3();
  const [showNotice, setShowNotice] = useState(false);
  const [inputValue, setInputValue] = useState<string>();
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const modal = useRef<any>();
  const nestPriceContract = NestPriceContract();
  const fortLPGuaranteeContract = FortLPGuaranteeContract();
  const fortContract = ERC20Contract(tokenList["DCU"].addresses);
  const {pendingList, txList} = useTransactionListCon();
  const [latestBlock, setLatestBlock] = useState({time: 0, blockNum: 0});
  const intervalRef = useRef<NodeJS.Timeout>();
  const [exercise, setExercise] = useState({time: "", blockNum: 0});
  const [dcuPayment, setDcuPayment] = useState<BigNumber>();
  const [tokenPair, setTokenPair] = useState<TokenType>(tokenList["ETH"]);
  const [hedgeListState, setHedgeListState] = useState<Array<HedgeListType>>([]);
  const [priceNow, setPriceNow] = useState<{ [key: string]: TokenType }>();
  const [dcuBalance, setDcuBalance] = useState(BigNumber.from(0));
  const [dcuAllowance, setDcuAllowance] = useState<BigNumber>(
    BigNumber.from("0")
  );
  const [y0, setY0] = useState('1')
  
  const mainButtonState = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.openHedge
    );
    return pendingTransaction.length > 0;
  };
  
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
    if (fortContract) {
      fortContract.balanceOf(account).then((value: any) => {
        setDcuBalance(BigNumber.from(value));
      });
      return;
    }
    setDcuBalance(BigNumber.from(0));
  }, [account, fortContract]);
  
  const getHedgeList = useCallback(async () => {
    if (!fortLPGuaranteeContract) {
      return;
    }
    const count = await fortLPGuaranteeContract.getGuaranteeCount();
    const hedgeList = await fortLPGuaranteeContract.find(
      0,
      1000,
      count,
      account
    );
    const resultList = hedgeList.filter((item: HedgeListType) =>
      item.balance.gt(BigNumber.from("0"))
    );
    setHedgeListState(resultList);
    setIsRefresh(true);
  }, [account, fortLPGuaranteeContract]);
  
  useEffect(() => {
    if (!isRefresh) {
      getHedgeList();
    }
    if (!txList || txList.length === 0) {
      return;
    }
    const latestTx = txList[txList.length - 1];
    if (
      latestTx.txState === 1 &&
      (latestTx.type === 10 || latestTx.type === 11)
    ) {
      setTimeout(getHedgeList, 4000);
      setTimeout(() => {
        if (!fortContract) {
          return;
        }
        fortContract.balanceOf(account).then((value: any) => {
          setDcuBalance(BigNumber.from(value));
        });
      }, 4000);
    }
  }, [account, fortContract, getHedgeList, isRefresh, txList]);
  
  useEffect(()=>{
    if (inputValue && priceNow && priceNow[tokenPair.symbol].nowPrice) {
      const y = (Number(inputValue)/Number(bigNumberToNormal(priceNow[tokenPair.symbol].nowPrice ?? BigNumber.from(1)))).toString()
      setY0(y)
    }
  }, [inputValue, priceNow, tokenPair.symbol])
  
  const open = useHedgeOpen(0, inputValue, y0, exercise.blockNum)
  
  const estimate = useCallback(() => {
    if (fortLPGuaranteeContract && inputValue && exercise.blockNum) {
      fortLPGuaranteeContract.estimate(0, normalToBigNumber(inputValue), 0, exercise.blockNum).then((value: any) => {
        setDcuPayment(BigNumber.from(value))
      })
    } else {
      return 0
    }
  }, [fortLPGuaranteeContract, inputValue, exercise])
  
  useEffect(() => {
    estimate()
  }, [estimate])
  
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
        setLatestBlock({time: moment().valueOf(), blockNum: latest || 0});
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
        setExercise({time: timeString, blockNum: latestBlock.blockNum || 0});
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
      {showNotice ? (
        <Popup
          ref={modal}
          open
          onClose={() => {
            setShowNotice(false);
          }}
        >
          <HedgeNoticeModal
            onClose={() => modal.current.close()}
            action={open}
          />
        </Popup>
      ) : null}
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
              dcuPayment && dcuPayment.gt(dcuBalance)
            }
          >
            <SingleTokenShow tokenNameOne={"USDT"} isBold/>
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
            topLeftText={t`Exercise time`}
            bottomRightText={''}
          >
            <DatePicker
              format="YYYY-MM-DD"
              defaultPickerValue={moment().add(30, "days")}
              disabledDate={disabledDate}
              onChange={onOk}
              bordered={false}
              suffixIcon={<PutDownIcon/>}
              allowClear={false}
            />
          </InfoShow>
          <InfoShow
            topLeftText={t`Payment`}
            bottomRightText={`${t`Balance`}: ${bigNumberToNormal(
              dcuBalance,
              18,
              6
            )} DCU`}
            balanceRed={
              dcuPayment && dcuPayment.gt(dcuBalance)
            }
          >
            <SingleTokenShow tokenNameOne={"DCU"} isBold/>
            <input
              type="text"
              placeholder={t`--`}
              className={"input-middle"}
              disabled={true}
              value={dcuPayment ? bigNumberToNormal(dcuPayment, 18, 10) : '--'}
              maxLength={32}
            />
          </InfoShow>
          <MainButton
            disable={!inputValue || !exercise.blockNum}
            onClick={() => {
              if (showNoticeModal()) {
                return;
              }
              if (!inputValue || !exercise.blockNum || mainButtonState()) {
                return;
              }
              if (checkAllowance()) {
                open();
              } else {
                approve();
              }
            }}
            loading={mainButtonState()}
          >
            {checkAllowance() ? <Trans>Hedge</Trans> : <Trans>Approve</Trans>}
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
