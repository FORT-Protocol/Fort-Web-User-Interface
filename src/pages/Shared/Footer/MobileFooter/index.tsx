import { FC } from "react";
import {
  GithubIcon,
  MiIcon,
  TelIcon,
  TwitterIcon,
  WhitePaper,
} from "../../../../components/Icon";
import './styles'

const MobileFooter: FC = () => {
  const footer = "footer-mobile";
  return (
    <footer>
      <div className={`${footer}`}>
        <a
          href="https://app.hedge.red/whitePaper/web/viewer.html"
          target="view_window"
        >
          <WhitePaper className={`${footer}-right-paper`} />
        </a>
        <a href="https://t.me/fort_DeFi" target="view_window">
          <TelIcon className={`${footer}-right-tel`} />
        </a>
        <a href="https://twitter.com/FortProtocol" target="view_window">
          <TwitterIcon className={`${footer}-right-twitter`} />
        </a>
        <a href="https://github.com/FORT-Protocol" target="view_window">
          <GithubIcon className={`${footer}-right-github`} />
        </a>
        <a href="https://fortprotocol.medium.com/" target="view_window">
          <MiIcon className={`${footer}-right-mi`} />
        </a>
      </div>
    </footer>
  );
};

export default MobileFooter;
