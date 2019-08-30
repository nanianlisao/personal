import * as React from 'react'
import TableCom from '../../components/table/TableCom'  // 用来操作table的一个封装好的组件


// 这是一个实例文件，
export default class Example extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <TableCom
        dataName="类型"
        addDataUrl="/app/store/type/create" // 添加数据url
        delDataUrl="/app/store/type/##/delete" // 删除数据url
        changeDataUrl="/app/store/type/modify" // 修改数据url
        getDataUrl="/app/store/type/list" // 查询数据url
        exportDataUrl="" // 导出数据url
        sortUpUrl="/app/store/type/up/##" // 排序上移url
        sortDownUrl="/app/store/type/down/##" // 排序下移url
        sortTopUrl="/app/store/type/top/##" // 排序置顶url
        // 生成的column
        tableColumn={[{
          name: '序号',
          wkey: 'sortkey',
          type: 3
        }, {
          name: '类型名称',
          wkey: 'name'
        }, {
          name: '关联店铺数',
          wkey: 'relateStoresNum'
        }]}

        // 搜索条件列表
        searchProps={[{
          name: '类型名称',
          wkey: 'name',
        }]}

        // 编辑时的操作对象
        modalProps={[{
          name: '类型名称',
          wkey: 'name',
          required: true
        }, {
          name: '选项',
          wkey: 'name1',
          required: true,
          type: 2,
          data: [{ value: '1', name: '选择省' }, { value: '21', name: '选项2' }],
          children: [{
            name: '选择市',
            wkey: 'nam111111e',
            required: true,
            type: 2,
            data: [{ value: '1', name: '选择市' }, { value: '21', name: '选项2' }],
            show: (val) => { return val == 1 },
            children: [{
              name: '选择区',
              wkey: 'nam11111e',
              required: true,
              type: 2,
              data: [{ value: '1', name: '选择区' }, { value: '21', name: '选项2' }],
              show: (val) => { return val == 1 },
            }]
          }, {
            name: '选项2',
            wkey: 'na2131me',
            required: true,
            show: (val) => { return val == 21 },
          }]
        }]}
      />
    )
  }
}
