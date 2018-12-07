/**
 * 描述： dialog弹出框 
 * 传参： title 标题 content 弹窗内容 cancelText 弹窗取消按钮文字 confirmText 弹窗确认按钮文字
 * 调用方式：selectComponent获取到实例 调用showDialog()
 * 无返回值： 监听cancelEvent，confirmEvent弹窗取消和确定事件
 * 创建时间 2018-08-07 陈翔 c597219320@aliyun.com
 */
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '弹窗内容'
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    isShow: {
      type: Boolean,
      value: false
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    // isShow: false
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */

    //隐藏弹框
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      console.log('cancelEvent')
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      //触发成功回调
      console.log('confirmEvent')
      this.triggerEvent("confirmEvent");
    }
  }
})