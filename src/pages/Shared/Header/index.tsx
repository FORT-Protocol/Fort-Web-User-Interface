import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MainButton from '../../../components/Button/MainButton'
import classNames from 'classnames'
import { FortLogo } from '../../../components/Icon'
import './styles'
import useWeb3 from '../../../libs/hooks/useWeb3'
import result from '../../../libs/connectors/injected'
import { useFortEuropeanOptionOpen } from '../../../contracts/hooks/useFortEuropeanOptionTransation'
import { BigNumber } from 'ethers'

const Header: FC = () => {
    const tran1 = useFortEuropeanOptionOpen(
        'USDT', BigNumber.from('100000000'), false, BigNumber.from('9247859'), BigNumber.from('2000000'))
    const { activate } = useWeb3()
    const location = useLocation()
    const header = 'header'
    const routes = [
        {path: '/sustainable', content: '永续合约'},
        {path: '/option', content: '期权'},
        {path: '/mining', content: '挖矿'}
    ].map((item) => (
        <li key={item.path} className={classNames({
            selected: location.pathname.indexOf(item.path) === 0,
          })} >
            <Link to={item.path}>{item.content}</Link>
        </li>
    ))
    return (
        <header>
            <div className={`${header}-notice`}>
                <b>Fort Protocol 为 Beta 版本，使用时需要自担风险，请注意不用使用过多资金</b>
            </div>
            <div className={`${header}-nav`}>
                <FortLogo className={`${header}-logo`}/>
                <nav>
                    <ul>
                        {routes}
                    </ul>
                </nav>
                
                <MainButton title={'链接钱包'} className={'connect'} onClick={() => activate(result.connector)}/>
                <button onClick={tran1}>交易1</button>
            </div>
        </header>
    )
}

export default Header

