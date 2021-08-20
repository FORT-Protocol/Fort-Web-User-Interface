import { FC } from 'react'
import MainButton from '../../components/Button/MainButton'
import { PutDownIcon } from '../../components/Icon'
import InfoView, { InfoShowType } from '../../components/InfoView'
import { SustainableItem } from '../../components/SustainableItem'

import './styles'

const Sustainable: FC = () => {
    const sustainable = 'sustainable'
    const list = [
        ['看涨开多', true, 'ETH/USDT', '100 FORT', '1547.56 USDT', '2', '19%', '100 FORT', '1234.56 ETH/USDT'],
        ['看跌开空', false, 'ETH/USDT', '100 FORT', '1547.56 USDT', '1', '23%', '100 FORT', '1234.56 ETH/USDT'],
        ['看涨开多', true, 'ETH/USDT', '100 FORT', '1547.56 USDT', '2', '19%', '100 FORT', '1234.56 ETH/USDT'],
        ['看跌开空', false, 'ETH/USDT', '100 FORT', '1547.56 USDT', '1', '23%', '100 FORT', '1234.56 ETH/USDT'],
    ].map((item, index) => (
        <li key={index}>
            <SustainableItem type={String(item[0])} isMore={Boolean(item[1])} pair={String(item[2])} money={String(item[3])} price={String(item[4])} num={String(item[5])} rate={String(item[6])} willGet={String(item[7])} willPrice={String(item[8])}/>
        </li>
    ))

    return (
        <div className={`${sustainable}`}>
            <div className={`${sustainable}-top`}>
                <p className={`${sustainable}-title`}>永续合约</p>
                <InfoView leftTitle={'当前价'} 
                          rightTitle={'1 ETH = 1764.54 USDT'} 
                          leftText={'USDT/ETH'}
                          leftType={InfoShowType.TokenSelect}
                          rightSelect/>
                <InfoView leftTitle={'杠杆倍数'}
                          leftText={'1'}
                          leftType={InfoShowType.ShowText}
                          rightText={'USDT'}
                          rightSelect/>
                          
                <InfoView leftTitle={'保证金'} 
                          rightTitle={''}
                          leftText={'请输入'}
                          leftType={InfoShowType.InputInfo}
                          rightText={'FORT'}/>
            </div>
            <div className={`${sustainable}-bottom`}>
                <hr/>
                <MainButton title={'看涨开多'} className={'different1'}/>
                <MainButton title={'看跌开空'} className={'different2'}/>
            </div>
            <div className={`${sustainable}-had`}>
                <div className={`${sustainable}-had-title`}>
                    <p>持有的永续合约</p>
                    <PutDownIcon/>
                </div>
                <hr/>
            </div>
            <div className={`${sustainable}-list`}>
                <ul>
                    <li>
                    <SustainableItem type={'期权类型'} pair={'币种对'} money={'保证金'} price={'买入价格'} num={'杠杆倍数'} rate={'当前收益率'} willGet={'未结算收益'} willPrice={'预估清算价'} doit={'操作'} isTitle/>
                    </li>
                    {list}
                </ul>
            </div>
        </div>
    )
}

export default Sustainable

