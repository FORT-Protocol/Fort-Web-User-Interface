import { FC } from 'react'
import { Trans } from '@lingui/macro'
import './styles'
import classNames from 'classnames'

type Props = {
    callBack: (isLong: boolean) => void
    isLong: boolean
}

const ChooseType: FC<Props> = ({...props}) => {
    const classPrefix = 'chooseType'
    return (
        <div className={classPrefix}>
            <p className={`${classPrefix}-title`}><Trans>Type</Trans></p>
            <div className={`${classPrefix}-choose`}>
                <div className={classNames({
                    [`${classPrefix}-choose-left`]:true,
                    [`isSelected`]: props.isLong
                })} onClick={() => props.callBack(true)}>
                    <div><Trans>Long</Trans></div>
                </div>
                <div className={classNames({
                    [`${classPrefix}-choose-right`]: true,
                    [`isSelected`]: !props.isLong
                })} onClick={() => props.callBack(false)}>
                    <div><Trans>Short</Trans></div>
                </div>
            </div>
        </div>
    )
}

export default ChooseType
