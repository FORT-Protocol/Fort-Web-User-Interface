import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import classNames from 'classnames'
import moment from 'moment'
import { FC, useCallback, useEffect, useState } from 'react'
import LineShowInfo from '../../../components/LineShowInfo'
import MainButton from '../../../components/MainButton'
import MainCard from '../../../components/MainCard'
import { useERC20Approve } from '../../../contracts/hooks/useERC20Approve'
import { useFortForStakingGetReward, useFortForStakingStake, useFortForStakingWithdraw } from '../../../contracts/hooks/useFortForStaking'
import { tokenList } from '../../../libs/constants/addresses'
import { ERC20Contract, FortForStaking } from '../../../libs/hooks/useContract'
import useTransactionListCon from '../../../libs/hooks/useTransactionInfo'
import useWeb3 from '../../../libs/hooks/useWeb3'
import { bigNumberToNormal, normalToBigNumber } from '../../../libs/utils'
import './styles'

type Props = {
    name: string
    time: number
}

enum StakingButtonType {
    disable = 0,
    farm = 1,
    claim = 2,
    withdraw = 3
}

type StakingType = {
    rate: BigNumber
    stakingNumber: BigNumber
    miningPoolNumber: BigNumber
    myStaking: BigNumber
    expectedMining: BigNumber
    claimTime: number
    buttonType: StakingButtonType
}

