import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import { FC, useCallback, useEffect, useState } from "react";
import {
  useFortEuropeanOptionExercise,
} from "../../contracts/hooks/useFortEuropeanOptionTransation";
import {
  FortEuropeanOptionContract,
  tokenList,
  TokenType,
} from "../../libs/constants/addresses";
import {
  FortEuropeanOption,
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
import { OptionsListType } from "../../pages/Options";
import MainButton from "../MainButton";
import MainCard from "../MainCard";
import MobileListInfo from "../MobileListInfo";
import './styles'

type Props = {
  item: OptionsListType;
  key: string;
  className: string;
  blockNum: string;
  nowPrice?: {[key: string]: TokenType};
};

const HedgeList: FC<Props> = ({ ...props }) => {
  const { pendingList } = useTransactionListCon();
  const { chainId, library } = useWeb3();
  const [strikeAmount, setStrikeAmount] = useState<BigNumber>();
  const priceContract = NestPriceContract();
  const optionsContract = FortEuropeanOption(FortEuropeanOptionContract);
  const loadingButton = () => {
    const closeTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.closeOption
    );
    return closeTx.length > 0;
  };

  const tokenName = useCallback(() => {
    if (props.item.tokenAddress === ZERO_ADDRESS) {
      return "ETH";
    }
    return "BTC";
  }, [props.item.tokenAddress]);
  const TokenOneSvg = tokenList[tokenName()].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;
  const active = useFortEuropeanOptionExercise(
    props.item.index,
    props.item.balance
  );
  
  const checkButton = () => {
    return loadingButton() ||
      Number(props.blockNum) <= props.item.exerciseBlock.toNumber();
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
            <p>{bigNumberToNormal(props.item.strikePrice, 18, 2)} USDT / 1 ETH</p>
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
      <td>{bigNumberToNormal(props.item.strikePrice, 18, 2)} USDT/ 1 ETH</td>
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
