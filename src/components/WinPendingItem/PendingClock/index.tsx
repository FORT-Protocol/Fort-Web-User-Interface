import { FC, useEffect } from "react";
import { ClockPosition } from "../../Icon";
import "./styles";

type PendingClockType = {
  leftTime: number;
  allTime: number;
  index: number;
}

const PendingClock:FC<PendingClockType> = ({...props}) => {
  const classPrefix = "pendingClock";

  useEffect(() => {
    const du = 360 - props.leftTime / props.allTime * 360 + (-90)
    var canvas = document.getElementById(`topClock-${props.index}`) as any;
    var cv = canvas?.getContext("2d");
    cv.clearRect(0,0,34,34);
    cv.beginPath();
    cv.moveTo(17, 17);
    cv.arc(17, 17, 17, (du * Math.PI) / 180, (270 * Math.PI) / 180);
    cv.fillStyle = "#80C269";
    cv.fill();

    var canvas2 = document.getElementById(`position-${props.index}`);
    canvas2!.style.transform = `rotate(${du}deg)`;
    
  }, [props.allTime, props.index, props.leftTime])
  return (
    <div className={classPrefix}>
      <div id={`position-${props.index}`} className={`${classPrefix}-position`}><ClockPosition/></div>
      <canvas id={`topClock-${props.index}`} width={`34px`} height={`34px`}>
        {/* Your browser does not support the canvas element. */}
      </canvas>
    </div>
  );
};

export default PendingClock;
