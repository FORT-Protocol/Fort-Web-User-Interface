import { BigNumber } from "@ethersproject/bignumber";
import { MaxUint256 } from "@ethersproject/constants";
import { t, Trans } from "@lingui/macro";
import { Tooltip } from "antd";
import classNames from "classnames";
import moment from "moment";
import { FC, useCallback, useEffect, useState } from "react";
import LineShowInfo from "../../../components/LineShowInfo";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { useERC20Approve } from "../../../contracts/hooks/useERC20Approve";
import {
  useFortForStakingGetReward,
  useFortForStakingStake,
  useFortForStakingWithdraw,
} from "../../../contracts/hooks/useFortForStaking";
import { tokenList } from "../../../libs/constants/addresses";
import { ERC20Contract, FortForStaking } from "../../../libs/hooks/useContract";
import useTransactionListCon from "../../../libs/hooks/useTransactionInfo";
import useWeb3 from "../../../libs/hooks/useWeb3";
import { bigNumberToNormal, normalToBigNumber } from "../../../libs/utils";
import "./styles";

type Props = {
  name: string;
  time: number;
  total: BigNumber;
};

enum StakingButtonType {
  disable = 0,
  farm = 1,
  claim = 2,
  withdraw = 3,
}

type StakingType = {
  rate: BigNumber;
  stakingNumber: BigNumber;
  miningPoolNumber: BigNumber;
  myStaking: BigNumber;
  expectedMining: BigNumber;
  claimTime: number;
  buttonType: StakingButtonType;
};

const oneMonthBlock = 200000;
// const oneMonthBlock = 300;
type TokenLink = {
  [key: string]: string;
};
type TokenLinkMap = { [key: string]: TokenLink };

const tokenInfoList: TokenLinkMap = {
  NEST: {
    info: "",
    link: "https://cofix.tech/",
  },
  CoFi: {
    info: t`COFI is the governance token of COFIX, a decentralized transaction protocol, and can be buy in COFIX.`,
    link: "https://cofix.tech/",
  },
  PETH: {
    info: t`PETH is a collateralized synthetic asset of the Parasset protocol.The 1:1 anchor ETH can be synthesized by collateralizing USDT or NEST.`,
    link: "https://parasset.top/",
  },
  NHBTC: {
    info: t`nHBTC is the quotation mining certificate for HBTC-ETH in the NEST protocol, which can be obtained through quotation mining or buy in Huobi exchange.`,
    link: "https://cofix.tech/",
  },
  PUSD: {
    info: t`PUSD is a collateralized synthetic asset of the Parasset protocol.USDT is anchored at 1:1 and can be synthesized by collateralizing ETH or NEST.`,
    link: "https://parasset.top/",
  },
};

