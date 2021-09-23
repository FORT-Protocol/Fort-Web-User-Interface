import { BigNumber } from "@ethersproject/bignumber";
import { t } from "@lingui/macro";
import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import useWeb3 from "../../libs/hooks/useWeb3";
import OptionsReview from "../Review/OptionsReview";
import CloseOptions from "./Close";
import MintOptions from "./Mint";
import "./styles";

export type OptionsInfo = {
  fortAmount: BigNumber;
  optionTokenAmount: BigNumber;
  optionToken: string;
  optionTokenName: string;
  type: boolean;
  strikePrice: BigNumber;
  exerciseTime: string;
  blockNumber: BigNumber;
};

const Options: FC = () => {
  const {chainId} = useWeb3()
  const [review, setReview] = useState({
    isReview: false,
    isMint: true,
  });
  const [optionInfo, setOptionInfo] = useState<OptionsInfo>();
  const location = useLocation();
  const classPrefix = "options";
  const routes = [
    { path: "/options/mint", content: t`Mint` },
    { path: "/options/close", content: t`Close` },
  ].map((item) => (
    <li
      key={item.path}
      className={classNames({
        selected: location.pathname.indexOf(item.path) === 0,
      })}
    >
      <Link to={item.path}>{item.content}</Link>
    </li>
  ));
  const handleInfo = (info: OptionsInfo, isMint: boolean) => {
    setReview({ ...review, isReview: true, isMint: isMint });
    setOptionInfo(info);
  };
  useEffect(() => {
    if(review.isReview) {
      setReview({ ...review, isReview: false});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])
  return review.isReview ? (
    <OptionsReview
      back={() => setReview({ ...review, isReview: false })}
      isMint={review.isMint}
      optionsInfo={optionInfo}
    />
  ) : (
    <div className={classPrefix}>
      <ul className={`${classPrefix}-route`}>{routes}</ul>
      <Switch>
        <Route path="/options/mint" exact>
          <MintOptions reviewCall={handleInfo} />
        </Route>

        <Route path="/options/close" exact>
          <CloseOptions reviewCall={handleInfo} />
        </Route>

        <Redirect to="/options/mint" />
      </Switch>
    </div>
  );
};

export default Options;
