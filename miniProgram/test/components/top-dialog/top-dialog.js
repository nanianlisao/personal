/**
 * 描述： 顶部弹出组件标签 
 * 传参： height：最大高度 默认为600rpx
 * 调用方式：selectComponent获取到实例 调用showDialog()
 * 暴露方法：cancle 取消输入内容
 * 创建时间 2018-07-02 陈翔 c597219320@aliyun.com
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: Number,
      value: 600
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showMask: false,
    showTxt: false,
    transition: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDialog() {
      this.setData({
        showMask: true,
        showTxt: true
      })
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setData({
          transition: true
        })
      }, 200)
    },
    hideDialog() {
      console.log('hideDialog')
      this.setData({
        transition: false
      })
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.setData({
          showMask: false,
          showTxt: false
        })
      }, 200)
    }
  }
})