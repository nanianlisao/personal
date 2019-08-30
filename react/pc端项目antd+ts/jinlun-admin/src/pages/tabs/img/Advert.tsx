import * as React from 'react'
import { Layout, Button, message } from 'antd'
import UEditor from '../../../components/ueditor/Ueditor'
import { Axios, clone } from "../../../utils/util"
export interface IObjectAny {
  [propName: string]: any
}

export interface IAdvertState {
  setting: {
    remark: string,
    fileId: string,
  }
}

export default class Advert extends React.Component<IObjectAny, IAdvertState> {
  public Ueditor: UEditor | undefined
  constructor(props: IObjectAny) {
    super(props)
    this.state = {
      setting: {
        remark: '',   // 详情
        fileId: '',   // 封面图
      }
    }
  }

  componentDidMount() {
    this.getSetting()
  }

  private async getSetting() {
    try {
      let res = await Axios.post("/app/pay/success/detail")
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
    this.state.setting.remark = (this.Ueditor as UEditor).getContent()
    await Axios.post("/app/pay/success/create", this.state.setting, true)
    message.success("操作成功")
  }

  render() {
    return (
      <Layout>
        <div style={{ position: "relative", display: "flex" }}>
          <div style={{ width: "110px", lineHeight: "32px", flexShrink: 0 }}>
            <span>支付成功广告</span>
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
