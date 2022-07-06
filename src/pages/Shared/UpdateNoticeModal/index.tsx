import { FC } from "react";
import MainCard from "../../../components/MainCard";
import "./styles";

const UpdateNoticeModal: FC = () => {
  const classPrefix = "notice";
  return (
    <MainCard classNames={`${classPrefix}-card`}>
      <p className={`${classPrefix}-card-title`}>升级公告</p>
      <ul>
        <input />
        <li>11111111111111111111111</li>
        <li>22222222222222222222222</li>
        <li>33333333333333333333333</li>
        <li>44444444444444444444444</li>
        <li>55555555555555555555555</li>
      </ul>
    </MainCard>
  );
};

export default UpdateNoticeModal;
