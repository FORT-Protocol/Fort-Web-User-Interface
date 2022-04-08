import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import { FC, useCallback, useEffect, useState } from "react";
import {
  tokenList,
  TokenType,
} from "../../libs/constants/addresses";
import {
  NestPriceContract,
} from "../../libs/hooks/useContract";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  checkWidth,
  ZERO_ADDRESS,
} from "../../libs/utils";
import MainButton from "../MainButton";
import MainCard from "../MainCard";
import MobileListInfo from "../MobileListInfo";
import './styles'
import {HedgeListType} from "../../pages/Hedge";
import useHedgeExercise from "../../contracts/hooks/useHedgeExercise";

type Props = {
  item: HedgeListType;
  key: string;
  className: string;
  blockNum: string;
  nowPrice?: {[key: string]: TokenType};
};

const HedgeList: FC<Props> = ({ ...props }) => {
  const { pendingList } = useTransactionListCon();
  const [strikeAmount, setStrikeAmount] = useState<BigNumber>();
  const [tokenX, setTokenX] = useState("ETH")
  const loadingButton = () => {
    const exerciseTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.strikeHedge
    );
    return exerciseTx.length > 0;
  };
  
  useEffect(()=>{
    if (props.item.tokenIndex === 0) {
      setTokenX("ETH")
    } else if (props.item.tokenIndex === 1) {
      setTokenX("BTC")
    }
  }, [props.item.tokenIndex])
  
  const TokenOneSvg = tokenList[tokenX].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;
  const active = useHedgeExercise(props.item.index.toNumber());
  
  const checkButton = () => {
    return loadingButton();
  };

  const classPrefix = "HedgeList";
  const liItem = (
    <li className={`${classPrefix}-mobile`}>
      <MainCard classNames={`${classPrefix}-mobile-card`}>
        <div className={`${classPrefix}-mobile-card-top`}>
          <MobileListInfo title={t`Token pair`}>
            <TokenOneSvg />
            <TokenTwoSvg />
          </MobileListInfo>
        </div>
        <div className={`${classPrefix}-mobile-card-mid`}>
          <MobileListInfo title={t`Liquidity`}>
            <p>{bigNumberToNormal(props.item.x0, 18, 2)} USDT / {bigNumberToNormal(props.item.y0, 18, 2)} ETH</p>
          </MobileListInfo>
        </div>
        <div className={`${classPrefix}-mobile-card-bottom`}>
          <MobileListInfo title={t`Strike earn`}>
            <p>
              {strikeAmount ? bigNumberToNormal(strikeAmount, 18, 2) : "---"}{" "}
              DCU
            </p>
          </MobileListInfo>
        </div>
        <div className={`${classPrefix}-mobile-card-buttonGroup`}>
          <MainButton
            onClick={() => {
              return checkButton() ? null : active();
            }}
            loading={loadingButton()}
            disable={checkButton()}
          >
            <Trans>Strike</Trans>
          </MainButton>
        </div>
      </MainCard>
    </li>
  );

  return checkWidth() ? (
    <tr key={props.key} className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td>{bigNumberToNormal(props.item.x0, 18, 2)} USDT/ {bigNumberToNormal(props.item.y0, 18, 2)} ETH</td>
      <td>{strikeAmount ? bigNumberToNormal(strikeAmount, 18, 2) : "---"}</td>
      <td className={"buttonGroup"}>
        <div>
          <MainButton
            onClick={() => {
              return checkButton() ? null : active();
            }}
            loading={loadingButton()}
            disable={checkButton()}
          >
            <Trans>Strike</Trans>
          </MainButton>
        </div>
      </td>
    </tr>
  ) : (liItem);
};

export default HedgeList;
