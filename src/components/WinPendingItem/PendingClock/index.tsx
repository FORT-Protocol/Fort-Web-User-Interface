import { FC, useEffect } from "react";
import "./styles";

type PendingClockType = {
  leftTime: number;
  allTime: number;
}

const PendingClock:FC<PendingClockType> = ({...props}) => {
  const classPrefix = "pendingClock";

  useEffect(() => {
    const du = 360 - props.leftTime / props.allTime * 360 + (-90)
    console.log(props.leftTime)
    console.log(du)
    var canvas = document.getElementById("topClock") as any;
    var cv = canvas?.getContext("2d");
    cv.clearRect(0,0,34,34);
    cv.beginPath();
    cv.moveTo(17, 17);
    cv.arc(17, 17, 17, (du * Math.PI) / 180, (270 * Math.PI) / 180);
    cv.fillStyle = "#80C269";
    cv.fill();
  }, [props.allTime, props.leftTime])
  return (
    <div className={classPrefix}>
      {/* <div className={`${classPrefix}-top`}> */}
      <canvas id='topClock' width={`34px`} height={`34px`}>
        Your browser does not support the canvas element.
      </canvas>
      </div>
    // </div>
  );
};

export default PendingClock;
