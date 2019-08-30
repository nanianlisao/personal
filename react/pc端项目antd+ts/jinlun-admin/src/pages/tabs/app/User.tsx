import * as React from 'react'
import { Layout, Table, Button, Modal, message, Input, Tag } from 'antd'
import InputCom from "../../../components/input/InputCom"
import { Axios, EventValue, ColumnProps } from "../../../utils/util"
import UserModal from './UserModal'
import constant from "../../../utils/Constant"
const confirm = Modal.confirm
export interface IObjectAny {
  [propName: string]: any
}

export interface IUserState {
  current: number,      // 当前分页
  userList: IObjectAny[], // 数据列表
  firstPassword: string,  // 重置密码第一次输入密码
  modelObj: IObjectAny, //  当前选中人员详情对象
  passwordUserId: string, // 重置密码是用户id
  phone: string,  // 用户手机号
  secondPassword: string,  // 重置密码第二次输入密码
  showPassModal: boolean,  // Boolean 修改密码弹出框显示
  showModal: boolean,  // Boolean 添加修改员工弹出框显示
  tableLoading: boolean, // table 数据加载loading
  searchTempUserName: string, // 搜索时临时userName
  total: number,   // data总条数
  userName: string, // 搜索时userName
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
    title: '关联店铺',
    dataIndex: 'storesVos',
    key: 'storesVos',
    render: (text, record) => {
      return (
        <div>{record.storesVos && record.storesVos.map((item: IObjectAny) => (
          <Tag key={item.id}>{item.name}</Tag>
        ))}</div>
      )
    }
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
              this.del(record.userId)
            } else {
              this.recoverUser(record.userId)
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
              passwordUserId: record.userId,
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
  }]

  constructor(props: IObjectAny) {
    super(props)
    this.state = {
      current: 1,      // 当前分页
      userList: [], // 数据列表
      firstPassword: "",  // 重置密码第一次输入密码
      modelObj: {}, //  当前选中人员详情对象
      passwordUserId: "", // 重置密码是用户id
      phone: "",  // 用户手机号
      secondPassword: "",  // 重置密码第二次输入密码
      showPassModal: false,  // Boolean 修改密码弹出框显示
      showModal: false,  // Boolean 添加修改员工弹出框显示
      tableLoading: false, // table 数据加载loading
      searchTempUserName: "", // 搜索时临时userName
      total: 1,   // data总条数
      userName: "", // 搜索时userName
    }
  }


  componentDidMount() {
    this.getUserList()
  }


  // 查询员工列表
  private async getUserList(page: number = this.state.current, pageSize = constant.data.pageSize): Promise<void> {
    this.setState({
      tableLoading: true,
    })
    let res = await Axios.get("/user/list", {
      pageSize,
      startIndex: (page - 1) * pageSize,
      userName: this.state.userName,
    })
    res.data.items.map((item: IObjectAny) => {
      item.key = item.userId
    })
    this.setState({
      tableLoading: false,
      userList: res.data.items,
      total: res.data.totalCount,
    })
  }

  // 隐藏人员修改modal
  private hideModal(): void {
    this.setState({
      showModal: false
    })
    this.getUserList()
  }

  // 离职
  private async del(userId: number): Promise<void> {
    confirm({
      title: '离职员工',
      content: '您确定要将该员工改为离职状态么？',
      onOk: async () => {
        try {
          await Axios.post(`/user/ban/${userId}`)
          message.success("操作成功")
          this.getUserList()
        } catch (e) {
          console.log(e)
        }
      },
    })
  }

  // 恢复员工
  private async recoverUser(userId: number): Promise<void> {
    await Axios.post(`/user/enable/${userId}`)
    message.success("恢复成功")
    this.getUserList()
  }

  // 重置密码
  private async restPassword(): Promise<void> {
    if (!this.state.firstPassword) {
      message.warning("请输入新密码")
      return
    }
    if (!this.state.secondPassword) {
      message.warning("请再次确认密码")
      return
    }
    if (this.state.secondPassword !== this.state.firstPassword) {
      message.warning("两次密码不一致")
      return
    }
    try {
      await Axios.post(`/user/password/reset`, {
        password: this.state.firstPassword,
        userId: this.state.passwordUserId
      })
      this.setState({
        showPassModal: false,
        passwordUserId: '',
      })
      message.success("重置密码成功")
    } catch (e) {
      console.log(e)
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
          <span className="small-warning-font" style={{ marginLeft: '5px' }}>员工登录后只能看到关联店铺的订单列表和店铺列表</span>
        </div>
        <div style={{ "marginBottom": "10px", display: 'flex' }}>
          <Input
            placeholder="员工姓名"
            onChange={(e) => {
              this.setState({
                searchTempUserName: e.target.value
              })
            }}
            style={{ "width": "150px", marginRight: "5px" }}
          />
          <Button type="primary" style={{ "width": "100px", marginRight: "5px" }} onClick={() => {
            let { searchTempUserName } = this.state
            this.setState({
              userName: searchTempUserName,
            }, () => {
              this.getUserList()
            })
          }}>搜索</Button>
        </div>
        <Table
          style={{ "backgroundColor": "#FFF" }}
          dataSource={this.state.userList}
          columns={this.columns}
          onChange={(e: any) => {
            this.setState({
              current: e.current
            }, this.getUserList)
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
          hideModal={() => { this.hideModal() }}
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
          onOk={()=>{
            this.restPassword()
          }}
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
