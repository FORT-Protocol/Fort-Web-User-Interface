import { FC } from "react";
import {
  ChineseIcon,
  EnglishIcon,
  GithubIcon,
  MiIcon,
  TwitterIcon,
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
        <TwitterIcon className={`${footer}-right-twitter`} />
        <GithubIcon className={`${footer}-right-github`} />
        <MiIcon className={`${footer}-right-mi`} />
      </div>
    </footer>
  );
};

export default Footer;
