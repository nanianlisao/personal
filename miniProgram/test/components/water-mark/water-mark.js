/**
 * 描述： 集梦宣传水印 
 * 传参： to 水印跳转链接地址
 * 调用方式：selectComponent获取到实例
 * 无返回值
 * 创建时间 2018-07-02 陈翔 c597219320@aliyun.com
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    to: {
      type: String,
      value: '/pages/index/index/index'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goindex() {
      wx.navigateTo({
        url: this.data.to,
      })
    }
  }
})