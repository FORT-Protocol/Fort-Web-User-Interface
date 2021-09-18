import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import { FC, MouseEventHandler, useEffect, useState } from "react";
import { BackIcon } from "../../../components/Icon";
import LineShowInfo from "../../../components/LineShowInfo";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import ReviewInfo from "../../../components/ReviewInfo";
import {
  useFortEuropeanOptionExercise,
  useFortEuropeanOptionOpen,
} from "../../../contracts/hooks/useFortEuropeanOptionTransation";
import { tokenList } from "../../../libs/constants/addresses";
import useTransactionListCon, {
  TransactionState,
} from "../../../libs/hooks/useTransactionInfo";
import { bigNumberToNormal } from "../../../libs/utils";
import { OptionsInfo } from "../../Options";
import { TransactionModalType } from "../../Shared/TransactionModal";
import "../styles";

type Props = {
  isMint?: boolean;
  back: MouseEventHandler<HTMLButtonElement>;
  optionsInfo: OptionsInfo | undefined;
};

const OptionsReview: FC<Props> = ({ ...props }) => {
  const classPrefix = "optionsReview";
  const { txList, showModal } = useTransactionListCon();
  const [txHash, setTxHash] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  if (!props.optionsInfo) {
    throw Error("OptionsReview:no info");
  }
  const open = useFortEuropeanOptionOpen(
    "ETH",
    BigNumber.from(props.optionsInfo.strikePrice),
    props.optionsInfo.type,
    BigNumber.from(props.optionsInfo.blockNumber),
    props.optionsInfo.fortAmount
  );

  const close = useFortEuropeanOptionExercise(
    props.optionsInfo.optionToken,
    props.optionsInfo.optionTokenAmount
  );

  useEffect(() => {
    if (showModal.txType === TransactionModalType.success && !buttonLoading) {
      setButtonLoading(true);
      setTxHash(showModal.hash);
    }
    if (buttonLoading) {
      if (
        txList.filter((item) => item.hash === txHash)[0].txState !==
        TransactionState.Pending
      ) {
        setButtonLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal.txType, txList]);
  return (
    <div className={classPrefix}>
      <MainCard classNames={`${classPrefix}-mainCard`}>
        <div className={`${classPrefix}-mainCard-top`}>
          <button onClick={props.back}>
            <BackIcon />
          </button>
          <p>{props.isMint ? t`Mint Confirm` : t`Close Confirm`}</p>
          <button></button>
        </div>
        <ReviewInfo
          title={props.isMint ? t`Mint amount` : t`Close amount`}
          value={bigNumberToNormal(
            BigNumber.from(
              props.isMint
                ? props.optionsInfo.fortAmount
                : props.optionsInfo.optionTokenAmount
            )
          )}
          name={props.isMint ? "DCU" : props.optionsInfo?.optionTokenName || ""}
        />
        {props.isMint ? null : (
          <ReviewInfo
            title={t`Expected get `}
            value={bigNumberToNormal(props.optionsInfo?.fortAmount)}
            name={"DCU"}
          />
        )}
        <div className={`${classPrefix}-mainCard-details`}>
          <p className={`${classPrefix}-mainCard-details-title`}>
            <Trans>Options Token details</Trans>
          </p>
          <div className={`${classPrefix}-mainCard-details-infoCard`}>
            <LineShowInfo
              leftText={t`Type`}
              rightText={
                props.optionsInfo?.type
                  ? t`ETH call option Token`
                  : t`ETH put option Token`
              }
            />
            <LineShowInfo
              leftText={t`Number of Option Token`}
              rightText={bigNumberToNormal(props.optionsInfo.optionTokenAmount)}
            />
            <LineShowInfo
              leftText={t`Strike price`}
              rightText={bigNumberToNormal(
                BigNumber.from(props.optionsInfo.strikePrice),
                tokenList["USDT"].decimals
              )}
            />
            <LineShowInfo
              leftText={t`Exercise time`}
              rightText={props.optionsInfo.exerciseTime}
            />
            <LineShowInfo
              leftText={t`Block number`}
              rightText={props.optionsInfo.blockNumber.toString()}
            />
          </div>
        </div>
        <MainButton
          onClick={props.isMint ? open : close}
          loading={buttonLoading}
          disable={buttonLoading}
        >
          {props.isMint ? t`Mint Confirm` : t`Close Confirm`}
        </MainButton>
      </MainCard>
    </div>
  );
};

export default OptionsReview;
