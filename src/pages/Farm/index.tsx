import { FC } from "react";
import { FarmCard } from "./FarmCard";
import "./styles";

const Farm: FC = () => {
  const classPrefix = "farm";
  const farms = [
    { name: "DCU", time: 1 },
    { name: "DCU", time: 2 },
    { name: "DCU", time: 24 },
    { name: "USDT", time: 1 },
    { name: "USDT", time: 2 },
    { name: "USDT", time: 3 },
  ].map((item) => {
    return (
      <li key={item.name + item.time.toString()}>
        <FarmCard name={item.name} time={item.time} />
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
