import { FC } from 'react'
import './styles'
export const HoldLine: FC = ({children}) => {
    const classPrefix = 'holdLine'
    return (
        <div className={classPrefix}>
            <div className={`${classPrefix}-line`}></div>
            <div className={`${classPrefix}-mainBG`}>
                {children}
            </div>
            
        </div>
    )
}
