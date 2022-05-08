import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import {
  useFortEuropeanOptionExercise,
  useFortEuropeanOptionSell,
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
  BASE_2000ETH_AMOUNT,
  BASE_AMOUNT,
  bigNumberToNormal,
  checkWidth,
  ZERO_ADDRESS,
} from "../../libs/utils";
import { OptionsListType } from "../../pages/Options";
import { LongIcon, ShortIcon } from "../Icon";
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

const OptionsList: FC<Props> = ({ ...props }) => {
  const { pendingList } = useTransactionListCon();
  const { chainId, library } = useWeb3();
  const [timeString, setTimeString] = useState("---");
  const [strikeAmount, setStrikeAmount] = useState<BigNumber>();
  const [saleAmount, setSaleAmount] = useState<BigNumber>();
  const priceContract = NestPriceContract();
  const optionsContract = FortEuropeanOption(FortEuropeanOptionContract);
  const loadingButton = () => {
    const closeTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.closeOption
    );
    return closeTx.length > 0 ? true : false;
  };
  const loadingSellButton = () => {
    const closeTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.sellOption
    );
    return closeTx.length > 0 ? true : false;
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
  const sellActive = useFortEuropeanOptionSell(
    props.item.index,
    props.item.balance
  );
  useEffect(() => {
    if (
      !library ||
      !chainId ||
      !priceContract ||
      props.blockNum === "0" ||
      props.blockNum === "" ||
      props.item.exerciseBlock === BigNumber.from("0")
    ) {
      return;
    }
    if (props.item.exerciseBlock.toNumber() >= Number(props.blockNum)) {
      const subTime =
        (props.item.exerciseBlock.toNumber() - Number(props.blockNum)) * 3000;
      setTimeString(
        moment(moment().valueOf() + subTime).format("YYYY[-]MM[-]DD HH:mm")
      );
    } else {
      (async () => {
        const blockInfo = await library.getBlock(
          props.item.exerciseBlock.toNumber()
        );
        setTimeString(
          moment(Number(blockInfo["timestamp"]) * 1000).format(
            "YYYY[-]MM[-]DD HH:mm"
          )
        );
      })();
      (async () => {
        const blockPrice: Array<BigNumber> = await priceContract.findPrice(
          0,
          tokenList[tokenName()].pairIndex[chainId],
          props.item.exerciseBlock
        );
        const blockPrice_toUSDT = BASE_2000ETH_AMOUNT.mul(BASE_AMOUNT).div(blockPrice[1])
        if (props.item.orientation) {
          const amount =
          blockPrice_toUSDT.gt(props.item.strikePrice)
              ? props.item.balance
                  .mul(blockPrice_toUSDT.sub(props.item.strikePrice))
                  .div(BASE_AMOUNT)
              : BigNumber.from("0");
          setStrikeAmount(amount);
        } else {
          const amount =
            props.item.strikePrice.gt(blockPrice_toUSDT)
              ? props.item.balance
                  .mul(props.item.strikePrice.sub(blockPrice_toUSDT))
                  .div(BASE_AMOUNT)
              : BigNumber.from("0");
          setStrikeAmount(amount);
        }
      })();
    }
  }, [chainId, library, optionsContract, priceContract, props.blockNum, props.item.balance, props.item.exerciseBlock, props.item.index, props.item.orientation, props.item.strikePrice, tokenName]);

  useEffect(() => {
    if (!optionsContract || !chainId || !props.nowPrice || !props.nowPrice[tokenName()].nowPrice) {
      return;
    }
    const nowPrice = props.nowPrice[tokenName()].nowPrice
    if (props.item.exerciseBlock.toNumber() >= Number(props.blockNum)) {
      (async () => {
        const calcV: BigNumber = await optionsContract.calcV(
          tokenList[tokenName()].addresses[chainId],
          nowPrice,
          props.item.strikePrice,
          props.item.orientation,
          props.item.exerciseBlock
        );
        const letNum = BigNumber.from("18446744073709551616000000000000000000");
        const sellNUm = calcV
          .mul(props.item.balance)
          .mul(BigNumber.from("950"))
          .div(BigNumber.from("1000").mul(letNum));
        setSaleAmount(sellNUm);
      })();
    }
  }, [chainId, optionsContract, props.blockNum, props.item.balance, props.item.exerciseBlock, props.item.orientation, props.item.strikePrice, props.nowPrice, tokenName]);

  const checkButton = () => {
    if (
      loadingButton() ||
      Number(props.blockNum) <= props.item.exerciseBlock.toNumber()
    ) {
      return true;
    }
    return false;
  };
  const checkSellButton = () => {
    if (
      loadingSellButton() ||
      Number(props.blockNum) > props.item.exerciseBlock.toNumber()
    ) {
      return true;
    }
    return false;
  };
  const classPrefix = "OptionsList";
  const liItem = (
    <li className={`${classPrefix}-mobile`}>
      <MainCard classNames={`${classPrefix}-mobile-card`}>
        <div className={`${classPrefix}-mobile-card-top`}>
          <MobileListInfo title={t`Token pair`}>
            <TokenOneSvg />
            <TokenTwoSvg />
          </MobileListInfo>
          <MobileListInfo title={t`Type`}>
            <div className={`${classPrefix}-mobile-card-top-type`}>
              {props.item.orientation ? <LongIcon /> : <ShortIcon />}
              <p className={props.item.orientation ? "red" : "green"}>
                {props.item.orientation ? t`Long` : t`Short`}
              </p>
            </div>
          </MobileListInfo>
        </div>
        <div className={`${classPrefix}-mobile-card-mid`}>
          <MobileListInfo title={t`Strike price`}>
            <p>{bigNumberToNormal(props.item.strikePrice, 18, 2)} USDT</p>
          </MobileListInfo>
          <MobileListInfo title={t`Option shares`}>
            <p>{bigNumberToNormal(props.item.balance, 18, 2)}</p>
          </MobileListInfo>
        </div>
        <div className={`${classPrefix}-mobile-card-bottom`}>
          <MobileListInfo title={t`Sale earn`}>
            <p>
              {saleAmount ? bigNumberToNormal(saleAmount, 18, 2) : "---"}
              DCU
            </p>
          </MobileListInfo>
          <MobileListInfo title={t`Strike earn`}>
            <p>
              {strikeAmount ? bigNumberToNormal(strikeAmount, 18, 2) : "---"}{" "}
              DCU
            </p>
          </MobileListInfo>
        </div>
        <div className={`${classPrefix}-mobile-card-block`}>
          <MobileListInfo title={t`Exercise time`}>
            <p>
              {t`Block`}:{props.item.exerciseBlock.toString()}
            </p>
            <p>{timeString}</p>
          </MobileListInfo>
        </div>
        <div className={`${classPrefix}-mobile-card-buttonGroup`}>
          <MainButton
            onClick={() => {
              return checkSellButton() ? null : sellActive();
            }}
            loading={loadingSellButton()}
            disable={checkSellButton()}
          >
            <Trans>Sell</Trans>
          </MainButton>
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
      <td className={"td-type"}>
        {props.item.orientation ? <LongIcon /> : <ShortIcon />}
        <p className={props.item.orientation ? "red" : "green"}>
          {props.item.orientation ? t`Call` : t`Put`}
        </p>
      </td>
      <td>{bigNumberToNormal(props.item.strikePrice, 18, 2)} USDT</td>
      <td className={`exerciseTime`}>
        <p>
          {t`Block`}:{props.item.exerciseBlock.toString()}
        </p>
        <p>{timeString}</p>
      </td>
      <td>{bigNumberToNormal(props.item.balance, 18, 2)}</td>
      <td>{saleAmount ? bigNumberToNormal(saleAmount, 18, 2) : "---"}</td>
      <td>{strikeAmount ? bigNumberToNormal(strikeAmount, 18, 2) : "---"}</td>
      <td className={"buttonGroup"}>
        <div>
          <MainButton
            onClick={() => {
              return checkSellButton() ? null : sellActive();
            }}
            loading={loadingSellButton()}
            disable={checkSellButton()}
          >
            <Trans>Sell</Trans>
          </MainButton>
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

export default OptionsList;
