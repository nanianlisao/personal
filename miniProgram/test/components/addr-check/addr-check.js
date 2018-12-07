/**
 * 描述： 省市区三级联动地区选择器 
 * 传参： zindex：默认为省市区三级，为2时为省市两级选择器
 * 调用方式：selectComponent获取到实例 调用show()
 * 返回值： 监听confirm，获取provinceCodeId，provinceName，cityCodeId，cityName，countyCodeId，countyName
 * 创建时间 2018-07-02 陈翔 c597219320@aliyun.com
 */

const app = getApp()
const windowWidth = wx.getSystemInfoSync().windowWidth
var util = require('../../utils/util')
var Promise = require('../../utils/bluebird')
var regeneratorRuntime = require('../../utils/runtime')
import {
  areaServer
} from "../../xcx/area/Area"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    zindex: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 3 // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    layerShow: false,
    regionPickerShow: true,
    pickerTranslate: windowWidth / 750 * 610
  },
  ready() {
    this.data.indexArr = new Array(this.data.zindex).fill(0)
    this.getCity();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show(e) {
      this.setData({
        pickerTranslate: 0,
        layerShow: true
      })
    },
    /**
     * 选择区域 确定
     */
    async sure() {
      this.setData({
        pickerTranslate: this.rpxToPx(610),
        layerShow: false,
      })
      this.triggerEvent('confirm', this.data.addrData)
    },

    areaChange(e) { //如果是在选择 商品名称//test2.27goodsName、goodsType用picker代替picker-view，有冗余代码
      this.data.indexArr = e.detail.value;
      this.getCity();
    },

    //获取区域
    async getCity() {
      // 获取省
      const [provinceIndex, cityIndex, districtIndex] = this.data.indexArr
      var res = await areaServer.areaList({
        pid: 0
      }, 1, 40);
      this.setData({
        provinceData: res.resultObj
      })
      // 获取市
      var res = await areaServer.areaList({
        pid: this.data.provinceData[provinceIndex].id
      }, 1, 20);
      this.setData({
        cityData: res.resultObj
      })
      // 获取区
      var res = await areaServer.areaList({
        pid: this.data.cityData[cityIndex].id
      }, 1, 20);
      this.setData({
        districtData: res.resultObj
      })
      let addrData = {
        provinceCodeId: this.data.provinceData[provinceIndex].id,
        provinceName: this.data.provinceData[provinceIndex].name,
        cityCodeId: this.data.cityData[cityIndex].id,
        cityName: this.data.cityData[cityIndex].name,
      }
      if (districtIndex) {
        addrData.countyCodeId = this.data.districtData[districtIndex].id
        addrData.countyName = this.data.districtData[districtIndex].name
      }
      this.data.addrData = addrData
    },

    cancel() {
      this.setData({
        pickerTranslate: this.rpxToPx(610),
        layerShow: false,
      });
    },
    rpxToPx(s) {
      return windowWidth / 750 * s
    },

  }
})