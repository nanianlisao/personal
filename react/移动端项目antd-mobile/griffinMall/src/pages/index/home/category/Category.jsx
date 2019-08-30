import React from 'react'
import './Category.less'
import { goPage, Axios } from 'util/util'
import Constant from 'util/Constant'
import { LevelGoodsStyles } from 'components/goods-style/GoodsStyles'
import { connect } from 'react-redux'
import { initTab, initScrollTop, initData, dataClear } from '@/reducers/category'
class Category extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            tabList: [],
            tabIndex: 0, // 默认展示第一个
        }
    }
    componentDidMount() {
        let { tab, scrollTop, data } = this.props
        console.log(this.props)
        if (data.length > 0) {    // 用户页面回退
            this.setState({
                tabList: data,
                tabIndex: tab,
            }, () => {
                this.refs.list.scrollTo(0, scrollTop)
                this.props.dataClear()
            })
        } else {
            var id = localStorage.getItem('categoryId')
            this.getData(id)
            localStorage.removeItem('categoryId')
        }
    }

    async getData(id) {
        let res = await Axios.get('/goods/list', {
            storesId: Constant.data.storesId
        })
        console.log(res)
        let tabIndex = 0
        if (id) {
            tabIndex = res.data.categoryVoList.findIndex(x => x.id == id)
        }
        this.setState({
            tabList: res.data.categoryVoList,
            tabIndex: tabIndex
        })
    }

    reduxData() {
        var { tabIndex, tabList } = this.state
        var { initScrollTop, initData, initTab } = this.props
        if (this.props.goDetailCallback) {
            this.props.goDetailCallback()
        }
        initScrollTop(this.refs.list.scrollTop)
        initData(tabList)
        initTab(tabIndex)
    }


    render() {
        let { tabList, tabIndex, imgUrl } = this.state
        let currentObj = tabList[tabIndex] ? tabList[tabIndex] : {}
        return (
            <main className="category-page">
                <div className="tab-list">
                    {tabList.map((x, i) => (
                        <div className={["tab-item text-overflow-1", i === tabIndex ? 'act' : ''].join(' ')} key={i} onClick={() => {
                            if (tabIndex !== i) {
                                this.setState({
                                    tabIndex: i
                                })
                            }

                        }}>{x.name}</div>
                    ))}
                </div>
                <div className="right" ref="list">
                    <div className="header-poster"><img src={imgUrl + currentObj.logoTopicFileId} alt="" /></div>
                    <div className="list-wrap">
                        <div className="category-list">
                            {currentObj.subCategoryVoList && currentObj.subCategoryVoList.map((x, i) => (
                                <div className="category-item flex-middle" key={i} onClick={() => {
                                    this.reduxData()
                                    goPage(`/home/categoryDetail?id=${x.id}`)
                                }}>
                                    <img src={x.logoFileId ? imgUrl + x.logoFileId : require('common/img/0.jpg')} alt="" />
                                    <span className="text-overflow-1">{x.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="goods-list">
                            {currentObj.goodsTemplateVoList && currentObj.goodsTemplateVoList.map((x, i) => (
                                <LevelGoodsStyles
                                    onClick={() => {
                                        this.reduxData()
                                        goPage(`/home/goodsDetail?id=${x.id}`)
                                    }}
                                    style={{
                                        borderBottom: 'none',
                                        padding: '0.1rem 0'
                                    }}
                                    showDots={false}
                                    small={true}
                                    key={i}
                                    name={x.name}
                                    price={x.price}
                                    salesCount={x.sales}
                                    fileId={x.imgFileId}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main >
        )
    }
}


const mapStateToProps = (state) => {
    // console.log(state)
    return state.category
}

const mapDispatchToProps = (dispatch) => {
    return {
        initTab: (tab) => {
            dispatch(initTab(tab))
        },
        initData: (data) => {
            dispatch(initData(data))
        },
        initScrollTop: (scrollTop) => {
            dispatch(initScrollTop(scrollTop))
        },
        dataClear: () => {
            dispatch(dataClear())
        }

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Category)
