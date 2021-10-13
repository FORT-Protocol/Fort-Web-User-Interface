import { Trans } from "@lingui/macro";
import classNames from "classnames";
import { FC, useRef, useState } from "react";
import Popup from "reactjs-popup";
import { WhiteLoading } from "../../../../components/Icon";
import { SupportedChains } from "../../../../libs/constants/chain";
import useTransactionListCon from "../../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../../libs/hooks/useWeb3";
import { showEllipsisAddress } from "../../../../libs/utils";
import Modal from "./Modal";
import "./styles";
import WalletModal from "./WalletModal";

const ConnectStatus: FC = () => {
  const { account, chainId } = useWeb3();
  const [isFirst, setIsFirst] = useState(true)
  const modal = useRef<any>();
  const thisChain = SupportedChains.filter(
    (item) => item.chainId === chainId
  )[0];
  const classPrefix = "connectStatus";
  const { pendingList } = useTransactionListCon();
  var cache = localStorage.getItem("FarmFirst");
  return (
    <div
      className={classNames({
        [`${classPrefix}`]: true,
        [`isConnect`]: false,
      })}
    >
      {thisChain !== undefined && thisChain.chainId !== 1 ? (
        <div className={`${classPrefix}-chainName`}>{thisChain.name}</div>
      ) : null}

      {(isFirst && !account && cache === '1') ? (<Popup open><Modal onClose={() => {
    setIsFirst(false)
    modal.current.close()}} /></Popup>) : null}

      {account === undefined ? (
        <Popup
          modal
          ref={modal}
          trigger={
            <button className={"fort-button"}>
              <Trans>Connect Wallet</Trans>
            </button>
          }
        >
          <Modal onClose={() => modal.current.close()} />
        </Popup>
      ) : (
        <Popup
          modal
          ref={modal}
          trigger={
            <button
              className={classNames({
                [`fort-button`]: true,
                [`showNum`]: pendingList.length > 0,
              })}
            >
              <div className={"transactionNum"}>
                <WhiteLoading className={"animation-spin"} />
                <p>{pendingList.length}</p>
              </div>
              <p>{showEllipsisAddress(account || "")}</p>
            </button>
          }
        >
          <WalletModal onClose={() => modal.current.close()} />
        </Popup>
      )}
    </div>
  );
};

export default ConnectStatus;
