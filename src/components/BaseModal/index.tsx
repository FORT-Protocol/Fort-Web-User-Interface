import { FC, MouseEventHandler } from 'react'
import { XIcon } from '../Icon'
import MainCard from '../MainCard'
import './styles'

type Props = {
    onClose?: MouseEventHandler<HTMLButtonElement>
    classNames?: string
    titleName?: string
}

const BaseModal: FC<Props> = ({children, ...props}) => {
    const classPrefix = 'baseModal'
    return (
        <div className={classPrefix}>
            <MainCard classNames={props.classNames}>
                <div className={`${classPrefix}-top`}>
                    <button className={`${classPrefix}-top-leftButton`}></button>
                    <p className={`${classPrefix}-top-title`}>{props.titleName || ''}</p>
                    <button className={`${classPrefix}-top-rightButton`} onClick={props.onClose}><XIcon/></button>
                </div>
                {children}
            </MainCard>
        </div>
    )
}

export default BaseModal
