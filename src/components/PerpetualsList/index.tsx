import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { useFortLeverSell } from '../../contracts/hooks/useFortLeverTransation'
import { tokenList } from '../../libs/constants/addresses'
import { bigNumberToNormal } from '../../libs/utils'
import { LeverListType } from '../../pages/Perpetuals'
import { LongIcon, ShortIcon } from '../Icon'
import MainButton from '../MainButton'

type Props = {
    item: LeverListType,
    key: string,
    className: string
}

const PerpetualsList: FC<Props> = ({...props}) => {
    const tokenName = () => {
        if (props.item.tokenAddress === '0x0000000000000000000000000000000000000000') {
            return 'ETH'
        }
        return 'ETH'
    }
    const TokenOneSvg = tokenList[tokenName()].Icon
    const TokenTwoSvg = tokenList['USDT'].Icon
    const active = useFortLeverSell(props.item.index, props.item.balance)
    return (
        <tr key={props.key} className={`${props.className}-table-normal`}>
            <td className={'tokenPair'}><TokenOneSvg/><TokenTwoSvg/></td>
            <td>
                {props.item.orientation ? (<LongIcon/>) : (<ShortIcon/>)}
            </td>
            <td>{props.item.lever.toString()}X</td>
            <td>{bigNumberToNormal(props.item.balance, 18, 2)} DCU</td>
            <td>{bigNumberToNormal(props.item.price, tokenList['USDT'].decimals, 2)} USDT</td>
            <td>{bigNumberToNormal(props.item.price, tokenList['USDT'].decimals, 2)} USDT</td>
            <td>30%</td>
            <td><MainButton onClick={active}><Trans>Close</Trans></MainButton></td>
        </tr>
    )
}

export default PerpetualsList
