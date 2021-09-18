import { FC } from "react";
import Footer from "./Shared/Footer";
import Header from "./Shared/Header";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import loadable from "@loadable/component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionModal from "./Shared/TransactionModal";
// import useWeb3 from '../libs/hooks/useWeb3'

const Sustainable = loadable(() => import("./Lever"));
const Option = loadable(() => import("./Options"));
const Mining = loadable(() => import("./Farm"));

const App: FC = () => {
  return (
    <main>
      <div className={"main-content"}>
        <TransactionModal />
        {/* <ToastContainer autoClose={8000}/> */}
        <ToastContainer />
        <HashRouter>
          <Header />
          <Switch>
            <Route path="/lever">
              <Sustainable />
            </Route>
            <Route path="/options">
              <Option />
            </Route>
            <Route path="/farm">
              <Mining />
            </Route>
            <Redirect to="/lever" />
          </Switch>
        </HashRouter>
      </div>
      <Footer />
    </main>
  );
};

export default App;
