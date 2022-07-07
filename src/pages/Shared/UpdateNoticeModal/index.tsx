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
        <li>Merger of the FORT protocol and NEST protocol</li>
        <li>On July 6th, 2022, FORT DAO passed the proposal for the merger of the FORT protocol and NEST protocol after discussion. The FORT community is scheduled to vote on the merger plan from July 8th to July 14th, 2022. If the vote is passed, the technical teams of the FORT protocol and NEST protocol will jointly advance the merger, and the merger is expected to be completed on July 29th.</li>
        <li>Starting from 10:00 (GMT+0) July 7 (some suspensions will take place a few hours earlier due to technical reason)</li>
        <li>1.the users will be suspended from buying DCU, although the holder can still sell it;</li>
        <li>2.the investors cannot open any positions for the future and option contracts, but all the contracts already purchased can still be settled;</li>
        <li>3.Probability coin is suspended from buying and selling but the holder can still spend it to win DCU.</li>
      </ul>
    </MainCard>
  );
};

export default UpdateNoticeModal;
