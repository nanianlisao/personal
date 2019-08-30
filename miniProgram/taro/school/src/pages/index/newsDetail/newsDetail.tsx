import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './newsDetail.styl'
const WxParse = require('@pulgins/wxParse/WxParse')

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
    name: string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface NewsDetail {
    props: IProps;
    state: PageState
}

class NewsDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '小红'
        }

    }
    componentDidMount() {
        const article = '<div style="color: red">我是HTML代码</div>'
        WxParse.wxParse('article', 'html', article, this.$scope, 5)
    }
    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() {

    }

    componentDidHide() { }

    render() {
        return (
            <View className='NewsDetail'>
                <import src='@pulgins/wxParse/wxParse.wxml' />
                <template is='wxParse' data='{{wxParseData:article.nodes}}' />
            </View>
        )
    }

}
export default NewsDetail as ComponentClass<PageOwnProps, PageState>