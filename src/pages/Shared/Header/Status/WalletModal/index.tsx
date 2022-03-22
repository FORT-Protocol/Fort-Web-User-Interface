import { FC, MouseEventHandler, useEffect, useMemo, useState } from "react";
import { t, Trans } from "@lingui/macro";
import BaseModal from "../../../../../components/BaseModal";
import {
  CopyIcon,
  Fail,
  Loading,
  MetamaskIconSmall,
  Success,
  ToEtherscan,
} from "../../../../../components/Icon";
import useWeb3 from "../../../../../libs/hooks/useWeb3";
import { showEllipsisAddress } from "../../../../../libs/utils";
import copy from "copy-to-clipboard";
import { message } from "antd";
import "./styles";
import { useEtherscanBaseUrl } from "../../../../../libs/hooks/useEtherscanBaseUrl";
import { transactionTitle } from "../../../TransactionToast";
import useThemes, { ThemeType } from "../../../../../libs/hooks/useThemes";
import classNames from "classnames";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

const WalletModal: FC<Props> = ({ ...props }) => {
  const { account, chainId, deactivate } = useWeb3();
  const [transactionList, setTransactionList] = useState<Array<any>>();
  const classPrefix = "modal-wallet";
  const etherscanBase = useEtherscanBaseUrl();
  const { theme } = useThemes();

  useEffect(() => {
    if (chainId) {
      var cache = localStorage.getItem("transactionList" + chainId.toString());
      if (!cache) {
        return;
      }
      const transactionList = JSON.parse(cache);
      setTransactionList(transactionList.reverse());
    }
  }, [chainId]);

  const liList = useMemo(() => {
    if (transactionList) {
      return transactionList.map((item) => {
        var icon: JSX.Element;
        if (item.txState === 0) {
          icon = (
            <>
              <Loading className={"animation-spin"} />
            </>
          );
        } else if (item.txState === 1) {
          icon = (
            <>
              <Success />
            </>
          );
        } else {
          icon = (
            <>
              <Fail />
            </>
          );
        }
        return (
          <li key={item.hash}>
            {icon}
            <div className={`transactionInfo`}>
              <p>{transactionTitle(item.type)}</p>
            </div>
            <a href={etherscanBase + item.hash} target="view_window">
              <ToEtherscan />
            </a>
          </li>
        );
      });
    } else {
      return <></>;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionList]);

  return (
    <BaseModal
      onClose={props.onClose}
      classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
      titleName={t`Wallet`}
    >
      <div className={`${classPrefix}-metamask`}>
        <MetamaskIconSmall />
        <div className={`${classPrefix}-metamask-address`}>
          <p>{showEllipsisAddress(account || "")}</p>
          <button
            className={"copyButton"}
            onClick={() => {
              copy(account ? account : "");
              message.success(t`Copied`);
            }}
          >
            <CopyIcon />
          </button>
        </div>
        <button onClick={() => deactivate()}>
          <Trans>Disconnect</Trans>
        </button>
      </div>
      <p className={`${classPrefix}-ulTitle`}>
        <Trans>Recent transactions</Trans>
      </p>
      <ul>{liList}</ul>
    </BaseModal>
  );
};

export default WalletModal;
