import React from 'react'
import { Axios, goBack } from 'util/util'
import Constant from 'util/Constant'
import './Evaluate.less'
import { TextareaItem, ImagePicker, Toast } from 'antd-mobile';

export default class Evaluate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            state: 1,
            files: [],
            typeList: [{ name: '好评', type: 1 }, { name: '中评', type: 2 }, { name: '差评', type: 3 }],
            answers: []
        }
    }

    componentWillMount() {

        let item = JSON.parse(localStorage.getItem('orderDetail'))
        let answers = item.orderGoodsVos.map(x => ({
            body: '',
            goodsTemplateId: x.goodsTemplateId,
            imgFileId: '',
            type: 1,
            files: []
        }))
        this.setState({
            item: item,
            answers: answers
        })
        console.log(item)
    }

    onChange = async (i, files, type, index) => {
        console.log(files, type, index);
        let { answers } = this.state
        if (type == 'add') {
            var file = files[files.length - 1].file;
            var formData = new FormData()
            formData.append('file', file)
            let res = await Axios.post("/file/upload", formData, false, Constant.getUpload())
            files[files.length - 1].url = this.state.imgUrl + res.data.fileId
            files[files.length - 1].fileId = res.data.fileId
        }
        let fileIds = files.map(x => x.fileId)
        answers[i].files = files
        answers[i].imgFileId = fileIds.join(',')
        this.setState({
            answers,
        });
    }

    async submit() {
        let { answers, item } = this.state
        let goodsCommentRequests = answers.map(x => ({
            body: x.body,
            goodsTemplateId: x.goodsTemplateId,
            imgFileId: x.imgFileId,
            type: x.type,
        }))
        let res = await Axios.post(`/goods/comment/add`, {
            goodsCommentRequests: goodsCommentRequests,
            orderId: item.id
        }, true)
        console.log(res)
        Toast.success('评价成功')
        setTimeout(() => {
            // localStorage.setItem('selectedTab', 'home')
            // goPage('/index')
            goBack()
        }, 500)

    }

    render() {
        let { typeList, item, answers, imgUrl } = this.state
        return (
            <main className="page-evaluate">
                <section className="evaluate-list">
                    {item.orderGoodsVos && item.orderGoodsVos.map((x, i) => {
                        let answer = answers[i]
                        return (
                            <div className="evaluate-item" key={i}>
                                <div className="header border2 flex-center">
                                    <div className="poster"><img src={imgUrl + x.imgFileId} alt="" /></div>
                                    <span>发布评价</span>
                                    <div className="type-list">{typeList.map((y, index) => (<span onClick={() => {
                                        answer.type = y.type
                                        this.setState({
                                            answer
                                        })
                                    }} className={y.type == answer.type ? 'act' : ''} key={index}>{y.name}</span>))}</div>
                                </div>
                                <div className="content">
                                    <TextareaItem
                                        className="textarea"
                                        placeholder="说出它的优点和美中不足的地方，快和大家分享吧！"
                                        rows={3}
                                        value={answer.body}
                                        onChange={(e) => {
                                            answer.body = e
                                            this.setState({
                                                answer
                                            })
                                        }}
                                    />
                                    <ImagePicker
                                        files={answer.files}
                                        onChange={this.onChange.bind(this, i)}
                                        selectable={answer.files.length < 6}
                                        onAddImageClick={(e) => {
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </section>
                <section className="footer-wrap">
                    <div className="footer flex-between">
                        <div className="footer-btn" onClick={() => {
                            this.submit()
                        }}>发布评价</div>
                    </div>
                </section>

            </main >
        )
    }
}