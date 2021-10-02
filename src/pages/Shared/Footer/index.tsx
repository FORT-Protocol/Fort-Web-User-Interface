import { FC } from "react";
import {
  ChineseIcon,
  EnglishIcon,
  GithubIcon,
  MiIcon,
  TelIcon,
  TwitterIcon,
  WhitePaper,
} from "../../../components/Icon";
import { dynamicActivate } from "../../../libs/i18nConfig";
import "./styles/index";

const Footer: FC = () => {
  const footer = "footer";

  const switchLang = (locale: string) => {
    return () => {
      dynamicActivate(locale);
    };
  };
  return (
    <footer>
      <div className={`${footer}-left`}>
        <button onClick={switchLang("en-US")}>
          <EnglishIcon className={`${footer}-left-english`} />
        </button>
        <button onClick={switchLang("zh-CN")}>
          <ChineseIcon className={`${footer}-left-chinese`} />
        </button>
      </div>
      <div className={`${footer}-right`}>
        <a href="https://github.com/FORT-Protocol/Docs/blob/main/FORT_WhitePaper.pdf" target="view_window"><WhitePaper className={`${footer}-right-paper`} /></a>
        <a href="https://t.me/fort_DeFi" target="view_window"><TelIcon className={`${footer}-right-tel`} /></a>
        <a href="https://www.google.com" target="view_window"><TwitterIcon className={`${footer}-right-twitter`} /></a>
        <a href="https://github.com/FORT-Protocol" target="view_window"><GithubIcon className={`${footer}-right-github`} /></a>
        <a href="https://www.google.com" target="view_window"><MiIcon className={`${footer}-right-mi`} /></a>
      </div>
    </footer>
  );
};

export default Footer;
