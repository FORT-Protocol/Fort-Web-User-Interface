import { FC } from 'react'
import './styles'

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

export default LineShowInfo
