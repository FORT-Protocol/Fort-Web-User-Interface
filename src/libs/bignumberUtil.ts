import { BigNumberish } from '@ethersproject/bignumber'
import BigNumber from 'bignumber.js'

export const parseToBigNumber = (n: BigNumberish | BigNumber) => {
  if (n === '') {
    return new BigNumber(0)
  }

  if (typeof n === 'undefined') {
    return new BigNumber(NaN)
  }

  if (n instanceof BigNumber) {
    return n
  }

  if (typeof n === 'string') {
    return new BigNumber(n)
  }

  if (n.toString) {
    return new BigNumber(n.toString())
  }

  return new BigNumber(NaN)
}

// decimals 为代币精度，formatPrecision 为显示精度
export const formatNumber = (n: BigNumber | BigNumberish, decimals = 18, formatPrecision = 4) => {
  return parseToBigNumber(parseToBigNumber(n).toFixed(decimals))
    .toFormat(formatPrecision)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '')
}
