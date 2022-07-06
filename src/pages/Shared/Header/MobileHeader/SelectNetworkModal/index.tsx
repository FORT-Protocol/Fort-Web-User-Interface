import { FC, MouseEventHandler } from "react";
import BaseModal from "../../../../../components/BaseModal";
import {
  LittleBSC,
  LittleETH,
  LittleKCC,
  NetworkNow,
  PolygonIcon,
} from "../../../../../components/Icon";
import "./styles";

type Props = {
  onClose?: MouseEventHandler<HTMLButtonElement>;
};

const SelectNetworkModal: FC<Props> = ({ ...props }) => {
  const classPrefix = "selectNetworkMobile";
  return (
    <BaseModal
      onClose={props.onClose}
      classNames={classPrefix}
      titleName={`Select a network`}
    >
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
          <a href={"https://bnb.fortprotocol.com"}>
            <LittleBSC />
            <p>BNB</p>
            <NetworkNow />
          </a>
        </li>
        <li>
          <a href={"https://polygon.fortprotocol.com"}>
            <PolygonIcon />
            <p>Polygon</p>
          </a>
        </li>
        <li>
          <a href={"https://kcc.fortprotocol.com"}>
            <LittleKCC />
            <p>KCC</p>
          </a>
        </li>
      </ul>
    </BaseModal>
  );
};

export default SelectNetworkModal;