export const FarmCard: FC<Props> = ({...props}) => {
    const {account, chainId, library} = useWeb3()
    const {pendingList} = useTransactionListCon()
    const [stakingInfo, setStakingInfo] = useState<StakingType>()
    const [showInput, setShowInput] = useState(false)
    const [approveAmount, setApproveAmount] = useState(BigNumber.from('0'))
    const [balanceAmount, setBalanceAmount] = useState(BigNumber.from('0'))
    const [inputValue, setInputValue] = useState('')
    const stakingContract = FortForStaking()
    const tokenContract = ERC20Contract(tokenList[props.name].addresses)
    const classPrefix = 'farm'
    const TokenIcon = tokenList[props.name].Icon
    const getReward = useFortForStakingGetReward(props.name, BigNumber.from((props.time * 1000).toString()))
    const stake = useFortForStakingStake(props.name, BigNumber.from((props.time * 1000).toString()), normalToBigNumber(inputValue))
    // TODO:不需要第三个参数，等合约修改，同时修改ABI
    const withdraw = useFortForStakingWithdraw(props.name, BigNumber.from((props.time * 1000).toString()), BigNumber.from('10000000000000000000'))
    const approve = useERC20Approve(props.name, MaxUint256, stakingContract?.address)

    const buttonJSX = useCallback(
        () => {
            if (!stakingInfo) {
                return (<MainButton className={'farmButton'} disable>Farm</MainButton>)
            } 
            if (stakingInfo.buttonType === StakingButtonType.disable) {
                return (<MainButton className={'farmButton'} disable>Farm</MainButton>)
            } else if (stakingInfo.buttonType === StakingButtonType.farm) {
                return (<MainButton className={'farmButton'} onClick={() => setShowInput(true)}>Farm</MainButton>)
            } else if (stakingInfo.buttonType === StakingButtonType.claim) {
                return (<MainButton className={'farmButton'} onClick={() => getReward()}>Claim</MainButton>)
            } else if (stakingInfo.buttonType === StakingButtonType.withdraw) {
                return (<MainButton className={'farmButton'} onClick={() => withdraw()}>Withdraw</MainButton>)
            }
            return (<MainButton disable>Farm</MainButton>)
        },
        [getReward, stakingInfo, withdraw]
    )()
    const approveTrue = approveAmount.gte(normalToBigNumber(inputValue))
    const inputButton = (
        <div className={'stake-button-inputView'}>
            <div className={'stake-button-inputView-input'}>
                <input value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
                <button onClick={() => setInputValue(bigNumberToNormal(balanceAmount))}>MAX</button>
            </div>
            <button 
            disabled={approveTrue && normalToBigNumber(inputValue).gt(balanceAmount)} 
            onClick={() => {
                if (approveTrue) {
                    stake()
                    setShowInput(false)
                } else {
                    approve()
                }
            }}>
                {approveTrue ? (<Trans>Confirm</Trans>) : (<Trans>Approve</Trans>)} 
            </button>
        </div>
    )

    const StakeButton = (
        <div className={'stake-button'}>
            {showInput ? inputButton : buttonJSX}
            {showInput ? (<p className={classNames({[`red`]:normalToBigNumber(inputValue).gt(balanceAmount)})}><Trans>wallet:</Trans>{`${bigNumberToNormal(balanceAmount, 18, 2)} ${props.name}`}</p>) : (<></>)}
        </div>
    )

    useEffect(() => {
        if (!account || !chainId || !stakingContract || !library || !tokenContract) { return }
        ;(async () => {
            const config = await stakingContract.getConfig()
            const channelInfo = await stakingContract.getChannelInfo(tokenList[props.name].addresses[chainId], (props.time * 1000))
            const balanceOf = await stakingContract.balanceOf(tokenList[props.name].addresses[chainId], (props.time * 1000), account)
            const latestBlock = await library.getBlockNumber()
            // 开始锁仓
            const startBlock:BigNumber = config[1]
            // 结束锁仓
            const stopBlock:BigNumber = config[2]
            // 总锁仓量
            const totalStaked:BigNumber = channelInfo[0]
            // 总出矿量
            const totalRewards:BigNumber = channelInfo[1]
            // 解锁区块号
            const unlockBlock:BigNumber = channelInfo[2]
            // 我的锁仓数量
            const myStakeAmount:BigNumber = balanceOf

            const rate = totalStaked.toString() === '0' ? BigNumber.from('0') : totalRewards.mul(BigNumber.from('1000000000000000000')).div(totalStaked)
            const stakingNumber = totalStaked
            const miningPoolNumber = totalRewards
            const myStaking = myStakeAmount
            const expectedMining = rate.mul(myStaking).div(BigNumber.from('1000000000000000000'))
            const claimTime = stopBlock.sub(latestBlock).toNumber() * 13000 + moment().valueOf()
            const buttonType = 
            latestBlock < startBlock.toNumber() ? StakingButtonType.disable : 
            latestBlock < stopBlock.toNumber() ? StakingButtonType.farm :
            latestBlock < unlockBlock.toNumber() ? StakingButtonType.claim : StakingButtonType.withdraw

            const newStakingInfo = {
                rate: rate,
                stakingNumber: stakingNumber,
                miningPoolNumber: miningPoolNumber,
                myStaking: myStaking,
                expectedMining: expectedMining,
                claimTime: claimTime,
                buttonType : buttonType
            }
            if (buttonType === StakingButtonType.farm) {
                const tokenBalance = await tokenContract.balanceOf(account)
                const allowance = await tokenContract.allowance(account, stakingContract.address)
                setBalanceAmount(tokenBalance)
                setApproveAmount(allowance)
            }
            setStakingInfo(newStakingInfo)
            // TODO:删除
            if (tokenList[props.name].addresses[chainId] === '0xDB7b4FdF99eEE8E4Cb8373630c923c51c1275382' && props.time === 1) {
                console.log(startBlock.toString(), stopBlock.toString(), totalStaked.toString(), totalRewards.toString(), unlockBlock.toString(), myStakeAmount.toString())
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, chainId, library, pendingList])

    return (
        <MainCard classNames={`stakeCard`}>
            <div className={`${classPrefix}-li-tokenInfo`}>
                <TokenIcon/>
                <p>{props.name}</p>
            </div>
            <div className={`${classPrefix}-middleInfo`}>
                <LineShowInfo leftText={t`Lock period`} rightText={`${props.time} Month`}/>
                <LineShowInfo leftText={t`Current mining rate`} rightText={`${bigNumberToNormal(stakingInfo?.rate || BigNumber.from('0'), 18, 8)} FORT/${props.name}`}/>
                <LineShowInfo leftText={t`Staking number`} rightText={`${bigNumberToNormal(stakingInfo?.stakingNumber || BigNumber.from('0'), 18, 2)} ${props.name}`}/>
                <LineShowInfo leftText={t`Mining pool number`} rightText={`${bigNumberToNormal(stakingInfo?.miningPoolNumber || BigNumber.from('0'), 18, 2)} DCU`}/>
            </div>
            <div className={`${classPrefix}-bottomInfo`}>
                <LineShowInfo leftText={t`My staking`} rightText={`${bigNumberToNormal(stakingInfo?.myStaking || BigNumber.from('0'), 18, 2)} ${props.name}`}/>
                <LineShowInfo leftText={t`Expected mining`} rightText={`${bigNumberToNormal(stakingInfo?.expectedMining || BigNumber.from('0'), 18, 8)} DCU`}/>
                <LineShowInfo leftText={t`Reward claim time`} rightText={`${moment(stakingInfo?.claimTime).format('YYYY[-]MM[-]DD HH:mm')}`}/>
            </div>
            {StakeButton}
        </MainCard>
    )
}
