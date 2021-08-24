import { FC } from 'react'
import Footer from './Shared/Footer'
import Header from './Shared/Header'
import { Switch, Route, Redirect, HashRouter } from 'react-router-dom'
import loadable from '@loadable/component'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Sustainable = loadable(() => import('./Sustainable'))
const Option = loadable(() => import('./Option'))
const Mining = loadable(() => import('./Mining'))

const App: FC = () => {
    return (
        <main>
            <ToastContainer autoClose={8000}/>
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