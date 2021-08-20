import classNames from 'classnames'
import { FC, useState } from 'react'
import { PutDownIcon } from '../Icon'
import ShowToken from '../ShowToken'
import './styles'

export enum InfoShowType {
    TokenSelect = 0,
    ShowText = 1,
    InputInfo = 2
}

type Props = {
    leftTitle?: string,
    rightTitle?: string,
    rightSelect?: boolean,
    rightText?: string,
    leftType?: InfoShowType,
    leftText?: string

}
const InfoView: FC<Props> = ({...props}) => {
    const [valueState, setValueState] = useState(props.leftText)
    const infoView = 'infoView'
    var LeftItem: JSX.Element
    var RightItem: JSX.Element
    if (props.rightSelect) {
        RightItem = <PutDownIcon className={`${infoView}-putDown`}/>
    } else {
        RightItem = <p className={`${infoView}-text`}>{props.rightText}</p>
    }

    switch (props.leftType) {
        case InfoShowType.TokenSelect:
            const tokenArray = props.leftText!.split('/')
            const token1 = tokenArray[0]
            const token2 = tokenArray[1]
            LeftItem = <ShowToken tokenName1={token1} tokenName2={token2}/>
            break
        case InfoShowType.ShowText:
            LeftItem = <p className={`${infoView}-showNum`}>{props.leftText}</p>
            break
        case InfoShowType.InputInfo:
            LeftItem = <input type='text' value={valueState} onChange={(e) => {setValueState(e.target.value)}}/>
            break
    }

    return (
        <div className={`${infoView}`}>
            <div className={`${infoView}-top`}>
                <p className={`${infoView}-leftTitle`}>{props.leftTitle}</p>
                <p className={`${infoView}-rightTitle`}>{props.rightTitle}</p>
            </div>
            
            <div className={classNames({
                [`${infoView}-showView`]: true,
            })}>
                {LeftItem!}
                {RightItem!}
            </div>
        </div>
    )
}

export default InfoView
