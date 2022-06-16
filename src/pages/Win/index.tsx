import { Trans } from "@lingui/macro";
import { Tooltip } from "antd";
import { BigNumber } from "ethers";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { AddIcon, AddTokenIcon, Chance, SubIcon } from "../../components/Icon";
import InfoShow from "../../components/InfoShow";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import { SingleTokenShow } from "../../components/TokenShow";
import { useFortPRCRoll } from "../../contracts/hooks/useFortPRCTransation";
import { FortPRC, tokenList } from "../../libs/constants/addresses";
import {
  FortPRCContract,
  getERC20Contract,
} from "../../libs/hooks/useContract";
import { useEtherscanAddressBaseUrl } from "../../libs/hooks/useEtherscanBaseUrl";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  formatPRCInputNum,
  normalToBigNumber,
  showEllipsisAddress,
  ZERO_ADDRESS,
} from "../../libs/utils";
import "./styles";
import WinOrderList from "./WinOrderList";

export type PRCListType = {
  gained: BigNumber;
  index: BigNumber;
  m: BigNumber;
  n: BigNumber;
  openBlock: BigNumber;
  open_block: BigNumber;
  owner: string;
};

const Win: FC = () => {
  const classPrefix = "win";
  const { chainId, account, library } = useWeb3();
  const [chance, setChance] = useState<String>("1.10");
  const [prcNum, setPRCNum] = useState<String>("1.00");
  const [winPendingList, setWinPendingList] = useState<Array<PRCListType>>([]);
  const [historyList, setHistoryList] = useState<Array<PRCListType>>([]);
  const [allBetsData, setAllBetsData] = useState<Array<PRCListType>>([]);
  const [weeklyData, setWeeklyData] = useState<Array<PRCListType>>([]);
  const [nowBlock, setNowBlock] = useState<number>(0);
  const [PRCBalance, setPRCBalance] = useState<BigNumber>(BigNumber.from("0"));
  const fortPRCContract = FortPRCContract(FortPRC);
  const { pendingList, txList } = useTransactionListCon();
  const intervalRef = useRef<NodeJS.Timeout>();

  const addressBaseUrl = useEtherscanAddressBaseUrl();

  const getBalance = useCallback(async () => {
    if (!chainId || !account || !library) {
      return;
    }
    const PRCBalance = await getERC20Contract(
      tokenList["PRC"].addresses[chainId],
      library,
      account
    )?.balanceOf(account);
    setPRCBalance(PRCBalance);
  }, [account, chainId, library]);

  useEffect(() => {
    getBalance();
  }, [getBalance, txList]);

  const getList = useCallback(async () => {
    if (!fortPRCContract) {
      return;
    }

    const latest = await library?.getBlockNumber();
    if (!latest) {
      return;
    }
    const allBets_get = await fetch("https://api.hedge.red/api/prcTest/list/0/2");
    const allBets_data = await allBets_get.json();
    const allBets_data_modol = allBets_data.value.filter(
      (item: PRCListType) => item.owner !== ZERO_ADDRESS
    );

    const weekly_get = await fetch("https://api.hedge.red/api/prcTest/weekList/10");
    const weekly_data = await weekly_get.json();
    const weekly_data_modol = weekly_data.value.filter(
      (item: PRCListType) => item.owner !== ZERO_ADDRESS
    );
    const myBetsUrl = `https://api.hedge.red/api/prcTest/userList/${account}/200`
    const myBets_get = await fetch(myBetsUrl)
    const myBets_data = await myBets_get.json();
    const myBets_data_modol = myBets_data.value.filter(
      (item: PRCListType) => item.owner !== ZERO_ADDRESS
    );

    const listResult = await fortPRCContract.find44(
      "0",
      "200",
      "200",
      account
    );
    const result = listResult.filter(
      (item: PRCListType) => item.owner !== ZERO_ADDRESS
    );
    var history = myBets_data_modol;
    const pending = result.filter(
      (item: PRCListType) =>
        (BigNumber.from(item.n.toString()).gt(BigNumber.from("0")) &&
          BigNumber.from(item.openBlock.toString())
            .add(BigNumber.from(256))
            .gt(latest) &&
          BigNumber.from(item.gained.toString()).gt(BigNumber.from("0"))) ||
        (BigNumber.from(item.gained.toString()).eq(BigNumber.from("0")) &&
          BigNumber.from(latest).sub(item.openBlock).lte(BigNumber.from(10)))
    );

    for (var i = 0; i < pending.length; i++) {
      for (var j = 0;j < myBets_data_modol.length; j++) {
        if ((pending[i].owner.toLowerCase() === myBets_data_modol[j].owner.toLowerCase()) && (pending[i].index.toString() === myBets_data_modol[j].index.toString())) {
          history.splice(j,1); 
        }
      }
    }

    setHistoryList(history);
    setWinPendingList(pending);
    setNowBlock(latest);
    setAllBetsData(allBets_data_modol);
    setWeeklyData(weekly_data_modol);
  }, [account, fortPRCContract, library]);

  useEffect(() => {
    if (
      !txList ||
      txList.length === 0 ||
      (txList[txList.length - 1].type !== TransactionType.roll &&
        txList[txList.length - 1].type !== TransactionType.prcclaim) ||
      txList[txList.length - 1].txState !== 1
    ) {
      return;
    }
    getList();
    const id = setInterval(() => {
      getList();
    }, 30 * 1000);
    intervalRef.current = id;
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getList, txList]);
  const { ethereum } = window;
  const addToken = async () => {
    if (!chainId) {
      return;
    }

    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenList["PRC"].addresses[chainId], // The address that the token is at.
          symbol: "PRC", // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image:
            "https://raw.githubusercontent.com/FORT-Protocol/Fort-Web-User-Interface/2e289cd29722576329fae529c2bfaa0a905f0148/src/components/Icon/svg/TokenPRC.svg", // A string url of the token logo
        },
      },
    });
  };

  const weekly_li = weeklyData.map((item) => {
    const url = addressBaseUrl + item.owner;
    return (
      <li key={item.owner + "weekly"}>
        <p>
          <a href={url} target="view_window">
            {showEllipsisAddress(item.owner)}
          </a>
        </p>
        <p>{item.gained} DCU</p>
      </li>
    );
  });

  const weeklyRanks = () => {
    return (
      <div className={`${classPrefix}-otherList-weekly`}>
        <p className={`${classPrefix}-otherList-weekly-title`}>Weekly ranks</p>
        <ul>{weekly_li}</ul>
      </div>
    );
  };

  const allBets_li = allBetsData.map((item) => {
    const url = addressBaseUrl + item.owner;
    return (
      <li key={item.owner + item.index.toString() + "all"}>
        <p>{item.open_block}</p>
        <p>
          <a href={url} target="view_window">
            {showEllipsisAddress(item.owner)}
          </a>
        </p>
        <p>{item.gained} DCU</p>
      </li>
    );
  });

  const allBets = () => {
    return (
      <div className={`${classPrefix}-otherList-allBets`}>
        <p className={`${classPrefix}-otherList-allBets-title`}>All bets</p>
        <ul>{allBets_li}</ul>
      </div>
    );
  };

  const confirm = useFortPRCRoll(
    normalToBigNumber(prcNum.valueOf(), 4),
    normalToBigNumber(chance.valueOf(), 4)
  );

  const mainButtonPending = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.roll
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  const winChance = (100 / parseFloat(chance.toString())).toFixed(2);
  const payout = (
    parseFloat(chance.toString()) * parseFloat(prcNum.toString())
  ).toFixed(2);
  const changePayout = (num: number) => {
    const result = parseFloat(prcNum.valueOf()) * num;
    const resultString = formatPRCInputNum(result.toFixed(2));
    if (parseFloat(resultString) > 1000) {
      setPRCNum("1000.00");
    } else if (parseFloat(resultString) < 1) {
      setPRCNum("1.00");
    } else {
      setPRCNum(resultString);
    }
  };
  const checkChance = () => {
    const result = parseFloat(chance.valueOf());
    const resultString = formatPRCInputNum(result.toFixed(2));
    if (parseFloat(resultString) > 100 || parseFloat(resultString) < 1.1) {
      return false;
    } else {
      return true;
    }
  };
  const checkPRCNum = () => {
    const result = parseFloat(prcNum.valueOf());
    const resultString = formatPRCInputNum(result.toFixed(2));
    if (parseFloat(resultString) > 1000 || parseFloat(resultString) < 1) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <div className={`${classPrefix}`}>
      <div className={`${classPrefix}-left`}>
        <MainCard classNames={`${classPrefix}-card`}>
          <p className={`${classPrefix}-card-title`}>Win DCU by PRC</p>
          <InfoShow
            topLeftText={"Multiplier"}
            topRightText={checkChance() ? "" : "Limitation: 1.10-100.00"}
            bottomRightText={`Win chance:${
              winChance === "NaN" ? "---" : winChance
            } %`}
            popText={"Win chance = 1 / Multiplier"}
          >
            <input
              type="text"
              placeholder={"Input"}
              className={"input-left"}
              value={chance.valueOf()}
              maxLength={6}
              onChange={(e) => {
                const resultString = formatPRCInputNum(e.target.value);
                setChance(resultString);
              }}
            />
            <p className={`${classPrefix}-card-x`}>X</p>
            <button
              onClick={() => {
                const result = Math.floor(Math.random() * 9890 + 110);
                const resultString = formatPRCInputNum((parseFloat(result.toString())/100).toFixed(2).toString());
                setChance(resultString);
              }}
            >
              <Chance />
            </button>
          </InfoShow>
          <InfoShow
            topLeftText={"Bet amount"}
            bottomRightText={`${"Payout"}: ${
              payout === "NaN" ? "---" : payout
            } DCU`}
            topRightText={checkPRCNum() ? "" : "Limitation: 1.10-1000.00"}
            popText={"Payout = Multiplier * Bet amount"}
          >
            <SingleTokenShow tokenNameOne={"PRC"} isBold />
            <input
              type="text"
              placeholder={`Input`}
              className={"input-middle"}
              value={prcNum.valueOf()}
              maxLength={7}
              onChange={(e) => {
                const resultString = formatPRCInputNum(e.target.value);
                setPRCNum(resultString);
              }}
            />
            <button className={"sub-button"} onClick={() => changePayout(0.5)}>
              <SubIcon />
            </button>
            <button className={"add-button"} onClick={() => changePayout(2)}>
              <AddIcon />
            </button>
          </InfoShow>
          <MainButton
            className={`${classPrefix}-card-button`}
            onClick={() => {
              if (
                !checkChance() ||
                !checkPRCNum() ||
                mainButtonPending() ||
                !PRCBalance.gte(BigNumber.from("1000000000000000000"))
              ) {
                return;
              }
              confirm();
            }}
            disable={
              !checkChance() ||
              !checkPRCNum() ||
              mainButtonPending() ||
              !PRCBalance.gte(BigNumber.from("1000000000000000000"))
            }
            loading={mainButtonPending()}
          >
            {<Trans>Roll</Trans>}
          </MainButton>
          <div className={`${classPrefix}-card-bottom`}>
            <p className={`${classPrefix}-card-fairness`}>
              <Tooltip
                placement="bottom"
                color={"#ffffff"}
                title={
                  "After each roll is submitted, the contract hashes the combination of the hash of next block and the index number of the roll. Convert the result to a 32-byte integer, and if it can be divisible by the multiplier you submitted, you win."
                }
              >
                <span>Fairness</span>
              </Tooltip>
            </p>
            <p className={`${classPrefix}-card-balance`}>
              <Tooltip
                placement="right"
                color={"#ffffff"}
                title={
                  <button
                    className={`${classPrefix}-card-balance-add`}
                    onClick={() => addToken()}
                  >
                    <AddTokenIcon />
                    <p>Add PRC to your wallet</p>
                  </button>
                }
              >
                <span>Balance: {bigNumberToNormal(PRCBalance, 18, 6)} PRC</span>
              </Tooltip>
            </p>
          </div>
        </MainCard>
        <WinOrderList
          historyList={historyList}
          pendingList={winPendingList}
          nowBlock={nowBlock}
        />
      </div>
      <div className={`${classPrefix}-right`}>
        <MainCard classNames={`${classPrefix}-otherList`}>
          {weeklyRanks()}
          <p className={`${classPrefix}-otherList-line`}></p>
          {allBets()}
        </MainCard>
      </div>
    </div>
  );
};

export default Win;
