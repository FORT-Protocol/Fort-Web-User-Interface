import { FC } from "react";
import MainCard from "../../../components/MainCard";
import "./styles";

const UpdateNoticeModal: FC = () => {
  const classPrefix = "notice";
  return (
    <MainCard classNames={`${classPrefix}-card`}>
      <p className={`${classPrefix}-card-title`}>Upgrade Announcement</p>
      <ul>
        <input />
        <li>the technical teams of the FORT protocol and NEST protocol will jointly advance the merger, and the merger is expected to be completed on July 22th.
</li>
        <li>Starting from 10:00 (GMT+0) July 7 (some suspensions will take place a few hours earlier due to technical reason),
</li>
        <li>1.the users will be suspended from buying DCU, although the holder can still sell it;</li>
        <li>2.the investors cannot open any positions for the future and option contracts, but all the contracts already purchased can still be settled;</li>
        <li>3.Probability coin is suspended from buying and selling but the holder can still spend it to win DCU.</li>
      </ul>
      <div className={`${classPrefix}-card-buttonGroup`}>
        <a
          href="https://pvm.nestprotocol.org"
          target="view_window"
        >
          <button className={`${classPrefix}-card-buttonGroup-more`}>
            Go NEST
          </button>
        </a>
      </div>
    </MainCard>
  );
};

export default UpdateNoticeModal;
