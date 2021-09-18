import classNames from 'classnames'
import { FC, MouseEventHandler } from 'react'
import { WhiteLoading } from '../Icon'
import './styles'

type Props = {
    className?: string
    disable?: boolean
    loading?: boolean
    onClick?: MouseEventHandler<HTMLButtonElement>
}

const MainButton: FC<Props> = ({children, ...props}) => {
    const classPrefix = 'fort-button'
    return (
        <button 
        onClick={props.onClick} 
        className={classNames({
            [`${classPrefix}`]: true,
            [props.className || '']: true,
            [`disable`]: props.disable
        })}>
            {props.loading ? (<WhiteLoading className={'animation-spin'}/>) : children}
        </button>
    )
}

export default MainButton
