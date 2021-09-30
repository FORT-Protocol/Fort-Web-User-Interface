import { t, Trans } from "@lingui/macro";
import moment from "moment";
import { FC } from "react";
import { useFortEuropeanOptionExercise } from "../../contracts/hooks/useFortEuropeanOptionTransation";
import { tokenList } from "../../libs/constants/addresses";
import useTransactionListCon from "../../libs/hooks/useTransactionInfo";
import { bigNumberToNormal } from "../../libs/utils";
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
  const loadingButton = () => {
    const closeTx = pendingList.filter(
      (item) => item.info === props.item.index.toString()
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
  const timeString = () => {
    if (props.item.exerciseBlock.toNumber() > Number(props.blockNum)) {
      const subTime =
        (props.item.exerciseBlock.toNumber() - Number(props.blockNum)) * 14000;
      return moment(moment().valueOf() + subTime).format(
        "YYYY[-]MM[-]DD HH:mm"
      );
    }
    return "---";
  };

  return (
    <tr key={props.key} className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td className={'td-type'}>{props.item.orientation ? <LongIcon /> : <ShortIcon />}<p className={props.item.orientation ? 'red':'green'}>{props.item.orientation ? t`Call` : t`Put`}</p></td>
      <td>{bigNumberToNormal(props.item.strikePrice, 6, 2)} USDT</td>
      <td
        className={`exerciseTime`}
      >{`${t`Block`}:${props.item.exerciseBlock.toString()} (${timeString()})`}</td>
      <td>{bigNumberToNormal(props.item.balance, 18, 2)}</td>
      <td>
        <MainButton
          onClick={() => {
            return loadingButton() ? null : active();
          }}
          loading={loadingButton()}
          disable={loadingButton()}
        >
          <Trans>Strike</Trans>
        </MainButton>
      </td>
    </tr>
  );
};

export default OptionsList;
