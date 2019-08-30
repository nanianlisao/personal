import React from 'react'
import { withRouter } from 'react-router-dom';
import { TextareaItem, Picker, Button, ImagePicker, Toast, Modal } from 'antd-mobile';
import { goPage, Axios, parseQueryString, postMessage, onMessage } from 'util/util'
import Constant from 'util/Constant'
import 'pages/index/quanzi/release/QuanziRelease.less'
const alert = Modal.alert
class QuanziRelease extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgUrl: Constant.getPicUrl(),
            options: {},
            files: [],
        }
    }
    componentDidMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        this.state.options.type = options.kind
    }

    onChange = async (files, type, index) => {
        console.log(files, type, index);
        let { options } = this.state
        if (type == 'add') {
            var file = files[files.length - 1].file;
            var formData = new FormData()
            formData.append('file', file)
            let res = await Axios.post("/file/upload", formData, false, Constant.getUpload())
            files[files.length - 1].url = this.state.imgUrl + res.data.fileId
            files[files.length - 1].fileId = res.data.fileId
        }
        let fileIds = files.map(x => x.fileId)
        options.fileId = fileIds.join(',')
        this.setState({
            files,
            options
        });
    }

    async submit() {
        let { options } = this.state
        if (!options.body) {
            alert('请输入内容')
            return
        }
        if (!options.lat) {
            alert('请选择地址')
            return
        }

        try {
            let res = await Axios.post('/circle/save', options)
            console.log(res)
            Toast.success('发布成功')
            setTimeout(() => {
                goPage('/index')
            }, 500)
        } catch (e) {
            alert('提示', e.res.retMsg, [
                { text: '确定' },
            ])
        }

    }

    render() {
        let { options, files, imgUrl } = this.state
        return (
            <main className="quanziRelease-page">
                <div className="content">
                    <div className="borderRadius">
                        <TextareaItem
                            placeholder="请输入要发布的内容"
                            rows={8}
                            count={256}
                            value={options.body}
                            onChange={(e) => {
                                options.body = e
                                this.setState({
                                    options
                                })
                            }}
                        />
                    </div>
                    <div className="choose-media">
                        <div>
                            <div className="media-img" style={{ display: options.fileType == 1 ? 'block' : 'none' }}>
                                <ImagePicker
                                    files={files}
                                    onChange={this.onChange}
                                    onAddImageClick={(e) => {
                                    }}
                                    onImageClick={(index, fs) => { console.log(index, fs) }}
                                />
                            </div>
                            {options.fileType == 2 ? <div className="media-video" style={{ display: options.fileType == 2 ? 'block' : 'none' }}>
                                <video id="media" controls poster={imgUrl + options.coverFileId}>
                                    <source src={imgUrl + options.fileId} />
                                </video>
                            </div> : ""}
                        </div>
                        <div style={{ display: options.fileType ? "none" : 'block' }}>
                            <div className="media-type">
                                <div className="type-item">
                                    <input type="file" accept="video/*" className="choose-video"
                                        onChange={async (e) => {
                                            let file = e.target.files[0]
                                            Toast.loading('上传视频中...',10)
                                            var formData = new FormData()
                                            formData.append('file', file)
                                            let res = await Axios.post("/file/upload?type=1", formData, false, Constant.getUpload())
                                            console.log(res)
                                            options.fileId = res.data.fileId
                                            options.coverFileId = res.data.coverFileId
                                            options.fileType = 2
                                            Toast.hide()
                                            this.setState({
                                                options
                                            })
                                        }} />
                                    <img src={require("common/img/video.png")} alt="" />
                                </div>
                                <div className="type-item" onClick={() => {
                                    options.fileType = 1
                                    this.setState({ options })
                                }}>
                                    <img src={require("common/img/img.png")} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="choose-type" onClick={() => {
                        postMessage('location', 'location')
                        onMessage('location', (data) => {
                            options.lat = data.latitude
                            options.lon = data.longitude
                            options.address = data.address
                            this.setState({
                                options
                            })
                        })
                        // var data = {
                        //     address: "江苏省南京市秦淮区太平南路1号",
                        //     errMsg: "chooseLocation:ok",
                        //     latitude: 32.040109,
                        //     longitude: 118.79521,
                        //     name: "新世纪广场",
                        // }
                        // options.lat = data.latitude
                        // options.lon = data.longitude
                        // options.address = data.address
                        // this.setState({
                        //     options
                        // })


                    }}>
                        <div className="choose-left"><img src={require('common/img/loc.png')} alt="" /><span>{options.lat ? options.address : '请选择地址'}</span></div>
                        <img src={require('common/img/rArrow.png')} alt="" />
                    </div>
                </div>
                <div className="submit">
                    <Button className="submit-btn" activeStyle={{ opacity: '0.8' }} onClick={() => {
                        this.submit()
                    }}>提交发布</Button>
                </div>
            </main >
        )
    }
}

export default withRouter(QuanziRelease)