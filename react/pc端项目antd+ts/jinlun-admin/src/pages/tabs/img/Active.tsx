import * as React from 'react'
import moment from 'moment'
import { Layout, Button, message, DatePicker } from 'antd'
import UploadImg from "../../../components/upload/UploadComponent"
import UEditor from '../../../components/ueditor/Ueditor'
import { Axios, clone } from "../../../utils/util"
const { RangePicker } = DatePicker
export interface IObjectAny {
  [propName: string]: any
}

export interface IActiveState {
  setting: {
    remark: string,
    photoFileId: string,
    endTime: string,
    beginTime: string,
    id?: number
  }
}

export default class Active extends React.Component<IObjectAny, IActiveState> {
  public Ueditor: UEditor | undefined
  constructor(props: IObjectAny) {
    super(props)
    this.state = {
      setting: {
        remark: '',   // 详情
        photoFileId: '',   // 封面图
        endTime: '',
        beginTime: '',
      }
    }
  }

  componentDidMount() {
    this.getSetting()
  }

  private async getSetting() {
    try {
      let res = await Axios.post("/app/use/ticket/detail")
      if (res.data) {
        let setting: any = clone(res.data)
        this.setState({
          setting,
        }, () => {
          setTimeout(() => {
            (this.Ueditor as UEditor).setContent(setting.remark)
          }, 500)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  private async save() {
    const { setting } = this.state
    if (!setting.beginTime) {
      message.warn('请选择活动时间')
      return
    }
    setting.remark = (this.Ueditor as UEditor).getContent()
    await Axios.post("/app/use/ticket/create", setting, true)
    message.success("操作成功")
  }

  render() {
    let setting = this.state.setting
    return (
      <Layout>
        <div className="requrie-icon-wrapper"
          style={{ display: "flex", position: "relative", marginBottom: '100px' }}>
          <div style={{ width: "110px", lineHeight: "32px" }}>
            <span>活动时间</span>
          </div>
          <RangePicker
            value={setting.beginTime ? [moment(setting.beginTime), moment(setting.endTime)] : undefined}
            placeholder={["开始时间", "结束时间"]}
            showTime={true}
            format="YYYY-MM-DD HH:mm:ss"
            // style={{ width: '380px' }}
            onChange={(dates, dateStrings) => {
              setting.beginTime = dateStrings[0];
              setting.endTime = dateStrings[1];
              this.setState({
                setting: setting
              });
            }}
          />
        </div>
        <UploadImg
          title="活动图片"
          imgSize="694px*480px"
          fileList={setting.photoFileId ? setting.photoFileId.split(',') : []}
          onChange={(fileList) => {
            setting.photoFileId = fileList.join(',')
            this.setState({
              setting
            })
          }}
        />
        <div style={{ position: "relative", display: "flex", marginTop: "80px" }}>
          <div style={{ width: "110px", lineHeight: "32px", flexShrink: 0 }}>
            <span>活动详情</span>
          </div>
          <div >
            <UEditor
              id="content"
              width="600px"
              height="300px"
              ref={(el: UEditor) => this.Ueditor = el}
            />
          </div>
        </div>
        <div className="upload-banner-modal-div" style={{ padding: "30px 300px", display: "block" }}>
          <Button type="primary" onClick={e => {
            this.save()
          }}>保存</Button>
        </div>
      </Layout>
    )
  }
}
