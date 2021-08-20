import { FC } from 'react'
import { ChineseIcon, EnglishIcon, GithubIcon, MiIcon, TwitterIcon } from '../../../components/Icon'
import './styles/index'

const Footer: FC = () => {
    const footer = 'footer'
    return (
        <footer>
            <div className={`${footer}-left`}>
                <EnglishIcon className={`${footer}-english`}/>
                <ChineseIcon className={`${footer}-chinese`}/>
            </div>
            <div className={`${footer}-right`}>
                <TwitterIcon className={`${footer}-twitter`}/>
                <GithubIcon className={`${footer}-github`}/>
                <MiIcon className={`${footer}-mi`}/>
            </div>

            
        </footer>
    )
}

export default Footer