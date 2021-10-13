import { FC } from "react";
import Footer from "./Shared/Footer";
import Header from "./Shared/Header";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import loadable from "@loadable/component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionModal from "./Shared/TransactionModal";
import useWeb3 from "../libs/hooks/useWeb3";

const Perpetuals = loadable(() => import("./Perpetuals"));
const Option = loadable(() => import("./Options"));
const Mining = loadable(() => import("./Farm"));

const App: FC = () => {
  // TODO:暂时只显示锁仓
  const {chainId} = useWeb3()
  return chainId === 1 ? (
    <main>
      <div className={"main-content"}>
        <TransactionModal />
        {/* <ToastContainer autoClose={8000}/> */}
        <ToastContainer />
        <HashRouter>
          <Header />
          <Switch>
            <Route path="/farm">
              <Mining />
            </Route>
            <Redirect to="/farm" />
          </Switch>
        </HashRouter>
      </div>
      <Footer />
    </main>
  ) : (
    <main>
      <div className={"main-content"}>
        <TransactionModal />
        {/* <ToastContainer autoClose={8000}/> */}
        <ToastContainer />
        <HashRouter>
          <Header />
          <Switch>
            <Route path="/futures">
              <Perpetuals />
            </Route>
            <Route path="/options">
              <Option />
            </Route>
            <Route path="/farm">
              <Mining />
            </Route>
            <Redirect to="/futures" />
          </Switch>
        </HashRouter>
      </div>
      <Footer />
    </main>
  );
};

export default App;
