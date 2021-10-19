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

const OptionsNoticeModal: FC<Props> = ({ ...props }) => {
  const [selected, setSelected] = useState(false);
  const classPrefix = "notice";
  return (
    <MainCard classNames={`${classPrefix}-card`}>
      <p className={`${classPrefix}-card-title`}>
        <Trans>Risk Warning</Trans>
      </p>
      <ul>
        <input />
        <li>
          <Trans>
            For users/smart contracts using Hedge Protocol European options,
            when purchasing options, exercising, selling options and other
            related operations, please understand the rules and the differences
            of similar products in the market, and fully understand the
            following possible risks and Participate when you can bear the risk:
          </Trans>
        </li>
        <li>
          <Trans>
            1. Hedge Protocol option pricing is derived from the BS option
            pricing model. Unlike traditional option pricing methods, Hedge
            options are completely priced by algorithms, while traditional
            centralized exchanges are freely quoted by users. This pricing
            method is a bold one. Attempts and innovations, but it may also
            bring unknown risks.
          </Trans>
        </li>
        <li>
          <Trans>
            2. The premium paid for options purchased by Hedge Protocol and the
            income at settlement are all used in DCU Token. DCU itself is also a
            highly volatile asset. In extreme cases, even if your perpetual
            contract position is profitable, it is due to the price of DCU
            itself. Volatility, which may cause you to lose money based on legal
            currency.
          </Trans>
        </li>
        <li>
          <Trans>
            3. The option price of Hedge protocol comes from the NEST oracle
            machine. If the oracle machine is attacked or the price is abnormal
            due to other reasons, the system may experience settlement
            abnormalities, resulting in errors in the user's income calculation.
          </Trans>
        </li>
        <li>
          <Trans>
            4. The smart contract of the Hedge protocol has not been audited.
            There may be fatal unknown risks in the smart contract that will
            damage your principal. Please evaluate the risk yourself before
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
          <Trans>
            I have read carefully and fully understand the above risks, and I am
            willing to bear the losses caused by the risks.
          </Trans>
        </li>
      </ul>
      <div className={`${classPrefix}-card-buttonGroup`}>
        <MainButton
          disable={!selected}
          className={`${classPrefix}-card-buttonGroup-sure`}
          onClick={(e) => {
            if (props.onClose && selected) {
              localStorage.setItem("OptionsFirst", "1");
              props.onClose(e);
            }
          }}
        >
          <Trans>Sure</Trans>
        </MainButton>
        <a
          href="https://github.com/FORT-Protocol/Docs/blob/main/Hedge_Product_Document.pdf"
          target="view_window"
        >
          <button className={`${classPrefix}-card-buttonGroup-more`}>
            <Trans>Read more</Trans>
          </button>
        </a>
      </div>
    </MainCard>
  );
};

export default OptionsNoticeModal;
