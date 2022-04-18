import { FC } from "react";
import Footer from "./Shared/Footer";
import Header from "./Shared/Header";
import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import loadable from "@loadable/component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TransactionModal from "./Shared/TransactionModal";
import { checkWidth } from "../libs/utils";
import MobileFooter from "./Shared/Footer/MobileFooter";
import MobileHeader from "./Shared/Header/MobileHeader";
import useThemes from "../libs/hooks/useThemes";
import "../themes/styles";

const Perpetuals = loadable(() => import("./Perpetuals"));
const Option = loadable(() => import("./Options"));
// const Mining = loadable(() => import("./Farm"));
const Swap = loadable(() => import("./Swap"));
const Win = loadable(() => import("./Win"));

const App: FC = () => {
  const { theme } = useThemes();
  return (
    <main className={`main-${theme.valueOf()}`}>
      <div className={"main-content"}>
        <TransactionModal />
        {/* <ToastContainer autoClose={8000}/> */}
        <ToastContainer />
        <HashRouter>
          {checkWidth() ? (<Header />) : (<MobileHeader/>)}
          <Switch>
            <Route path="/futures">
              <Perpetuals />
            </Route>
            <Route path="/options">
              <Option />
            </Route>
            {/* <Route path="/farm">
              <Mining />
            </Route> */}
            <Route path="/win">
              <Win />
            </Route>
            <Route path="/swap">
              <Swap />
            </Route>
            <Redirect to="/futures" />
          </Switch>
        </HashRouter>
      </div>
      {checkWidth() ? (<Footer/>) : (<MobileFooter/>)}
    </main>
  );
};

export default App;
