import React from 'react'
import { SearchBar, Carousel, Modal } from 'antd-mobile';
import './Home.less'
import { goPage, Axios, postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant'
import { HomeGoodsStyles } from 'components/goods-style/GoodsStyles'
const alert = Modal.alert
var chunk = function (array, size) {
  var result = [];
  for (var x = 0; x < Math.ceil(array.length / size); x++) {
    var start = x * size;
    var end = start + size;
    result.push(array.slice(start, end));
  }
  return result;
}
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: Constant.getPicUrl(),
      homePageBanner: [],
      goodsRecommendVos: [],
      topicGoods: [],
      categoryQueryVos: []
    }
  }

  componentDidMount() {
    this.getHomeDetail()
  }

  // 获取首屏的数据
  async getHomeDetail() {
    if (!Constant.data.storesId) { // 如果不存在店铺id 就进行查询
      var longitude = '', latitude = '';
      await new Promise((resolve, reject) => {
        // setTimeout(() => {
        if (window.env == 'wx') {
          if (window.env === 'wx' && window.ws && window.ws.readyState != 1) {
            Constant.data.taskArr.push({ type: 'getLocationNoSetting', key: 'getLocationNoSetting' })
          } else {
            postMessage('getLocationNoSetting', 'getLocationNoSetting')
          }
          onMessage('getLocationNoSetting', data => {
            longitude = data.longitude;
            latitude = data.latitude
            resolve()
          })
        } else {
          resolve()
        }
        // }, 500)
      })
      let res2 = await Axios.get('/stores/list/app', {
        longitude: longitude,
        latitude: latitude,
      })
      console.log(res2)
      if (res2.data.items.length === 0) {
        alert('提示', '当前应用未添加店铺，请添加店铺后再次进入')
        return
      }
      Constant.data.storesVos = res2.data.items[0]
      Constant.data.storesId = res2.data.items[0].id
    } else if (!Constant.data.storesVos.name) { // 存在店铺id 但是不存在店铺详情 查询一次
      console.log('查询店铺详情')
      let res3 = await Axios.get('/stores/list/app', {
        id: Constant.data.storesId
      })
      if (res3.data.items.length === 0) {
        alert('提示', '未查询到该店铺详情')
        return
      }
      Constant.data.storesVos = res3.data.items[0]
    }
    document.title = Constant.data.storesVos.name

    let res = await Axios.get(`/viewPager/shopping/home/page/${Constant.data.appId}/${Constant.data.storesId}`)
    console.log(res)
    // 为了webview分享时 带入storesId
    postMessage('storesId', Constant.data.storesId)
    this.setState({
      goodsRecommendVos: res.data.goodsRecommendVos,
      homePageBanner: res.data.homePageBanner,
      topicGoods: res.data.topicGoods,
      categoryQueryVos: chunk(res.data.categoryQueryVos, 5),

    })
  }

  render() {
    let { imgUrl, goodsRecommendVos, homePageBanner, topicGoods, categoryQueryVos } = this.state
    return (
      <main className="page-home">
        <section className="header flex-between">
          <div className="shop-name flex-center" onClick={() => {
            goPage('/home/shop')
          }}>
            <span className="text-overflow-1">{Constant.data.storesVos.name}</span>
            <img src={require('common/img/arrowRG.png')} alt="" />
          </div>
          <div className="search-w" onClick={() => {
            goPage('/home/search')
          }}>
            <SearchBar
              placeholder="请输入商品名" maxLength={15}
              showCancelButton={false}
              disabled={true}
              clearTextOnFocus={false}
            />
            <div className="searchNull"></div>
          </div>
          <div className="home-more" onClick={() => {
            goPage('/home/category')
          }}>
            <img src={require('common/img/home_more.png')} alt="" />
          </div>
        </section>
        <section className="swiper">
          {homePageBanner.length > 0 ? <Carousel
            className='top-swiper'
            autoplay={true}
            infinite
            autoplayInterval={4000}
          >
            {homePageBanner.map((x, i) => (
              <img
                onClick={() => {
                  if (x.text) {
                    localStorage.setItem('bannerDetail', x.text)
                    goPage('/home/bannerDetail')
                  }
                }}
                src={imgUrl + x.imgFileId}
                alt=""
                className="banner"
                key={i}
              />
            ))}
          </Carousel> : ""}
          {categoryQueryVos.length > 0 ?
            <Carousel
              className='category-swiper'
            >
              {categoryQueryVos.map((y, index) => (
                <div className="category-list flex-center" key={index}>
                  {y.map((x, i) => (
                    <div className="category-item flex-middle" key={i} onClick={() => {
                      localStorage.setItem('categoryId', x.id)
                      goPage(`/home/category`)
                    }}>
                      <img src={imgUrl + x.logoFileId} alt="" />
                      <span>{x.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Carousel> : ""}
        </section>
        {Constant.data.appId != 126 ? <section className="home-get" onClick={() => {
          goPage('/home/addTicket')
        }}>
          <img src={require('common/img/home_get.png')} alt="" />
        </section> : ""}
        {topicGoods.length > 0 ? <section className="theme-wrap">
          <div className="theme-top flex-between">
            <div className="theme-left theme-item" onClick={() => {
              goPage(`/home/themeDetail?id=${topicGoods[0].id}`)
            }}>
              <img src={imgUrl + topicGoods[0].imgFileId} alt="" />
            </div>
            <div className="theme-right flex-between">
              {topicGoods.length > 1 ? <div className="theme-item" onClick={() => {
                goPage(`/home/themeDetail?id=${topicGoods[1].id}`)
              }}>
                <img src={imgUrl + topicGoods[1].imgFileId} alt="" />
              </div> : ""}
              {topicGoods.length > 2 ? <div className="theme-item" onClick={() => {
                goPage(`/home/themeDetail?id=${topicGoods[2].id}`)
              }}>
                <img src={imgUrl + topicGoods[2].imgFileId} alt="" />
              </div> : ""}
            </div>
          </div>
          {topicGoods.slice(3).map((x, i) => (
            <div className="theme-more theme-item" key={i} onClick={() => {
              goPage(`/home/themeDetail?id=${x.id}`)
            }}>
              <img src={imgUrl + x.imgFileId} alt="" />
            </div>
          ))}
        </section>
          : ""}
        <section className="goods-list flex-between">
          {goodsRecommendVos.map((x, i) =>
            <HomeGoodsStyles
              style={{
                flexShrink: 0,
                marginBottom: '0.1rem'
              }}
              onClick={() => {
                goPage(`/home/goodsDetail?id=${x.goodsTemplateId}`)
              }}
              key={i}
              name={x.goodsTemplateQueryVo && x.goodsTemplateQueryVo.name}
              price={x.goodsTemplateQueryVo && x.goodsTemplateQueryVo.price}
              salesCount={x.goodsTemplateQueryVo && x.goodsTemplateQueryVo.sales}
              fileId={x.goodsTemplateQueryVo && x.goodsTemplateQueryVo.imgFileId}
            />
          )}
        </section>
      </main>
    )
  }
}