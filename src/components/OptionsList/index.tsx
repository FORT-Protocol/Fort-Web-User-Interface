import { Trans } from "@lingui/macro";
import { FC } from "react";
import { useFortEuropeanOptionExercise } from "../../contracts/hooks/useFortEuropeanOptionTransation";
import { tokenList } from "../../libs/constants/addresses";
import { bigNumberToNormal } from "../../libs/utils";
import { OptionsListType } from "../../pages/Options";
import { LongIcon, ShortIcon } from "../Icon";
import MainButton from "../MainButton";

type Props = {
  item: OptionsListType;
  key: string;
  className: string;
};

const OptionsList: FC<Props> = ({ ...props }) => {
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

  return (
    <tr key={props.key} className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td>{props.item.orientation ? <LongIcon /> : <ShortIcon />}</td>
      <td>{bigNumberToNormal(props.item.strikePrice, 6, 2)} USDT</td>
      <td
        className={`exerciseTime`}
      >{`Block number:${props.item.exerciseBlock.toString()}(2021-12-12 12:12)`}</td>
      <td>{bigNumberToNormal(props.item.balance, 18, 2)}</td>
      <td>
        <MainButton onClick={active}>
          <Trans>Close</Trans>
        </MainButton>
      </td>
    </tr>
  );
};

export default OptionsList;
