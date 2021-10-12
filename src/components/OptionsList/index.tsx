import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { useFortEuropeanOptionExercise } from "../../contracts/hooks/useFortEuropeanOptionTransation";
import { tokenList } from "../../libs/constants/addresses";
import { NestPriceContract } from "../../libs/hooks/useContract";
import useTransactionListCon, {
  TransactionType,
} from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import { bigNumberToNormal, USDT_BASE_AMOUNT } from "../../libs/utils";
import { OptionsListType } from "../../pages/Options";
import { LongIcon, ShortIcon } from "../Icon";
import MainButton from "../MainButton";

type Props = {
  item: OptionsListType;
  key: string;
  className: string;
  blockNum: string;
};

const OptionsList: FC<Props> = ({ ...props }) => {
  const { pendingList } = useTransactionListCon();
  const { chainId, library } = useWeb3();
  const [timeString, setTimeString] = useState("---");
  const [strikeAmount, setStrikeAmount] = useState<BigNumber>();
  const priceContract = NestPriceContract();
  const loadingButton = () => {
    const closeTx = pendingList.filter(
      (item) =>
        item.info === props.item.index.toString() &&
        item.type === TransactionType.closeOption
    );
    return closeTx.length > 0 ? true : false;
  };

  const tokenName = () => {
    if (
      props.item.tokenAddress === "0x0000000000000000000000000000000000000000"
    ) {
      return "ETH";
    }
    return "ETH";
  };
  const TokenOneSvg = tokenList[tokenName()].Icon;
  const TokenTwoSvg = tokenList["USDT"].Icon;
  const active = useFortEuropeanOptionExercise(
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
        (props.item.exerciseBlock.toNumber() - Number(props.blockNum)) * 14000;
      setTimeString(
        moment(moment().valueOf() + subTime).format("YYYY[-]MM[-]DD HH:mm")
      );
    } else {
      (async () => {
        const blockInfo = await library?.getBlock(
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
          tokenList["USDT"].addresses[chainId],
          props.item.exerciseBlock
        );
        if (props.item.orientation) {
          const amount =
            blockPrice[1] > props.item.strikePrice
              ? props.item.balance
                  .mul(blockPrice[1].sub(props.item.strikePrice))
                  .div(USDT_BASE_AMOUNT)
              : BigNumber.from("0");
          setStrikeAmount(amount);
        } else {
          const amount =
            props.item.strikePrice > blockPrice[1]
              ? props.item.balance
                  .mul(props.item.strikePrice.sub(blockPrice[1]))
                  .div(USDT_BASE_AMOUNT)
              : BigNumber.from("0");
          setStrikeAmount(amount);
        }
      })();
    }
  }, [chainId, library, priceContract, props.blockNum, props.item.balance, props.item.exerciseBlock, props.item.orientation, props.item.strikePrice]);

  const checkButton = () => {
    if (
      loadingButton() ||
      Number(props.blockNum) <= props.item.exerciseBlock.toNumber()
    ) {
      return true;
    }
    return false;
  };

  return (
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
      <td>{bigNumberToNormal(props.item.strikePrice, 6, 2)} USDT</td>
      <td className={`exerciseTime`}>
        <p>
          {t`Block`}:{props.item.exerciseBlock.toString()}
        </p>
        <p>{timeString}</p>
      </td>
      <td>{bigNumberToNormal(props.item.balance, 18, 2)}</td>
      <td>{strikeAmount ? bigNumberToNormal(strikeAmount, 18, 2) : '---'}</td>
      <td>
        <MainButton
          onClick={() => {
            return checkButton() ? null : active();
          }}
          loading={loadingButton()}
          disable={checkButton()}
        >
          <Trans>Strike</Trans>
        </MainButton>
      </td>
    </tr>
  );
};

export default OptionsList;
