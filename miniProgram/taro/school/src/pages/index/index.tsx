import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { appId, imgUrl } from '@constants/global'
import { Axios, goPage } from '@utils/util'
import './index.styl'

interface chunkT {  // chunkT 传入的必须是对象数组 且对象中含有title字段
  title: string
}
const chunk = function <T extends Array<chunkT>>(array: T, size: number): Array<any> {
  var result: Array<any> = [];
  for (var x = 0; x < Math.ceil(array.length / size); x++) {
    var start = x * size;
    var end = start + size;
    result.push(array.slice(start, end));
  }
  return result;
}

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  banner: Array<any>,
  catList: Array<any>,
  topicList: Array<any>,
  current: number,
  photoType: number,
}

// 新闻详情 必须要传入title
interface Objects {
  title: string
  [propName: string]: any
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: PageState
}

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props)
    this.state = {
      banner: [],
      catList: [],
      topicList: [],
      current: 0,
      photoType: 2, // 轮播图类型 
    }
  }

  componentWillMount() {
    this.getBanner() //轮播图
    this.getCatList() // 分类
    this.getTopicList() // 专题
  }

  // 获取轮播图
  async getBanner() {
    let res = await Axios.get('photo/list/applet', {
      appId,
      photoType: this.state.photoType
    })
    this.setState({
      banner: res.data.items
    })
  }

  // 获取分类列表
  async getCatList() {
    let res = await Axios.get('news/type/list/app')
    console.log(res)
    this.setState({
      catList: res.data
    })
  }

  // 获取专题列表
  async getTopicList() {
    let res = await Axios.get('topic/list/app')
    console.log(res)
    this.setState({
      topicList: res.data
    })
  }





  goSearch() {
    goPage('/pages/index/search/search')
  }
  componentWillReceiveProps() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    let { banner, current, catList, topicList } = this.state
    return (
      <View className='page-index'>
        <View className="search flex-mid">
          <View className="search-box flex-center" onClick={() => {
            this.goSearch()
          }}>
            <View className='search-img'><Image className='full-box' mode='aspectFill' src={require('@asset/img/search.png')} /></View>
            <Text>搜索</Text>
          </View>
        </View>
        <Swiper
          className="my-swiper"
          current={current}
          indicator-dots
          circular
          duration={1000}
          skip-hidden-item-layout
          previous-margin="40px"
          next-margin="40px"
          onChange={(e) => {
            this.setState({
              current: e.detail.current
            })
          }}
        >
          {banner.map((item, index) => (
            <SwiperItem
              key={item.id}
              className={index == current ? 'swiper-current' : ''}>
              <View className='card' onClick={() => {
                if (item.remark) {
                  goPage(`/pages/component/banner/banner?id=${item.id}`)
                }
              }}>
                <Image className="full-box" mode="aspectFill" src={imgUrl + item.photoFileId} />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <View className="cat">
          {catList.map((item) => (
            <View key={item.id} className="cat-item flex-mid">
              <View className='icon-img'><Image className='full-box' mode='aspectFill' src={item.fileId ? imgUrl + item.fileId : ''} /></View>
              <View className="cat-name line1">{item.name}</View>
            </View>
          ))}
        </View>
        <View className="special">
          <View className="special-title flex-mid">专题模块</View>
          <View className="special-contian">
            {topicList.slice(0, 2).map((item) => (
              <View key={item.id} className="special-card flex-mid">
                <View className='card-img'><Image className='full-box' mode='aspectFill' src={imgUrl + item.fileId} /></View>
              </View>
            ))}
          </View>
        </View>
        {topicList.slice(2) && topicList.slice(2).map((item, index) => {
          let swiperItemArr = chunk(item.newsQueryVos, 3)   // 把新闻列表按3个位单位生成一个二维数组
          console.log(swiperItemArr)
          return (
            <View key={'s' + index} className="trends">
              <View className="trends-left flex-mid">
                <View className='trends-img'>
                  <Image className='full-box' mode='aspectFill' src={imgUrl + item.fileId} />
                </View>
                <View className='line-vert-img'>
                  <Image className='full-box' mode='aspectFill' src={require('@asset/img/line_vert.png')} />
                </View>
              </View>
              <Swiper
                className="trends-list"
                autoplay
                interval={2000}
                circular
                vertical
              >
                {swiperItemArr && swiperItemArr.map((newsArr: Array<any>, index) => (
                  <SwiperItem key={'b' + index}>
                    {newsArr && newsArr.map((newObj: Objects, index) => (
                      <View className="trends-item flex-mid" key={'n' + index}>
                        {newObj.tag ? <View className="trends-item-label flex-center">{newObj.tag}</View> : ""}
                        <View className="trends-item-title line1">{newObj.title}</View>
                      </View>
                    ))}
                  </SwiperItem>
                ))}
              </Swiper>
            </View >
          )
        })
        }
      </View >
    )
  }

}
export default Index as ComponentClass<PageOwnProps, PageState>