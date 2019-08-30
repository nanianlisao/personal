import React from 'react'
import moment from 'moment';
import { Button, Tabs, DatePicker, Radio, Select, Input, TreeSelect, Modal, message } from 'antd';
import InputCom from "../../../components/input/InputCom";
import { Axios } from "../../../utils/util";
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const { TextArea } = Input;
export interface IObjectAny {
  [propName: string]: any
}

export interface IAddActState {
  [propName: string]: any
}
export default class AddAct extends React.Component<IObjectAny, IAddActState> {
  constructor(props: IObjectAny) {
    super(props)
    this.state = {
      loading: false,   // 添加时控制button的loading
      ticketList: [], // 礼品券列表
      goodsList: [], // 添加商品列表
      showModal: false,
      ruleList: [], // 根据后台请求的规则列表进行渲染页面
      codeList: [], // 用于页面渲染的一些state
      timesOptions: [], // 参与限制
      formValueArr: [], // form 表单值
      addTicketList: [], // 添加的券列表
      addGoodsList: [],    //  添加的商品列表
    }
  }
  async componentDidMount() {
    this.getTicketRules()
  }

  // 查询接口 获取优惠券规则
  private async getTicketRules(): Promise<void> {
    try {
      let res = await Axios.get('/rule_app/list')
      console.log(res)
      // 返回券类型 name:string 券名称  rules:array 券规则列表
      let { formValueArr, addTicketList, addGoodsList, codeList, timesOptions } = this.state
      // 根据规则返回的券类型的长度，生成一个同长度数组，用来存数据 生成各种数据格式，为了通过ajax 传递给后台
      res.data.map((item: IObjectAny, index: number) => {
        formValueArr[index] = {}
        addTicketList[index] = []
        addGoodsList[index] = []
        // 参与限制 no_limit 不限制 total_times: 限制总次数 everyday_times: 限制每天次数 
        timesOptions[index] = ['no_limit', { total_times: '' }, { everyday_times: '' }]
        codeList[index] = {
          giveCode: '1',  // 发放总量
          useCode: '1',   // 最低消费
          timeCode: '1',  // 券有效期
          checkGoodCode: '1', // 可使用商品
          maxCountCode: '1', // 最高优惠
          activeCode: '1', // 活动规则
        }
      })
      this.setState({
        ruleList: res.data,
        formValueArr, addTicketList, addGoodsList, codeList, timesOptions
      })

    } catch (e) {
      console.log(e)
    }
  }

  // 查询当前可用于消费送礼的优惠券列表
  private async getTicketList(): Promise<void> {
    try {
      let res2 = await Axios.get('/active/list', {
        startIndex: 0,
        pageSize: 100,
        receiveType: 3,
        state: 1
      })
      this.setState({
        ticketList: res2.data.items
      })
    } catch (e) {
      console.log(e)
    }
  }

  // 查询规则 “可使用商品” 下的 商品列表
  private async getGoodsList(): Promise<void> {
    try {
      let res2 = await Axios.get('/goodsTemplate/list', {
        startIndex: 0,
        pageSize: 100,
      })
      this.setState({
        goodsList: res2.data.items
      })
    } catch (e) {
      console.log(e)
    }
  }

