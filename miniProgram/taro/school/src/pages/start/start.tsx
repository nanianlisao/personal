import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import { Axios, goPage } from '@utils/util'
import { appId, imgUrl } from '@constants/global'
import './start.styl'
type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  data: Array<any>,
  photoType: number,
  tabIndex: number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Start {
  props: IProps;
  state: PageState
}

class Start extends Component {
  config = {}
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      photoType: 1,
      tabIndex: 0,
    }

  }
  componentWillMount() {
    this.getData()
  }

  async getData() {
    let res = await Axios.get('photo/list/applet', {
      appId: appId,
      photoType: this.state.photoType
    })
    this.setState({
      data: res.data.items
    })
  }

  jumpDown = () => {
    goPage('/pages/index/index', 'reLaunch')
  }

  componentWillReceiveProps() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    let { data, tabIndex } = this.state
    return (
      <View className="page-start">
        <Swiper
          className="start"
          indicator-dots
          current={tabIndex}
          onTransition={(e) => {
            if (tabIndex === data.length - 1 && e.detail.dx > 50) {
              this.jumpDown();
            }
          }}
          onAnimationFinish={(e) => {
            this.setState({
              tabIndex: e.detail.current
            })
          }}
        >

          {data.map((item, index) => (
            <SwiperItem key={index}>
              <Image className='full-box' src={imgUrl + item.photoFileId} mode='aspectFill' />
            </SwiperItem>
          ))}

        </Swiper >

        <View className="skip flex-center" onClick={this.jumpDown}>跳过</View>
      </View >
    )
  }
}
export default Start as ComponentClass<PageOwnProps, PageState>