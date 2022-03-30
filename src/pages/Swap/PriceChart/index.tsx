import { Area } from '@ant-design/plots';
import {useEffect, useState} from "react";
import {useDate} from "../../../libs/hooks/useDate";

const PriceChart = () => {
  const [data, setData] = useState([]);
  const { today, aMonthAgo } = useDate()

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    const JWT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxIiwic3ViIjoiYWRtaW4xMjMiLCJpYXQiOjE2NDMxNzY0NDksImlzcyI6ImFkbWluMTIzIiwiZXhwIjoxOTU4NTM2NDQ5LCJsZXZlbCI6ImFkbWluIiwicm9sZXMiOltdLCJtb2JpbGUiOiIxNTg5NzgzMDQxNCIsInVzZXJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluMTIzIn0.U9Obn_JybKpczWJ2VibAxNX-mHoMmP3eQPElNIf2QLM'

    fetch(`https://work.parasset.top/workbench-api/futures/DCUPrice?from=${aMonthAgo}&to=${today}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JWT_TOKEN
      },
    })
      .then((response) => response.json())
      .then((json) => setData(json.data))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  const config = {
    data,
    xField: 'time',
    yField: 'price',
    color: '#0061FF',
    line: {
      size: 2,
      color: '#0061FF',
    },
    yAxis: {
      // label: null,
      grid: null,
      line: null,
      tickCount: 3,
      tickLine: null,
      min: 0.22
    },
    xAxis: {
      nice: true,
      title: null,
      tickCount: 15,
      line: null,
      grid: null,
      tickLine: null,
      label: {
        formatter: (item: string) => item.slice(8, 10)
      },
      annotations: [
        {
          type: 'text',
          position: ['min', 'median'],
          content: '中位数',
          offsetY: -4,
          style: {
            textBaseline: 'bottom',
          },
        },
        {
          type: 'line',
          start: ['min', 'median'],
          end: ['max', 'median'],
          style: {
            stroke: 'red',
            lineDash: [2, 2],
          },
        },
      ],
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#8BB7FF 1:#0061FF',
      };
    },
    meta: {
      price: {
        alias: "1 DCU"
      }
    }
  };

  return (
    <div style={{ height: '160px' }}>
      <Area {...config} />
    </div>
  )
}

export default PriceChart