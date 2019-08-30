import * as React from 'react';
import { Layout, Button, message, Modal } from 'antd';
import { Axios, clone } from "../../../utils/util";
import UploadImg from "../../../components/upload/UploadComponent";
import constant from "../../../utils/Constant";
const imgSize = "550px * 732px"
export interface IObjectAny {
    [propName: string]: any
}

export interface IAdvertState {
    setting: {
        photoFileId?: string
    }
    previewImg: string
    previewVisible: boolean
}

export default class Advert extends React.Component<IObjectAny, IAdvertState> {
    constructor(props: IObjectAny) {
        super(props);
        this.state = {
            setting: {
                photoFileId: '',
            },
            previewVisible: false,
            previewImg: ''
        }
    }
    componentDidMount() {
        this.getSetting()
    }

    getSetting = async () => {
        try {
            let res = await Axios.get("/photo/list/advertisement");
            console.log(res.data)
            if (res.data) {
                let setting: IAdvertState["setting"] = clone(res.data)
                this.setState({
                    setting,
                })
            }
        } catch (e) {
            console.log(e);
        }
    }
    save = async () => {
        if (!this.state.setting.photoFileId) {
            message.warning("请上传广告图片");
            return;
        }
        try {
            await Axios.post("/photo/create/advertisement", this.state.setting);
            message.success("操作成功");
        } catch (e) {
            console.log(e);
        }
    }

    public render() {
        return (
            <Layout>
                <UploadImg
                    title="上传广告图片"
                    imgSize={imgSize}
                    fileList={this.state.setting.photoFileId ? this.state.setting.photoFileId.split(',') : []}
                    onChange={(fileList) => {
                        let setting = this.state.setting
                        setting.photoFileId = fileList.join(',');
                        this.setState({
                            setting
                        })
                    }}
                />
                <div className="upload-banner-modal-div" style={{ padding: "30px 130px", display: "block" }}>
                    <Button type="primary" onClick={e => {
                        this.save();
                    }}>保存</Button>
                </div>
                <Modal
                    visible={this.state.previewVisible}
                    footer={null}
                    onCancel={() => {
                        this.setState({
                            previewVisible: false
                        })
                    }}>
                    <img alt="" style={{ width: '100%' }} src={constant.getPicUrl() + this.state.previewImg} />
                </Modal>
            </Layout>
        );
    }
}
