/**
 * Created by chenlu on 2018/11/3.
 */
import React from 'react';
import { Layout, Table, Button, Input, Modal, Row, Col, Popover, message } from 'antd';
import { Axios, ColumnProps } from "../../../utils/util";
const { Header, Content } = Layout;
const confirm = Modal.confirm;
const Search = Input.Search;
export interface IQrcodeProps {
  [propName: string]: any
}

export interface IObjectAny {
  [propName: string]: any
}
const format = 'HH:mm';
export default class ChangeAct extends React.Component<IQrcodeProps, IObjectAny> {
  constructor(props: IQrcodeProps) {
    super(props);
    this.state = {
      startIndex: 0,
      loading: false,
      visible: false,
      searchValue: "",
      store: {},
      modalDetail: {},
      dataSource: []
    };
  }

  componentWillMount() {
    this.getList()
  }

  async getList(name = '') {
    this.setState({
      loading: true
    })
    let res = await Axios.get('/active/list', {
      startIndex: this.state.startIndex,
      pageSize: 10,
      name: name
    })
    let items = res.data.items
    items.map((x: IObjectAny) => {
      x.key = x.id
    })
    this.setState({
      dataSource: items,
      loading: false,
      total: res.data.totalCount
    })
    console.log(items)
  }

  columns: Array<ColumnProps<IObjectAny>> = [{
    title: '活动名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '活动时间',
    dataIndex: 'time',
    key: 'time',
    render: (text, record) => {
      return `${record.beginTime} ~ ${record.endTime}`
    }
  }, {
    title: '活动类型',
    dataIndex: 'typeDesc',
    key: 'typeDesc',
    render: (text) => text && text.name
  }, {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    render: (text) => text == 1 ? "进行中" : "已结束"
  }, {
    title: '活动数据',
    dataIndex: 'datas',
    key: 'datas',
    render: (text, record) => (
      <div>
        <span style={{ marginRight: '20px' }}>发券{record.grantAmount}</span>
        <span>核券{record.useAmount}</span>
      </div>
    )
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => (
      <div>
        <Button className="margin-right-5" onClick={() => { this.del(record.id, index) }} type="primary" disabled={record.state != 1}>停止</Button>
        <Button onClick={() => {
          this.showActiveDetal(record)
        }} type="primary">查看券内容</Button>
      </div>
    )
  }];

