import React from 'react';
import { Modal, message, Icon, Upload } from 'antd';
import { beforeImgUpload } from "../../utils/util";
import constant from "../../utils/Constant";
export interface IUploadComponentProps {
    imgSize: string // 图片尺寸
    title: string   // 标题
    maxLength: number  // 最多可以为多少张，默认一张
    showPreviewIcon: boolean
    fileList: any[]
    onChange: (arg1: string[]) => void,
    required?: boolean // 是否是必传项（多一个*）
}

export interface IUploadComponentState {
    imgUrl: string,
    previewVisible: boolean
    previewImg: string
    fileList: any[],
}

export default class UploadComponent extends React.Component<IUploadComponentProps, IUploadComponentState> {
    static defaultProps = {
        imgSize: "50px*50px",   // 提示语中 图片尺寸大小
        title: "上传封面图",   // 标题
        maxLength: 1, // 最大数量
        showPreviewIcon: true, // 是否可预览图片
        fileList: [],
        onChange: () => {
            console.log('1')
        }
    }

    constructor(props: IUploadComponentProps) {
        super(props);
        this.state = {
            imgUrl: constant.getPicUrl(),
            previewVisible: false, // 预览图片
            previewImg: "",
            fileList: props.fileList.map((x: string) => ({    // 数据列表
                uid: x,
                fileId: x,
                url: constant.getPicUrl() + x,
            })),
        };
    }

    componentWillReceiveProps(props: IUploadComponentProps) {
        if (JSON.stringify(props.fileList) !== JSON.stringify(this.props.fileList)) {
            let fileList = props.fileList.map((x: string) => ({    // 数据列表
                uid: x,
                fileId: x,
                url: constant.getPicUrl() + x,
            }))
            this.setState({
                fileList
            })
        }
    }

    // 封面图 及视频更改
    public handleChange(info: any) {
        if (info.file.status === 'done') {
            if (info.file.response) {
                if (info.file.response.retCode == 0) {
                    setTimeout(() => { // 更改state 和更改props都会引起组件重新render 增加一个定时器，防止页面闪烁
                        let fileId = info.file.response.data.fileId;
                        this.props.onChange([...this.props.fileList, fileId])
                    }, 200)
                } else {
                    message.warning(info.file.response.retMsg);
                }
            }
            return
        }
        let fileList = info.fileList;
        this.setState({
            fileList
        });
    }


    public render() {
        return (
            <div>
                <div className={["upload-banner-modal-div", this.props.required ? " required-mark" : ""].join(" ")}>
                    <div className="upload-banner-modal-span-div">
                        <span>{this.props.title}</span>
                    </div>
                    <div className="upload-banner-modal-upload-div">
                        <div>
                            <span className="small-warning-font">
                                图片格式必须为：png,bmp,jpeg,jpg,gif；不可大于5M；
                            </span>
                            <span className="small-warning-font">
                                建议使用png格式图片，以保持最佳效果；建议图片尺寸为{this.props.imgSize}
                            </span>
                        </div>
                        <Upload
                            name="file"
                            listType="picture-card"
                            showUploadList={{ showPreviewIcon: this.props.showPreviewIcon, showRemoveIcon: true }}
                            onPreview={(e: any) => {
                                this.setState({
                                    previewImg: e.url,
                                    previewVisible: true
                                })
                            }}
                            fileList={this.state.fileList}
                            action={constant.getUpload() + "/file/upload"}
                            onRemove={(e) => {
                                this.state.fileList.forEach((item: { uid: string; fileId: any; }, index: any) => {
                                    if (item.uid == e.uid) {
                                        let newFileList = this.props.fileList.filter((x: any) => x !== item.fileId)
                                        this.props.onChange(newFileList)
                                    }
                                })
                            }}
                            onChange={(info) => {
                                this.handleChange(info)
                            }}
                            beforeUpload={beforeImgUpload}
                        >
                            {this.state.fileList.length >= this.props.maxLength ? null : (<div>
                                <Icon type='plus' />
                                <div className="ant-upload-text">上传</div>
                            </div>)}
                        </Upload>
                    </div>
                </div>
                <Modal
                    visible={this.state.previewVisible}
                    zIndex={10000}   // 盖过ueditor
                    footer={null}
                    onCancel={() => {
                        this.setState({
                            previewVisible: false
                        })
                    }}>
                    <div style={{ color: '#f00', marginBottom: '10px' }}>提示：可通过右键另存为，保存图片</div>
                    <img alt="" style={{ width: '100%' }} src={this.state.previewImg} />
                </Modal>
            </div>
        )
    }
}
