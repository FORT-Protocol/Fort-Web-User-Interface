import { Trans } from '@lingui/macro'
import { FC } from 'react'
import MainCard from '../../../components/MainCard'
import './styles'

const CloseOptions: FC = () => {
    const classPrefix = 'options-closeOptions'
    return (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-leftCard`}>
                <p className={`${classPrefix}-leftCard-title`}><Trans>Option Token held</Trans></p>
                <ul>

                </ul>
                <div className={`${classPrefix}-leftCard-addToken`}>

                </div>
            </MainCard>
            <MainCard classNames={`${classPrefix}-rightCard`}>

            </MainCard>
        </div>
    )
}

export default CloseOptions
