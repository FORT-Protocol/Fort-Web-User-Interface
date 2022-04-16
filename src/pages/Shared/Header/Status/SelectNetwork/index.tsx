import { FC } from "react";
import {
  LittleBSC,
  LittleETH,
  LittleKCC,
  NetworkNow,
  PolygonIcon,
} from "../../../../../components/Icon";
import MainCard from "../../../../../components/MainCard";
import "./styles";

const SelectNetwork: FC = () => {
  const classPrefix = "selectNetwork";
  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-chainName`}>
        <PolygonIcon />
        <p>Polygon</p>
      </div>
      <div className={`${classPrefix}-hover`}>
        <MainCard classNames={`${classPrefix}-ul`}>
          <p>Select a network</p>
          <ul>
            <li>
              <a href={"https://app.fortprotocol.com"}>
                <LittleETH />
                <p>Ethereum</p>
              </a>
            </li>
            <li>
              <a href={"https://test.fortprotocol.com"}>
                <LittleETH />
                <p>Rinkeby</p>
              </a>
            </li>
            <li>
              <a href={"https://bsc.fortprotocol.com"}>
                <LittleBSC />
                <p>BSC</p>
              </a>
            </li>
            <li>
              <a href={"/"}>
                <PolygonIcon />
                <p>Polygon</p>
                <NetworkNow />
              </a>
            </li>
            <li>
              <a href={"https://kcc.fortprotocol.com"}>
                <LittleKCC />
                <p>KCC</p>
              </a>
            </li>
          </ul>
        </MainCard>
      </div>
    </div>
  );
};

export default SelectNetwork;
