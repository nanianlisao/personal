import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image } from '@tarojs/components'
import { Axios, goPage } from '@utils/util'
import './search.styl'
type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
    searchKey: string
    dataList: Array<any>
    page: number
    pageSize: number
    totalCount: number
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Search {
    props: IProps;
    state: PageState,
}

interface Lengthwise {
    length: number;
}

function returnArg<T extends Lengthwise>(arg: T): number {
    return arg.length
}
class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchKey: '',
            dataList: [],
            page: 1,
            pageSize: 10,
            totalCount: 0,
        }

    }

    componentWillMount() {
        this.getDataList()
        var aa = returnArg('aaa')
        console.log(aa)
    }

    // 获取列表
    async getDataList() {
        let { searchKey, page, pageSize } = this.state
        let res = await Axios.get(`news/list`, {
            title: searchKey,
            startIndex: (page - 1) * pageSize,
            pageSize
        })
        console.log(res);
        let dataList = res.data.items
        this.state.totalCount = res.data.totalCount
        this.setState({
            dataList: page === 1 ? dataList : [...this.state.dataList, ...dataList],
            showLoading: res.data.totalCount <= this.state.pageSize ? 3 : 2,
            finish: true
        })
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        let { searchKey, dataList } = this.state
        return (
            <View className='page-search'>
                <View className="search flex-between">
                    <View className="input flex-center">
                        <View className='search-img'><Image mode='aspectFill' src={require('@asset/img/search.png')} /></View>
                        <Input type="text" placeholder="搜索" focus placeholder-style='color: #B5B5B5' value={searchKey} />
                    </View>
                    <View className="cancel">取消</View>
                </View>
                <View className="search-list">
                    {dataList.map((item, index) => (
                        <View key={'a' + index} className="item" >
                            <View className="item-left">
                                <Image className='item-dot' mode='aspectFill' src={require('@asset/img/dot_blue.png')} />
                            </View>
                            <View className="item-right">
                                <View className="item-title line1">{item.title}</View>
                                <View className="item-time">{item.yyyy}</View>
                            </View>
                            <View className='line-img'><Image className='full-box' mode='aspectFill' src={require('@asset/img/line.png')} /></View>
                        </View>
                    ))}
                </View>
            </View>
        )
    }

}
export default Search as ComponentClass<PageOwnProps, PageState>