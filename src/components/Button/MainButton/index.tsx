import classNames from 'classnames'
import { FC, MouseEventHandler } from 'react'
import './styles'

export type Props = {
    title?: string,
    className?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
    disable?: boolean
}

const MainButton: FC<Props> = ({...props}) => {
    const fortButton = 'fortButton'
    return (
        <button className={classNames({
            [`${fortButton}-${props.className}`]: true,
            [`disable`]: props.disable
        })} onClick={props.onClick}>
            {props.title}
        </button>
    )
}

export default MainButton
