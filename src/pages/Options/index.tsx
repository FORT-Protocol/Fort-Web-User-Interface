import { t, Trans } from "@lingui/macro";
import { BigNumber, Contract } from "ethers";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import ChooseType from "../../components/ChooseType";
import { PutDownIcon, WhiteLoading } from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import { DoubleTokenShow, SingleTokenShow } from "../../components/TokenShow";
import {
  FortEuropeanOptionContract,
  tokenList,
} from "../../libs/constants/addresses";
import {
  ERC20Contract,
  FortEuropeanOption,
  NestPriceContract,
} from "../../libs/hooks/useContract";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  formatInputNum,
  normalToBigNumber,
  ZERO_ADDRESS,
} from "../../libs/utils";
import { DatePicker, message, Tooltip } from "antd";
import "../../styles/ant.css";
import "./styles";
import { HoldLine } from "../../components/HoldLine";
import moment from "moment";
import { useFortEuropeanOptionOpen } from "../../contracts/hooks/useFortEuropeanOptionTransation";
import OptionsList from "../../components/OptionsList";
import useTransactionListCon from "../../libs/hooks/useTransactionInfo";
import { Popup } from "reactjs-popup";
import OptionsNoticeModal from "./OptionsNoticeModal";
// import _ from 'lodash';

export type OptionsListType = {
  balance: BigNumber;
  exerciseBlock: BigNumber;
  index: BigNumber;
  orientation: boolean;
  strikePrice: BigNumber;
  tokenAddress: string;
};

