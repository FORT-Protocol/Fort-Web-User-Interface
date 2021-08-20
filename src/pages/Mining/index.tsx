import { FC } from 'react'
import MainButton from '../../components/Button/MainButton'
import InfoView, { InfoShowType } from '../../components/InfoView'
import MiningCircle from '../../components/MiningCircle'
import MiningNormalInfo from '../../components/MiningNormalInfo'
import RadioGroupFort from '../../components/RadioGroupFort'
import './styles'

const Mining: FC = () => {
    const mining = 'mining'
    return (
        <div className={`${mining}`}>
            <div className={`${mining}-info`}>
                <MiningCircle titleOne={'$ 2.03748'} titleTwo={'FORT Price'} className={'left'}></MiningCircle>
                <MiningCircle titleOne={'1,067,479'} titleTwo={'FORT Current'} className={'middle'}></MiningCircle>
                <MiningCircle titleOne={'3,564,766'} titleTwo={'FORT Mine'} className={'right'}></MiningCircle>
            </div>
            <div className={`${mining}-top`}>
                <p className={`${mining}-top-title`}>质押挖矿</p>
                <p className={`${mining}-top-text`}>用户向合约打入 NEST 质押，即可挖矿获得 FORT，质押周期分为3个月、6个月、4年，质押结束后可取出 NEST，质押挖矿从区块203943848（约6/23 12:00 ）开始，持续 7 天在区块 203943848（约6/30 12:00）结束，共释放 75,000,000 枚 FORT</p>
                <div className={`${mining}-top-squareInfo`}>
                    <MiningNormalInfo topTitle={'NEST'} middleTitle={'234234325'} bottomTitle={'当前总抵押'}/>
                    <MiningNormalInfo topTitle={'NEST'} middleTitle={'234234325'} bottomTitle={'当前总抵押'}/>
                    <MiningNormalInfo topTitle={'NEST'} middleTitle={'234234325'} bottomTitle={'当前总抵押'}/>
                    <MiningNormalInfo topTitle={'NEST'} middleTitle={'234234325'} bottomTitle={'当前总抵押'}/>
                </div>
                <hr/>
                <div className={`${mining}-top-morTime`}>
                    <p>质押时间</p>
                    <RadioGroupFort/>
                </div>
                <InfoView leftTitle={'质押金额'} 
                          rightTitle={'钱包余额：234534 NEST'} 
                          leftText={'请输入'}
                          leftType={InfoShowType.InputInfo}
                          rightText={'NEST'}/>
                <div className={`${mining}-top-doubleButton`}>
                    <MainButton title={'授权'} className={'mining'}/>
                    <MainButton title={'挖矿'} className={'mining'} disable/>
                </div>
                <hr/>
                <p className={`${mining}-top-title-two`}>我的奖励</p>
                <div className={`${mining}-top-squareInfo-two`}>
                    <MiningNormalInfo topTitle={'NEST'} middleTitle={'234234325'} bottomTitle={'当前总抵押'}/>
                    <MiningNormalInfo topTitle={'NEST'} middleTitle={'234234325'} bottomTitle={'当前总抵押'}/>
                    <MiningNormalInfo topTitle={'NEST'} middleTitle={'234234325'} bottomTitle={'当前总抵押'}/>
                </div>
                <div className={`${mining}-top-morTime`}>
                    <p>质押时间</p>
                    <RadioGroupFort/>
                </div>
                <div className={`${mining}-top-doubleButton`}>
                    <MainButton title={'领取FORT'} className={'mining'}/>
                    <MainButton title={'取回NEST'} className={'mining'} disable/>
                </div>
            </div>
        </div>
    )
}

export default Mining