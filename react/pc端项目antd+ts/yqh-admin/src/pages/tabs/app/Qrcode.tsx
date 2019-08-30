import * as React from 'react';
import { Layout } from 'antd';
import { Axios } from "../../../utils/util";
import constant from "../../../utils/Constant";
export interface IQrcodeProps {
  [propName: string]: any
}

export interface IQrcodeState {
  codeImgUrl: string
}

export default class Qrcode extends React.Component<IQrcodeProps, IQrcodeState> {
  constructor(props: IQrcodeProps) {
    super(props);
    this.state = {
      codeImgUrl: "",
    }
  }

  componentDidMount() {
    this.getCodeUrl();
  }

  getCodeUrl = async () => {
    let user = JSON.parse(constant.getLocalStorage('user') as string)
    if (user.appCode == "103") {
      this.setState({
        codeImgUrl: "13e63a5fbbc76cb1fc1d2f1fef068241"
      })
    } else {
      let res = await Axios.get("/app/qrcode", {
        qrUrl: "pages/index/index",
        scene: "1"
      });
      this.setState({
        codeImgUrl: res.data
      })
    }
  }

  render() {
    return (
      <Layout>
        <div style={{ margin: "50px 0 0 100px", textAlign: "center", width: "400px" }}>
          <img
            style={{ width: "400px", height: "400px" }}
            src={constant.getPicUrl() + this.state.codeImgUrl} /><br /><br />
          <span style={{ fontSize: "18px", }}>可右键另存为，进行保存</span>
        </div>
      </Layout>
    )
  }
}
