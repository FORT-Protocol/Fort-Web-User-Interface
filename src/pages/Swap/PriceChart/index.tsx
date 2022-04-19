import {Area} from '@ant-design/plots';
import {useCallback, useEffect, useState} from "react";
import {useDate} from "../../../libs/hooks/useDate";

const PriceChart = () => {
    const [data, setData] = useState([]);
    const {today, threeDayAgo} = useDate()
    
    const asyncFetch = useCallback(() => {
        const JWT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxIiwic3ViIjoiYWRtaW4xMjMiLCJpYXQiOjE2NDMxNzY0NDksImlzcyI6ImFkbWluMTIzIiwiZXhwIjoxOTU4NTM2NDQ5LCJsZXZlbCI6ImFkbWluIiwicm9sZXMiOltdLCJtb2JpbGUiOiIxNTg5NzgzMDQxNCIsInVzZXJpZCI6IjEiLCJ1c2VybmFtZSI6ImFkbWluMTIzIn0.U9Obn_JybKpczWJ2VibAxNX-mHoMmP3eQPElNIf2QLM'
        
        fetch(`https://work.parasset.top/workbench-api/futures/preMinute/DCUPrice?from=${threeDayAgo}&to=${today}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JWT_TOKEN
            },
        })
            .then((response) => response.json())
            .then((json) => setData(json.data.slice(-2880)))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    }, [threeDayAgo, today])
    
    useEffect(() => {
      asyncFetch()
    }, [asyncFetch]);
    
    useEffect(()=>{
      setInterval(asyncFetch, 60 * 1000)
    }, [asyncFetch])
    
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
            tickCount: 2,
            tickLine: null,
            // min: 0
        },
        xAxis: {
            nice: true,
            title: null,
            tickCount: 12,
            line: null,
            grid: null,
            tickLine: null,
            label: {
                formatter: (item: string) => new Date(item).getHours()
            },
        },
        areaStyle: () => {
            return {
                fill: 'l(270) 0:#8BB7FF 1:#0061FF',
            };
        },
        meta: {
            price: {
                alias: "DCU/USDT"
            },
            time: {
                formatter: (item: string)=>{
                  return item.replace('T', ' ')
                }
            }
        }
    };
    
    return (
        <div style={{height: '160px'}}>
            <Area {...config} />
        </div>
    )
}

export default PriceChart