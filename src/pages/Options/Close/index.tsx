import { BigNumber } from "@ethersproject/bignumber";
import { t, Trans } from "@lingui/macro";
import classNames from "classnames";
import moment from "moment";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { OptionsInfo } from "..";
import {
  CopyIcon,
  NoOptionToken,
  OptionLiChoose,
  TokenFORTBig,
} from "../../../components/Icon";
import LineShowInfo from "../../../components/LineShowInfo";
import MainButton from "../../../components/MainButton";
import MainCard from "../../../components/MainCard";
import { SingleTokenShow } from "../../../components/TokenShow";
import { tokenList } from "../../../libs/constants/addresses";
import { FortOptionToken, NestPriceContract } from "../../../libs/hooks/useContract";
import copy from "copy-to-clipboard";
import useWeb3 from "../../../libs/hooks/useWeb3";
import {
  bigNumberToNormal,
  formatInputAddress,
  getBaseBigNumber,
  showEllipsisAddress,
} from "../../../libs/utils";
import "./styles";
import { Contract } from "ethers";
import ERC20ABI from "../../../contracts/abis/ERC20.json";
import { message } from "antd";

type Props = {
  reviewCall: (info: OptionsInfo, isMint: boolean) => void;
};

const CloseOptions: FC<Props> = ({ ...props }) => {
  const classPrefix = "options-closeOptions";
  const { chainId, account, library } = useWeb3();
  const [showAddButton, setShowAddButton] = useState(false);
  const [addAddressValue, setAddAddressValue] = useState("");
  const [latestBlock, setLatestBlock] = useState(0);
  const [selectToken, setSelectToken] = useState<string>();
  const [closeButtonDis, setCloseButtonDis] = useState<boolean>();
  const [optionInfo, setOptionInfo] = useState<OptionsInfo | null>();
  const [optionTokenList, setOptionTokenList] = useState<
    Array<{ [key: string]: string }>
  >([]);
  const nestPriceContract = NestPriceContract()

  const routes = optionTokenList ? (
    optionTokenList.reverse().map((item: any, index) => (
      <li
        key={item.address}
        className={classNames({
          selected: item.address === selectToken,
        })}
        onClick={() => setSelectToken(item.address)}
      >
        <SingleTokenShow tokenNameOne={item.name} isBold />
        <OptionLiChoose />
      </li>
    ))
  ) : (
    <></>
  );

  const noOptionToken = (
    <div className={'noOptionToken'}>
      <NoOptionToken />
      <p>
        <Trans>No option Token</Trans>
      </p>
    </div>
  )

  useEffect(() => {
    if (chainId && account && library) {
      var cache = localStorage.getItem(
        "optionTokensList" + chainId?.toString()
      );
      const optionTokenList = cache ? JSON.parse(cache) : [];
      setOptionTokenList(optionTokenList);
    }
  }, [chainId, account, library]);

  const optionTokenContracts = useMemo(
    () =>
      optionTokenList
        .reverse()
        .map((item: any) => FortOptionToken(item.address)),
    [optionTokenList]
  );
  const isOptionTokenContracts = optionTokenContracts.length > 0 ? true : false
  useEffect(() => {
    if (!chainId) {
      return;
    }
    if (selectToken) {
      const tokenName: string = optionTokenList.filter(
        (item: any) => selectToken === item.address
      )[0].name;
      const selectTokenContract = optionTokenContracts.filter(
        (item: any) => selectToken === item.address
      )[0];
      setCloseButtonDis(true);
      (async () => {
        const tokenInfo = await selectTokenContract?.getOptionInfo();
        const balance: BigNumber = await selectTokenContract?.balanceOf(
          account
        );
        const latestBlock = await library?.getBlockNumber();
        const endBlock = BigNumber.from(tokenInfo[3]);
        var subBlock: BigNumber = BigNumber.from(0);
        var nowTime = 0;
        var fortAmount = BigNumber.from("0");
        // TODO:删除测试代码----
        const blockPrice = await nestPriceContract?.latestPriceView(tokenList["USDT"].addresses[chainId])
        if (Boolean(tokenInfo[2])) {
          fortAmount = blockPrice[1]
            .sub(BigNumber.from(tokenInfo[1]))
            .mul(balance)
            .div(getBaseBigNumber(6));
        } else {
          fortAmount = BigNumber.from(tokenInfo[1])
            .sub(blockPrice[1])
            .mul(balance)
            .div(getBaseBigNumber(6));
        }
        // TODO:删除测试代码----//

        if (BigNumber.from(latestBlock?.toString()).gt(endBlock)) {
          // TODO:恢复正式代码
          // const blockPrice = await nestPriceContract?.findPrice(tokenList['USDT'].addresses[chainId], endBlock.toString())
          // if (Boolean(tokenInfo[2])) {
          //     fortAmount = (BigNumber.from(blockPrice[1]).sub(BigNumber.from(tokenInfo[1]))).mul(balance).div(getBaseBigNumber(6))
          // } else {
          //     fortAmount = (BigNumber.from(tokenInfo[1])).sub(BigNumber.from(blockPrice[1])).mul(balance).div(getBaseBigNumber(6))
          // }
          subBlock = BigNumber.from(latestBlock).sub(endBlock);
          nowTime = moment().valueOf() - subBlock.mul(13000).toNumber();
        } else {
          subBlock = endBlock.sub(BigNumber.from(latestBlock));
          nowTime = moment().valueOf() + subBlock.mul(13000).toNumber();
        }

        if (fortAmount.lte(BigNumber.from('0'))) {
          fortAmount = BigNumber.from('0')
        }

        const newOptionInfo: OptionsInfo = {
          fortAmount: fortAmount,
          optionTokenAmount: BigNumber.from(balance),
          optionToken: selectTokenContract?.address || "",
          optionTokenName: tokenName,
          type: tokenInfo[2],
          strikePrice: BigNumber.from(tokenInfo[1]),
          exerciseTime: moment(nowTime).format("YYYY[-]MM[-]DD HH:mm:ss"),
          blockNumber: endBlock,
        };
        setLatestBlock(latestBlock || 0);
        setOptionInfo(newOptionInfo);
        const buttonStatus = () => {
          // 检查区块，fort数量，余额
          if (((latestBlock || 0) > endBlock.toNumber()) && newOptionInfo.fortAmount.gt(BigNumber.from('0')) && BigNumber.from(balance).gt(BigNumber.from('0'))) {
            return false
          }
          return true
        }
        setCloseButtonDis(buttonStatus());
      })();
    } else {
      if (optionTokenContracts.length > 0 && optionTokenContracts[0]) {
        setSelectToken(optionTokenContracts[0].address);
      }
    }
  }, [account, library, selectToken, optionTokenContracts, optionTokenList, chainId, nestPriceContract]);

  const addToken = useCallback(() => {
    var cache = localStorage.getItem("optionTokensList" + chainId?.toString());
    var optionTokenList = cache ? JSON.parse(cache) : [];
    const newTokenAddress = addAddressValue;
    
    if (optionTokenList.length > 0 &&
      optionTokenList.filter(
        (item: { address: string }) => item.address === newTokenAddress
      ).length !== 0
    ) {
      message.error(t`Option Token add failed`);
      return;
    }
    const newTokenContract = new Contract(newTokenAddress, ERC20ABI, library);
    (async () => {
      try {
        const newTokenName = await newTokenContract?.name();
        const optionToken = { address: newTokenAddress, name: newTokenName };
        const newOptionTokenList = [...optionTokenList, optionToken];
        localStorage.setItem(
          "optionTokensList" + chainId?.toString(),
          JSON.stringify(newOptionTokenList)
        );
        setOptionTokenList(newOptionTokenList);
        message.success(t`Option Token add success`);
      } catch {
        message.error(t`Option Token add failed`);
      }
    })();
  }, [addAddressValue, chainId, library]);

  const addTokenView = (
    <div className={`${classPrefix}-leftCard-addToken-addTokenView`}>
      <input
        placeholder={t`Input`}
        value={addAddressValue}
        onChange={(e) => setAddAddressValue(formatInputAddress(e.target.value))}
      />
      <button onClick={addToken}>Add</button>
    </div>
  );

  return (
    <div className={classPrefix}>
      <MainCard classNames={`${classPrefix}-leftCard`}>
        <p className={`${classPrefix}-leftCard-title`}>
          {isOptionTokenContracts ? (<Trans>Option Token held</Trans>) : null}
        </p>
        {isOptionTokenContracts ? (
        <ul>{routes}</ul>
        ) : noOptionToken}
        <div className={`${classPrefix}-leftCard-addToken`}>
          {showAddButton ? (
            addTokenView
          ) : (
            <button onClick={() => setShowAddButton(true)}>
              <Trans>+ Add option Token</Trans>
            </button>
          )}
        </div>
      </MainCard>
      <MainCard classNames={`${classPrefix}-rightCard`}>
        <div className={`${classPrefix}-rightCard-topInfo`}>
          <LineShowInfo
            leftText={t`Type`}
            rightText={
              optionInfo?.type
                ? t`ETH call option Token`
                : (isOptionTokenContracts ? t`ETH put option Token` : '----') 
            }
          />
          <LineShowInfo
            leftText={t`Number of Option Token`}
            rightText={
              optionInfo
                ? bigNumberToNormal(optionInfo.optionTokenAmount)
                : "--.--"
            }
          />
          <LineShowInfo
            leftText={t`Strike price`}
            rightText={
              optionInfo
                ? bigNumberToNormal(
                    optionInfo.strikePrice,
                    tokenList["USDT"].decimals
                  )
                : "--.--"
            }
          />
          <LineShowInfo
            leftText={t`Exercise time`}
            rightText={optionInfo ? optionInfo.exerciseTime : "----"}
          />
          <LineShowInfo
            leftText={t`Block number`}
            rightText={optionInfo ? optionInfo.blockNumber.toString() : "----"}
          />
          <div className={`${classPrefix}-rightCard-topInfo-lastAddress`}>
            <LineShowInfo
              leftText={t`Contract address`}
              rightText={
                optionInfo
                  ? showEllipsisAddress(optionInfo.optionToken)
                  : "----"
              }
            />
            <button
              className={"copyButton"}
              onClick={() => {
                copy(optionInfo ? optionInfo.optionToken : "");
                message.success(t`Copied`);
              }}
            >
              <CopyIcon />
            </button>
          </div>
        </div>
        <div className={`${classPrefix}-rightCard-bottomInfo`}>
          <p className={`${classPrefix}-rightCard-bottomInfo-title`}>
            <Trans>Expected get after close</Trans>
          </p>
          <TokenFORTBig />
          <div className={`${classPrefix}-rightCard-bottomInfo-fortNum`}>
            <div
              className={`${classPrefix}-rightCard-bottomInfo-fortNum-value`}
            >
              {/* TODO:恢复正式代码 */}
              {bigNumberToNormal(
                optionInfo?.fortAmount || BigNumber.from("0"),
                18,
                6
              )}
              {/* {latestBlock > (optionInfo?.blockNumber || 0) ? bigNumberToNormal(optionInfo?.fortAmount || BigNumber.from('0')) : '---'} */}
              <span
                className={`${classPrefix}-rightCard-bottomInfo-fortNum-name`}
              >
                DCU
              </span>
            </div>
          </div>
          <div className={`${classPrefix}-rightCard-bottomInfo-buttonDiv`}>
            {((latestBlock > (optionInfo?.blockNumber || 0)) || !isOptionTokenContracts) ? (
              <></>
            ) : (
              <p>
                <Trans>
                  The Option Token has not reached the exercise time
                </Trans>
              </p>
            )}
            {/* TODO:恢复正式代码 */}
            <MainButton
              disable={closeButtonDis ? false : false}
              onClick={() => props.reviewCall(optionInfo!, false)}
            >
              <Trans>Close</Trans>
            </MainButton>
            {/* <MainButton disable={closeButtonDis} onClick={() => !closeButtonDis ? props.reviewCall(optionInfo!, false) : null}><Trans>Close</Trans></MainButton> */}
          </div>
        </div>
      </MainCard>
    </div>
  )
};

export default CloseOptions;
