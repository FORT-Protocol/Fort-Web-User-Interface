import { FC } from 'react'
import './styles'

type Props = {
    titleOne?: string,
    titleTwo?: string,
    className?: string
}

const MiningCircle: FC<Props> = ({...props}) => {
    const miningCircle = 'miningCircle'
    return (
        <div className={`${miningCircle}-${props.className}`}>
            <p>{props.titleOne}</p>
            <p>{props.titleTwo}</p>
        </div>
    )
}

export default MiningCircle
