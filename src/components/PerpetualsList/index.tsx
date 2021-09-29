import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import { FC, useEffect, useState } from "react";
import { useFortLeverSell } from "../../contracts/hooks/useFortLeverTransation";
import { FortLeverContract, tokenList } from "../../libs/constants/addresses";
import { FortLever } from "../../libs/hooks/useContract";
import useTransactionListCon from "../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../libs/hooks/useWeb3";
import { bigNumberToNormal } from "../../libs/utils";
import { LeverListType } from "../../pages/Perpetuals";
import { LongIcon, ShortIcon } from "../Icon";
import MainButton from "../MainButton";

type Props = {
  item: LeverListType;
  key: string;
  className: string;
  nowPrice?: BigNumber;
};

const PerpetualsList: FC<Props> = ({ ...props }) => {
  const { pendingList } = useTransactionListCon();
  const {account} = useWeb3()
  const leverContract = FortLever(FortLeverContract);
  const [marginAssets, setMarginAssets] = useState<BigNumber>()
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
  const active = useFortLeverSell(props.item.index, props.item.balance);
  useEffect(() => {
    if (!leverContract || !account || !props.nowPrice) {return}
    
      (async () => {
        console.log(props.item.index)
        const num = await leverContract.balanceOf(props.item.index, props.nowPrice, account)
        setMarginAssets(num)
    })()
  }, [account, leverContract, props.item.index, props.nowPrice])
  return (
    <tr key={props.key} className={`${props.className}-table-normal`}>
      <td className={"tokenPair"}>
        <TokenOneSvg />
        <TokenTwoSvg />
      </td>
      <td className={'td-type'}>{props.item.orientation ? <LongIcon /> : <ShortIcon />}<p className={props.item.orientation ? 'red':'green'}>{props.item.orientation ? t`Long` : t`Short`}</p></td>
      <td>{props.item.lever.toString()}X</td>
      <td>{bigNumberToNormal(props.item.balance, 18, 2)} DCU</td>
      <td>
        {bigNumberToNormal(props.item.price, tokenList["USDT"].decimals, 2)}{" "}
        USDT
      </td>
      <td>
        {marginAssets ? bigNumberToNormal(marginAssets, 18, 2) : '---'}{" "}
        DCU
      </td>
      <td>
        <MainButton
          onClick={() => {
            return loadingButton() ? null : active();
          }}
          loading={loadingButton()}
          disable={loadingButton()}
        >
          <Trans>Close</Trans>
        </MainButton>
      </td>
    </tr>
  );
};

export default PerpetualsList;
