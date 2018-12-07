// components/foot-dialog/foot-dialog.js
/**
 * 描述： 搜索框组件
 * 传参： height 搜索框高度 bgc 搜索框背景色
 * 调用方式：selectComponent获取到实例 默认展示
 * 返回值： 监听submit 获取到输入内容
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
      value: 56
    },
    bgc: {
      type: String,
      value: '#EFEFF4'
    },
    placeholder: {
      type: String,
      value: '请输入您感兴趣的内容...'
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    name:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit(e) {
      let name = e.detail.value.name
      if (name.trim()) {
        this.triggerEvent('submit', name)
      } else {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
      }
    },
    confirm(e) {
      let name = e.detail.value
      if (name.trim()) {
        this.triggerEvent('submit', name)
      } else {
        wx.showToast({
          title: '请输入内容',
          icon: 'none'
        })
      }
    },
    cancle(){
      this.setData({
        name:''
      })
    }
  }
})