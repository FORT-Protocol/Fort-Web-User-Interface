import { t } from '@lingui/macro'
import classNames from 'classnames'
import { FC } from 'react'
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'
import CloseOptions from './Close'
import MintOptions from './Mint'
import './styles'

const Options: FC = () => {
    const location = useLocation()
    const classPrefix = 'options'
    const routes = [
        {path: '/options/mint', content: t`Mint`},
        {path: '/options/close', content: t`Close`}
    ].map((item) => (
        <li key={item.path} className={classNames({
            selected: location.pathname.indexOf(item.path) === 0,
          })} >
            <Link to={item.path}>{item.content}</Link>
        </li>
    ))
    return (
        <div className={classPrefix}>
            <ul>
                {routes}
            </ul>
            <Switch>
                <Route path="/options/mint" exact>
                    <MintOptions/>
                </Route>

                <Route path="/options/close" exact>
                    <CloseOptions/>
                </Route>

                <Redirect to="/options/mint" />
            </Switch>
        </div>
        
    )
}

export default Options