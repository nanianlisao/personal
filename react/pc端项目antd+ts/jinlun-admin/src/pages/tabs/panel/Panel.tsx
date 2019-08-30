import React from 'react'
import { Row, Col, Popover, Icon, Tooltip, Select, Progress } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { Axios } from "../../../utils/util"
import './Panel.less'
interface IObjectAny {
    [name: string]: any,
}
interface IPanelState {
    panelData: {
        orderData: any[], // 订单数据的列表集合
        peopleCount: IObjectAny
    },
    comeData: IObjectAny,
    monthData: IObjectAny,
    genderData: {
        manCount?: number,
        totalCount?: number,
        womanCount?: number,
    }
}
export default class Panel extends React.Component<IObjectAny, IPanelState> {
    constructor(props: IObjectAny) {
        super(props)
        this.state = {
            panelData: { orderData: [], peopleCount: {} },
            comeData: {},
            monthData: {},
            genderData: {
                manCount: 0,
                totalCount: 0,
                womanCount: 0,
            }
        }
    }
    componentDidMount() {
        this.getPanelData()
        this.getCome() // 获取用户数据
        this.getMonthData() // 获取月留存数据
        this.getGenderData() // 获取性别数据
    }

    // 获取用户来源数据
    private async  getCome(): Promise<void> {
        let res = await Axios.get('/app/daily')
        console.log(res)
        let comeData: IPanelState["comeData"] = {}
        // x轴显示的 日期列表
        comeData.xAxis = res.data.map((item: any) => item.refDate.slice(4, 6) + '-' + item.refDate.slice(6))
        comeData.sessionCnt = res.data.map((item: any) => item.sessionCnt) //打开次数 
        comeData.visitPv = res.data.map((item: any) => item.visitPv) //访问次数 
        comeData.visitUv = res.data.map((item: any) => item.visitUv) //访问人数 
        comeData.visitUvNew = res.data.map((item: any) => item.visitUvNew) //新用户数 
        const series = [{ name: '打开次数', key: 'sessionCnt' }, { name: '访问次数', key: 'visitPv' }, { name: '访问人数', key: 'visitUv' }, { name: '新用户数', key: 'visitUvNew' }]
        comeData.series = series.map((item) => ({
            name: item.name,
            data: comeData[item.key],
            type: 'bar',
            label: {
                normal: {
                    position: 'top',
                }
            },
            smooth: true,
            barMaxWidth: '40px'
        }))
        comeData.stayTimeUv = res.data.map((item: any) => item.stayTimeUv) //人均停留时长 (单位：秒) 
        comeData.stayTimeSession = res.data.map((item: any) => item.stayTimeSession) //次均停留时长 (单位：秒) 
        comeData.visitDepth = res.data.map((item: any) => item.visitDepth) //平均访问深度
        const series2 = [{ name: '次均停留时长 (单位：秒)', key: 'stayTimeSession' }, { name: '人均停留时长 (单位：秒) ', key: 'stayTimeUv' }, { name: '平均访问深度', key: 'visitDepth' }]
        comeData.series2 = series2.map((item) => ({
            name: item.name,
            data: comeData[item.key],
            type: 'line',
            label: {
                normal: {
                    position: 'top',
                }
            },
            smooth: true,
            barMaxWidth: '40px'
        }))
        this.setState({
            comeData
        })
    }

    // 获取月留存数据
    private async  getMonthData(): Promise<void> {
        let res = await Axios.get('/app/monthly')
        console.log(res)
        let monthData: IPanelState["monthData"] = {}
        // x轴显示的 日期列表
        monthData.xAxis = res.data.map((item: any) => item.refDate.slice(0, 4) + '-' + item.refDate.slice(4))
        monthData.sessionCnt = res.data.map((item: any) => item.sessionCnt) //打开次数 
        monthData.visitPv = res.data.map((item: any) => item.visitPv) //访问次数 
        monthData.visitUv = res.data.map((item: any) => item.visitUv) //访问人数 
        monthData.visitUvNew = res.data.map((item: any) => item.visitUvNew) //新用户数 
        const series = [{ name: '打开次数', key: 'sessionCnt' }, { name: '访问次数', key: 'visitPv' }, { name: '访问人数', key: 'visitUv' }, { name: '新用户数', key: 'visitUvNew' }]
        monthData.series = series.map((item) => ({
            name: item.name,
            data: monthData[item.key],
            type: 'bar',
            label: {
                normal: {
                    position: 'top',
                }
            },
            smooth: true,
            barMaxWidth: '40px'
        }))
        this.setState({
            monthData
        })
    }

