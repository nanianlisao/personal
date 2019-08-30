import * as React from 'react';
import { Axios, ColumnProps, EventValue } from "../../../utils/util";
import constant from "../../../utils/Constant";
import { Layout, Table, Button, Input, Select, } from 'antd';
const Option = Select.Option;
export interface IObjectAny {
  [propName: string]: any
}

export interface IOrderListState {
  orderVisible: boolean,
  tableLoading: boolean,
  dateDisabled: boolean,
  para: {
    name: string,
    state: string,
    pageSize: number,
    startIndex: number
  },
  pagination: {
    current: number,
    total: number
  }
  orderList: object[],
}

export default class OrderList extends React.Component<IObjectAny, IOrderListState> {


  columns: Array<ColumnProps<IObjectAny>> = [{
    title: '交易时间',
    dataIndex: 'addTime',
    key: 'addTime'
  }, {
    title: '交易单号',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: '交易金额',
    dataIndex: 'totalFee',
    key: 'totalFee',
  }, {
    title: '会员信息',
    dataIndex: 'userName',
    key: 'userName',
    render: (text, record) => (
      <div>{text} {record.phone ? record.phone : ""}</div>
    )
  }, {
    title: '订单状态',
    dataIndex: 'state',
    key: 'stat3e',
    render: (text) => (
      <span>{text == 1 ? "待付款" : (text == 2) ? "已完成" : "已取消"}</span>
    )
  }, {
    title: '支付方式',
    dataIndex: 'payType',
    key: 'payType',
    render: () => (
      <div>微信支付</div>
    )
  }, {
    title: '交易内容',
    dataIndex: 'signVenuesQueryVos',
    key: 'signVenuesQueryVos',
    render: (text) => (
      <div>{text && text.map((x: IObjectAny, i: number) => (
        <div key={i}>{x.activityVenuesTime.slice(0, 11)} {x.activityVenuesName} {x.price}</div>
      ))}</div>
    )
  }];


  constructor(props: IObjectAny) {
    super(props);

    this.state = {
      orderVisible: false,
      tableLoading: false,
      dateDisabled: true,
      pagination: {
        current: 1,
        total: 0
      },
      para: {
        name: "",
        state: "",
        startIndex: 0,
        pageSize: 10
      },
      orderList: [],
    };
  }
  componentDidMount() {
    this.getOrderList();
  }

  getOrderList = async (page = 1, pageSize = constant.data.pageSize) => {
    try {
      this.setState({
        tableLoading: true,
      });
      let para = this.state.para;
      para.pageSize = pageSize;
      para.startIndex = (page - 1) * pageSize;
      let res = await Axios.get("/pay/list", para);
      let pagination = {
        total: res.data.totalCount,
        current: page
      }
      let data = res.data.items;
      data.map((item: IObjectAny, index: number) => {
        item.key = index;
      });
      this.setState({
        tableLoading: false,
        orderList: data,
        pagination,
      });
    } catch (e) {
      console.log(e);
    }
  }


  // 清空搜索条件
  clear = () => {
    let { para } = this.state
    para.name = ''
    para.state = ''
    this.setState({
      para
    })
  }

  render() {
    return (
      <Layout>
        <div style={{ "marginBottom": "10px" }}>
          <Input
            placeholder="输入姓名、联系方式、订单号以查询"
            value={this.state.para.name}
            onChange={(e) => {
              let para = this.state.para;
              para.name = e.target.value;
              this.setState({
                para
              })
            }}
            style={{ "width": "250px", marginRight: "5px" }}
          />
          <Select
            style={{ width: "140px", marginRight: "5px" }}
            value={this.state.para.state}
            onChange={(value: EventValue) => {
              let para = this.state.para;
              para.state = value as string;
              this.setState({
                para
              })
            }}
          >
            <Option value="">全部(订单状态)</Option>
            <Option value="1">待付款</Option>
            <Option value="2">已付款</Option>
            <Option value="-1">订单取消</Option>
          </Select>
          <Button type="primary" style={{ "width": "100px", marginRight: "5px" }}
            onClick={() => {
              this.getOrderList()
            }}>搜索</Button>
        </div>
        <Table
          style={{ "backgroundColor": "#FFF", minWidth: "1300px" }}
          dataSource={this.state.orderList}
          columns={this.columns}
          pagination={this.state.pagination}
          loading={this.state.tableLoading}
          onChange={(page) => {
            this.getOrderList(page.current);
          }}
          bordered={true}
        />
      </Layout>
    )
  }
}
