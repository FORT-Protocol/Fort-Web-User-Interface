import classNames from 'classnames'
import { FC, useState } from 'react'
import MainButton from '../Button/MainButton'
import './styles'

const RadioGroupFort: FC = ({...props}) => {
    const radioGroupFort = 'radioGroupFort'
    const [state, setstate] = useState('1')
    return (
        <div className={`${radioGroupFort}`}>
            <MainButton title={'6个月'} className={classNames({
                'select': true,
                'noSelect': state !== '1'
            })} onClick={() => {setstate('1')}}/>
            <MainButton title={'8个月'} className={classNames({
                'select': true,
                'noSelect': state !== '2'
            })} onClick={() => {setstate('2')}}/>
            <MainButton title={'12个月'} className={classNames({
                'select': true,
                'noSelect': state !== '3'
            })} onClick={() => {setstate('3')}}/>
        </div>
    )
}

export default RadioGroupFort
