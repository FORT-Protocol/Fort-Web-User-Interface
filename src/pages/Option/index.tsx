import { FC } from 'react'
import MainButton from '../../components/Button/MainButton'
import { PutDownIcon } from '../../components/Icon'
import InfoView, { InfoShowType } from '../../components/InfoView'
import OptionChoice from '../../components/OptionChoice'
import OptionItem from '../../components/OptionItem'
import './styles'

const Option: FC = () => {
    const option = 'option'

    const list = [
        ['ETH', 'Fort-Future-USDT/ETH', 'USDT/ETH', '0.1', '0.0000376', '2020-06-12 17:00', '区块 203834245', '14,000 FORT', '0xa1114367B2626cCf6B1cf820db089b2a15B96cFB', "1"],
        ['ETH', 'Fort-Future-USDT/ETH', 'USDT/ETH', '0.1', '0.0000376', '2020-06-12 17:00', '区块 203834245', '14,000 FORT', '0xa1114367B2626cCf6B1cf820db089b2a15B96cFq', "1"],
        ['ETH', 'Fort-Future-USDT/ETH', 'USDT/ETH', '0.1', '0.0000376', '2020-06-12 17:00', '区块 203834245', '14,000 FORT', '0xa1114367B2626cCf6B1cf820db089b2a15B96cFw', "1"],
        ['ETH', 'Fort-Future-USDT/ETH', 'USDT/ETH', '0.1', '0.0000376', '2020-06-12 17:00', '区块 203834245', '14,000 FORT', '0xa1114367B2626cCf6B1cf820db089b2a15B96cFe', "1"],
        ['ETH', 'Fort-Future-USDT/ETH', 'USDT/ETH', '0.1', '0.0000376', '2020-06-12 17:00', '区块 203834245', '14,000 FORT', '0xa1114367B2626cCf6B1cf820db089b2a15B96cFr', "0"],
    ].map((item, index) => (
        <li key={index}>
            <OptionItem icon={item[0]} pairName={item[1]} pair={item[2]} num={item[3]} price={item[4]} time={item[5]} block={item[6]} money={item[7]} address={item[8]} doit={item[9] === "1" ? true : false}/>
        </li>
    ))

    return (
        <div className={`${option}`}>
            <div className={`${option}-top`}>
                <p className={`${option}-title`}>买入期权</p>
                <OptionChoice titleName={'选择期权类型'}/>
                <InfoView leftTitle={'当前价'} 
                          rightTitle={'1 ETH = 1764.54 USDT'} 
                          leftText={'USDT/ETH'}
                          leftType={InfoShowType.TokenSelect}
                          rightSelect/>
                <InfoView leftTitle={'期权份数'} 
                          rightTitle={''} 
                          leftText={'1000'}
                          leftType={InfoShowType.ShowText}/>
                <InfoView leftTitle={'行权时间'} 
                          rightTitle={'区块号 29394848'} 
                          leftText={'2021-05-05 22:23'}
                          leftType={InfoShowType.ShowText}
                          rightSelect/>
                <InfoView leftTitle={'行权价'} 
                          rightTitle={''} 
                          leftText={'12345678'}
                          leftType={InfoShowType.ShowText}
                          rightText={'USDT'}/>
            </div>
            <div className={`${option}-bottom`}>
                <hr/>
                <div className={`${option}-fortValue`}>
                    <div className={`${option}-fortValue-title`}>
                        权利金
                    </div>
                    <div className={`${option}-fortValue-value`}>
                        <div className={`${option}-fortValue-value-value`}>
                            <p>2000000</p>
                            <p>FORT</p>
                        </div>
                        <div className={`${option}-fortValue-value-balance`}>
                            钱包余额:333333 FORT
                        </div>
                    </div>
                </div>
                <MainButton title={'买入看跌期权'} className={'different0'}/>
            </div>
            <div className={`${option}-had`}>
                <div className={`${option}-had-title`}>
                    <p>持有的永续合约</p>
                    <PutDownIcon/>
                </div>
                <hr/>
            </div>
            <div className={`${option}-list`}>
                <ul>
                    <li>
                        <OptionItem pair={'币种对'} num={'期权份数'} price={'行权价'} time={'行权时间'} money={'权利金'} address={'合约地址'} block={'操作'} isTitle/>
                    </li>
                    {list}
                    <li className={`${option}-list-add`}>
                        <p>记录不全,</p><button>点击添加 +</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Option