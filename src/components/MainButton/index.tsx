import classNames from 'classnames'
import { FC, MouseEventHandler } from 'react'
import './styles'

type Props = {
    className?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
}

const MainButton: FC<Props> = ({children, ...props}) => {
    const classPrefix = 'fort-button'
    return (
        <button 
        onClick={props.onClick} 
        className={classNames({
            [`${classPrefix}`]: true,
            [props.className || '']: true
        })}>
            {children}
        </button>
    )
}

export default MainButton