export const FarmCard: FC<Props> = ({ ...props }) => {
  const { account, chainId, library } = useWeb3();
  const { pendingList } = useTransactionListCon();
  const [stakingInfo, setStakingInfo] = useState<StakingType>();
  const [showInput, setShowInput] = useState(false);
  const [approveAmount, setApproveAmount] = useState(BigNumber.from("0"));
  const [balanceAmount, setBalanceAmount] = useState(BigNumber.from("0"));
  const [inputValue, setInputValue] = useState("");
  const stakingContract = FortForStaking();
  const tokenContract = ERC20Contract(tokenList[props.name].addresses);
  const classPrefix = "farm";
  const TokenIcon = tokenList[props.name].Icon;
  const getReward = useFortForStakingGetReward(
    props.name,
    BigNumber.from((props.time * oneMonthBlock).toString())
  );
  const stake = useFortForStakingStake(
    props.name,
    BigNumber.from((props.time * oneMonthBlock).toString()),
    normalToBigNumber(inputValue)
  );
  const withdraw = useFortForStakingWithdraw(
    props.name,
    BigNumber.from((props.time * oneMonthBlock).toString())
  );
  const approve = useERC20Approve(
    props.name,
    MaxUint256,
    stakingContract?.address
  );

  const claimButtonDis = () => {
    return stakingInfo?.expectedMining.eq(BigNumber.from("0")) ? true : false;
  };
  const withdrawButtonDis = () => {
    return stakingInfo?.myStaking.eq(BigNumber.from("0")) ? true : false;
  };

  const buttonJSX = useCallback(
    () => {
      if (!stakingInfo) {
        return (
          <MainButton className={"farmButton"} disable>
            <Trans>Farm</Trans>
          </MainButton>
        );
      }
      if (stakingInfo.buttonType === StakingButtonType.disable) {
        return (
          <MainButton className={"farmButton"} disable>
            <Trans>Farm</Trans>
          </MainButton>
        );
      } else if (stakingInfo.buttonType === StakingButtonType.farm) {
        return (
          <MainButton
            className={"farmButton"}
            onClick={() => setShowInput(true)}
          >
            <Trans>Farm</Trans>
          </MainButton>
        );
      } else if (stakingInfo.buttonType === StakingButtonType.claim) {
        return (
          <MainButton
            disable={claimButtonDis()}
            className={"farmButton"}
            onClick={() => {
              if (claimButtonDis()) {
                return;
              }
              getReward();
            }}
          >
            <Trans>Claim</Trans>
          </MainButton>
        );
      } else if (stakingInfo.buttonType === StakingButtonType.withdraw) {
        return (
          <MainButton
            disable={withdrawButtonDis()}
            className={"farmButton"}
            onClick={() => {
              if (withdrawButtonDis()) {
                return;
              }
              withdraw();
            }}
          >
            <Trans>Withdraw</Trans>
          </MainButton>
        );
      }
      return (
        <MainButton disable>
          <Trans>Farm</Trans>
        </MainButton>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getReward, stakingInfo, withdraw]
  )();
  const approveTrue = approveAmount.gte(normalToBigNumber(inputValue));
  const inputButton = (
    <div className={"stake-button-inputView"}>
      <div className={"stake-button-inputView-input"}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={() => setInputValue(bigNumberToNormal(balanceAmount))}>
          MAX
        </button>
      </div>
      <button
        disabled={
          approveTrue && normalToBigNumber(inputValue).gt(balanceAmount)
        }
        onClick={() => {
          if (approveTrue) {
            stake();
            setShowInput(false);
          } else {
            approve();
          }
        }}
      >
        {approveTrue ? <Trans>Confirm</Trans> : <Trans>Approve</Trans>}
      </button>
    </div>
  );

  const StakeButton = (
    <div className={"stake-button"}>
      {showInput ? (
        inputButton
      ) : (
        <div className={"stake-button-div"}>{buttonJSX}</div>
      )}
      {showInput ? (
        <p
          className={classNames({
            [`red`]: normalToBigNumber(inputValue).gt(balanceAmount),
          })}
        >
          <Trans>wallet:</Trans>
          {`${bigNumberToNormal(balanceAmount, 18, 2)} ${props.name}`}
        </p>
      ) : (
        <></>
      )}
    </div>
  );

  useEffect(() => {
    if (
      !account ||
      !chainId ||
      !stakingContract ||
      !library ||
      !tokenContract
    ) {
      return;
    }
    const timeOut = stakingInfo ? 4000 : 0;
    setTimeout(async () => {
      const config = await stakingContract.getConfig();
      const channelInfo = await stakingContract.getChannelInfo(
        tokenList[props.name].addresses[chainId],
        props.time * oneMonthBlock
      );
      const balanceOf = await stakingContract.balanceOf(
        tokenList[props.name].addresses[chainId],
        props.time * oneMonthBlock,
        account
      );
      const latestBlock = await library.getBlockNumber();
      // 开始锁仓
      const startBlock: BigNumber = config[1];
      // 结束锁仓
      const stopBlock: BigNumber = config[2];
      // 总锁仓量
      const totalStaked: BigNumber = channelInfo[0];
      // 总出矿量
      const totalRewards: BigNumber = props.total;
      // 解锁区块号
      const unlockBlock: BigNumber = channelInfo[2];
      // 我的锁仓数量
      const myStakeAmount: BigNumber = balanceOf;

      const rate =
        totalStaked.toString() === "0"
          ? BigNumber.from("0")
          : totalRewards
              .mul(BigNumber.from("1000000000000000000"))
              .div(totalStaked);
      const stakingNumber = totalStaked;
      const miningPoolNumber = totalRewards;
      const myStaking = myStakeAmount;
      var expectedMining = rate
        .mul(myStaking)
        .div(BigNumber.from("1000000000000000000"));
      var claimTime = 0;
      if (stopBlock.lt(latestBlock)) {
        const blockInfo = await library?.getBlock(stopBlock.toNumber());
        claimTime = Number(blockInfo["timestamp"]) * 1000;
      } else {
        claimTime =
          stopBlock.sub(latestBlock).toNumber() * 14000 + moment().valueOf();
      }
      const buttonType =
        latestBlock < startBlock.toNumber()
          ? StakingButtonType.disable
          : latestBlock < stopBlock.toNumber()
          ? StakingButtonType.farm
          : latestBlock < unlockBlock.toNumber()
          ? StakingButtonType.claim
          : StakingButtonType.withdraw;

      if (
        buttonType === StakingButtonType.claim ||
        buttonType === StakingButtonType.withdraw
      ) {
        expectedMining = await stakingContract.earned(
          tokenList[props.name].addresses[chainId],
          props.time * oneMonthBlock,
          account
        );
      }

      const newStakingInfo = {
        rate: rate,
        stakingNumber: stakingNumber,
        miningPoolNumber: miningPoolNumber,
        myStaking: myStaking,
        expectedMining: expectedMining,
        claimTime: claimTime,
        buttonType: buttonType,
      };
      if (buttonType === StakingButtonType.farm) {
        const tokenBalance = await tokenContract.balanceOf(account);
        const allowance = await tokenContract.allowance(
          account,
          stakingContract.address
        );
        setBalanceAmount(tokenBalance);
        setApproveAmount(allowance);
      }
      setStakingInfo(newStakingInfo);
    }, timeOut);
    // ;(async () => {
    //     const config = await stakingContract.getConfig()
    //     const channelInfo = await stakingContract.getChannelInfo(tokenList[props.name].addresses[chainId], (props.time * 1000))
    //     const balanceOf = await stakingContract.balanceOf(tokenList[props.name].addresses[chainId], (props.time * 1000), account)
    //     const latestBlock = await library.getBlockNumber()
    //     // 开始锁仓
    //     const startBlock:BigNumber = config[1]
    //     // 结束锁仓
    //     const stopBlock:BigNumber = config[2]
    //     // 总锁仓量
    //     const totalStaked:BigNumber = channelInfo[0]
    //     // 总出矿量
    //     const totalRewards:BigNumber = BigNumber.from(props.total)
    //     // 解锁区块号
    //     const unlockBlock:BigNumber = channelInfo[2]
    //     // 我的锁仓数量
    //     const myStakeAmount:BigNumber = balanceOf

    //     const rate = totalStaked.toString() === '0' ? BigNumber.from('0') : totalRewards.mul(BigNumber.from('1000000000000000000')).div(totalStaked)
    //     const stakingNumber = totalStaked
    //     const miningPoolNumber = totalRewards
    //     const myStaking = myStakeAmount
    //     const expectedMining = rate.mul(myStaking).div(BigNumber.from('1000000000000000000'))
    //     const claimTime = stopBlock.sub(latestBlock).toNumber() * 13000 + moment().valueOf()
    //     const buttonType =
    //     latestBlock < startBlock.toNumber() ? StakingButtonType.disable :
    //     latestBlock < stopBlock.toNumber() ? StakingButtonType.farm :
    //     latestBlock < unlockBlock.toNumber() ? StakingButtonType.claim : StakingButtonType.withdraw

    //     const newStakingInfo = {
    //         rate: rate,
    //         stakingNumber: stakingNumber,
    //         miningPoolNumber: miningPoolNumber,
    //         myStaking: myStaking,
    //         expectedMining: expectedMining,
    //         claimTime: claimTime,
    //         buttonType : buttonType
    //     }
    //     if (buttonType === StakingButtonType.farm) {
    //         const tokenBalance = await tokenContract.balanceOf(account)
    //         const allowance = await tokenContract.allowance(account, stakingContract.address)
    //         setBalanceAmount(tokenBalance)
    //         setApproveAmount(allowance)
    //     }
    //     setStakingInfo(newStakingInfo)
    //     // TODO:删除
    //     if (tokenList[props.name].addresses[chainId] === '0xDB7b4FdF99eEE8E4Cb8373630c923c51c1275382' && props.time === 1) {
    //         console.log(startBlock.toString(), stopBlock.toString(), totalStaked.toString(), totalRewards.toString(), unlockBlock.toString(), myStakeAmount.toString())
    //     }
    // })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, library, pendingList]);
  const miningRate = () => {
    if (
      stakingInfo?.buttonType === StakingButtonType.claim ||
      stakingInfo?.buttonType === StakingButtonType.withdraw
    ) {
      return "---";
    }
    return `${bigNumberToNormal(
      stakingInfo?.rate || BigNumber.from("0"),
      18,
      2
    )} DCU/${props.name}`;
  };
  return (
    <MainCard classNames={`stakeCard`}>
      <div className={`${classPrefix}-li-tokenInfo`}>
        <TokenIcon />
        {props.name === 'NEST' ? (<p>{props.name}</p>) : (<p>
          <Tooltip
            placement="top"
            color={"#ffffff"}
            title={tokenInfoList[props.name].info}
          >
            <span>{props.name}</span>
          </Tooltip>
        </p>)}
        
      </div>
      <div className={`${classPrefix}-middleInfo`}>
        <LineShowInfo
          leftText={t`Lock period`}
          rightText={`${props.time} Month`}
          red={props.time === 24}
        />
        <LineShowInfo
          leftText={t`Current mining rate`}
          rightText={miningRate()}
        />
        <LineShowInfo
          leftText={t`Staking number`}
          rightText={`${bigNumberToNormal(
            stakingInfo?.stakingNumber || BigNumber.from("0"),
            18,
            2
          )} ${props.name}`}
        />
        <LineShowInfo
          leftText={t`Mining pool number`}
          rightText={`${bigNumberToNormal(
            stakingInfo?.miningPoolNumber || BigNumber.from("0"),
            18,
            2
          )} DCU`}
        />
      </div>
      <div className={`${classPrefix}-bottomInfo`}>
        <LineShowInfo
          leftText={t`My staking`}
          rightText={`${bigNumberToNormal(
            stakingInfo?.myStaking || BigNumber.from("0"),
            18,
            2
          )} ${props.name}`}
        />
        <LineShowInfo
          leftText={t`Expected mining`}
          rightText={`${bigNumberToNormal(
            stakingInfo?.expectedMining || BigNumber.from("0"),
            18,
            6
          )} DCU`}
        />
        <LineShowInfo
          leftText={t`Reward claim time`}
          rightText={`${moment(stakingInfo?.claimTime).format(
            "YYYY[-]MM[-]DD HH:mm"
          )}`}
        />
      </div>
      {StakeButton}
      <p className={`${classPrefix}-getLink`}>
        <Trans>No</Trans> {props.name},{" "}
        <a href={`${tokenInfoList[props.name].link}`} target="view_window">
          <Trans>get it now</Trans>
        </a>
      </p>
    </MainCard>
  );
};
