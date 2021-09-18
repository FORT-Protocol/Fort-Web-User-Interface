import classNames from 'classnames'
import { FC } from 'react'
import { tokenList } from '../../libs/constants/addresses'
import { NormalTokenIcon } from '../Icon'
import './styles'

type SingleProps = {
    tokenNameOne: string,
    isBold?: boolean
}

export const SingleTokenShow: FC<SingleProps> = ({...props}) => {
    const classPrefix = 'TokenShow'
    const hadIcon = () => {
        for (let key in tokenList) {
            if (key === props.tokenNameOne) {
                return true
            }
        }
        return false
    }
    const TokenOneSvg = hadIcon() ? tokenList[props.tokenNameOne].Icon : NormalTokenIcon
    const showText = hadIcon() ? tokenList[props.tokenNameOne].symbol : props.tokenNameOne
    return (
        <div className={classPrefix}>
            <TokenOneSvg/>
            <p className={classNames({
                [`${classPrefix}-text`]: true,
                [`isBold`]: props.isBold
            })}>{showText}</p>
        </div>
    )
}


type DoubleProps = {
    tokenNameOne: string,
    tokenNameTwo: string
}

export const DoubleTokenShow: FC<DoubleProps> = ({...props}) => {
    const classPrefix = 'TokenShow'
    const TokenOneSvg = tokenList[props.tokenNameOne].Icon
    const TokenTwoSvg = tokenList[props.tokenNameTwo].Icon
    return (
        <div className={classPrefix}>
            <TokenOneSvg/>
            <TokenTwoSvg/>
            <p className={classNames({
                [`${classPrefix}-text`]: true,
                [`isBold`]: true
            })}>{tokenList[props.tokenNameOne].symbol + '/' + tokenList[props.tokenNameTwo].symbol}</p>
        </div>
    )
}


