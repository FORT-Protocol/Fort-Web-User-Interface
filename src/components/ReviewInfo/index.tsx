import { FC } from 'react'
import './styles'

type Props = {
    title: string,
    value: string,
    name: string
}

const ReviewInfo: FC<Props> = ({...props}) => {
    const classPrefix = 'reviewInfo'
    return (
        <div className={classPrefix}>
            <p className={`${classPrefix}-title`}>{props.title}</p>
            <div className={`${classPrefix}-info`}>
                <p className={`${classPrefix}-info-value`}>{props.value}<span className={`${classPrefix}-info-name`}>{props.name}</span></p>
            </div>
        </div>
    )
}

export default ReviewInfo
