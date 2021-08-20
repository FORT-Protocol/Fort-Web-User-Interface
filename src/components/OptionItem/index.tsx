import classNames from 'classnames'
import { FC } from 'react'
import { tokenList } from '../../libs/constants/addresses'
import MainButton from '../Button/MainButton'
import './styles'

type Props = {
    icon?: string,
    pairName?: string,
    pair?: string,
    num?: string,
    price?: string,
    time?: string,
    block?: string,
    money?: string,
    address?: string,
    doit?: boolean,
    isTitle?: boolean
}

const OptionItem: FC<Props> = ({...props}) => {
    const optionItem = 'optionItem'
    var timeView
    var doitView
    var tokenSvg
    var addressString
    if (props.isTitle) {
        timeView = (
            <div className={`${optionItem}-time`}>{props.time}</div>
        )
        doitView = (
            <div className={`${optionItem}-doit`}>{props.block}</div>
        )
        tokenSvg = (
            <div className={`${optionItem}-icon`}></div>
        )
        addressString = props.address
    } else {
        timeView = (
            <div className={`${optionItem}-time`}>
                <div className={`${optionItem}-time-span`}>{props.time}</div>
                <div className={`${optionItem}-time-block`}>{props.block}</div>
            </div>
        )
        var buttonView
        if (props.doit) {
            buttonView = <MainButton title={'结算'} className={'over'}/>
        } else {
            buttonView = <MainButton title={'已过期'} className={'over'} disable/>
        }
        doitView = (
            <div className={`${optionItem}-doit`}>
                {buttonView}
            </div>
        )
        const TokenIcon = tokenList['ETH'].Icon
        tokenSvg = (
            <div className={`${optionItem}-icon`}>
                <TokenIcon />
            </div>
        )
        addressString = props.address!.substr(0, 6) + '....' + props.address!.substr(props.address!.length - 4, 4)
    }
    return (
        <div className={classNames({
            [`${optionItem}`]: true,
            [`isTitle`]: props.isTitle
        })}>
            {tokenSvg}
            <div className={`${optionItem}-pairName`}>{props.pairName}</div>
            <div className={`${optionItem}-pair`}>{props.pair}</div>
            <div className={`${optionItem}-num`}>{props.num}</div>
            <div className={`${optionItem}-price`}>{props.price}</div>
            {timeView}
            <div className={`${optionItem}-money`}>{props.money}</div>
            <div className={`${optionItem}-address`}>{addressString}</div>
            {doitView}
        </div>
    )
}

export default OptionItem
