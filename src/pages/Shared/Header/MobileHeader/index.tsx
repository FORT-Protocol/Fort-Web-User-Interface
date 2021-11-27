import { t, Trans } from "@lingui/macro";
import classNames from "classnames";
import { FC, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Popup } from "reactjs-popup";
import { FortLogo, HeaderListMobile, WhiteLoading, XIcon } from "../../../../components/Icon";
import useTransactionListCon from "../../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../../libs/hooks/useWeb3";
// import { dynamicActivate } from "../../../../libs/i18nConfig";
import { showEllipsisAddress } from "../../../../libs/utils";
import Modal from "../Status/Modal";
import WalletModal from "../Status/WalletModal";
import "../Status/styles"
import "./styles";


const MobileHeader: FC = () => {
  const classPrefix = "header-mobile";
  const { account} = useWeb3();
  const [showList, setShowList] = useState(false);
  // const switchLang = (locale: string) => {
  //   return () => {
  //     dynamicActivate(locale);
  //   };
  // };
  const location = useLocation();
  const { pendingList } = useTransactionListCon();
  const routes = [
    { path: "/futures", content: t`Futures` },
    { path: "/options", content: t`Options` },
    { path: "/swap", content: t`Swap` }
  ].map((item) => (
    <li
      key={item.path}
      className={classNames({
        selected: location.pathname.indexOf(item.path) === 0,
      })}
      onClick={() => setShowList(false)}
    >
      <Link to={item.path}>{item.content}</Link>
    </li>
  ));
  const modal = useRef<any>();

  const headerListShow = (
    <div className={`${classPrefix}-headerList`}>
      <div className={`${classPrefix}-headerList-top`}>
        <div className={`${classPrefix}-headerList-top-left`}>
            <button onClick={() => setShowList(false)}><XIcon/></button>
        </div>
        <div className={`${classPrefix}-headerList-top-mid`}>
        BSC
        </div>
        <div className={`${classPrefix}-headerList-top-right`}>
        {/* <button onClick={switchLang("en-US")}>
          <EnglishIcon className={`${classPrefix}-right-english`} />
        </button>
        <button onClick={switchLang("zh-CN")}>
          <ChineseIcon className={`${classPrefix}-right-chinese`} />
        </button> */}
        </div>
      </div>
      <ul>
          {routes}
      </ul>
      <div className={'connectStatus'}>
      {account === undefined ? (
        <Popup
          modal
          ref={modal}
          trigger={
            <button className={"fort-button fort-button-mobile"}>
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
                [`fort-button-mobile`]: true,
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
      
    </div>
  );
  return (
    <header>
        {showList ? (headerListShow) : (<></>)}
      <div className={classPrefix}>
        <div className={`${classPrefix}-leftButton`}>
          <button onClick={() => setShowList(true)}>
            <HeaderListMobile />
          </button>
        </div>
        <FortLogo className={`${classPrefix}-logo`} />
        <div className={`${classPrefix}-rightButton`}></div>
      </div>
    </header>
  );
};

export default MobileHeader;
