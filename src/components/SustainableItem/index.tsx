import classNames from 'classnames'
import { FC } from 'react'
import MainButton from '../Button/MainButton'
import './styles'

type Props = {
    type?: string,
    isMore?: boolean
    pair?: string,
    money?: string,
    price?: string,
    num?: string,
    rate?: string,
    willGet?: string,
    willPrice?: string,
    doit?: String,
    isTitle?: boolean
}

export const SustainableItem: FC<Props> = ({...props}) => {
    const sustainableItem = 'sustainableItem'
    var doitView
    if (props.isTitle) {
        doitView = <div className={`${sustainableItem}-doit`}>{props.doit}</div>
    } else {
        doitView = (
            <div className={`${sustainableItem}-doit`}>
                <MainButton title={'平仓'} className={'over'}/>
                <MainButton title={'追加抵押'}className={'second'}/>
            </div>
        )
    }
    return (
        <div className={classNames({
            [`${sustainableItem}`]: true,
            [`isTitle`]: props.isTitle,
            [`isMore`]: props.isMore
        })}>
            <div className={`${sustainableItem}-type`}>{props.type}</div>
            <div className={`${sustainableItem}-pair`}>{props.pair}</div>
            <div className={`${sustainableItem}-money`}>{props.money}</div>
            <div className={`${sustainableItem}-price`}>{props.price}</div>
            <div className={`${sustainableItem}-num`}>{props.num}</div>
            <div className={`${sustainableItem}-rate`}>{props.rate}</div>
            <div className={`${sustainableItem}-willGet`}>{props.willGet}</div>
            <div className={`${sustainableItem}-willPrice`}>{props.willPrice}</div>
            {doitView}
        </div>
    )
}
