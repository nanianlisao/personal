import React from 'react'
import { withRouter } from 'react-router-dom';
import { goPage, Axios, parseQueryString } from 'util/util'
import 'pages/index/baojia/release/BaojiaRelease.less'
import Constant from 'util/Constant'
import { TextareaItem, Picker, Button, Modal, Toast } from 'antd-mobile';
const alert = Modal.alert;
class BaojiaRelease extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeList: [],
            "body": "",
            "typeListIndex": '',
            "title": "",
            offerTypeId: '',
            offerTypeName: '',
            newId: ''
        }
    }

    componentDidMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.getTypeList()
        if (options.id) {
            this.state.newId = options.id
            this.getNewsDetail(options.id)
        }
    }

    async getNewsDetail(id) {
        let res = await Axios.get(`/offer/detail/${id}`)
        console.log(res)
        this.setState({
            "body": res.data.body,
            "title": res.data.title,
            offerTypeId: res.data.offerTypeId,
            offerTypeName: res.data.offerTypeName,
        })
    }

    // 获取报价分类
    async getTypeList() {
        let res = await Axios.get('/offer/type/list/app',{
            appId: Constant.data.app_id
        })
        res.data.map((x, index) => {
            x.label = x.name
            x.value = index
        })
        this.setState({
            typeList: res.data,
        })
    }

    async submit() {
        let { body, title, offerTypeId } = this.state
        if (!title) {
            alert('请输入标题')
            return
        }
        if (!body) {
            alert('请输入内容')
            return
        }
        if (!offerTypeId) {
            alert('请选择行业')
            return
        }
        let url = '/offer/save/app'
        let options = {
            "body": body,
            "offerTypeId": offerTypeId,
            "title": title
        }
        if (this.state.newId) {
            url = '/offer/modify'
            options.id = this.state.newId
        }
        try {
            let res = await Axios.post(url, options)
            alert('提示', '报价发布成功，请等待审核', [
                {
                    text: '确定', onPress: () => {
                        this.props.history.goBack()
                    }
                },
            ])
        } catch (e) {
            alert('提示', e.res.retMsg, [
                { text: '确定' },
            ])
        }
    }

    render() {
        let { typeList, title, body, typeListIndex, offerTypeId, offerTypeName } = this.state
        return (
            <main className="baojiaRelease-page">
                <div className="borderRadius section">
                    <TextareaItem
                        placeholder="请输入标题"
                        rows={4}
                        count={60}
                        value={title}
                        onChange={(e) => {
                            this.setState({
                                title: e
                            })
                        }}
                    />
                </div>
                <div className="borderRadius section">
                    <TextareaItem
                        placeholder="请输入内容"
                        rows={6}
                        count={1000}
                        value={body}
                        autoHeight
                        onChange={(e) => {
                            this.setState({
                                body: e
                            })
                        }}
                    />
                </div>
                <Picker data={typeList} cols={1} value={typeListIndex} onOk={(e) => {
                    this.setState({
                        typeListIndex: e,
                        offerTypeName: typeList[e[0]].name,
                        offerTypeId: typeList[e[0]].id
                    })
                }}>
                    <div className="choose-type section">
                        <span>{offerTypeId ? offerTypeName : '请选择发布的行业'}</span>
                        <img src={require('common/img/rArrow.png')} alt="" />
                    </div>
                </Picker>
                <div className="submit">
                    <Button className="submit-btn" onClick={() => {
                        this.submit()
                    }} activeStyle={{ opacity: '0.8' }}>提交发布</Button>
                </div>
            </main >
        )
    }
}

export default withRouter(BaojiaRelease)