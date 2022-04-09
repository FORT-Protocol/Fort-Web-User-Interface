import { Trans } from "@lingui/macro";
import { Tooltip } from "antd";
import { BigNumber } from "ethers";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import MainButton from "../../components/MainButton";
import MainCard from "../../components/MainCard";
import WinChoice from "../../components/WinChoice";
import { useFortPRCRoll } from "../../contracts/hooks/useFortPRCTransation";
import { FortPRC, tokenList } from "../../libs/constants/addresses";
import {
  FortPRCContract,
  getERC20Contract,
} from "../../libs/hooks/useContract";
import useTransactionListCon, { TransactionType } from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  normalToBigNumber,
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
  owner: string;
};

const Win: FC = () => {
  const classPrefix = "win";
  const { chainId, account, library } = useWeb3();
  const [selected, setSelected] = useState<BigNumber>(BigNumber.from('100000000000000000000'));
  const [winPendingList, setWinPendingList] = useState<Array<PRCListType>>([]);
  const [historyList, setHistoryList] = useState<Array<PRCListType>>([]);
  const [nowBlock, setNowBlock] = useState<number>(0);
  const [PRCBalance, setPRCBalance] = useState<BigNumber>(BigNumber.from("0"));
  const fortPRCContract = FortPRCContract(FortPRC);
  const { pendingList, txList } = useTransactionListCon();
  const intervalRef = useRef<NodeJS.Timeout>();

  const select = (num: BigNumber) => {
    setSelected(num);
  };
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
    if (!txList || txList.length === 0) {
      return;
    }
    const latest = await library?.getBlockNumber()
    if (!latest){return}
    const listResult = await fortPRCContract.find("0", "2000", "2000", account);
    const result = listResult.filter(
      (item: PRCListType) => item.owner !== ZERO_ADDRESS
    );
    const history = result
    const pending = result.filter((item: PRCListType) =>
      (BigNumber.from(item.n.toString()).gt(BigNumber.from("0")) && BigNumber.from(item.openBlock.toString()).add(BigNumber.from(256)).gt(latest) && BigNumber.from(item.gained.toString()).gt(BigNumber.from("0"))) || (BigNumber.from(item.gained.toString()).eq(BigNumber.from("0")) && BigNumber.from(latest).sub(item.openBlock).lte(BigNumber.from(10)))
    );
    setHistoryList(history)
    setWinPendingList(pending)
    setNowBlock(latest)
  }, [account, fortPRCContract, library, txList]);

  useEffect(() => {
    getList();
    const id = setInterval(() => {
      getList();
    }, 10 * 1000);
    intervalRef.current = id;
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getList]);
  const { ethereum } = window;
  const addToken = async () => {
    if (!chainId) {return}
    
    await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenList['PRC'].addresses[chainId], // The address that the token is at.
          symbol: 'PRC', // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          image: '', // A string url of the token logo
        },
      },
    });
  } 

  const confirm = useFortPRCRoll(
    BigNumber.from("1"),
    selected ? BigNumber.from(bigNumberToNormal(selected, 18, 6)) : null
  );

  const mainButtonPending = () => {
    const pendingTransaction = pendingList.filter(
      (item) => item.type === TransactionType.roll
    );
    return pendingTransaction.length > 0 ? true : false;
  };
  return (
    <div className={`${classPrefix}`}>
      <MainCard classNames={`${classPrefix}-card`}>
        <p className={`${classPrefix}-card-title`}>Win DCU by 1 PRC</p>
        <div className={`${classPrefix}-card-choice`}>
          <div className={`${classPrefix}-card-choice-first`}>
            <WinChoice
              DCUAmount={normalToBigNumber("100")}
              selected={selected}
              callBack={select}
            />
            <WinChoice
              DCUAmount={normalToBigNumber("1000")}
              selected={selected}
              callBack={select}
            />
          </div>
          <div className={`${classPrefix}-card-choice-second`}>
            <WinChoice
              DCUAmount={normalToBigNumber("10000")}
              selected={selected}
              callBack={select}
            />
            <WinChoice
              DCUAmount={normalToBigNumber("100000")}
              selected={selected}
              callBack={select}
            />
          </div>
        </div>
        <MainButton
          className={`${classPrefix}-card-button`}
          onClick={() => confirm()}
          disable={selected == null || mainButtonPending() || !PRCBalance.gte(BigNumber.from('1000000000000000000'))}
          loading={mainButtonPending()}
        >
          {<Trans>Roll</Trans>}
        </MainButton>
        <p className={`${classPrefix}-card-balance`}>
        <Tooltip
          placement="right"
          color={"#ffffff"}
          title={<button onClick={() => addToken()}>+ Add PRC to your wallet</button>}
        >
          <span>Balance: {bigNumberToNormal(PRCBalance, 18, 6)} PRC</span>
          </Tooltip>
        </p>
      </MainCard>
      <WinOrderList historyList={historyList} pendingList={winPendingList} nowBlock={nowBlock}/>
    </div>
  );
};

export default Win;
