import React from 'react';
import { Layout, Table, Button, Modal, message, Select, Input } from 'antd';
import InputCom from "../../../components/input/InputCom";
import { Axios, ColumnProps, EventValue } from "../../../utils/util";
import constant from "../../../utils/Constant";
const Option = Select.Option;
export interface IObjectAny {
  [propName: string]: any
}

export interface IRecordState {
  [propName: string]: any
}


export default class Record extends React.Component<IObjectAny, IRecordState> {

  columns: Array<ColumnProps<IObjectAny>> = [{
    title: '序号',
    dataIndex: 'userId',
    key: 'userId',
    render: (text, record, index) => (
      <span>{index + 1 + (this.state.current - 1) * 10}</span>
    )
  }, {
    title: '签到时间',
    dataIndex: 'addTime',
    key: 'addTime',
  }, {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  }, {
    title: '联系方式',
    dataIndex: 'phone',
    key: 'phone',
  }, {
    title: '所在会场',
    dataIndex: 'roomName',
    key: 'roomName',
  }, {
    title: '场次名称',
    dataIndex: 'activityVenuesName',
    key: 'activityVenuesName',
  }, {
    title: '参与活动',
    dataIndex: 'activityName',
    key: 'activityName',
  }];


  constructor(props: IObjectAny) {
    super(props);
    this.state = {
      showModal: false,
      current: 1,
      tableLoading: false,
      temSearch: {},  // 临时search paramer
      actList: [], // 活动列表
      changciList: [], // 场次列表
      searchPara: {},


      role: '',
      phone: '',
      userName: '',
      tempPhone: '',
      signVenuesId: '',
      typeList: [],
      modelObj: {},
      dataSource: [],
    };
  }

  componentDidMount() {
    this.getRecordList();
    this.getActList()  // 查询所有活动
  }

  hideModel = () => {
    this.setState({
      showModal: false
    })
    this.getRecordList(this.state.current);
  }

  getRecordList = async (page = 1, pageSize = constant.data.pageSize) => {
    try {
      this.setState({
        tableLoading: true,
      });
      let para = {
        "pageSize": pageSize,
        "startIndex": (page - 1) * pageSize,
        ...this.state.searchPara
      };
      let res = await Axios.get("/check/in/record/list", para);
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

  // 查询所有活动
  async getActList() {
    let res = await Axios.get("/activity/list", {
      pageSize: 1000,
      startIndex: 0
    })
    this.setState({
      actList: res.data.items
    })
  }

  // 查询活动下所有场次
  async getChangciList(id: number) {
    let res = await Axios.get("/activity/venues/list", {
      pageSize: 1000,
      startIndex: 0,
      activityId: id
    })
    this.setState({
      changciList: res.data.items
    })
  }



  render() {
    let { temSearch, actList, changciList } = this.state
    let actListOptions = actList.map((x: IObjectAny, index: number) => {
      return (
        <Option value={x.id} key={index}>{x.name}</Option>
      )
    })
    let changciListOptions = changciList.map((x: IObjectAny, index: number) => {
      return (
        <Option value={x.id} key={index}>{x.name}</Option>
      )
    })

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
          >后台签到</Button>&nbsp;&nbsp;
                <Button
            size="large"
            type="primary" style={{ "width": "150px", marginRight: "5px" }}
            onClick={() => {
              window.open(constant.getNetWork() + "/check/in/record/export/" + constant.getToken());
            }}>导出全部</Button>
        </div>
        <div style={{ "marginBottom": "10px", display: 'flex' }}>
          <Input
            placeholder="输入昵称搜索"
            value={temSearch.userName}
            onChange={e => {
              temSearch.userName = e.target.value
              this.setState({
                temSearch
              })
            }}
            style={{ "width": "150px", marginRight: "5px" }}
          />
          <Select
            style={{ width: "150px", marginRight: "5px" }}
            value={temSearch.activityId ? temSearch.activityId : ""}
            onChange={(e: number | string) => {
              temSearch.activityId = e
              if (e) {
                temSearch.activityVenuesId = ""
                this.getChangciList(e as number)
              }
              this.setState({
                temSearch
              })
            }}
          >
            <Option value="" key="all">全部活动</Option>
            {actListOptions}
          </Select>
          <Select
            style={{ width: "150px", marginRight: "5px" }}
            value={temSearch.activityVenuesId ? temSearch.activityVenuesId : ""}
            onChange={(e: EventValue) => {
              temSearch.activityVenuesId = e
              this.setState({
                temSearch
              })
            }}
          >
            <Option value="" key="unikey">全部场次</Option>
            {changciListOptions}
          </Select>
          <Button type="primary" style={{ "width": "100px", marginRight: "5px" }} onClick={() => {
            this.setState({
              searchPara: temSearch
            }, () => {
              this.getRecordList()
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
            this.getRecordList(e.current)
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
        <Modal
          width="400px"
          visible={this.state.showModal}
          title="后台签到"
          onCancel={() => {
            this.setState({
              showModal: false
            })
          }}
          onOk={async () => {
            if (!this.state.signVenuesId) {
              message.warning('请输入签到码')
              return
            }
            await Axios.post(`/check/in/record/inspect/ticket/${this.state.signVenuesId}`, {}, true);
            message.success("签到成功");
            this.setState({
              loading: false,
              signVenuesId: '',
              showModal: false
            })
            this.getRecordList();
          }}
          confirmLoading={this.state.loading}
        >
          <InputCom
            errMsg="请输入签到码"
            type="text"
            placeholder="可通过扫码枪或直接输入"
            title="输入签到码"
            inputWidth="200px"
            value={this.state.signVenuesId ? this.state.signVenuesId : ''}
            validate={true}
            onChange={(value: string) => {
              this.setState({
                signVenuesId: value
              })
            }}
          />
        </Modal>
      </Layout>
    )
  }
}
