import classNames from 'classnames'
import { FC, useState } from 'react'
import './styles'

export const LeverChoose: FC = () => {
    const classPrefix = 'leverChoose'
    const [selected, setSelected] = useState(1)
    const liList = [
        {text: '1X', value: 1},
        {text: '2X', value: 2},
        {text: '3X', value: 3},
        {text: '4X', value: 4},
        {text: '5X', value: 5},
    ].map((item, index) => {
        return <li 
                key={index.toString() + item.text} 
                className={classNames({
                    [`selected`]: selected === item.value ? true : false
                })} 
                onClick={() => {setSelected(item.value)}}>{item.text}</li>
    })
    return (
        <div className={classPrefix}>
            <div className={`${classPrefix}-title`}>Leverage</div>
            <ul className={`${classPrefix}-choose`}>
                {liList}
            </ul>
        </div>
    )
}
