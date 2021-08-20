import { FC } from 'react'
import Footer from './Shared/Footer'
import Header from './Shared/Header'
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom'
import loadable from '@loadable/component'

const Sustainable = loadable(() => import('./Sustainable'))
const Option = loadable(() => import('./Option'))
const Mining = loadable(() => import('./Mining'))

const App: FC = () => {
    return (
        <main>
            <HashRouter>
                <Header/>
                <Switch>
                    <Route path="/sustainable">
                        <Sustainable/>
                    </Route>
                    <Route path="/option">
                        <Option/>
                    </Route>
                    <Route path="/mining">
                        <Mining/>
                    </Route>
                    <Redirect to="/sustainable" />
                </Switch>
                <Footer/>
            </HashRouter>
        </main>
    )
}

export default App