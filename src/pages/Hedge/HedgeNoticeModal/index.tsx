import {Trans} from "@lingui/macro";
import classNames from "classnames";
import {FC, MouseEventHandler, useState} from "react";
import {NoticeSelected} from "../../../components/Icon";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import "./styles";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  action: () => Promise<void>;
};

const HedgeNoticeModal: FC<Props> = ({...props}) => {
  const [selected, setSelected] = useState(false);
  const classPrefix = "notice";
  return (
    <MainCard classNames={`${classPrefix}-card`}>
      <p className={`${classPrefix}-card-title`}>
        <Trans>Risk Warning</Trans>
      </p>
      <ul>
        <input/>
        <li>
          <Trans>
            For users/smart contracts using Fort Protocol American options, when purchasing Hedge options, exercising
            and other related operations, please understand the rules and the differences of similar products in the
            market, and fully understand the following possible risks and participate when you can bear the risk:
          </Trans>
        </li>
        <li>
          <Trans>
            1.Impermanent loss deviation risk: The hedging impermanent loss model is completely priced by the algorithm,
            and the strike earn you obtain varies according to the exercise time, which may deviate from the impermanent
            loss you actually provide liquidity.
          </Trans>
        </li>
        <li>
          <Trans>
            2. DCU Token price fluctuation risk: Both the payment and the final profit and loss use DCU Token, and DCU
            itself is also a highly volatile asset. In extreme cases, even if your perpetual contract position is
            profitable, However, due to the fluctuation of the DCU price itself, it may cause you to lose money in terms
            of fiat currency.
          </Trans>
        </li>
        <li>
          <Trans>
            3. External oracle risk: Fort protocol's Liquidity contract price comes from the NEST oracle. If the oracle
            is attacked or other reasons cause the price to be abnormal, The system may encounter settlement exceptions,
            which may cause errors in the user's revenue calculation.
          </Trans>
        </li>
        <li>
          <Trans>
            4. Smart contract risk: The smart contract of the Fort protocol may be fatal unknown risks in the smart
            contract that may cause your principal to be damaged. Please evaluate the risk yourself before deciding
            whether to participate.
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
            <NoticeSelected/>
          </button>
          {" "}
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
              localStorage.setItem("HedgeFirst", "1");
              props.action();
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

export default HedgeNoticeModal;
