/**
 * 描述： 日历选择器 
 * 传参： monthLength：默认为当前日期近六个月数据
 * 调用方式：selectComponent获取到实例 调用show()
 * 返回值： 监听check，获取日期字符串 如： "2018-02-18"
 * 创建时间 2018-08-07 陈翔 c597219320@aliyun.com
 */
function add0(x) {
  return String(x).length > 1 ? x : '0' + x;
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    monthLength: {
      type: Number,
      value: 6
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    weekArr: ['日', '一', '二', '三', '四', '五', '六'],
    daysCountArr: [ // 保存各个月份的长度，平年
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    monthes: []
  },
  ready() {
    this.getDate();
    this.dialog = this.selectComponent('#dialog')
    // this.show()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.dialog.showDialog()
    },
    hide() {
      this.dialog.hideDialog()
    },
    getDate() {
      let date = new Date();
      let year = add0(date.getFullYear()); //年
      let month = add0(date.getMonth() + 1); //月
      let c_day = add0(date.getDate()); //日
      let monthes = this.data.monthes;
      //先设计为6个月的数据
      for (let j = 0; j < this.data.monthLength; j++) {
        let week;
        [year, month, week] = this.checkWeek(year, month)
        let monthObj = {
          year: year,
          month: month,
          week: week
        };
        let dayArr = [];
        for (var i = 1; i < this.data.daysCountArr[month - 1] + 1; i++) {
          // 本月已经过去的时间 变为灰色
          if (j == 0 && i < c_day) {
            dayArr.push({
              date: i,
              out: true
            })
          } else {
            dayArr.push({
              date: i
            })
          }
        }
        for (let k = 0; k < week; k++) {
          dayArr.unshift({
            date: 0
          })
        }

        monthObj.dayArr = dayArr;
        month++;
        monthes.push(monthObj)
      }
      this.setData({
        monthes
      })
    },
    /**
     * 判断年份，月份，和星期
     */
    checkWeek(year, month) {

      if (month == 13) {
        year++;
        month = '01';
      }
      //如果是闰年
      let week = new Date(year, month - 1, 1).getDay();
      if (year % 4 == 0 && year % 100 != 0) {
        this.data.daysCountArr[1] = 29;
      }
      return [year, month, week]
    },
    chooseDate(e) {
      let {
        item,
        mindex
      } = e.currentTarget.dataset
      if (!item.out && item.date) {
        let date = [this.data.monthes[mindex].year, this.data.monthes[mindex].month, add0(item.date)].join('-')
        this.triggerEvent('check', date)
        this.hide()
      }
    }
  }
})