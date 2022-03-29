import { Line } from '@ant-design/plots';
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
    color: '#0061FF',
    xField: 'time',
    yField: 'price',
    yAxis: {
      title: {
        text: 'Trading Price of DCU',
      },
      nice: true,
      tickCount: 4,
      min: 0.2
    },
    xAxis: {
      nice: true,
      title: null,
      tickCount: 4,
      label: {
        formatter: (item: string) => item.slice(0, 10)
      }
    },
    meta: {
      price: {
        alias: "1 DCU"
      }
    }
  };

  return (
    <div style={{ height: '200px' }}>
      <Line {...config} />
    </div>
  )
}

export default PriceChart