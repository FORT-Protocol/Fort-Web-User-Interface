import { FC } from 'react'
import { LittleBSC, LittleETH, NetworkNow, PolygonIcon } from '../../../../../components/Icon'
import MainCard from '../../../../../components/MainCard'
import './styles'

const SelectNetwork: FC = () => {
    const classPrefix = 'selectNetwork'
    return (
        <div className={classPrefix}>
            <div className={`${classPrefix}-chainName`}>
                <LittleETH/><p>Ethereum</p>
            </div>
            <div className={`${classPrefix}-hover`}>
                <MainCard classNames={`${classPrefix}-ul`}>
                    <p>Select a network</p>
                    <ul>
                        <li><a href={'https://app.hedge.red'}><LittleETH/><p>Ethereum</p><NetworkNow/></a></li>
                        <li><a href={'https://test.hedge.red'}><LittleETH/><p>Rinkeby</p></a></li>
                        <li><a href={'https://bsc.hedge.red'}><LittleBSC/><p>BSC</p></a></li>
                        <li><a href={'https://polygon.hedge.red'}><PolygonIcon/><p>Polygon</p></a></li>
                    </ul>
                </MainCard>
            </div>
            
        </div>
    )
}

export default SelectNetwork
