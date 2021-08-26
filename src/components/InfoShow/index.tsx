import { FC } from 'react'
import './styles'

type Props = {
    topLeftText: string,
    bottomRightText: string
}

const InfoShow: FC<Props> = ({children, ...props}) => {
    const classPrefix = 'infoView'
    return (
        <div className={classPrefix}>
            <p className={`${classPrefix}-topLeft`}>{props.topLeftText}</p>
            <div className={`${classPrefix}-mainView`}>
                {children}
            </div>
            <p className={`${classPrefix}-bottomRight`}>{props.bottomRightText}</p>
        </div>
    )
}

export default InfoShow
