import { BigNumber } from "ethers";

export const PRICE_FEE = BigNumber.from(normalToBigNumber("0"));
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const BASE_AMOUNT = BigNumber.from('1000000000000000000');
export const BASE_2000ETH_AMOUNT = BigNumber.from('2000000000000000000000');
export const COFIX_THETA = BigNumber.from('30');

/**
 * BigNumber转为浮点字符串
 * @param num BigNumber
 * @param decimals token精度（USDT为6位，大部分为18位）
 * @param fix 保留小数点后位数
 * @param exZero 是否清除0
 * @returns 浮点字符串
 */
export function bigNumberToNormal(
  num: BigNumber,
  decimals: number = 18,
  fix: number = 18
): string {
  const str = num.toString();
  const strLength = str.length;
  var newStr: string;
  if (strLength > decimals) {
    newStr =
      str.substr(0, strLength - decimals) +
      "." +
      str.substr(strLength - decimals, strLength);
  } else {
    var baseStr: string = "";
    for (var i = 0; i < decimals - strLength; i++) {
      baseStr += "0";
    }
    newStr = "0." + baseStr + str;
  }
  // 除0
  var resultBaseStr = newStr;
  if (resultBaseStr.indexOf(".") !== -1) {
    const resultBaseStrArray = resultBaseStr.split(".");
    resultBaseStr =
      resultBaseStrArray[0] + "." + resultBaseStrArray[1].substr(0, fix);
  }
  if (fix <= 6 || fix === 10) {
    while (resultBaseStr[resultBaseStr.length-1] === '0') {
      resultBaseStr = resultBaseStr.substr(0, resultBaseStr.length-1)
      if (resultBaseStr[resultBaseStr.length-1] === '.') {
        resultBaseStr = resultBaseStr.substr(0, resultBaseStr.length-1)
        break
      }
    }
  }
  return resultBaseStr;
}

/**
 * 字符串转为BigNumber
 * @param num 数字字符串
 * @param decimals token精度（USDT为6位，大部分为18位）
 * @returns BigNumber
 */
export function normalToBigNumber(
  num: string,
  decimals: number = 18
): BigNumber {
  const pointNum = num.indexOf(".");
  var baseStr: string = "";
  var i = 0;
  if (pointNum !== -1) {
    // 有小数
    const strArray = num.split(".");
    if (strArray[1].length > 18) {
      throw Error("normalToBigNumber:more decimals");
    }
    for (i; i < decimals - strArray[1].length; i++) {
      baseStr += "0";
    }
    return BigNumber.from(strArray[0] + strArray[1] + baseStr);
  } else {
    // 没有小数
    for (i; i < decimals; i++) {
      baseStr += "0";
    }
    return BigNumber.from(num + baseStr);
  }
}

export function getBaseBigNumber(num: number): BigNumber {
  var numStr = "1";
  for (var i = 0; i < num; i++) {
    numStr += "0";
  }
  return BigNumber.from(numStr);
}

/**
 * gasLimit默认增加
 * @param value 默认gaslImit
 * @returns 默认gaslImit增加10%
 */
export function addGasLimit(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 1000)).div(BigNumber.from(10000));
}

/**
 * 截取省略地址字符串
 * @param address 完整地址字符串
 * @returns 省略地址字符串
 */
export function showEllipsisAddress(address: string): string {
  return address.substr(0, 8) + "...." + address.substr(address.length - 6, 6);
}

export function checkWidth():boolean {
  const width = window.innerWidth;
  const breakpoint = 1000;
  return width < breakpoint ? false : true
}

export function formatInputNum(value: string): string {
  return value
    .replace(/[^\d.]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".")
    .replace(
      // eslint-disable-next-line no-useless-escape
      /^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d\d).*$/,
      "$1$2.$3"
    )
    .replace(/^\./g, "");
}

export function forMoney(value: string) {
  // eslint-disable-next-line no-useless-escape
  value = parseFloat((value + "").replace(/[^\d\.-]/g, "")) + "";
  var l = value.split(".")[0].split("").reverse(),
    r = value.split(".")[1];
  var t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}
