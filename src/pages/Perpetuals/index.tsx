import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { FC, useState } from 'react'
import ChooseType from '../../components/ChooseType'
import { HoldLine } from '../../components/HoldLine'
import { LongIcon, PutDownIcon, ShortIcon } from '../../components/Icon'
import InfoShow from '../../components/InfoShow'
import { LeverChoose } from '../../components/LeverChoose'
import MainButton from '../../components/MainButton'
import MainCard from '../../components/MainCard'
import { DoubleTokenShow, SingleTokenShow } from '../../components/TokenShow'
import { tokenList } from '../../libs/constants/addresses'
import { bigNumberToNormal, formatInputNum, normalToBigNumber } from '../../libs/utils'
import './styles'

const Perpetuals: FC = () => {
    const [isLong, setIsLong] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dcuBalance, setDcuBalance] = useState<BigNumber>()
    const [dcuInput, setDcuInput] = useState<string>('')
    const classPrefix = 'perpetuals'
    const handleType = (isLong: boolean) => {
        setIsLong(isLong);
    };
    const trList = [
        {token:'USDT', type: true, lever:2, guarantee: BigNumber.from('1000200000000000000000'), positioning: BigNumber.from('1000000000'), price: BigNumber.from('1000000000')},
        {token:'USDT', type: false, lever:3, guarantee: BigNumber.from('1000300000000000000000'), positioning: BigNumber.from('1000000000'), price: BigNumber.from('1000000000')},
        {token:'USDT', type: true, lever:4, guarantee: BigNumber.from('1000040000000000000000'), positioning: BigNumber.from('1000000000'), price: BigNumber.from('1000000000')},
    ].map((item, index) => {
        const TokenOneSvg = tokenList['ETH'].Icon
        const TokenTwoSvg = tokenList[item.token].Icon

        return (
            <tr key={index} className={`${classPrefix}-table-normal`}>
                <td className={'tokenPair'}><TokenOneSvg/><TokenTwoSvg/></td>
                <td>
                    {item.type ? (<LongIcon/>) : (<ShortIcon/>)}
                </td>
                <td>{item.lever.toString()}X</td>
                <td>{bigNumberToNormal(item.guarantee, 18, 2)} DCU</td>
                <td>{bigNumberToNormal(item.positioning, tokenList[item.token].decimals, 2)} DCU</td>
                <td>{bigNumberToNormal(item.price, tokenList[item.token].decimals, 2)} DCU</td>
                <td>30%</td>
                <td><MainButton><Trans>Close</Trans></MainButton></td>
            </tr>
        )
    })
    return (
        <div>
            <MainCard classNames={`${classPrefix}-card`}>
                <InfoShow topLeftText={t`Token pair`} bottomRightText={""}>
                    <div className={`${classPrefix}-card-tokenPair`}>
                        <DoubleTokenShow tokenNameOne={"ETH"} tokenNameTwo={"USDT"} />
                        <button className={"select-button"}>
                            <PutDownIcon />
                        </button>
                    </div>
                    <p>1 ETH = 42000,455733 USDT</p>
                </InfoShow>
                <ChooseType callBack={handleType} isLong={isLong} />
                <LeverChoose/>
                <InfoShow
                topLeftText={t`Mint amount`}
                bottomRightText={`Balance: ${dcuBalance ? bigNumberToNormal(dcuBalance) : '----'} DCU`}
                balanceRed={normalToBigNumber(dcuInput).gt(dcuBalance || BigNumber.from('0')) ? true : false}
                >
                <SingleTokenShow tokenNameOne={"DCU"} isBold />
                <input
                    placeholder={t`Input`}
                    className={"input-middle"}
                    value={dcuInput}
                    onChange={(e) => setDcuInput(formatInputNum(e.target.value))}
                    onBlur={(e: any) => {}}
                />
                <button
                    className={"max-button"}
                    onClick={() => setDcuInput(bigNumberToNormal(dcuBalance || BigNumber.from('0')))}
                >
                    MAX
                </button>
                </InfoShow>
                <MainButton 
                className={`${classPrefix}-card-button`} 
                onClick={() => {}}>
                    {isLong ? (<Trans>Long</Trans>) : (<Trans>Short</Trans>)}
                </MainButton>
            </MainCard>
            <HoldLine><Trans>Hold Options</Trans></HoldLine>
            <table>
                <tr className={`${classPrefix}-table-title`}>
                    <th>Token pair</th>
                    <th>Options Type</th>
                    <th>Leveraged Multiplier</th>
                    <th>Guarantee</th>
                    <th>Positioning</th>
                    <th>Liquidation Price</th>
                    <th>Current Yield</th>
                    <th>Operation</th>
                </tr>
                {trList}
            </table>
        </div>
        
    )
}

export default Perpetuals
