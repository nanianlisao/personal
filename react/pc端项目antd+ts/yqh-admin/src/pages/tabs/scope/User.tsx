import * as React from 'react';
import { Layout, Table, Button, Modal, message, Input } from 'antd';
import InputCom from "../../../components/input/InputCom";
import { Axios, EventValue, ColumnProps } from "../../../utils/util";
import UserModal from './UserModal'
import constant from "../../../utils/Constant";
const confirm = Modal.confirm;
export interface IObjectAny {
  [propName: string]: any
}

export interface IUserState {
  current: number,
  dataSource: IObjectAny[],
  firstPassword: string,
  modelObj: IObjectAny,
  passwordUserId: string,
  phone: string,
  secondPassword: string,
  showPassModal: boolean,  // Boolean 修改密码弹出框显示
  showModal: boolean,
  tableLoading: boolean,
  tempUserName: string,
  tempPhone: string,
  total: number,
  userName: string,
}

export default class User extends React.Component<IObjectAny, IUserState> {

  columns: Array<ColumnProps<IObjectAny>> = [{
    title: '序号',
    dataIndex: 'sort',
    key: 'sort',
    render: (text, record, index) => (
      <span>{index + 1 + (this.state.current - 1) * 10}</span>
    )
  }, {
    title: '员工姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record) => (
      <div>
        <Button
          className="margin-right-5"
          onClick={() => {
            if (record.state == 1) {
              this.banUser(record.id)
            } else {
              this.recoverUser(record.id)
            }
          }}
          type={record.state === 1 ? "primary" : undefined}
        >{record.state === 1 ? '离职' : '恢复'}</Button>
        <Button
          className="margin-right-5"
          disabled={record.state == 3}
          onClick={() => {
            this.setState({
              showPassModal: true,
              passwordUserId: record.id,
              firstPassword: '',
              secondPassword: ''
            })
          }} type="primary">重置密码</Button>
        <Button
          className="margin-right-5"
          disabled={record.state == 3}
          onClick={() => {
            this.setState({
              showModal: true,
              modelObj: record
            })
          }} type="primary">修改资料</Button>

      </div>
    )
  }];

  constructor(props: IObjectAny) {
    super(props);
    this.state = {
      current: 1,
      dataSource: [],
      firstPassword: '',
      modelObj: {},
      passwordUserId: '',
      phone: '',
      secondPassword: '',
      showPassModal: false,  // Boolean 修改密码弹出框显示
      showModal: false,
      tableLoading: false,
      tempUserName: '',
      tempPhone: '',
      total: 1,
      userName: '',

    };
  }

  hideModel = () => {
    this.setState({
      showModal: false
    })
    this.getUserList(this.state.current);
  }

  async del(id: number) {
    confirm({
      title: '删除员工',
      content: '您确定要删除该员工么？',
      okText: "删除",
      cancelText: "取消",
      onOk: async () => {
        try {
          await Axios.post(`/user/delete/${id}`)
          message.success("删除成功");
          this.getUserList(this.state.current);
        } catch (e) {
          console.log(e);
        }
      },
    });
  }

  recoverUser = async (id: number) => {
    try {
      await Axios.post(`/user/${id}/recover`)
      message.success("恢复成功");
      this.getUserList(this.state.current);
    } catch (e) {
      console.log(e);
    }
  }


  componentDidMount() {
    this.getUserList();
  }

  // 查询员工列表
  getUserList = async (page = 1, pageSize = constant.data.pageSize) => {
    try {
      this.setState({
        tableLoading: true,
      });
      let para = {
        "pageSize": pageSize,
        "startIndex": (page - 1) * pageSize,
        "name": this.state.userName,
      };
      let res = await Axios.get("/user/list", para);
      console.log(res.data.items);
      res.data.items.map((item: IObjectAny, index: number) => {
        item.key = index
      });
      this.setState({
        tableLoading: false,
        dataSource: res.data.items,
        total: res.data.totalCount,
      })

    } catch (e) {
      console.log(e);
    }
  };

  // 重置密码
  restPassword = async () => {
    if (!this.state.firstPassword) {
      message.warning("请输入新密码");
      return
    }
    if (!this.state.secondPassword) {
      message.warning("请再次确认密码");
      return
    }
    if (this.state.secondPassword !== this.state.firstPassword) {
      message.warning("两次密码不一致");
      return
    }
    try {
      await Axios.post(`/user/modify/password`, {
        firstPassword: this.state.firstPassword,
        secondPassword: this.state.secondPassword,
        userId: this.state.passwordUserId
      })
      this.setState({
        showPassModal: false,
        passwordUserId: '',
        firstPassword: '',
        secondPassword: ''
      })
      message.success("重置成功成功");
    } catch (e) {
      console.log(e);
    }
  }

  // 冻结
  banUser = async (id: number) => {
    try {
      await Axios.post(`/user/${id}/delete`)
      message.success("离职成功");
      this.getUserList(this.state.current);
    } catch (e) {
      console.log(e);
    }
  }



  render() {
    return (
      <Layout>
        <div style={{ "marginBottom": "10px" }}>
          <Button
            type="primary"
            size="large"
            style={{ "width": "150px" }}
            onClick={() => {
              this.setState({
                showModal: true,
                modelObj: {}
              })
            }}
          >添加员工</Button>
          <span className="small-warning-font" style={{ marginLeft: '20px' }}>员工权限仅限登陆B端小程序，可以进行验票&查看参会人员。</span>
        </div>
        <div style={{ "marginBottom": "10px", display: 'flex' }}>
          <Input
            placeholder="员工姓名"
            onChange={(e) => {
              this.setState({
                tempUserName: e.target.value
              })
            }}
            style={{ "width": "150px", marginRight: "5px" }}
          />
          <Button type="primary" style={{ "width": "100px", marginRight: "5px" }} onClick={() => {
            let { tempUserName } = this.state
            this.setState({
              userName: tempUserName,
            }, () => {
              this.getUserList()
            })
          }}>搜索</Button>
        </div>
        <Table
          rowKey={record => record.id}
          style={{ "backgroundColor": "#FFF" }}
          dataSource={this.state.dataSource}
          columns={this.columns}
          onChange={(e: any) => {
            this.setState({
              current: e.current
            })
            this.getUserList(e.current)
          }}
          pagination={{
            total: this.state.total,
            current: this.state.current,
            showTotal: (total) => {
              return `共${total}条`
            }
          }}
          loading={this.state.tableLoading}
          bordered={true}
        />
        <UserModal
          visible={this.state.showModal}
          hideModel={this.hideModel}
          obj={this.state.modelObj}
        />
        <Modal
          width="400px"
          visible={this.state.showPassModal}
          title="重置密码"
          onCancel={() => {
            this.setState({
              showPassModal: false
            })
          }}
          onOk={this.restPassword}
        >
          <InputCom
            errMsg="请输入新密码"
            type="text"
            placeholder="请输入新密码"
            inputWidth="200px"
            value={this.state.firstPassword ? this.state.firstPassword : ''}
            validate={true}
            onChange={(value: EventValue) => {
              this.setState({
                firstPassword: value as string
              })
            }}
          />
          <InputCom
            errMsg="再次输入新密码"
            type="text"
            placeholder="再次输入新密码"
            inputWidth="200px"
            value={this.state.secondPassword ? this.state.secondPassword : ''}
            validate={true}
            onChange={(value: EventValue) => {
              this.setState({
                secondPassword: value as string
              })
            }}
          />
        </Modal>
      </Layout>
    )
  }
}
