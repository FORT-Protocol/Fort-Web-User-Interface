import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { FortLogo } from "../../../components/Icon";
import "./styles";
import { t } from "@lingui/macro";
import ConnectStatus from "./Status";

const Header: FC = () => {
  const location = useLocation();
  const header = "header";
  const routes = [
    { path: "/futures", content: t`Futures` },
    { path: "/options", content: t`Options` },
    { path: "/win", content: t`Win` },
    { path: "/swap", content: t`Swap` },
    // { path: "/farm", content: t`Farm` },
  ].map((item) => (
    <li
      key={item.path}
      className={classNames({
        selected: location.pathname.indexOf(item.path) === 0,
      })}
    >
      <Link to={item.path}>{item.content}</Link>
    </li>
  ));
  return (
    <header>
      <div className={`${header}-nav`}>
        <a href={"https://www.fortprotocol.com"}>
          <FortLogo className={`${header}-logo`} />
        </a>
        <nav>
          <ul>{routes}</ul>
        </nav>
        <ConnectStatus />
      </div>
    </header>
  );
};

export default Header;
