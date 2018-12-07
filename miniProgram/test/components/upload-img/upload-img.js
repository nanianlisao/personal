/**
 * 描述： 图片上传组件 
 * 传参： imgArr 已上传的图片 maxLength 最大图片上传数量
 * 调用方式：selectComponent获取到实例
 * 监听change 获取到用户上传的图片数组
 * 创建时间 2018-07-02 陈翔 c597219320@aliyun.com
 */
const app = getApp()
const util = require('../../utils/util')
const Promise = require('../../utils/bluebird')
const regeneratorRuntime = require('../../utils/runtime')
const qiniuUploader = require("../../utils/qiniuUploader")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgArr: {
      type: Array,
      value: []
    },
    maxLength: {
      type: Number,
      value: 6
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
  },

  ready() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 轮播图点击放大
    previewImg(e) {
      let {
        index
      } = e.currentTarget.dataset
      let urls = [...this.data.imgArr.map(x => this.data.imgUrl + x)]
      wx.previewImage({
        current: urls[index],
        urls: urls,
      })
    },

    // 图片上传
    addImg() {
      const {
        uptoken,
        domain,
      } = app.globalData
      const that = this
      wx.chooseImage({
        count: that.data.maxLength - that.data.imgArr.length,
        success(res) {
          const filePaths = res.tempFilePaths;
          filePaths.forEach((filePath) => {
            let getFileExt = name => {
              var arr = name.split('.');
              return arr[arr.length - 1]
            }
            let fileName = new Date().getTime() + parseInt(Math.random(0, 1) * 10000) + '.' + getFileExt(filePath);
            let key = 'njdream/temp/' + app.globalData.app_id + "/" + fileName;
            qiniuUploader.upload(filePath, (response) => {
              const {
                imageURL
              } = response;
              // console.log(105, imageURL);
              if (imageURL) {
                that.data.imgArr.push(fileName)
              }
              that.setData({
                imgArr: that.data.imgArr
              })
              that.triggerEvent('change', that.data.imgArr)

            }, (error) => {
              console.error('error: ' + JSON.stringify(error))
            }, {
              region: 'ECN',
              uptoken,
              domain,
              key
            }, (progress) => {
              // console.log('上传进度', progress.progress)
              // console.log('已经上传的数据长度', progress.totalBytesSent)
              // console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
            })
          });

        }
      })
    },

    // 删除图片
    delImg(e) {
      let {
        index
      } = e.currentTarget.dataset
      let {
        imgArr
      } = this.data
      wx.showModal({
        title: '提示',
        content: '是否要删除？',
        success: (res) => {
          if (res.confirm) {
            imgArr.splice(index, 1)
            this.setData({
              imgArr
            })
            this.triggerEvent('change', this.data.imgArr)
          }
        }
      })
    },
  }
})