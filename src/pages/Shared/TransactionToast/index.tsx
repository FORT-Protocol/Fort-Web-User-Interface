import { t, Trans } from "@lingui/macro";
import { FC } from "react";
import { toast } from "react-toastify";
import { Fail, Success } from "../../../components/Icon";
import { useEtherscanBaseUrl } from "../../../libs/hooks/useEtherscanBaseUrl";
import {
  TransactionInfoType,
  TransactionType,
} from "../../../libs/hooks/useTransactionInfo";
import "./styles";

export type TransactionToastInfo = {
  isSuccess: boolean;
  value: string;
  hash: string;
  type: TransactionType;
};

// export enum TransactionType {
//     buyLever = 0,
//     closeLever = 1,
//     buyOption = 2,
//     closeOption = 3,
//     approve = 4,
//     stake = 5,
//     claim = 6,
//     unStake = 7
// }

type Props = {
  info: TransactionToastInfo;
};

const TransactionToast: FC<Props> = ({ ...props }) => {
  const classPrefix = "transactionToast";
  const icon = props.info.isSuccess ? <Success /> : <Fail />;
  const etherscanBase = useEtherscanBaseUrl();

  return (
    <div className={classPrefix}>
      <div className={`${classPrefix}-left`}>
        {icon}
        <div className={`${classPrefix}-left-info`}>
          {transactionTitle(props.info.type)}
        </div>
      </div>
      <a
        href={`${etherscanBase}${props.info.hash}`}
        target="view_window"
        className={`${classPrefix}-right`}
      >
        <Trans>View</Trans>
      </a>
    </div>
  );
};

export default TransactionToast;

export const notifyTransaction = (txInfo: TransactionInfoType) => {
  const toastInfo: TransactionToastInfo = {
    isSuccess: txInfo.txState === 1 ? true : false,
    value: txInfo.info,
    hash: txInfo.hash,
    type: txInfo.type,
  };
  toast(<TransactionToast info={toastInfo} />, {
    position: toast.POSITION.TOP_RIGHT,
    closeOnClick: false,
    // hideProgressBar: true,
  });
};

export const transactionTitle = (type: TransactionType) => {
  switch (type) {
    case 0:
      return t`Buy Leveraged Token`;
    case 1:
      return t`Sell Leveraged Token`;
    case 2:
      return t`Option Token mint`;
    case 3:
      return t`Option Token close`;
    case 4:
      return t`Approve`;
    case 5:
      return t`Staking`;
    case 6:
      return t`Claim reward`;
    case 7:
      return t`Withdraw`;
    default:
      break;
  }
};
