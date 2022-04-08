import { CofixSwapAddress, NestPrice as NestPriceAddress } from './../constants/addresses';
import useWeb3 from '../hooks/useWeb3';
import { getAddress } from "@ethersproject/address"
import { Contract } from "@ethersproject/contracts"
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import { AddressZero } from "@ethersproject/constants"
import { useMemo } from 'react';
import { AddressesType } from '../constants/addresses';
import ERC20ABI from '../../contracts/abis/ERC20.json'
import FortEuropeanOptionABI from '../../contracts/abis/FortEuropeanOption.json';
import FortLeverABI from '../../contracts/abis/FortLever.json';
import NestPriceABI from '../../contracts/abis/NestPrice.json';
import CofixSwapABI from '../../contracts/abis/CofixSwap.json';
import FortPRCABI from '../../contracts/abis/FortPRC.json';
import { ZERO_ADDRESS } from '../utils';

function isAddress(value: any): string | false {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

function getSigner(
    provider:Web3Provider, 
    account:string
): JsonRpcSigner {
    return provider.getSigner(account).connectUnchecked()
}

export function getContract(
    address: string, 
    ABI: any, 
    provider:Web3Provider, 
    account: string
): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw new Error(`${address} is wrong!!`);
    }
    return new Contract(address, ABI, getSigner(provider, account))
}

export function useContract(
    addresses: AddressesType, 
    ABI: any
): Contract | null {
    const {library, account, chainId} = useWeb3()
    return useMemo(() => {
        if (!library || !(library instanceof Web3Provider) || !account || !ABI || !chainId || addresses[chainId] === ZERO_ADDRESS) return null
        try {
            return getContract(addresses[chainId], ABI, library, account)
        } catch (error) {
            console.error('can not useContract', error)
            return null
        }
    }, [addresses, ABI, library, account, chainId])
}

export function getERC20Contract(address:string, provider:Web3Provider, 
    account: string): Contract | null {
    return getContract(address, ERC20ABI, provider, account)
}

export function ERC20Contract(addresses: AddressesType): Contract | null {
    return useContract(addresses, ERC20ABI);
}

export function FortEuropeanOption(addresses: AddressesType): Contract | null {
    return useContract(addresses, FortEuropeanOptionABI)
}

export function FortLever(addresses: AddressesType): Contract | null {
    return useContract(addresses, FortLeverABI)
}

export function NestPriceContract(): Contract | null {
    return useContract(NestPriceAddress, NestPriceABI)
}

export function CofixSwapContract(): Contract | null {
    return useContract(CofixSwapAddress,CofixSwapABI)
}

export function FortPRCContract(addresses: AddressesType): Contract | null {
    return useContract(addresses, FortPRCABI)
}
