import { t, Trans } from "@lingui/macro";
import { message } from "antd";
import classNames from "classnames";
import { FC, MouseEventHandler } from "react";
import BaseModal from "../../../../../components/BaseModal";
import {
  MetamaskIcon,
  WalletConnectIcon,
} from "../../../../../components/Icon";
import MainCard from "../../../../../components/MainCard";
import { SupportedConnectors } from "../../../../../libs/connectors";
import useThemes, { ThemeType } from "../../../../../libs/hooks/useThemes";
import useWeb3 from "../../../../../libs/hooks/useWeb3";
import "./styles";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

const Modal: FC<Props> = ({ ...props }) => {
  const { activate } = useWeb3();
  const classPrefix = "modal-status";
  const { theme } = useThemes();
  return (
    <BaseModal
      onClose={props.onClose}
      classNames={classNames({
        [`${classPrefix}`]: true,
        [`${classPrefix}-dark`]: theme === ThemeType.dark,
      })}
      titleName={t`Connect Wallet`}
    >
      <p className={`${classPrefix}-notice`}>
        <Trans>Please select the method of connecting to the wallet</Trans>
      </p>
      <div className={`${classPrefix}-walletSelect`}>
        <MainCard
          onClick={() => {
            activate(SupportedConnectors[0].connector, undefined, true).catch(
              () => {
                message.error(
                  t`This network is not supported, please switch the network`
                );
              }
            );
          }}
        >
          <MetamaskIcon />
          <p>MetaMask</p>
        </MainCard>
        <MainCard
          onClick={() => {
            activate(SupportedConnectors[1].connector, undefined, true).catch(() => {
              message.error(
                t`This network is not supported, please switch the network`
              );
            });
          }}
        >
          <WalletConnectIcon />
          <p>WalletConnect</p>
        </MainCard>
      </div>
    </BaseModal>
  );
};

export default Modal;
