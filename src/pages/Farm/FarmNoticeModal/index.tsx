import { Trans } from "@lingui/macro";
import classNames from "classnames";
import { FC, MouseEventHandler, useState } from "react";
import { NoticeSelected } from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import "./styles";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

const FarmNoticeModal: FC<Props> = ({ ...props }) => {
  const [selected, setSelected] = useState(false);
  const classPrefix = "farmNotice";
  return (
    <MainCard classNames={`${classPrefix}-card`}>
      <p className={`${classPrefix}-card-title`}>
        <Trans>Risk Warning</Trans>
      </p>
      <ul>
        <input/>
        <li>
          <Trans>
            To enter the Hedge protocol and participate in pledge mining
            users/smart contracts, they need to fully understand the mining
            rules and the following risks. Users who do not understand the rules
            or cannot bear the risks are not recommended to participate:
          </Trans>
        </li>
        <li>
          <Trans>
            1. Users who participate in pledge mining need to pledge the Token
            supported by the agreement to the smart contract, and can retrieve
            the pledged Token after the lock-up period ends;
          </Trans>
        </li>
        <li>
          <Trans>
            2. Participating in pledge mining can get DCU rewards. DCU Token is
            the only payment voucher for participating in perpetual contracts
            and European options in the Hedge agreement. DCU currently does not
            have liquidity and price.
          </Trans>
        </li>
        <li>
          <Trans>
            3. In the process of participating in pledge mining, certain miners’
            fees are required for operations such as lock-up, receipt of
            rewards, and withdrawal of funds. Miners’ fees are collected by
            Ethereum miners. Pledge mining has a certain cost, and there is no
            guarantee that there will be income.
          </Trans>
        </li>
        <li>
          <Trans>
            4. There is no upper limit on the total amount of DCU Token. As the
            result of the game between users and the agreement, additional
            issuance or destruction will be carried out. If the agreement has
            been in the state of additional issuance, the DCU you obtained
            through mining will depreciate and may even return to zero.
          </Trans>
        </li>
        <li>
          <Trans>
            5. The Hedge protocol smart contract has not yet been audited. There
            may be fatal unknown risks in the smart contract that may cause your
            principal to be damaged. Please evaluate the risk yourself before
            deciding whether to participate.
          </Trans>
        </li>
        <li className={`${classPrefix}-card-select`}>
          
            <button
              className={classNames({
                [`selectButton`]: true,
                [`selected`]: selected,
              })}
              onClick={() => {
                setSelected(!selected);
              }}
            >
              <NoticeSelected />
            </button>{" "}
            <Trans>I have read carefully and fully understand the above risks, and I am
            willing to bear the losses caused by the risks.
          </Trans>
        </li>
      </ul>
      <div className={`${classPrefix}-card-buttonGroup`}>
        <MainButton
          disable={!selected}
          className={`${classPrefix}-card-buttonGroup-sure`}
          onClick={(e) => {
            if (props.onClose) {
              localStorage.setItem("FarmFirst", "1");
              props.onClose(e);
            }
          }}
        >
          <Trans>Sure</Trans>
        </MainButton>
        <a href="https://github.com/FORT-Protocol/Docs/blob/main/Hedge_Product_Document.pdf" target="view_window"><MainButton className={`${classPrefix}-card-buttonGroup-more`}>
          <Trans>Read more</Trans>
        </MainButton></a>
        
      </div>
    </MainCard>
  );
};

export default FarmNoticeModal;
