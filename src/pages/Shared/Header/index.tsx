import { FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { FortLogo } from '../../../components/Icon'
import './styles'
import { t, Trans } from '@lingui/macro'
import ConnectStatus from './Status'

const Header: FC = () => {
    const location = useLocation()
    const header = 'header'
    const routes = [
        {path: '/lever', content: t`Leveraged Coins`},
        {path: '/options', content: t`Opions`},
        {path: '/farm', content: t`Farm`}
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
                <b><Trans>Fort Protocol is a Beta version, you need to use it at your own risk, please be careful not to use too much money.</Trans></b>
            </div>
            <div className={`${header}-nav`}>
                <FortLogo className={`${header}-logo`}/>
                <nav>
                    <ul>
                        {routes}
                    </ul>
                </nav>
                <ConnectStatus/>
                
            </div>
        </header>
    )
}

export default Header

