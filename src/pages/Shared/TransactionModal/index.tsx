import { Trans } from "@lingui/macro";
import { FC } from "react";
import Popup from "reactjs-popup";
import BaseModal from "../../../components/BaseModal";
import { Loading, Refuse, Success } from "../../../components/Icon";
import useTransactionListCon from "../../../libs/hooks/useTransactionInfo";
import "./styles";
import { useEtherscanBaseUrl } from "../../../libs/hooks/useEtherscanBaseUrl";
import useThemes, { ThemeType } from "../../../libs/hooks/useThemes";
import classNames from "classnames";

export enum TransactionModalType {
  wait = 0,
  success = 1,
  fail = 2,
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
  const { theme } = useThemes();

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
        <Trans>View on bscscan</Trans>
      </a>
    </>
  );

  const fail = (
    <>
      <Refuse />
      <p className={`${classPrefix}-text`}>
        <Trans>Transaction declined</Trans>
        <p className={`${classPrefix}-text-error`}>{showModal.info}</p>
      </p>
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
      default:
        return <></>;
    }
  })();

  return (
    <Popup open={showModal.isShow}>
      <BaseModal
        onClose={closeModal}
        classNames={classNames({
          [`${classPrefix}`]: true,
          [`${classPrefix}-dark`]: theme === ThemeType.dark,
        })}
        titleName={""}
      >
        {iconContent}
      </BaseModal>
    </Popup>
  );
};

export default TransactionModal;
