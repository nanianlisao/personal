import * as React from 'react'
import TableCom from '../../../components/table/TableCom'  // 用来操作table的一个封装好的组件

export default class Floor extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <TableCom
        dataName="楼层"
        addDataUrl="/app/floor/create" // 添加数据url
        delDataUrl="/app/floor/##/delete" // 删除数据url
        changeDataUrl="/app/floor/modify" // 修改数据url
        getDataUrl="/app/floor/list" // 查询数据url
        exportDataUrl="" // 导出数据url
        sortUpUrl="/app/floor/up/##" // 排序上移url
        sortDownUrl="/app/floor/down/##" // 排序下移url
        sortTopUrl="/app/floor/top/##" // 排序置顶url
        // 生成的column
        tableColumn={[{
          name: '序号',
          wkey: 'sortkey',
          type: 3
        }, {
          name: '楼层名称',
          wkey: 'name'
        }, {
          name: '关联店铺数',
          wkey: 'relateStoresNum'
        }]}
        // 搜索条件列表
        searchProps={[{
          name: '楼层名称',
          wkey: 'name',
        }]}

        // 编辑时的操作对象
        modalProps={[{
          name: '楼层名称',
          wkey: 'name',
          required: true
        }]}
      />
    )
  }
}
