import { FC } from 'react'
import './styles'
import { LongTypeNormal, LongTypeSelected, ShortTypeNormal, ShortTypeSelected } from '../Icon'

type Props = {
    callBack: (isLong: boolean) => void
    isLong: boolean
}

const ChooseType: FC<Props> = ({...props}) => {
    const classPrefix = 'chooseType'
    const leftIcon = props.isLong ? (<LongTypeSelected/>) : (<LongTypeNormal/>)
    const rightIcon = props.isLong ? (<ShortTypeNormal/>) : (<ShortTypeSelected/>)
    return (
        <div className={classPrefix}>
            <div onClick={() => props.callBack(true)}>{leftIcon}</div>
            <div onClick={() => props.callBack(false)}>{rightIcon}</div>
        </div>
    )
}

export default ChooseType
