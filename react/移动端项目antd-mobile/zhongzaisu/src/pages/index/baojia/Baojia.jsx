import React from 'react'
import { InputItem, SearchBar,Modal } from 'antd-mobile'
import BaojiaList from 'components/baojiaList/BaojiaList'
import 'pages/index/baojia/Baojia.less'
import Constant from 'util/Constant'
import { goPage, Axios } from 'util/util'
const alert = Modal.alert
export default class Baojia extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeList: [],
            offerTypeId: '',
            tabIndex: null,
            title: '',
            tempTitle: ''
        }
    }

    componentWillMount() {
        var baojiaTab = localStorage.getItem('baojiaTab')
        if (baojiaTab) {
            localStorage.removeItem('baojiaTab')
            baojiaTab = JSON.parse(baojiaTab)
            this.state.tabIndex = baojiaTab.tabIndex
            this.state.offerTypeId = baojiaTab.json.offerTypeId
            this.state.title = baojiaTab.json.title
            this.state.tempTitle = baojiaTab.json.tempTitle
        }
        this.getTypeList()
        console.log('报价')
    }

    // 获取报价分类
    async getTypeList() {
        let res = await Axios.get('/offer/type/list',{
            appId: Constant.data.app_id
        })
        // console.log(res)
        res.data.items.unshift({
            id: '',
            name: '全部报价'
        })
        this.setState({
            typeList: res.data.items,
        })
        // if (this.state.tabIndex) {
        //     this.setState({
        //         offerTypeId: res.data.items[this.state.tabIndex].id
        //     })
        // }
    }

    getMemberDetail() {
        if (localStorage.getItem('token')) {
            if (Constant.data.timerss && Date.now() - Constant.data.timerss <= 60 * 1000) {  // 更新数据
                return Constant.data.memberDetail
            } else {
                return Axios.get('/member/final/level').then((res) => {
                    Constant.data.timerss = Date.now()
                    Constant.data.memberDetail = res.data
                    return res.data
                })
            }
        } else {
            return {}
        }
    }


    render() {
        console.log('render')
        let { typeList, offerTypeId, tabIndex } = this.state
        let translateX = 1.3 / 2 + tabIndex * 2.5
        return (
            <main className="baojia-page">
                <div className="tabCtn">
                    <div className="search">
                        <SearchBar
                            value={this.state.tempTitle}
                            onChange={(e) => {
                                this.setState({ tempTitle: e })
                            }}
                            onSubmit={(e) => {
                                this.setState({
                                    title: e
                                })
                            }}
                            style={{ width: '5.4rem', marginLeft: '0.4rem' }}
                            placeholder="输入您感兴趣的词进行搜索"
                            showCancelButton={false}
                            cancelText=" "
                        />
                        <div className="release" onClick={async () => {
                            var res = await this.getMemberDetail()
                            if (res.level == 1 || res.level == 2) {
                                alert('提示', '您没有权限发布报价，升级会员享受更高权力', [
                                    { text: '取消' },
                                    {
                                        text: '去升级', onPress: () => {
                                            goPage('/mine/levelUp')
                                        }
                                    }
                                ])
                            } else {
                                goPage('/baojia/release')
                            }
                        }}>发布</div>
                    </div>
                    <div className='wrapper'>
                        {typeList.map((item, index) => {
                            return (
                                <div className={['tab', tabIndex === index ? 'act' : ''].join(" ")} key={index} onClick={() => {
                                    this.setState({
                                        offerTypeId: item.id,
                                        tabIndex: index,
                                        title: ''
                                    })
                                }}>{item.name}</div>
                            )
                        })}
                        <div className='slider' style={{ transform: 'translateX(' + translateX + 'rem)', background: '#24C789' }}></div>
                    </div>
                </div>
                <BaojiaList
                    loadUrl='/offer/list/app'
                    json={{
                        title: this.state.title,
                        offerTypeId: this.state.offerTypeId,
                        appId: Constant.data.app_id
                    }}
                    goDetailCallback={() => {
                        if (this.state.tabIndex) {
                            localStorage.setItem('baojiaTab', JSON.stringify({
                                tabIndex: this.state.tabIndex,
                                json: {
                                    title: this.state.title,
                                    offerTypeId: this.state.offerTypeId,
                                    tempTitle: this.state.tempTitle
                                }
                            }))
                        }
                    }}
                />
            </main >
        )
    }
}