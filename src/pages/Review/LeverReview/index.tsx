import { t, Trans } from "@lingui/macro";
import { BigNumber } from "ethers";
import { FC, useEffect, useState } from "react";
import { BackIcon } from "../../../components/Icon";
import LineShowInfo from "../../../components/LineShowInfo";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import ReviewInfo from "../../../components/ReviewInfo";
import {
  useFortLeverBuy,
  useFortLeverSell,
} from "../../../contracts/hooks/useFortLeverTransation";
import useTransactionListCon, {
  TransactionState,
} from "../../../libs/hooks/useTransactionInfo";
import { normalToBigNumber } from "../../../libs/utils";
import { TransactionModalType } from "../../Shared/TransactionModal";
import "../styles";

export type LeverReviewModel = {
  fromToken: string;
  fromNum: string;
  getToken: string;
  getNum: string;
  frontPrice?: string;
  price: string;
};

type Props = {
  model: LeverReviewModel;
  back: () => void;
};

const LeverReview: FC<Props> = ({ ...props }) => {
  const classPrefix = "leverReview";
  var details_type: boolean;
  var details_factor: string = "";
  const { txList, showModal } = useTransactionListCon();
  const [txHash, setTxHash] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  if (props.model.fromToken === "DCU") {
    const strLength = props.model.getToken.length;
    details_type = props.model.getToken[strLength - 1] === "L" ? true : false;
    details_factor = props.model.getToken[strLength - 2];
  } else {
    const strLength = props.model.fromToken.length;
    details_type = props.model.fromToken[strLength - 1] === "L" ? true : false;
    details_factor = props.model.fromToken[strLength - 2];
  }

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
  var action: any = null;
  try {
    if (props.model.fromToken === "DCU") {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      action = useFortLeverBuy(
        "ETH",
        BigNumber.from(details_factor),
        details_type,
        normalToBigNumber(props.model.fromNum)
      );
    } else {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      action = useFortLeverSell(
        props.model.fromToken,
        normalToBigNumber(props.model.fromNum).toString()
      );
    }
  } catch (error) {
    props.back();
    console.log(error);
    return <></>;
  }

  return (
    <div className={classPrefix}>
      <MainCard classNames={`${classPrefix}-mainCard`}>
        <div className={`${classPrefix}-mainCard-top`}>
          <button onClick={props.back}>
            <BackIcon />
          </button>
          <p>
            <Trans>Swap Confirm</Trans>
          </p>
          <button></button>
        </div>
        {props.model.fromToken === "DCU" ? (
          <div className={`${classPrefix}-mainCard-fortNot`}>
            <Trans>
              If you already hold the Leveraged Token, it will be merged on
              transaction
            </Trans>
          </div>
        ) : null}

        <ReviewInfo
          title={t`From`}
          value={props.model.fromNum}
          name={props.model.fromToken}
        />
        <ReviewInfo
          title={t`Expected get `}
          value={props.model.getNum}
          name={props.model.getToken}
        />
        <div className={`${classPrefix}-mainCard-details`}>
          <p className={`${classPrefix}-mainCard-details-title`}>
            <Trans>Leveraged Token details</Trans>
          </p>
          <div className={`${classPrefix}-mainCard-details-infoCard`}>
            <LineShowInfo
              leftText={t`Type`}
              rightText={
                details_type
                  ? t`ETH Long Leveraged Token`
                  : t`ETH Short Leveraged Token`
              }
            />
            <LineShowInfo
              leftText={t`Leverage factor`}
              rightText={details_factor}
            />
          </div>
        </div>
        <LineShowInfo
          leftText={t`Current price`}
          rightText={`1 ETH = ${props.model.price} USDT`}
        />
        <MainButton
          onClick={action}
          loading={buttonLoading}
          disable={buttonLoading}
        >
          <Trans>Swap Confirm</Trans>
        </MainButton>
      </MainCard>
    </div>
  );
};

export default LeverReview;
