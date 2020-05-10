/**
 * 金额转中文
 * 思路：
 * 个 十   百   千   万
 *    十万 百万 千万 亿 
 *    十亿 百亿 千亿
 * 1  2    3    4    5
 *    6    7    8    9   
 *    10
 * 
 */
export function getAmountChinese ( val ) {
  const amount = +val
  if ( Number.isNaN( amount ) ) return ''
  const NUMBER = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const N_UNIT1 = ['', '拾', '佰', '仟']
  const N_UNIT2 = ['', '万', '亿']
  const D_UNIT = ['角', '分']
  let [integer, decimal] = amount.toFixed( 2 ).split( '.' )
  if ( integer && integer.length > 12 ) return '金额过大无法计算'
  let res = ''
  // 整数部分
  if ( integer ) {
    for ( let i = 0, len = integer.length; i < len; i++ ) {
      const num = integer.charAt( i )
      const pos = len - i - 1 // -1 排除个位干扰
      if ( i === len - 1 && num === '0' ) break
      res += NUMBER[num] + N_UNIT1[( pos ) % 4]
      if ( pos % 4 === 0 ) { // 排除个位数后 万和亿位置都是4的倍数
        res += N_UNIT2[Math.floor( ( pos ) / 4 )]
      }
    }
  }
  res += '圆'
  if ( decimal ) {
    // 小数部分
    for ( let i = 0; i < 2; i++ ) {
      const num = decimal.charAt( i )
      num !== '0' && ( res += NUMBER[num] + D_UNIT[i] )
    }
  }
  return res
}

/**
 * 计算两个时间差经历的时间的文字描述
 * @param {*} timestamp - 毫秒
 */
export const timeCalculate = ( start, end ) => {
  const label = ['分钟', '小时', '天', '月', '年']
  const unit = [60, 60, 24, 30, 12]
  let restTime = Math.floor( ( end - start ) / 1000 )
  let res = ''
  for ( let i = 0, len = unit.length; i < len; i++ ) {
    const pos = len - i // 从年开始算，分钟换算成年 === Math.pow(60, 4)
    const temp = unit.slice( 0, pos ).reduce( ( p, c ) => p * c, 1 )
    const time = Math.floor( restTime / temp )
    time > 0 && ( res += time + label[pos - 1] )
    restTime -= time * temp
  }
  return res
}


/**
 * 简易防抖函数
 * @param {Function} func -防抖目标函数
 * @param {Number}} gap - 防抖时间间隔
 */
export const debounce = ( func, gap ) => {
  let timer
  return function ( ...arg ) {
    clearTimeout( timer )
    timer = setTimeout( () => {
      func( ...arg )
    }, gap )
  }
}
/**
 * 下划线转驼峰
 * @param {String} name - 字符串
 */
export const toHump = name => name.replace( /\_(\w)/g, function ( all, letter ) {
  return letter.toUpperCase()
} )