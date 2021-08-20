import { FC } from 'react'
import './styles'

type Props = {
    titleName?: string
}

const OptionChoice: FC<Props> = ({...props}) => {
    const optionChoice = 'optionChoice'
    return (
        <div className={`${optionChoice}`}>
            <p className={`${optionChoice}-title`}>{props.titleName}</p>
            <div className={`${optionChoice}-button`}>
                <div className={`${optionChoice}-button-left-bg`}>
                    <button className={`${optionChoice}-button-left`}><p>CALL</p></button>
                </div>
                <div className={`${optionChoice}-button-right-bg`}>
                    <button className={`${optionChoice}-button-right`}><p>PUT</p></button>
                </div>
                
            </div>
        </div>
    )
}

export default OptionChoice
