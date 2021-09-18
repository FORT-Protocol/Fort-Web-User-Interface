import { BigNumber, Contract } from 'ethers';
import { ERC20Contract } from '../../libs/hooks/useContract';
import { tokenList } from './../../libs/constants/addresses';

class ERC20Token {

    contract?: Contract | null

    constructor(name: string) {
        this.contract = ERC20Contract(tokenList[name].addresses)
    }

    async balanceOf(address: string): Promise<BigNumber> {
        const value = await this.contract?.balanceOf(address)
        return BigNumber.from(value)
    }
}

export default ERC20Token