    // 获取订单等面板信息
    async getPanelData() {
        let res = await Axios.get('/datastatistics/management')
        console.log(res)
        let resJson = res.data
        let panelData = this.state.panelData
        let orderDataObj = resJson.orderSurveyVo  // 订单数据列表
        // 顶部四个模块订单的数据
        panelData.orderData = [
            {
                name: '昨日交易人数（人）',
                value: orderDataObj.yesterdayOrderPeople,
                weekVal: orderDataObj.weekOrderPeople,
                monthVal: orderDataObj.monthOrderPeople
            }, {
                name: '昨日交易金额（元）',
                value: orderDataObj.yesterdayOrderPrice,
                weekVal: orderDataObj.weekOrderPrice,
                monthVal: orderDataObj.monthOrderPrice
            }, {
                name: '昨日交易笔数（笔）',
                value: orderDataObj.yesterdayOrderNumber,
                weekVal: orderDataObj.weekOrderNumber,
                monthVal: orderDataObj.monthOrderNumber
            }, {
                name: '昨日访问人数（人）',
                value: orderDataObj.yesterdayVisitPeople,
                weekVal: orderDataObj.weekVisitPeople,
                monthVal: orderDataObj.monthVisitPeople
            }
        ]
        // 消费人数 数据
        panelData.peopleCount = {
            total: resJson.totalPeopleDataVo.totalConsumerNumber,
            year: resJson.totalPeopleDataVo.oneYearConsumerNumber,
            twoTime: resJson.totalPeopleDataVo.moreThanTwoTimesConsumerNumber,
            old: resJson.nearPeopleDataVo.oldConsumer,
            lose: resJson.nearPeopleDataVo.loseConsumer,
            new: resJson.nearPeopleDataVo.newConsumer,
        }
        this.setState({
            panelData: panelData
        })
    }

    // 获取性别数据
    private async  getGenderData(): Promise<void> {
        let res = await Axios.get('/app/genders')
        // x轴显示的 日期列表
        this.setState({
            genderData: res.data
        })
    }

    // 获取性别分析options
    getGenderOtion() {
        const { genderData } = this.state
        const option = {
            color: ['#3ad6fc', '#ffc851', '#ff6564'], // 配置颜色
            title: {        // 配置主题
                text: '性别分析',
            },
            tooltip: {  // 设置hover的tooltip
                // trigger: 'item',  // 默认是单个切换
                formatter: "{a} <br/>{b} : {c} ({d}%)"   // a: series.name, b:data.name, c: data.value, d:radio
            },
            legend: {
                right: 10          // 设置不同系列的标记位置 靠右 默认居中
            },
            series: [
                {
                    name: '性别分析',        // 图名称
                    type: 'pie',            // 圆饼图
                    label: {
                        // show: true,  // 默认展示
                        formatter: '{b}: {d}%',  // 展示内容： 名称 比例
                        position: 'outside',  // 展示位置 通过引导线外部展示
                    },
                    data: [{
                        name: '男',
                        value: genderData.manCount
                    }, {
                        name: '女',
                        value: genderData.womanCount
                    }],
                }
            ]
        }
        return option
    }

