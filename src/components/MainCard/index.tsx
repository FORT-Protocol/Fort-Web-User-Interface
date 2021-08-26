import classNames from 'classnames'
import { FC } from 'react'
import './styles'

type Props = {
    classNames?:string
}

const MainCard: FC<Props> = ({children, ...props}) => {
    const classPrefix = 'mainCard'
    return (
        <div className={classNames({
            [`${classPrefix}`]: true,
            [props.classNames || '']: true
        })}>
            {children}
        </div>
    )
}

export default MainCard
