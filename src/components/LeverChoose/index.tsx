import { Trans } from '@lingui/macro'
import classNames from 'classnames'
import { FC } from 'react'
import './styles'

type Props = {
    callBack: (selected: number) => void
    selected: number
}

export const LeverChoose: FC<Props> = ({...props}) => {
    const classPrefix = 'leverChoose'
    const liList = [
        {text: '1X', value: 1},
        {text: '2X', value: 2},
        {text: '3X', value: 3},
        {text: '4X', value: 4},
        {text: '5X', value: 5},
    ].map((item, index) => {
        return <li 
                key={index.toString() + item.text} 
                className={classNames({
                    [`selected`]: props.selected === item.value ? true : false
                })} 
                onClick={() => {props.callBack(item.value)}}>{item.text}</li>
    })
    return (
        <div className={classPrefix}>
            <div className={`${classPrefix}-title`}><Trans>Leverage</Trans></div>
            <ul className={`${classPrefix}-choose`}>
                {liList}
            </ul>
        </div>
    )
}
