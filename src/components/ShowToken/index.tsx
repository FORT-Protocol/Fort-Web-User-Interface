import { FC } from 'react'
import { tokenList } from '../../libs/constants/addresses'
import './styles'

type Props = {
    tokenName1?: string,
    tokenName2?: string
}

const ShowToken: FC<Props> = ({...props}) => {
    const showToken = 'showToken'
    const TokenSvg1 = tokenList[props.tokenName1!].Icon
    const TokenSvg2 = tokenList[props.tokenName2!].Icon
    return (
        <div className={`${showToken}`}>
            <TokenSvg1 className={`${showToken}-one`}/>
            <TokenSvg2 className={`${showToken}-two`}/>
            
            <p>{props.tokenName1}/{props.tokenName2}</p>
        </div>
    )
}

export default ShowToken
