import { FC } from 'react'
import { ProblemIcon } from '../Icon'
import { Popover } from 'antd';
import './styles'
import { Trans } from '@lingui/macro';

type Props = {
    leftText: string,
    rightText: string
}

const LineShowInfo: FC<Props> = ({...props}) => {
    const classPrefix = 'lineShowInfo'
    return (
        <div className={classPrefix}>
            <p className={`${classPrefix}-leftText`}>{props.leftText}</p>
            <p className={`${classPrefix}-rightText`}>{props.rightText}</p>
        </div>
    )
}

export const LineShowInfoForOracleFee: FC<Props> = ({...props}) => {
    const classPrefix = 'lineShowInfo'
    const content = (
        <div className={`${classPrefix}-content`}>
            <p><Trans>Oracle Fee is what you pay to the NEST protocol for providing accurate 
market price data to the smart contract.</Trans></p>
        </div>
    )
    return (
        <div className={classPrefix}>
            <p className={`${classPrefix}-leftText`}>
                {props.leftText}
                <Popover placement="rightTop" title={''} content={content} trigger="hover" arrowPointAtCenter>
                    <button><ProblemIcon/></button>
                </Popover>
                </p>
            <p className={`${classPrefix}-rightText`}>{props.rightText}</p>
        </div>
    )
}

export default LineShowInfo
