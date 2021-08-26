import { FC } from 'react'
import InfoShow from '../../components/InfoShow'
import MainCard from '../../components/MainCard'
import { t, Trans } from '@lingui/macro'
import './styles'
import { ExchangeIcon } from '../../components/Icon'
import MainButton from '../../components/MainButton'
import LineShowInfo from '../../components/LineShowInfo'
import { SingleTokenShow } from '../../components/TokenShow'

const Lever: FC = () => {
    const classPrefix = 'lever'
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-card`}>
                <InfoShow topLeftText={t`From`} bottomRightText={t`Balance:230.000 FORT`}>
                    <SingleTokenShow tokenNameOne={'FORT'}/>
                </InfoShow>
                <button className={`${classPrefix}-card-exchangeButton`}><ExchangeIcon/></button>
                <InfoShow topLeftText={t`Expected get`} bottomRightText={t`Balance: 240,000 Margin-ETH2L`}></InfoShow>
                <LineShowInfo leftText={t`Current price`} rightText={t`1 ETH = 2364.575869 USDT`}/>
                <MainButton className={`${classPrefix}-card-buyButton`}><Trans>BUY</Trans></MainButton>
            </MainCard>
        </div>
    )
}

export default Lever