import * as React from 'react'
import TableCom from '../../../components/table/TableCom'  // 用来操作table的一个封装好的组件

const photoType: { value: number, name: string }[] = [{
  value: 1,
  name: '首页banner'
}, {
  value: 2,
  name: '左侧(领券中心)'
}, {
  value: 3,
  name: '右侧(参与品牌)'
}, {
  value: 4,
  name: '优惠券面'
}]
export default class ImgList extends React.Component {
  constructor(props: any) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <TableCom
        dataName="图片"
        addDataUrl="/photo/create" // 添加数据url
        delDataUrl="/photo/##/delete" // 删除数据url
        changeDataUrl="/photo/modify" // 修改数据url
        getDataUrl="/photo/list" // 查询数据url
        topRemark="每个位置的图片只展示第一个。"
        // 生成的column
        tableColumn={[{
          name: '序号',
          wkey: 'sortkey',
          type: 3
        }, {
          name: '图片名称',
          wkey: 'name',
        }, {
          name: '图片',
          wkey: 'photoFileId',
          type: 2,
        }, {
          name: '图片位置',
          wkey: 'type',
          render: (text) => {
            let pos = photoType.find(x => x.value === text)
            return (
              <div>{pos ? pos.name : ''}</div>
            )
          }
        }]}

        // 编辑时的操作对象
        modalProps={[{
          name: '图片名称',
          wkey: 'name',
          required: true
        }, {
          name: '上传图片',
          wkey: 'photoFileId',
          type: 4,
          imgSize: "60px*60px",
          required: true
        }, {
          name: '图片位置',
          wkey: 'type',
          type: 2,
          required: true,
          data: photoType
        }]}

      />
    )
  }
}
