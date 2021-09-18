import { t, Trans } from "@lingui/macro";
import { FC } from "react";
import Popup from "reactjs-popup";
import copy from "copy-to-clipboard";
import BaseModal from "../../../components/BaseModal";
import { CopyIcon, Loading, Refuse, Success } from "../../../components/Icon";
import LineShowInfo from "../../../components/LineShowInfo";
import MainCard from "../../../components/MainCard";
import useTransactionListCon from "../../../libs/hooks/useTransactionInfo";
import { bigNumberToNormal, showEllipsisAddress } from "../../../libs/utils";
import "./styles";
import { BigNumber } from "@ethersproject/bignumber";
import { message } from "antd";
import { useEtherscanBaseUrl } from "../../../libs/hooks/useEtherscanBaseUrl";

export enum TransactionModalType {
  wait = 0,
  success = 1,
  fail = 2,
  eurSuccess = 3,
}

export type TransactionModalTokenInfo = {
  tokenName: string;
  tokenValue: string;
  tokenAddress: string;
};

const TransactionModal: FC = () => {
  const classPrefix = "modal-transaction";
  const { showModal, closeModal } = useTransactionListCon();
  const etherscanBase = useEtherscanBaseUrl();

  const wait = (
    <>
      <Loading className={"animation-spin"} />
      <p className={`${classPrefix}-text`}>
        <Trans>Wait for confirm</Trans>
      </p>
    </>
  );

  const success = (
    <>
      <Success />
      <p className={`${classPrefix}-text`}>
        <Trans>Transaction submitted</Trans>
      </p>
      <a href={`${etherscanBase}${showModal.hash}`} target="view_window">
        <Trans>View on etherscan</Trans>
      </a>
    </>
  );

  const fail = (
    <>
      <Refuse />
      <p className={`${classPrefix}-text`}>
        <Trans>Transaction declined</Trans>
      </p>
    </>
  );

  const eurSuccess = (
    <>
      <Success />
      <p className={`${classPrefix}-text`}>
        <Trans>European option Token minted successfully</Trans>
      </p>
      <MainCard classNames={"mainCard-eurModal"}>
        <LineShowInfo
          leftText={t`Number of Option Token`}
          rightText={bigNumberToNormal(
            BigNumber.from(showModal.tokenInfo?.tokenValue || "0"),
            18,
            6
          )}
        />
        <div className={`mainCard-eurModal-lastAddress`}>
          <LineShowInfo
            leftText={t`Contract address`}
            rightText={showEllipsisAddress(
              showModal.tokenInfo?.tokenAddress || "0"
            )}
          />
          <button
            className={"copyButton"}
            onClick={() => {
              message.success(t`Copied`);
              copy(showModal.tokenInfo ? showModal.tokenInfo.tokenAddress : "");
            }}
          >
            <CopyIcon />
          </button>
        </div>
      </MainCard>
      <a href={`${etherscanBase}${showModal.hash}`} target="view_window">
        <Trans>View on etherscan</Trans>
      </a>
    </>
  );

  const iconContent = (() => {
    switch (showModal.txType) {
      case TransactionModalType.wait:
        return wait;
      case TransactionModalType.success:
        return success;
      case TransactionModalType.fail:
        return fail;
      case TransactionModalType.eurSuccess:
        return eurSuccess;
      default:
        return <></>;
    }
  })();

  return (
    <Popup open={showModal.isShow}>
      <BaseModal onClose={closeModal} classNames={classPrefix} titleName={""}>
        {iconContent}
      </BaseModal>
    </Popup>
  );
};

export default TransactionModal;
