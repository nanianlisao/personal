/**
 * 描述： 页面中部弹出框，外部自定义组件
 * 传参： width，radius 页面宽度及圆角大小
 * 调用方式：selectComponent获取到实例 调用showDialog()
 * 返回值： 无返回值
 * 创建时间 2018-08-07 陈翔 c597219320@aliyun.com
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 600 // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    radius: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 20 // 属性初始值（可选），如果未指定则会根据类型选择一个
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