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

const PerpetualsNoticeModal: FC<Props> = ({ ...props }) => {
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
            For users/smart contracts using Fort Protocol perpetual contracts,
            please understand its rules and the differences of similar products
            in the market when performing positions, settlement, liquidation and
            other related operations. After fully understanding the following
            possible risks and can bear Participate in the risk situation:
          </Trans>
        </li>
        <li>
          <Trans>
            1. Uncertainty risk of income: The calculation method of Fort
            perpetual contract is different from the calculation method of
            perpetual contract of traditional centralized exchange. The Fort
            perpetual contract converts the future price of the asset based on
            the historical rate of return of the asset. Therefore, the asset
            price increases by 100% after the user opens a position. The user's
            income is not 100%. In extreme cases, even if the asset price is
            rising, your income may be negative.
          </Trans>
        </li>
        <li>
          <Trans>
            2. Position liquidation risk: Fort perpetual contracts provide
            leverage of 1-5 times. When your leverage is greater than 1 times
            leverage, the price fluctuation of the underlying asset may cause
            liquidation.
          </Trans>
        </li>
        <li>
          <Trans>
            3. DCU Token price fluctuation risk: Both the margin and the final
            profit and loss use DCU Token, and DCU itself is also a highly
            volatile asset. In extreme cases, even if your perpetual contract
            position is profitable, However, due to the fluctuation of the DCU
            price itself, it may cause you to lose money in terms of fiat
            currency.
          </Trans>
        </li>
        <li>
          <Trans>
            4. External oracle risk: Fort protocol's perpetual contract price
            comes from the NEST oracle. If the oracle is attacked or other
            reasons cause the price to be abnormal, The system may encounter
            settlement exceptions, which may cause errors in the user's revenue
            calculation.
          </Trans>
        </li>
        <li>
          <Trans>
            5. Smart contract risk: The smart contract of the Fort protocol has
            not been audited. There may be fatal unknown risks in the smart
            contract that may cause your principal to be damaged. Please
            evaluate the risk yourself before deciding whether to participate.
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
              localStorage.setItem("PerpetualsFirst", "1");
              props.onClose(e);
            }
          }}
        >
          <Trans>Sure</Trans>
        </MainButton>
        <a
          href="https://github.com/FORT-Protocol/Docs/blob/main/Fort_Product_Document.pdf"
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

export default PerpetualsNoticeModal;
