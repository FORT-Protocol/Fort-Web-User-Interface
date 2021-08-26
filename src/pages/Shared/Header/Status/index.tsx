import classNames from 'classnames'
import { FC } from 'react'
import MainButton from '../../../../components/MainButton'
import './styles'

const ConnectStatus: FC = () => {
    const classPrefix = 'connectStatus'
    return (
        <div className={classNames({
            [`${classPrefix}`]: true,
            [`isConnect`]: false
        })}>
            <div className={`${classPrefix}-chainName`}>Rinkeby</div>
            <MainButton>0x465f...cf89cf</MainButton>
        </div>
    )
}

export default ConnectStatus
