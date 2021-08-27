import { t, Trans } from '@lingui/macro'
import { FC, useState } from 'react'
import ChooseType from '../../../components/ChooseType'
import { PutDownIcon } from '../../../components/Icon'
import InfoShow from '../../../components/InfoShow'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import { DoubleTokenShow, SingleTokenShow } from '../../../components/TokenShow'
import './styles'

const MintOptions: FC = () => {
    const classPrefix = 'options-mintOptions'
    const [fortValue, setFortValue] = useState('198,365.88')
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-leftCard`}>
                <InfoShow topLeftText={t`Token pair`} bottomRightText={''}>
                    <DoubleTokenShow tokenNameOne={'USDT'} tokenNameTwo={'ETH'}/>
                    <button className={'select-button'}><PutDownIcon/></button>
                </InfoShow>
                <ChooseType/>
                <InfoShow topLeftText={t`Exercise time`} bottomRightText={'Block number: 29392617'}>
                    <input className={'input-left'} value={fortValue} readOnly/>
                    <button className={'select-button'}><PutDownIcon/></button>
                </InfoShow>
                <InfoShow topLeftText={t`Strike price`} bottomRightText={'1 ETH = 3000 USDT'}>
                    <input className={'input-left'} value={fortValue} onChange={(e) => setFortValue(e.target.value)}/>
                    <span>USDT</span>
                </InfoShow>
                <InfoShow topLeftText={t`Mint amount`} bottomRightText={'Balance: 20,000 FORT'}>
                    <SingleTokenShow tokenNameOne={'FORT'}/>
                    <button className={'max-button'}>MAX</button>
                </InfoShow>
            </MainCard>

            <MainCard classNames={`${classPrefix}-rightCard`}>
                <p className={`${classPrefix}-rightCard-tokenTitle`}><Trans>Estimated number of European Options Token</Trans></p>
                <p className={`${classPrefix}-rightCard-tokenValue`}>21.7876574</p>
                <p className={`${classPrefix}-rightCard-tokenName`}>ETH-Call3000-38721293823</p>
                <MainButton>BUY</MainButton>
                <div className={`${classPrefix}-rightCard-time`}>
                    <p className={`${classPrefix}-rightCard-timeTitle`}><Trans>Compare the spot price with the Srike price at</Trans></p>
                    <p className={`${classPrefix}-rightCard-timeValue`}>2021-10-02 09:34</p>
                </div>
                
                <div className={`${classPrefix}-rightCard-smallCard`}>
                    <MainCard>
                        <div className={`${classPrefix}-rightCard-smallCard-title`}>
                            <p><Trans>{'Spot price > 1,000,000'}</Trans></p>
                            <p><Trans>Expected get</Trans></p>
                        </div>
                        <p className={`${classPrefix}-rightCard-smallCard-value`}>10,000,000,00</p>
                        <p className={`${classPrefix}-rightCard-smallCard-name`}>FORT</p>
                    </MainCard>
                    <MainCard>
                        <div className={`${classPrefix}-rightCard-smallCard-title`}>
                            <p><Trans>{'Spot price <= 1,000,000'}</Trans></p>
                            <p><Trans>Expected get</Trans></p>
                        </div>
                        <p className={`${classPrefix}-rightCard-smallCard-value`}>10,000,000,00</p>
                        <p className={`${classPrefix}-rightCard-smallCard-name`}>FORT</p>
                    </MainCard>
                </div>
            </MainCard>
        </div>
    )
}

export default MintOptions