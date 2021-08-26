import { FC } from 'react'
import { ChineseIcon, EnglishIcon, GithubIcon, MiIcon, TwitterIcon } from '../../../components/Icon'
import './styles/index'

const Footer: FC = () => {
    const footer = 'footer'
    return (
        <footer>
            <div className={`${footer}-left`}>
                <EnglishIcon className={`${footer}-left-english`}/>
                <ChineseIcon className={`${footer}-left-chinese`}/>
            </div>
            <div className={`${footer}-right`}>
                <TwitterIcon className={`${footer}-right-twitter`}/>
                <GithubIcon className={`${footer}-right-github`}/>
                <MiIcon className={`${footer}-right-mi`}/>
            </div>

            
        </footer>
    )
}

export default Footer