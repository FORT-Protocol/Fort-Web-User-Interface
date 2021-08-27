import classNames from 'classnames'
import { FC } from 'react'
import { tokenList } from '../../libs/constants/addresses'
import './styles'

type SingleProps = {
    tokenNameOne: string,
}

export const SingleTokenShow: FC<SingleProps> = ({...props}) => {
    const classPrefix = 'TokenShow'
    const TokenOneSvg = tokenList[props.tokenNameOne].Icon
    return (
        <div className={classPrefix}>
            <TokenOneSvg/>
            <p className={`${classPrefix}-text`}>{tokenList[props.tokenNameOne].symbol}</p>
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