const MintOptions: FC = () => {
  const classPrefix = "options-mintOptions";
  const { account, chainId, library } = useWeb3();
  const [showNotice, setShowNotice] = useState(false)
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
  const [optionsListState, setOptionsListState] = useState<
    Array<OptionsListType>
  >([]);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [priceNow, setPriceNow] = useState<BigNumber>();
  const [fortBalance, setFortBalance] = useState(BigNumber.from(0));
  const [optionTokenValue, setOptionTokenValue] = useState<BigNumber>();

  const showNoticeModal = () => {
    var cache = localStorage.getItem("OptionsFirst");
    if (cache !== '1') {
      setShowNotice(true)
      return true
    }
    return false
  };
  
  const trList = optionsListState.map((item) => {
    return (
      <OptionsList
        className={classPrefix}
        key={item.index.toString() + account}
        item={item}
        blockNum={latestBlock.blockNum.toString()}
        showNotice={showNoticeModal}
        nowPrice={priceNow}
      />
    );
  });

  const getOptionsList = useCallback(async () => {
    if (!fortEuropeanOption) {
      return;
    }
    const optionsCount = await fortEuropeanOption.getOptionCount();
    const optionsList = await fortEuropeanOption.find(
      0,
      1000,
      optionsCount,
      account
    );
    const resultList = optionsList.filter((item: OptionsListType) =>
      item.balance.gt(BigNumber.from("0"))
    );
    setOptionsListState(resultList);
    setIsRefresh(true);
  }, [account, fortEuropeanOption]);

  useEffect(() => {
    setStrikePrice("");
    setFortNum("");
  }, [account]);

  useEffect(() => {
    if (!isRefresh) {
      getOptionsList();
    }
    if (!txList || txList.length === 0) {
      return;
    }
    const latestTx = txList[txList.length - 1];
    if (
      latestTx.txState === 1 &&
      (latestTx.type === 2 || latestTx.type === 3 || latestTx.type === 8)
    ) {
      setTimeout(getOptionsList, 4000);
    }
  }, [getOptionsList, isRefresh, txList]);

  const loadingButton = () => {
    const latestTx = pendingList.filter((item) => item.type === 2);
    return latestTx.length > 0 ? true : false;
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
    const price = await contract.triggeredPrice(
      tokenList["USDT"].addresses[chainId]
    );
    setPriceNow(price[1]);
  };
  useEffect(() => {
    if (!nestPriceContract || !chainId) {
      return;
    }
    getPrice(nestPriceContract, chainId);
    const id = setInterval(() => {
      getPrice(nestPriceContract, chainId);
    }, 60 * 1000);
    intervalRef.current = id;
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [chainId, nestPriceContract]);

  useEffect(() => {
    if (moment().valueOf() - latestBlock.time > 15000 && library) {
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
        // TODO:删除测试代码
        // const blockNum = parseFloat(
        //   ((selectTime - nowTime) / 14000).toString()
        const blockNum = parseFloat(
          ((selectTime - nowTime) / 672000).toString()
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
            priceNow,
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
  ]);

  const checkButton = () => {
    if (
      fortNum === "" ||
      strikePrice === "" ||
      exercise.blockNum === 0 ||
      normalToBigNumber(fortNum).gt(fortBalance) ||
      normalToBigNumber(strikePrice || "0", tokenList["USDT"].decimals).eq(
        BigNumber.from("0")
      ) ||
      loadingButton()
    ) {
      return true;
    }
    return false;
  };
  function disabledDate(current: any) {
    return current && current < moment().add(1, "days").startOf("day");
  }
  const active = useFortEuropeanOptionOpen(
    "ETH",
    isLong,
    BigNumber.from(exercise.blockNum),
    normalToBigNumber(fortNum),
    strikePrice ? normalToBigNumber(strikePrice, 6) : undefined
  );
  return (
    <div>
      {showNotice ? (<Popup
          ref={modal} open onClose={() => {setShowNotice(false)}}><OptionsNoticeModal onClose={() => modal.current.close()}></OptionsNoticeModal></Popup>) : null}
      <div className={classPrefix}>
        <MainCard classNames={`${classPrefix}-leftCard`}>
          <InfoShow topLeftText={t`Token pair`} bottomRightText={""}>
            <div className={`${classPrefix}-leftCard-tokenPair`}>
              <DoubleTokenShow tokenNameOne={"ETH"} tokenNameTwo={"USDT"} />
              {/* <button className={"select-button"}>
              <PutDownIcon />
            </button> */}
            </div>
            <p>{`1 ETH = ${priceNow ? bigNumberToNormal(priceNow, 6, 2) : '---'} USDT`}</p>
          </InfoShow>
          <ChooseType
            callBack={handleType}
            isLong={isLong}
            textArray={[t`Call`, t`Put`]}
          />
          <InfoShow
            topLeftText={t`Exercise time`}
            bottomRightText={`${t`Block number`}: ${
              exercise.blockNum === 0 ? "---" : exercise.blockNum
            }`}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              onChange={onOk}
              bordered={false}
              suffixIcon={<PutDownIcon />}
              placeholder={t`Exercise time`}
              allowClear={false}
            />
          </InfoShow>

          <InfoShow
            topLeftText={t`Strike price`}
            bottomRightText={`1 ETH = ${priceNow ? bigNumberToNormal(priceNow, 6, 2) : '---'} USDT`}
          >
            <input
              type="text"
              placeholder={t`Input`}
              className={"input-left"}
              value={strikePrice}
              onChange={(e) => setStrikePrice(formatInputNum(e.target.value))}
            />
            <span>USDT</span>
          </InfoShow>
          <InfoShow
            topLeftText={t`Payment`}
            bottomRightText={`${t`Balance`}: ${bigNumberToNormal(
              fortBalance,
              18,
              6
            )} DCU`}
            balanceRed={
              normalToBigNumber(fortNum).gt(fortBalance) ? true : false
            }
          >
            <SingleTokenShow tokenNameOne={"DCU"} isBold />
            <input
              type="text"
              placeholder={t`Input`}
              className={"input-middle"}
              value={fortNum}
              onChange={(e) => setFortNum(formatInputNum(e.target.value))}
            />
            <button
              className={"max-button"}
              onClick={() => setFortNum(bigNumberToNormal(fortBalance, 18, 18))}
            >
              MAX
            </button>
          </InfoShow>
        </MainCard>

        <MainCard classNames={`${classPrefix}-rightCard`}>
          <p className={`${classPrefix}-rightCard-tokenTitle`}>
            <Tooltip
              placement="top"
              color={"#ffffff"}
              title={t`One option shares to the return of a ETH.`}
            >
              <span>
                <Trans>Option shares</Trans>
              </span>
            </Tooltip>
          </p>
          {showLoading ? (
            <WhiteLoading className={"animation-spin"} />
          ) : (
            <p className={`${classPrefix}-rightCard-tokenValue`}>
              {optionTokenValue
                ? bigNumberToNormal(optionTokenValue, 18, 6)
                : "---"}
            </p>
          )}

          <MainButton
            disable={checkButton()}
            loading={loadingButton()}
            onClick={() => {
              if (showNoticeModal()) {return}
              if (normalToBigNumber(fortNum).gt(fortBalance)) {
                message.error(t`Insufficient balance`);
                return;
              }
              if (checkButton()) {
                return;
              }
              active();
            }}
          >
            <Trans>Buy Option</Trans>
          </MainButton>
          <div className={`${classPrefix}-rightCard-time`}>
            <p className={`${classPrefix}-rightCard-timeTitle`}>
              {` ${exercise.time}`}
            </p>
            <p className={`${classPrefix}-rightCard-timeValue`}>
              <Trans>compare with spot price and strike price</Trans>
            </p>
          </div>

          <div className={`${classPrefix}-rightCard-smallCard`}>
            <MainCard>
              <div className={`${classPrefix}-rightCard-smallCard-title`}>
                <p>
                  <Trans>Spot price</Trans>
                  {isLong ? " > " : " < "}
                  {bigNumberToNormal(
                    normalToBigNumber(strikePrice || "0"),
                    18,
                    6
                  )}
                </p>
                <p>
                  <Trans>Expected get</Trans>
                </p>
              </div>
              <p className={`${classPrefix}-rightCard-smallCard-value`}>
                {isLong
                  ? t`(Spot price - Strike price)*`
                  : t`(Strike price - Spot price)*`}
                {optionTokenValue
                  ? bigNumberToNormal(optionTokenValue, 18, 6)
                  : "---"}
              </p>
              <p className={`${classPrefix}-rightCard-smallCard-name`}>DCU</p>
            </MainCard>
            <MainCard>
              <div className={`${classPrefix}-rightCard-smallCard-title`}>
                <p>
                  <Trans>Spot price</Trans>
                  {isLong ? " <= " : " >= "}
                  {bigNumberToNormal(
                    normalToBigNumber(strikePrice || "0"),
                    18,
                    6
                  )}
                </p>
                <p>
                  <Trans>Expected get</Trans>
                </p>
              </div>
              <p className={`${classPrefix}-rightCard-smallCard-value`}>
                {"0"}
              </p>
              <p className={`${classPrefix}-rightCard-smallCard-name`}>DCU</p>
            </MainCard>
          </div>
        </MainCard>
      </div>
      {optionsListState.length > 0 ? (
        <div>
          <HoldLine>
            <Trans>Position</Trans>
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
        </div>
      ) : null}
    </div>
  );
};

export default MintOptions;
