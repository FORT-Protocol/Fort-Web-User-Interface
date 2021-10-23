import { FC } from 'react'
import { PerpetualsListKValue } from '..';
import { LeverListType } from '../../../pages/Perpetuals';
import './styles'

type Props = {
    item: LeverListType;
    key: string;
    className: string;
    showNotice: () => boolean;
    kValue?: PerpetualsListKValue;
  };

const PerpetualsListMobile: FC<Props> = ({...props}) => {
    const classPrefix = 'perListMobile'
    return (
        <li className={classPrefix}>
            <div className={`${classPrefix}-top`}>
                <div className={`${classPrefix}-top-left`}>

                </div>
                <div className={`${classPrefix}-top-right`}>

                </div>
            </div>
            <div className={`${classPrefix}-mid`}></div> 
            <div className={`${classPrefix}-bottom`}></div>        
        </li>
    )
}

export default PerpetualsListMobile
