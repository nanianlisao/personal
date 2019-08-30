import * as React from 'react';
import { Layout, Button, message, Modal } from 'antd';
import InputCom from "../../../components/input/InputCom";
import UploadImg from "../../../components/upload/UploadComponent";
// import UEditor from '../../../components/ueditor/Ueditor';
import { Axios, clone } from "../../../utils/util";
import constant from "../../../utils/Constant";
export interface IObjectAny {
  [propName: string]: any
}

export interface ISettingState {
  setting: {
    remark: string,
    fileId: string,
    phone: string,
  }
  previewVisible: boolean
  previewImg: string

}

export default class Setting extends React.Component<IObjectAny, ISettingState> {
  // public Ueditor: UEditor | null = null;
  constructor(props: IObjectAny) {
    super(props);

    this.state = {
      setting: {
        remark: '',
        fileId: '',
        phone: '',
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
      let res = await Axios.get("/app/service/list");
      console.log(res)
      if (res.data) {
        let setting: any = clone(res.data);
        this.setState({
          setting,
        }, () => {
          // setTimeout(() => {
          //   setting.remark ? (this.Ueditor as UEditor).setContent(setting.remark) : (this.Ueditor as UEditor).setContent("");
          // }, 500);
        })
      }
    } catch (e) {
      console.log(e);
    }
  }

  save = async () => {
    // this.state.setting.remark = (this.Ueditor as UEditor).getContent();
    try {
      await Axios.post("/app/service/create", this.state.setting, true);
      message.success("操作成功");
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    let setting = this.state.setting;
    return (
      <Layout>
        <InputCom
          title="联系电话"
          inputWidth="200px"
          placeholder="请输入联系电话"
          errMsg="联系电话不能为空"
          validate={true}
          value={this.state.setting.phone}
          onChange={(value: string) => {
            setting.phone = value;
            this.setState({
              setting
            })
          }}
        />
        <UploadImg
          title="上传分享海报"
          imgSize="180px*180px"
          fileList={setting.fileId ? setting.fileId.split(',') : []}
          onChange={(fileList) => {
            setting.fileId = fileList.join(',');
            this.setState({
              setting
            })
          }}
        />
        {/* <div style={{ position: "relative", display: "flex" }}>
          <div style={{ width: "110px", lineHeight: "32px", flexShrink: 0 }}>
            <span>报名成功广告</span>
          </div>
          <div >
            <div style={{ marginBottom: "10px" }}>
              <span className="small-warning-font">展示在报名成功页下方 </span>
            </div>
            <UEditor
              id="content"
              width="600px"
              height="300px"
              ref={(el) => this.Ueditor = el as UEditor}
            />
          </div>
        </div> */}

        <div className="upload-banner-modal-div" style={{ padding: "30px 300px", display: "block" }}>
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
    )
  }
}
