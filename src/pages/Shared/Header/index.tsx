import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MainButton from '../../../components/Button/MainButton'
import classNames from 'classnames'
import { FortLogo } from '../../../components/Icon'
import './styles'

const Header: FC = () => {
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
                
                <MainButton title={'链接钱包'} className={'connect'} />
            </div>
        </header>
    )
}

export default Header