  del = (id: number, index: number) => {
    confirm({
      title: '您确定要停止该活动么?',
      content: '',
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        Axios.post('/active/update/state', {
          "id": id,
          "state": 2
        })
        message.success('已停止该活动')
        this.state.dataSource[index].state = 2
        this.setState({
          dataSource: this.state.dataSource
        })
      },
    });
  }

  search = (e: string) => {
    this.getList(e)
  }

  searchButton = () => {
    this.getList(this.state.searchValue)
  }


  handleCancel = () => {
    this.setState({ visible: false });
  }
  showActiveDetal(obj: IObjectAny) {
    this.setState({
      visible: true,
      modalDetail: obj
    })
  }

  render() {
    let { modalDetail } = this.state
    let modalDetailContent = null;
    if (JSON.stringify(modalDetail) !== "{}") {
      let ruleCodeObj: IObjectAny = {} // 创建局部变量，生成表单默认值
      modalDetail.activeRuleVoList.map((x: IObjectAny) => {
        ruleCodeObj[`${x.ruleCode}Show`] = true
        ruleCodeObj[x.ruleCode] = x.ruleValue
      })
      let ticketList = null
      if (ruleCodeObj.activeId) {
        var activeStr = ruleCodeObj.activeId.slice(1, ruleCodeObj.activeId.length - 1)
        var activeArr = activeStr.split(',')
        ticketList = activeArr.map((x: any, i: number) => {
          return (<p key={i}>{x}</p>)
        })
      }
      let goodsList = null
      if (ruleCodeObj.goods && ruleCodeObj.goods != 'all') {
        var activeStr = ruleCodeObj.goods.slice(1, ruleCodeObj.goods.length - 1)
        var activeArr = activeStr.split(',')
        goodsList = activeArr.map((x: any, i: number) => {
          return (<p key={i}>{x}</p>)
        })
      }
      let fn1 = (code: number | string) => {
        if (code == 1) {
          return '无需用户领取'
        }
        if (code == 2) {
          return '需用户领取'
        }
        if (code == 3) {
          return '消费送礼赠券'
        }
      }
      let fn2 = (str: string | undefined) => {
        if (str) {
          var arr = str.split('/')
          if (arr.length == 1) {
            return { text1: '相对时间', text2: `领取后${arr[0]}天内有效` }
          } else {
            return { text1: '指定时间', text2: `${arr[0]} ~ ${arr[1]}` }
          }
        }
      }
      let fn3 = (str: string | undefined) => {
        if (str) {
          var arr = str.split(':')
          if (arr.length == 1) {
            return '不限制'
          } else {
            let o = JSON.parse(str)
            console.log(o)
            return o.hasOwnProperty('total_times') ? `限定每个用户总共参与${o['total_times']}次` : `限定每个用户每天参与${o['everyday_times']}次`
          }
        }
      }
      let receiveType = fn1(ruleCodeObj.receiveType)
      let termofvalidityObj = fn2(ruleCodeObj.termofvalidity)
      let times = fn3(ruleCodeObj.times)
      modalDetailContent = (
        <div>
          {ruleCodeObj.reduceShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>券面额</Col>
            <Col span={18}>{ruleCodeObj.reduce}元</Col>
          </Row> : ""}
          {ruleCodeObj.saleShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>折扣力度</Col>
            <Col span={18}>{ruleCodeObj.sale}折</Col>
          </Row> : ""}
          <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>{modalDetail.type == 3 ? '活动时间' : '券发放时间'}</Col>
            <Col span={18}>{modalDetail.beginTime}&nbsp;~&nbsp;{modalDetail.endTime}</Col>
          </Row>
          {ruleCodeObj.receiveTypeShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>领取类型</Col>
            <Col span={18}>{receiveType}</Col>
          </Row> : ""}
          {ruleCodeObj.totalAmountShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>发放总量</Col>
            <Col span={18}>{ruleCodeObj.totalAmount === null ? '不限制' : ruleCodeObj.totalAmount + '张'}</Col>
          </Row> : ""}
          {ruleCodeObj.minConsumeShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>最低消费</Col>
            <Col span={18}>{ruleCodeObj.minConsume === null ? '不限制' : `最低消费满${ruleCodeObj.minConsume}元可用`}</Col>
          </Row> : ""}
          {ruleCodeObj.maxPreferentialAmountShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>最高优惠</Col>
            <Col span={18}>{ruleCodeObj.maxPreferentialAmount === null ? '不限制' : `最高优惠${ruleCodeObj.maxPreferentialAmount}元`}</Col>
          </Row> : ""}
          {ruleCodeObj.termofvalidityShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>券有效期</Col>
            <Col span={18}><span>{termofvalidityObj ? termofvalidityObj.text1 : ''}</span>{termofvalidityObj ? termofvalidityObj.text2 : ''}</Col>
          </Row> : ""}
          {ruleCodeObj.goodsShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6} style={{ marginTop: '5px' }}>可使用商品</Col>
            <Col span={18}>{ruleCodeObj.goods == 'all' ? <span style={{ lineHeight: '32px' }}>全场通用</span> : <Popover
              content={(<div className="noScroll" style={{ overflowY: 'scroll', maxHeight: '200px' }}>{goodsList}</div>)}
              title="指定商品列表"
              trigger="hover"
            >
              <Button type="primary">查看可用商品</Button>
            </Popover>}</Col>
          </Row> : ""}
          {ruleCodeObj.timesShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>参与限制</Col>
            <Col span={18}>{times}</Col>
          </Row> : ""}
          {ruleCodeObj.takeoutShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>适用场景</Col>
            <Col span={18}>{ruleCodeObj.takeout == 1 ? "全场通用" : ruleCodeObj.takeout == 2 ? "仅限堂食" : "仅限外卖"}</Col>
          </Row> : ""}
          {modalDetail.remark ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>使用说明</Col>
            <Col span={18}>{modalDetail.remark}</Col>
          </Row> : ""}
          {ruleCodeObj.beginGiveMoneyShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6}>活动规则</Col>
            <Col span={18}>{ruleCodeObj.beginGiveMoney === null ? '消费即送' : `需单笔消费满${ruleCodeObj.beginGiveMoney}元`}</Col>
          </Row> : ""}
          {ruleCodeObj.activeIdShow ? <Row style={{ marginBottom: '10px' }}>
            <Col span={6} style={{ marginTop: '5px' }}>活动奖品</Col>
            <Col span={18}> <Popover
              content={(<div className="noScroll" style={{ overflowY: 'scroll', maxHeight: '200px' }}>{ticketList}</div>)}
              title="券列表"
              trigger="hover"
            // visible={this.state.showAllGoods}
            >
              <Button type="primary">查看活动券</Button>
            </Popover></Col>
          </Row> : ""}
        </div>
      )
    }
    return (
      <Layout>
        <div style={{ "marginBottom": "10px" }}>
          <Search
            placeholder="输入活动名称查询"
            onChange={e => {
              this.setState({
                searchValue: e.target.value
              })
            }}
            onSearch={this.search}
            style={{ "width": "200px" }}
          />&nbsp;&nbsp;
                    <Button type="primary" style={{ "width": "100px", marginRight: "5px" }} onClick={this.searchButton}>搜索</Button>
        </div>
        <Content>
          <Table
            style={{ "backgroundColor": "#FFF" }}
            dataSource={this.state.dataSource}
            columns={this.columns}
            onChange={(e: any) => {
              this.setState({
                startIndex: (e.current - 1) * 10,
                current: e.current
              }, this.getList)
            }}
            loading={this.state.loading}
            pagination={{
              total: this.state.total,
              current: this.state.current,
              showTotal: (total) => {
                return `共${total}条`
              }
            }}
            bordered />
        </Content>
        <Modal title={modalDetail.name}
          visible={this.state.visible}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
        >
          {modalDetailContent}
        </Modal>
      </Layout>
    )
  }
}

