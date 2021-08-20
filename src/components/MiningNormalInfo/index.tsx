import { FC } from 'react'
import './styles'

type Props = {
    topTitle?: string
    middleTitle?: string
    bottomTitle?: string
}

const MiningNormalInfo: FC<Props> = ({...props}) => {
    const miningNormalInfo = 'miningNormalInfo'
    return (
        <div className={`${miningNormalInfo}`}>
            <p>{props.topTitle}</p>
            <p>{props.middleTitle}</p>
            <p>{props.bottomTitle}</p>
        </div>
    )
}

export default MiningNormalInfo