  // 根据当前tabIndex 创建活动 
  private async  createActive(index: number): Promise<void> {
    let {
      formValueArr,  // 表单填写内容集合
      codeList,      // 券规则默认值
      timesOptions,   //  参与限制 值的结果集
    } = this.state
    console.log(this.state)
    let formValue = formValueArr[index]
    if (formValue.activeId) {
      if (formValue.activeId.length == 0) {
        message.warn('请添加活动奖品');
        this.setState({
          loading: false
        })
        return
      } else {
        formValue.activeId = JSON.stringify(formValue.activeId)
      }
    }

    if (formValue.goods && typeof formValue.goods != 'string') {
      if (formValue.goods.length == 0) {
        message.warn('请添加商品');
        this.setState({
          loading: false
        })
        return
      } else {
        formValue.goods = JSON.stringify(formValue.goods)
      }
    }
    console.log(formValue.goods);
    if (formValue.times && typeof formValue.times != 'string') {
      if (Object.values(formValue.times)[0] !== '') {
        formValue.times = JSON.stringify(formValue.times)
      } else {
        message.warn('请录入完整信息');
        this.setState({
          loading: false
        })
        return
      }
    }
    console.log(formValue)
    for (let keys in formValue) {
      if (keys != 'dates' && keys != 'dates2' && keys != 'timesRadioKey' && keys != 'text1' && keys != 'text2') {
        if (formValue[keys] === '') {
          message.warn('请录入完整信息');
          this.setState({
            loading: false
          })
          return
        }
      }
    }

    try {
      let activeRequest: IObjectAny = { activeRuleRequestList: [] }
      for (let key in formValue) {
        if (key == 'name' || key == 'beginTime' || key == 'endTime' || key == 'remark' || key == 'type') {
          activeRequest[key] = formValue[key]
        } else if (key != 'dates' && key != 'dates2' && key != 'timesRadioKey' && key != 'text1' && key != 'text2') {
          activeRequest.activeRuleRequestList.push({
            ruleCode: key,
            ruleValue: formValue[key]
          })
        }
      }
      let res = await Axios.post('/active/create',
        activeRequest
      )
      message.success('添加成功')
      /* 清空表单数据 */
      formValueArr[index] = {}
      timesOptions[index] = ['no_limit', { total_times: '' }, { everyday_times: '' }]
      codeList[index] = {
        giveCode: '1',
        useCode: '1',
        timeCode: '1',
        checkGoodCode: '1',
        maxCountCode: '1',
        activeCode: '1',
      }
      this.setState({
        formValueArr, timesOptions, codeList
      })
    } catch (e) {

    }
    this.setState({ loading: false })
  }
  render() {
    const tabPanes = this.state.ruleList.map((x: IObjectAny, tabIndex: number) => {
      let formValue = this.state.formValueArr[tabIndex] // 提交表单的数据json
      let codes = this.state.codeList[tabIndex] // 页面渲染变量json
      let timesOptions = this.state.timesOptions[tabIndex] // 领取限制的json数组
      let rules = x.rules
      formValue.type = rules[0].type
      let defaultValue = ['name', 'beginTime', 'endTime']
      defaultValue.map(dv => {
        formValue[dv] = formValue[dv] ? formValue[dv] : ''
      })
      let ruleCodeList = [{
        name: 'totalAmount', // 发放总量
        val: null
      }, {
        name: 'times', // 参与限制
        val: ""
      }, {
        name: 'minConsume', // 最低消费
        val: null
      }, {
        name: 'reduce', // 券面额
        val: ""
      }, {
        name: 'sale', // 折扣力度
        val: ""
      }, {
        name: 'maxPreferentialAmount', // 最高优惠
        val: null
      }, {
        name: 'goods', // 可使用商品
        val: 'all'
      }, {
        name: 'activeId', // 活动奖品
        val: []
      }, {
        name: 'beginGiveMoney', // 起送金额
        val: null
      }, {
        name: 'receiveType', // 领取类型
        val: ""
      }, {
        name: 'termofvalidity', // 券有效期
        val: ""
      }]
      let ruleCodeObj: IObjectAny = {} // 创建局部变量，生成表单默认值
      ruleCodeList.map(rt => {
        ruleCodeObj[`${rt.name}Show`] = rules.some((y: IObjectAny) => y.ruleCode == rt.name)
        if (ruleCodeObj[`${rt.name}Show`]) {
          formValue[rt.name] = formValue[rt.name] ? formValue[rt.name] : rt.val
        }
      })
      let treeNode = this.state.ticketList.map((t: IObjectAny) => {
        return (
          <TreeNode value={t.id} title={t.name} key={t.id}></TreeNode>
        )
      })
      let treeNode2 = this.state.goodsList.map((t: IObjectAny) => {
        return (
          <TreeNode value={t.goodsTemplateResult.id} title={t.goodsTemplateResult.name} key={t.goodsTemplateResult.id}></TreeNode>
        )
      })
      return (
        <TabPane tab={x.name} key={x.name} style={{ padding: '20px' }}>
          <div>
            {rules[0].type == 1 && ruleCodeObj.reduceShow ? <div style={{ marginBottom: '10px' }}>
              <InputCom
                titleWidth="100px"
                inputWidth="80px"
                validate={true}
                type="number"
                title="券面额"
                value={formValue.reduce}
                remark="元"
                onChange={(val: any) => {
                  formValue.reduce = val
                  this.setState({ formValue })
                }}
              />
            </div> : ""}
            {rules[0].type == 2 && ruleCodeObj.saleShow ? <div style={{ marginBottom: '10px' }}>
              <InputCom
                titleWidth="100px"
                inputWidth="80px"
                type="number"
                validate={true}
                value={formValue.sale}
                title="折扣力度"
                remark={(<span>折<span style={{ fontSize: '12px', color: '#999', marginLeft: '5px' }}>折扣范围0.1折至9.9折。例：设置2折后，原价10元，用户仅需付2元</span></span>)}
                onChange={(val: any) => {
                  formValue.sale = val
                  this.setState({ formValue })
                }}
              />
            </div> : ""}
            {rules[0].type == 3 ? <div style={{ marginBottom: '10px' }}>
              <InputCom
                titleWidth="100px"
                validate={true}
                value={formValue.name}
                title="活动名称"
                onChange={(val: any) => {
                  formValue.name = val
                  this.setState({ formValue })
                }}
              />
            </div> : ""}
            <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
              <span style={{ width: '100px', display: 'inline-block' }}>{rules[0].type == 3 ? '活动时间' : '券发放时间'}</span>
              <RangePicker
                format="YYYY-MM-DD"
                placeholder={['开始时间', '结束时间']}
                value={formValue.dates}
                // value={formValue.beginTime ? [moment(formValue.beginTime), moment(formValue.endTime)] : [undefined, undefined]}
                onChange={(dates, dateStrings) => {
                  formValue.beginTime = dateStrings[0]
                  formValue.dates = dates
                  formValue.endTime = dateStrings[1]
                  this.setState({ formValue })
                }}
              />
            </div>
            {rules[0].type == 3 ? <div>
              {ruleCodeObj.beginGiveMoneyShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>活动规则</span>
                <Select value={codes.activeCode} style={{ width: 120 }} onChange={(key: any) => {
                  formValue.beginGiveMoney = null;
                  codes.activeCode = key
                  this.setState({ codes })
                }}>
                  <Option value="1">消费即送</Option>
                  <Option value="2">消费满送</Option>
                </Select>
                {
                  codes.activeCode == 1 ? "" : (<div style={{ display: 'inline-block', marginLeft: '20px' }}>
                    <span style={{ marginRight: '10px' }}>需单笔消费满</span>
                    <Input type="number"
                      style={{ width: '100px', marginRight: '10px' }}
                      value={formValue.beginGiveMoney}
                      onChange={(e) => {
                        formValue.beginGiveMoney = e.target.value
                        this.setState({ formValue })
                      }} />

                    <span>元</span>
                  </div>)
                }
              </div> : ""}
              {ruleCodeObj.activeIdShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>活动奖品</span>
                <Button type="primary" onClick={() => {
                  this.getTicketList()
                  this.setState({
                    showAddModal: true
                  })
                }}>添加券{formValue.activeId.length > 0 ? `(已添加${formValue.activeId.length}张)` : ''}</Button>
              </div> : ""}
            </div> : ""}
            {rules[0].type != 3 ? <div>
              {ruleCodeObj.receiveTypeShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>领取类型</span>
                <RadioGroup
                  value={formValue.receiveType}
                  onChange={(e) => {
                    formValue.receiveType = e.target.value
                    this.setState({ formValue })
                  }}>
                  <Radio value={1}>无需用户领取</Radio>
                  <Radio value={2}>需用户领取</Radio>
                  <Radio value={3}>消费送礼赠券</Radio>
                </RadioGroup>
              </div> : ""}
              <div style={{ marginBottom: '10px' }}>
                <InputCom
                  titleWidth="100px"
                  validate={true}
                  title="券名称"
                  value={formValue.name}
                  onChange={(val: any) => {
                    formValue.name = val
                    this.setState({ formValue })
                  }}
                />
              </div>
              {ruleCodeObj.totalAmountShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>发放总量</span>
                <Select
                  value={codes.giveCode}
                  style={{ width: 120 }}
                  onChange={(key: any) => {
                    if (key == 1) {
                      formValue.totalAmount = null
                    }
                    codes.giveCode = key
                    this.setState({ codes })
                  }}>
                  <Option value="1">不限制</Option>
                  <Option value="2">设置</Option>
                </Select>
                {
                  codes.giveCode == 1 ? "" : (<div style={{ display: 'inline-block', marginLeft: '20px' }}>
                    <Input type="number"
                      value={formValue.totalAmount}
                      style={{ width: '100px', marginRight: '10px' }}
                      onChange={(e) => {
                        formValue.totalAmount = e.target.value
                        this.setState({ formValue })
                      }} />
                    <span>张</span>
                  </div>)
                }
              </div> : ""}
              {ruleCodeObj.minConsumeShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>最低消费</span>
                <Select value={codes.useCode} style={{ width: 120 }} onChange={(e: any) => {
                  if (e == 1) {
                    formValue.minConsume = null
                  }
                  codes.useCode = e
                  this.setState({ codes })
                }}>
                  <Option value="1">不限制</Option>
                  <Option value="2">指定金额</Option>
                </Select>
                {
                  codes.useCode == 1 ? "" : (<div style={{ display: 'inline-block', marginLeft: '20px' }}>
                    <span style={{ marginRight: '10px' }}>最低消费满</span>
                    <Input
                      type="number"
                      value={formValue.minConsume}
                      style={{ width: '100px', marginRight: '10px' }}
                      onChange={(e) => {
                        formValue.minConsume = e.target.value
                        this.setState({ formValue })
                      }} />
                    <span>元可使用</span>
                  </div>)
                }
              </div> : ""}
              {rules[0].type == 2 && ruleCodeObj.maxPreferentialAmountShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>最高优惠</span>
                <Select value={codes.maxCountCode} style={{ width: 120 }} onChange={(e: any) => {
                  if (e == 1) {
                    formValue.maxPreferentialAmount = null
                  }
                  codes.maxCountCode = e
                  this.setState({ codes })
                }}>
                  <Option value="1">不限制</Option>
                  <Option value="2">指定金额</Option>
                </Select>
                {
                  codes.maxCountCode == 1 ? "" : (<div style={{ display: 'inline-block', marginLeft: '20px' }}>
                    <span style={{ marginRight: '10px' }}>最高优惠</span>
                    <Input
                      type="number"
                      value={formValue.maxPreferentialAmount}
                      style={{ width: '100px', marginRight: '10px' }}
                      onChange={(e) => {
                        formValue.maxPreferentialAmount = e.target.value
                        this.setState({ formValue })
                      }} />
                    <span>元</span>
                  </div>)
                }
              </div> : ""}
              {ruleCodeObj.termofvalidityShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>券有效期</span>
                <Select value={codes.timeCode} style={{ width: 120 }} onChange={(e: any) => {
                  codes.timeCode = e
                  this.setState({ codes })
                }}>
                  <Option value="1">相对时间</Option>
                  <Option value="2">指定时间</Option>
                </Select>
                {
                  codes.timeCode == 1 ? (<div style={{ display: 'inline-block', marginLeft: '20px' }}>
                    <span style={{ marginRight: '10px' }}>领取后</span>
                    <Input
                      type="number"
                      value={formValue.termofvalidity}
                      style={{ width: '100px', marginRight: '10px' }}
                      onChange={(e) => {
                        formValue.termofvalidity = e.target.value
                        this.setState({ formValue })
                      }} />
                    <span>天内有效</span>
                  </div>)
                    : (<div style={{ display: 'inline-block', marginLeft: '20px' }}><span style={{ marginRight: '10px', display: 'inline-block' }}>指定时间</span>
                      <RangePicker
                        format="YYYY-MM-DD"
                        value={formValue.dates2}
                        placeholder={['开始时间', '结束时间']}
                        onChange={(dates, moments) => {
                          formValue.dates2 = dates
                          formValue.termofvalidity = moments[0] + '/' + moments[1]
                          this.setState({ formValue })
                        }}
                      /></div>)}
              </div> : ""}
              {ruleCodeObj.goodsShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>可使用商品</span>
                <Select value={codes.checkGoodCode} style={{ width: 120 }} onChange={(e: any) => {
                  if (e == 1) {
                    formValue.goods = 'all'
                  }
                  codes.checkGoodCode = e
                  this.setState({ codes })
                }}>
                  <Option value="1">全场通用</Option>
                  <Option value="2">指定商品</Option>
                </Select>
                {
                  codes.checkGoodCode == 1 ? "" : (<Button type="primary" style={{ marginLeft: '20px' }} onClick={() => {
                    this.getGoodsList()
                    this.setState({
                      showGoodsModal: true
                    })
                  }}>添加指定商品</Button>)
                }
              </div> : ""}
              {ruleCodeObj.timesShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>参与限制</span>
                <RadioGroup
                  value={formValue.timesRadioKey}
                  onChange={(e) => {
                    formValue.times = timesOptions[e.target.value - 1]
                    formValue.timesRadioKey = e.target.value
                    this.setState({ formValue })
                  }}>
                  <Radio value={1}>不限制</Radio>
                  <Radio value={2}>
                    <span>限定每个用户总共参与</span>
                    <Input style={{ width: '100px', margin: '0 10px' }}
                      type="number"
                      value={formValue.text1}
                      onChange={(e) => {
                        timesOptions[1].total_times = e.target.value
                        formValue.text1 = e.target.value
                        this.setState({ formValue })
                      }}
                    />
                    <span>次</span>
                  </Radio>
                  <Radio value={3}>
                    <span>限定每个用户每天参与</span>
                    <Input style={{ width: '100px', margin: '0 10px' }}
                      type="number"
                      value={formValue.text2}
                      onChange={(e) => {
                        timesOptions[2].everyday_times = e.target.value
                        formValue.text2 = e.target.value
                        this.setState({ formValue })
                      }} />
                    <span>次</span>
                  </Radio>
                </RadioGroup>
              </div> : ""}
              {ruleCodeObj.receiveTypeShow ? <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block' }}>外卖限制</span>
                <RadioGroup
                  value={formValue.takeout}
                  onChange={(e) => {
                    formValue.takeout = e.target.value
                    this.setState({ formValue })
                  }}>
                  <Radio value={1}>通用</Radio>
                  <Radio value={2}>仅到店</Radio>
                  <Radio value={3}>仅外卖</Radio>
                </RadioGroup>
              </div> : ""}
              <div className="requrie-icon-wrapper flex-middle" style={{ marginBottom: '10px', lineHeight: '32px' }}>
                <span style={{ width: '100px', display: 'inline-block', verticalAlign: 'top' }}>使用说明</span>
                <TextArea rows={4} style={{ width: '500px' }} value={formValue.remark} placeholder="填写使用说明" onChange={(e) => {
                  formValue.remark = e.target.value
                  this.setState({ formValue })
                }} />
              </div>
            </div> : ""}

            <div style={{ marginTop: '100px' }}>
              <Button type="primary" style={{ marginLeft: '250px' }} loading={this.state.loading} disabled={this.state.loading} onClick={() => {
                this.setState({
                  loading: true
                })
                this.createActive(tabIndex)
              }}>保存并提交</Button>
            </div>

            <Modal title="添加指定商品"
              visible={this.state.showGoodsModal}
              onOk={() => {
                formValue.goods = this.state.addGoodsList[tabIndex]
                this.setState({
                  showGoodsModal: false,
                  formValue: formValue
                })
              }}
              onCancel={() => {
                this.state.addGoodsList[tabIndex] = formValue.activeId
                this.setState({
                  showGoodsModal: false,
                  addGoodsList: this.state.addGoodsList
                })
              }}
            >
              <div style={{ height: '300px' }}>
                <TreeSelect
                  showSearch
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="添加指定商品"
                  allowClear
                  value={this.state.addGoodsList[tabIndex]}
                  multiple
                  treeDefaultExpandAll
                  onChange={(e) => {
                    this.state.addGoodsList[tabIndex] = e
                    this.setState({
                      addGoodsList: this.state.addGoodsList
                    })
                  }}
                >
                  {treeNode2}
                </TreeSelect>
              </div>
            </Modal>
            <Modal title="添加券"
              visible={this.state.showAddModal}
              onOk={() => {
                formValue.activeId = this.state.addTicketList[tabIndex]
                this.setState({
                  showAddModal: false,
                  formValue: formValue
                })
              }}
              onCancel={() => {
                this.state.addTicketList[tabIndex] = formValue.activeId
                this.setState({
                  showAddModal: false,
                  addTicketList: this.state.addTicketList
                })
              }}
            >
              <div style={{ height: '300px' }}>
                <TreeSelect
                  showSearch
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="选择优惠券"
                  allowClear
                  value={this.state.addTicketList[tabIndex]}
                  multiple
                  treeDefaultExpandAll
                  onChange={(e) => {
                    this.state.addTicketList[tabIndex] = e
                    this.setState({
                      addTicketList: this.state.addTicketList
                    })
                  }}
                >
                  {treeNode}
                </TreeSelect>
              </div>
            </Modal>
          </div>
        </TabPane>
      )
    })
    return (
      <Tabs type="card" >
        {tabPanes}
      </Tabs>
    )
  }
}