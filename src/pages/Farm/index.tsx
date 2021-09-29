import { BigNumber } from "@ethersproject/bignumber";
import { FC } from "react";
import { FarmCard } from "./FarmCard";
import "./styles";

const baseTotal = BigNumber.from('1000000000000000000')

const Farm: FC = () => {
  const classPrefix = "farm";
  const farms = [
    { name: "NEST", time: 24, total: BigNumber.from('30000000').mul(baseTotal) },
    { name: "NEST", time: 1, total: BigNumber.from('2000000').mul(baseTotal) },
    { name: "CoFi", time: 1, total: BigNumber.from('2000000').mul(baseTotal) },
    { name: "FOR", time: 1, total: BigNumber.from('2000000').mul(baseTotal) },
    { name: "NHBTC", time: 1, total: BigNumber.from('2000000').mul(baseTotal) },
    { name: "PUSD", time: 1, total: BigNumber.from('2000000').mul(baseTotal) },
  ].map((item) => {
    return (
      <li key={item.name + item.time.toString()}>
        <FarmCard name={item.name} time={item.time} total={item.total}/>
      </li>
    );
  });
  return (
    <div className={classPrefix}>
      {/* <div className={`${classPrefix}-circleInfo`}>
                <div className={`${classPrefix}-circleInfo-one`}>
                    <p className={`${classPrefix}-circleInfo-value`}>$ 2,037,482</p>
                    <p><Trans>FORT Price</Trans></p>
                </div>
                <div className={`${classPrefix}-circleInfo-two`}>
                    <p className={`${classPrefix}-circleInfo-value`}>$ 0.7654</p>
                    <p><Trans>FORT Price</Trans></p>
                </div>
                <div className={`${classPrefix}-circleInfo-three`}>
                    <p className={`${classPrefix}-circleInfo-value`}>1,038,294</p>
                    <p><Trans>Fort Current</Trans></p>
                </div>
                <div className={`${classPrefix}-circleInfo-four`}>
                    <p className={`${classPrefix}-circleInfo-value`}>3,674,921</p>
                    <p><Trans>Fort Mine</Trans></p>
                </div>
            </div> */}
      <ul>{farms}</ul>
    </div>
  );
};

export default Farm;