    // attr: series前七天统计数据 , series2停留时长统计 
    getOtion(attr: string, name?: string) {
        const { comeData } = this.state
        const option = {
            legend: {
                too: 50
            },
            xAxis: {
                type: 'category',
                data: comeData.xAxis
            },
            yAxis: {
                type: 'value',
                name: name,
                nameLocation: "center",
                nameTextStyle: {
                    verticalAlign: 'middle',
                    padding: 20
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            series: comeData[attr]
        }
        return option
    }


    // attr: series前七天统计数据 , series2停留时长统计 
    getMonthOtion() {
        const { monthData } = this.state
        const option = {
            legend: {
                too: 50
            },
            xAxis: {
                type: 'category',
                data: monthData.xAxis
            },
            yAxis: {
                type: 'value',
                name: '月访问统计',
                nameLocation: "center",
                nameTextStyle: {
                    verticalAlign: 'middle',
                    padding: 20
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            series: monthData.series
        }
        return option
    }




    render() {
        let { panelData } = this.state
        let { peopleCount, orderData } = panelData
        let Cards = orderData.map(item => (
            <Col key={item.name} span={6}>
                <div className="card-item">
                    <div className="card-header">{item.name}</div>
                    <div className="card-value">{item.value}</div>
                    <Row justify={'space-between'} type={'flex'} style={{ marginTop: '10px', lineHeight: '40px' }}>
                        <Col span={12} ><div>本周</div><div>{item.weekVal}</div></Col>
                        <Col span={12} ><div>本月</div><div>{item.monthVal}</div></Col>
                    </Row>
                </div>
            </Col>
        ))
        const content = (
            <div className="tips-box">
                <div>回头客：来过2次及以上，并且仅90天来过。</div>
                <div>新客：只来过1次，并且是在近90天内。</div>
                <div>流失客：90天没来了。</div>
            </div>
        )

        return (
            <div style={{ paddingLeft: '20px' }}>
                <section>
                    <div className="header">
                        经营概况<span>数据统计截止到【此处显示昨日的日期】， 仅供了解经营策略，不作为对账验证依据若无特别说明，数据看板内数据均为全门店总数据</span>
                    </div>
                    <Row type={'flex'} style={{ marginTop: '20px' }} gutter={16}>
                        {Cards}
                    </Row>
                </section>
                <section style={{ marginTop: '40px' }}>
                    <div className="header">
                        用户人群分析
                    </div>
                    <Row type={'flex'} style={{ marginTop: '20px' }} align={'middle'} gutter={16}>
                        <Col span={12}>
                            <div className="card-item">

                                <ReactEcharts
                                    option={this.getGenderOtion()}
                                />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="card-item" style={{ height: '342px', padding: '20px 10px' }}>
                                <Row type={"flex"} align={"middle"} style={{ height: '150px' }}>
                                    <Col span={8}>
                                        <div>近1年消费人数（人）</div>
                                        <div className="titles">{peopleCount.year}</div>
                                    </Col>
                                    <Col span={14} style={{ textAlign: 'left' }}>
                                        <div className="progress-box">
                                            <span style={{ width: '50px' }}>回头客</span>
                                            <Tooltip title={peopleCount.old + '人'}>
                                                <span style={{ width: `${peopleCount.old / peopleCount.year * 60}%` }} className="progress"></span>
                                            </Tooltip>
                                            <span>{(peopleCount.year == 0 ? 0 : peopleCount.old / peopleCount.year * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="progress-box">
                                            <span style={{ width: '50px' }}>新客</span>
                                            <Tooltip title={peopleCount.new + '人'}>
                                                <span style={{ width: `${peopleCount.new / peopleCount.year * 60}%` }} className="progress"></span>
                                            </Tooltip>
                                            <span>{(peopleCount.year == 0 ? 0 : peopleCount.new / peopleCount.year * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="progress-box">
                                            <span style={{ width: '50px' }}>流失客</span>
                                            <Tooltip title={peopleCount.lose + '人'}>
                                                <span style={{ width: `${peopleCount.lose / peopleCount.year * 60}%` }} className="progress"></span>
                                            </Tooltip>
                                            <span>{(peopleCount.year == 0 ? 0 : peopleCount.lose / peopleCount.year * 100).toFixed(1)}%</span>
                                        </div>
                                    </Col>
                                    <Col span={2} style={{ height: '100%' }}>
                                        <Popover placement="right" content={content} trigger="hover">
                                            <Icon type="question-circle" theme="outlined" style={{ fontSize: '20px' }} />
                                        </Popover>
                                    </Col>
                                </Row>
                                <Row type={"flex"} align={"middle"} style={{ height: '60px' }}>
                                    <Col span={8}>
                                        <div>消费2次以上人数</div>
                                    </Col>
                                    <Col span={16}>
                                        <Tooltip title={peopleCount.twoTime + '人'}>
                                            <Progress showInfo={false} type="line" percent={peopleCount.twoTime / peopleCount.year * 100} strokeColor="#ffb55d" />
                                        </Tooltip>
                                    </Col>
                                </Row>
                                <Row type={"flex"} align={"middle"} style={{ height: '60px' }}>
                                    <Col span={8}>
                                        <div>总计消费者人数</div>
                                    </Col>
                                    <Col span={16}>
                                        <Tooltip title={peopleCount.total + '人'}>
                                            <Progress showInfo={false} type="line" percent={100} strokeColor="#ffb55d" />
                                        </Tooltip>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </section >
                <section style={{ marginTop: '40px' }}>
                    <div className="header">
                        最近7天访问分析<span>数据分析来源于微信小程序统计</span>
                    </div>
                    <Row style={{ marginTop: '20px' }}>
                        <Col span={24}>
                            <div className="card-item">
                                <ReactEcharts
                                    option={this.getOtion('series', '访问分析')}
                                />
                            </div>
                        </Col>
                    </Row>
                </section>
                <section style={{ marginTop: '40px' }}>
                    <div className="header">
                        停留时长<span>数据分析来源于微信小程序统计</span>
                    </div>
                    <Row style={{ marginTop: '20px' }}>
                        <Col span={24}>
                            <div className="card-item">
                                <ReactEcharts
                                    option={this.getOtion('series2', '停留时长')}
                                />
                            </div>
                        </Col>
                    </Row>
                </section>
                <section style={{ marginTop: '40px' }}>
                    <div className="header">
                        月访问统计<span>数据分析来源于微信小程序统计</span>
                    </div>
                    <Row style={{ marginTop: '20px' }}>
                        <Col span={24}>
                            <div className="card-item">
                                <ReactEcharts
                                    option={this.getMonthOtion()}
                                />
                            </div>
                        </Col>
                    </Row>
                </section>
            </div >
        )
    }
}