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
  });
};

export const transactionTitle = (type: TransactionType) => {
  switch (type) {
    case 0:
      return t`Open Future positions`;
    case 1:
      return t`Close Future positions`;
    case 2:
      return t`Buy options`;
    case 3:
      return t`Strike options`;
    case 4:
      return t`Approve`;
    case 5:
      return t`Staking`;
    case 6:
      return t`Claim reward`;
    case 7:
      return t`Withdraw`;
    case 8:
      return t`Sell options`;
    case 9:
    return t`Swap`;
    case 10:
    return 'Roll';
    case 11:
    return 'Claim';
    default:
      break;
  }
};
