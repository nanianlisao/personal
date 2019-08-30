import * as React from 'react'
import TableCom from '../../../components/table/TableCom'  // 用来操作table的一个封装好的组件
import Constant from "../../../utils/Constant"
import { Button, Modal } from 'antd'
import { Axios, goPage } from "../../../utils/util"
interface dataType {
  name: string,
  value: any,
}
interface IShopListState {
  previewVisible: boolean, // 控制图片弹出框
  previewImg: string, // 图片弹出框fileId
  typeList: dataType[],
  floorList: dataType[],
}
export default class ShopList extends React.Component<{}, IShopListState> {
  constructor(props: any) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImg: "",
      typeList: [],
      floorList: [],
    }
  }

  componentDidMount() {
    this.getFloorList() // 获取店铺楼层列表
    this.getTypeList() // 获取店铺类型列表
  }

  // 获取店铺楼层列表
  private async getFloorList(): Promise<void> {
    let res = await Axios.get("/app/floor/list", {
      pageSize: 1000,
      startIndex: 0,
    })
    let floorList = res.data.items.map((item: any) => {
      return {
        name: item.name,
        value: item.id
      }
    })
    this.setState({
      floorList: floorList
    })
  }

  // 获取店铺类型列表
  private async getTypeList(): Promise<void> {
    let res = await Axios.get("/app/store/type/list", {
      pageSize: 1000,
      startIndex: 0,
    })
    let typeList = res.data.items.map((item: any) => {
      return {
        name: item.name,
        value: item.id
      }
    })
    this.setState({
      typeList: typeList
    })
  }

  // 查询店铺二维码
  async getQrcode(id?: string): Promise<void> {
    let res = await Axios.get("/stores/jin/lun/wx/qrcode", {
      qrUrl: "pages/index/index",
      scene: id,
      storesId: id,
    })
    this.setState({
      previewImg: res.data,
      previewVisible: true
    })
  }

  render() {
    let user = localStorage.getItem('user')
    if (!user) {
      goPage('/login')
      return
    }
    let roleId = JSON.parse(user).roleId  // 根据roleId 做权限 1 为管理员 
    let { typeList, floorList, previewImg, previewVisible } = this.state
    return (
      <div>
        <TableCom
          tableWidth="1000px"
          dataName="店铺"
          addDataUrl={roleId === 1 ? "/stores/jin/lun/create" : ""} // 添加数据url
          delDataUrl={roleId === 1 ? "/stores/jin/lun/##/delete" : ""} // 删除数据url
          changeDataUrl={roleId === 1 ? "/stores/jin/lun/modify" : ""} // 修改数据url
          getDataUrl="/stores/jin/lun/list" // 查询数据url
          delDataName="隐藏"
          sortUpUrl="/stores/move/up/##" // 排序上移url
          sortDownUrl="/stores/move/down/##" // 排序下移url
          sortTopUrl="/stores/move/top/##" // 排序置顶url
          // 生成的column
          tableColumn={[{
            name: '序号',
            wkey: 'sortkey',
            type: 3
          }, {
            name: '店铺名称',
            wkey: 'name',
          }, {
            name: '封顶优惠金额',
            wkey: 'topDiscount',
          }, {
            name: '店铺所占比例',
            wkey: 'ratio',
            render: (text) => (
              <span>{text}%</span>
            )
          }, {
            name: '店铺二维码',
            wkey: 'qrCodeFileId',
            render: (text, record) => (
              <Button onClick={() => {
                this.getQrcode(record.id)
              }}>查看</Button>
            )
          }, {
            name: '店铺楼层',
            wkey: 'floorName',
          }, {
            name: '店铺类型',
            wkey: 'typeName',
          }, {
            name: '电话',
            wkey: 'tel'
          }]}

          // 搜索条件列表
          searchProps={[{
            name: '店铺名称',
            wkey: 'name',
          }]}

          // 编辑时的操作对象
          modalProps={[{
            name: '店铺名称',
            wkey: 'name',
            required: true
          }, {
            name: '封顶优惠金额',
            wkey: 'topDiscount',
            extPorps: {
              type: "number",
            },
            required: true
          }, {
            name: '店铺所占比例',
            wkey: 'ratio',
            required: true,
            rule: (val) => {   // 校验规则 在0-100之间
              return Number(val) >= 0 && Number(val) <= 100
            },
            ruleErrMsg: "店铺所占比例在0-100之间",
            extPorps: {
              type: "number",
              placeholder: "请输入店铺所占比例",
              errMsg: "店铺所占比例在0-100之间",
              regex: new RegExp(/^([0-9]{1,2}|100)$/)
            },
            extInputPorps: {
              suffix: "%",
            }
          }, {
            name: '店铺楼层',
            wkey: 'floorId',
            type: 2,
            data: floorList,
            required: true
          }, {
            name: '店铺类型',
            wkey: 'typeId',
            type: 2,
            data: typeList,
            required: true
          }, {
            name: '店铺电话',
            wkey: 'tel',
            required: true
          }, {
            name: '营业开始时间',
            wkey: 'beginTime',
            type: 7,
            format: "HH:mm",
            required: true
          }, {
            name: '营业结束时间',
            wkey: 'endTime',
            type: 7,
            format: "HH:mm",
            required: true
          }, {
            name: '店铺封面图',
            wkey: 'coverFileId',
            type: 4,
            imgSize: "100px*95px",
            required: true
          }, {
            name: '详情页顶部图片',
            wkey: 'detailFileId',
            type: 4,
            imgSize: "750px*450px",
            required: true
          }, {
            name: '店铺介绍',
            wkey: 'remark',
            type: 5,
            required: true,
          }]}

        />
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({
              previewVisible: false
            })
          }}>
          <div style={{ color: '#f00', marginBottom: '10px' }}>提示：可通过右键另存为，保存图片</div>
          <img alt="" style={{ width: '100%' }} src={Constant.getPicUrl() + previewImg} />
        </Modal>
      </div>
    )
  }
}
