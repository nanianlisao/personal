/**
 *
 * 文件名：countUp.js  数字滚动效果
 *
 * 创建人：陈翔 - c597219320@aliyun.com
 *
 * 创建时间：2018年10月24日 上午11:24:16
 *
 * 版权所有：
 */
var randomNum = (num, range = 0.1) => Math.random() * num * range * 2 + num * (1 - range);

/**
 * 功能描述：小程序数字动态改变效果
 * @param data      小程序变量
 * @param startVal  开始值 
 * @param endVal    结束值
 * @param target    目标对象，建议传入this
 * @param during    动画时长 单位s
 * @param decimals  小数点位数 单位s
 * @return {void} 无返回值
 * 
 * 例子：小程序页面调用 创建类实例
 * const demo = new CountUp('data', 100, 1000, this,2,1);
 * demo.start() // 开始动画
 * 
 * demo.setValue(31) // 赋新值开始动画
 */
export default class CountUp {
  constructor(data, startVal, endVal, target, during = 2, decimals = 0) {
    this.target = target
    this.data = data // data值
    this.during = during // 持续时间
    this.decimals = decimals // 小数位
    this.endVal = endVal // 结束值
    this.startVal = startVal // 开始值
    this.case = startVal < endVal // ture 为增 ，false为减
    this.target.setData({
      [data]: startVal
    })
  }
  // 开始变值
  start() {
    clearInterval(this.timer)
    let num = this.startVal;
    let timeDur = (this.endVal - this.startVal) / (this.during * 20 * (Math.pow(10, this.decimals)))
    timeDur = randomNum(timeDur)
    console.time()
    this.timer = setInterval(() => {
      if ((this.case && num >= this.endVal) || (!this.case && num <= this.endVal)) {
        console.log((this.case && num >= this.endVal), (!this.case && num <= this.startVal))
        clearInterval(this.timer)
        console.timeEnd()
      }
      this.target.setData({
        [this.data]: num.toFixed(this.decimals)
      })
      num = this.case ? Math.min(num + timeDur, this.endVal) : Math.max(num + timeDur, this.endVal)
      this.startVal = num
    }, 50 / Math.pow(10, this.decimals))
  }
  // 重新赋值
  setValue(num) {
    this.startVal = this.endVal
    this.endVal = Number(num)
    this.case = this.startVal < this.endVal
    this.start()
  }
}