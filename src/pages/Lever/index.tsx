import { FC, useEffect, useState } from 'react'
import InfoShow from '../../components/InfoShow'
import MainCard from '../../components/MainCard'
import { t, Trans } from '@lingui/macro'
import './styles'
import { ExchangeIcon, PutDownIcon } from '../../components/Icon'
import MainButton from '../../components/MainButton'
import LineShowInfo from '../../components/LineShowInfo'
import { SingleTokenShow } from '../../components/TokenShow'
import LeverReview, { LeverReviewModel } from '../Review/LeverReview'
import { ERC20Contract, NestPriceContract } from '../../libs/hooks/useContract'
import { bigNumberToNormal, formatInputNum, normalToBigNumber } from '../../libs/utils'
import { LeverTokenList, tokenList } from '../../libs/constants/addresses'
import useWeb3 from '../../libs/hooks/useWeb3'
import { BigNumber } from 'ethers'
import { message } from 'antd'

type LeverTransactionIon = {
    fromToken: string,
    getToken: string,
    fromNum: string,
    getNum: string,
}

const Lever: FC = () => {
    const [isReview, setIsReview] = useState(false)
    const [fromBalance, setFromBalance] = useState(BigNumber.from('0'))
    const [getBalance, setGetBalance] = useState(BigNumber.from('0'))
    const [priceNow, setPriceNow] = useState('--.--')
    const { account, chainId } = useWeb3()
    const [transactionInfo, setTransactionInfo] = useState<LeverTransactionIon>({
        fromToken: 'DCU',
        getToken: 'Margin-ETH1L',
        fromNum: '',
        getNum: ''
    })
    const nestPriceContract = NestPriceContract()
    const tokenContracts = [...LeverTokenList, tokenList['DCU']].map((item) => {
        return ERC20Contract(item.addresses)
    })
    
    useEffect(() => {
        if (nestPriceContract && priceNow === '--.--' && chainId) {
            nestPriceContract
            .latestPrice(tokenList['USDT'].addresses[chainId])
            .then((value:any) => {
                setPriceNow(bigNumberToNormal(value[1], tokenList['USDT'].decimals))
            })
        }

    }, [priceNow, nestPriceContract, chainId])

    useEffect(() => {
        if (account && chainId) {
            const tokenContract = tokenContracts.filter(
                (item) => item?.address === tokenList[transactionInfo.fromToken].addresses[chainId]
            )
            if (tokenContract[0]) {
                tokenContract[0].balanceOf(account)
                .then((value: any) => {
                    setFromBalance(BigNumber.from(value))
                })
                return
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, chainId, transactionInfo.fromToken])

    useEffect(() => {
        if (account && chainId) {
            const tokenContract = tokenContracts.filter(
                (item) => item?.address === tokenList[transactionInfo.getToken].addresses[chainId]
            )
            if (tokenContract[0]) {
                tokenContract[0].balanceOf(account)
                .then((value: any) => {
                    setGetBalance(BigNumber.from(value))
                })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, chainId, transactionInfo.getToken])
    const handleExchange = () => {
        const oldTransactionInfo = transactionInfo
        setTransactionInfo({
            fromToken: oldTransactionInfo.getToken,
            getToken: oldTransactionInfo.fromToken,
            fromNum: oldTransactionInfo.getNum,
            getNum: oldTransactionInfo.fromNum
        })
    }
    const handleGetTokenSelect_from = (token: string) => {
        setTransactionInfo({...transactionInfo, fromToken: token})
    }
    const handleGetTokenSelect_get = (token: string) => {
        setTransactionInfo({...transactionInfo, getToken: token})
    }

    const handleInput = (value: string) => {
        const formatValue = formatInputNum(value)
        setTransactionInfo({...transactionInfo, fromNum: formatValue, getNum: formatValue})
    }

    const classPrefix = 'lever'
    const reviewModel: LeverReviewModel = {
        fromToken: transactionInfo.fromToken,
        fromNum: transactionInfo.fromNum,
        getToken: transactionInfo.getToken,
        getNum: transactionInfo.getNum,
        frontPrice: '0',
        price: priceNow
    }
    const checkBalance = () => {
        if (
        fromBalance === BigNumber.from('0') || 
        transactionInfo.fromNum === '') {
            return true
        }
        // TODO:去掉3
        if (chainId !== 1 && chainId !== 4 && chainId !== 3) {
            return true
        }

        if (normalToBigNumber(transactionInfo.fromNum).gt(fromBalance)) {
            return true
        }
        return false
    }
    const handleMax = () => {
        setTransactionInfo({...transactionInfo, fromNum: bigNumberToNormal(fromBalance), getNum: bigNumberToNormal(fromBalance)})
    }
    
    return isReview ? <LeverReview back={() => setIsReview(false)} model={reviewModel}/> : (
        <div className={classPrefix}>
            <MainCard classNames={`${classPrefix}-card`}>
                <InfoShow 
                topLeftText={t`From`} 
                bottomRightText={t`Balance:` + ` ${bigNumberToNormal(fromBalance,18,4)} ${transactionInfo.fromToken}`}
                balanceRed={normalToBigNumber(transactionInfo.fromNum).gt(fromBalance) ? true : false}
                tokenSelect={transactionInfo.fromToken === 'DCU'? false : true}
                tokenList={LeverTokenList} 
                getSelectedToken={handleGetTokenSelect_from}>
                    <div className={'infoView-mainView-leftSelect'}>
                        <SingleTokenShow tokenNameOne={transactionInfo.fromToken}/>
                        <PutDownIcon/>
                    </div>
                    <div className={`infoView-mainView-maxView`}>
                        <input 
                        type={'text'}
                        className={'input-right'} 
                        value={transactionInfo.fromNum} 
                        onChange={(e) => handleInput(e.target.value)} 
                        placeholder={t`Input`}/>
                        <button className={'max-button'} onClick={() => handleMax()}>MAX</button>
                    </div>
                </InfoShow>
                <button className={`${classPrefix}-card-exchangeButton`} onClick={handleExchange}><ExchangeIcon/></button>
                <InfoShow 
                topLeftText={t`Expected get`} 
                bottomRightText={t`Balance:` + ` ${bigNumberToNormal(getBalance,18,4)} ${transactionInfo.getToken}`} 
                tokenSelect={transactionInfo.getToken === 'DCU'? false : true}
                tokenList={LeverTokenList} 
                getSelectedToken={handleGetTokenSelect_get}>
                    <div className={'infoView-mainView-leftSelect'}>
                        <SingleTokenShow tokenNameOne={transactionInfo.getToken}/>
                        <PutDownIcon/>
                    </div>
                    <input className={'input-right'} value={transactionInfo.getNum} onChange={(e) => handleInput(e.target.value)} placeholder={t`Input`}/>
                </InfoShow>
                <LineShowInfo leftText={t`Current price`} rightText={`1 ETH = ${priceNow} USDT`}/>
                <MainButton 
                className={`${classPrefix}-card-buyButton`} 
                onClick={() => {
                    if (normalToBigNumber(transactionInfo.fromNum).lt(normalToBigNumber('100'))) {
                        message.error(t`Minimum input 100`)
                        return 
                    }
                    if (normalToBigNumber(transactionInfo.fromNum).gt(fromBalance)) {
                        message.error(t`Insufficient balance`)
                        return 
                    }
                    setIsReview(true)
                }} disable={checkBalance()}>
                    <Trans>BUY</Trans>
                </MainButton>
            </MainCard>
        </div>
    )
}

export default Lever