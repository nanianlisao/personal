import * as React from 'react'
import TableCom from '../../../components/table/TableCom'  // 用来操作table的一个封装好的组件
import Constant from "../../../utils/Constant"
export default class Type extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <TableCom
        dataName="订单"
        tableWidth="1200px"
        getDataUrl="/order/jinlun/pay/list" // 查询数据url
        exportDataUrl={Constant.getNetWork() + "/order/export/jinlun/pay/" + localStorage.getItem('token')} // 导出数据url
        // 生成的column

        tableColumn={[{
          name: '序号',
          wkey: 'sortkey',
          type: 3
        }, {
          name: '交易时间',
          wkey: 'addTime',
        }, {
          name: '交易单号',
          wkey: 'id',
        }, {
          name: '交易金额',
          wkey: 'totalFee',
        }, {
          name: '实付金额',
          wkey: 'actualPayment',
        }, {
          name: '优惠金额',
          wkey: 'discountAmount',
        }, {
          name: '成本分担（平台）',
          wkey: 'jinlunDiscountAmount',
        },{
          name: '所占比例（平台）',
          wkey: 'jinlunRatio',
        }, {
          name: '成本分担（店铺）',
          wkey: 'storeDiscountAmount',
        }, {
          name: '所占比例（店铺）',
          wkey: 'ratio',
        }, {
          name: '门店信息',
          wkey: 'storesName',
        }, {
          name: '订单状态',
          wkey: 'state',
          render: (text) => (
            <span>{text == 1 ? "待付款" : (text == 2) ? "已完成" : "已取消"}</span>
          )
        }]}

        // 搜索条件列表
        searchProps={[{
          name: '交易单号',
          wkey: 'payId',
        }, {
          name: '订单状态',
          wkey: 'states',
          type: 2,
          data: [{
            name: "全部(订单状态)",
            value: ""
          }, {
            name: "待付款",
            value: 1
          }, {
            name: "已付款",
            value: 2
          }, {
            name: "订单取消",
            value: -1
          }]
        }, {
          name: "开始时间",
          wkey: "beginTime",
          format:"YYYY-MM-DD",
          type: 3,
        }, {
          name: "结束时间",
          wkey: "endTime",
          format:"YYYY-MM-DD",
          type: 3,
        }]}
      />
    )
  }
}
