import { BigNumber } from "ethers";

export const PRICE_FEE = normalToBigNumber('0.01')

export function bigNumberToNormal(num: string, decimals: number): string {
    const strLength = num.length
    if (strLength > decimals) {
        return num.substr(0, strLength - decimals) + "." + num.substr(strLength - decimals, strLength)
    } else {
        var baseStr: string = "";
        for (var i = 0; i < decimals - strLength; i++) {
            baseStr += "0"
        }
        return "0." + baseStr + num
    }
}

export function normalToBigNumber(num: string, decimals: number = 18): string {
    const pointNum = num.indexOf(".")
    var baseStr: string = ""
    var i = 0
    if (pointNum > 1) {
        throw new Error("normalToBigNumber, numString is wrong!");
    }
    if (num.indexOf(".") === 1) {
        // 有小数
        const strArray = num.split(".")
        for(i; i < decimals - strArray[1].length; i++) {
            baseStr += "0"
        }
        return strArray[0] + strArray[1] + baseStr
    } else {
        // 没有小数
        for(i ;i < decimals; i++) {
            baseStr += "0"
        }
        return num + baseStr
    }
}

export function addGasLimit(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000 + 1000)).div(BigNumber.from(10000))
}