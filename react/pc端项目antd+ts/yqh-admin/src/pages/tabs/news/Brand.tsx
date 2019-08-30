import * as React from 'react';
import { Layout, Table, Button, Modal, message, Icon, Upload, Input } from 'antd';
import InputCom from '../../../components/input/InputCom'
import { Axios, arrayMove, clone, beforePdfUpload, ColumnProps } from "../../../utils/util";
import UploadImg from "../../../components/upload/UploadComponent";
import constant from "../../../utils/Constant";
const confirm = Modal.confirm;
export interface IObjectAny {
  [propName: string]: any
}

export interface IBrandState {
  imgUrl: string
  imgList: any[]
  tableLoading: boolean
  visible: boolean
  loading: boolean
  modelObj: IObjectAny
  pdfList: any[]
  para: { name: string }
  pagination: { pageSize: number, total: number, current: number }
}

export default class Brand extends React.Component<IObjectAny, IBrandState> {
  public timer: any = null

  columns: Array<ColumnProps<IObjectAny>> = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => (
      <span>{index + 1 + (this.state.pagination.current - 1) * 10}</span>
    )
  }, {
    title: '合作品牌名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '文件封面图',
    dataIndex: 'photoFileId',
    key: 'photoFileId',
    render: (text) => (
      <img style={{ "width": "60px" }} src={constant.getPicUrl() + text} />
    )
  }, {
    title: '排序',
    dataIndex: 'order',
    key: 'order',
    render: (text, record, index) => (
      <div>
        {index != 0 ? <Button style={{ marginRight: "2px" }} onClick={() => {
          this.move(record.id, index, -1)
        }}>上移</Button> : ""}
        {index != this.state.imgList.length - 1 ? <Button style={{ marginRight: "2px" }} onClick={() => {
          this.move(record.id, index, 1)
        }}>下移</Button> : ""}
        {index != 0 ? <Button onClick={() => {
          this.move(record.id, index, 0);
        }}>置顶</Button> : ""}
      </div>
    )
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record) => (
      <div>
        <Button
          className="margin-right-5"
          onClick={() => {

            let pdfList = record.fileId ? [{
              uid: record.fileId,
              url: constant.getPicUrl() + record.fileId,
              name: record.fileName
            }] : []
            this.setState({
              visible: true,
              modelObj: clone(record),
              pdfList
            })
          }} type="primary">修改</Button>
        <Button onClick={() => {
          this.del(record.key)
        }} type="primary">删除</Button>
      </div>
    )
  }];

  constructor(props: IObjectAny) {
    super(props);
    this.state = {
      tableLoading: false,
      imgUrl: constant.getPicUrl(),
      imgList: [],
      visible: false,
      loading: false,
      modelObj: {},
      pdfList: [],
      para: {
        name: ''
      },
      pagination: {
        pageSize: constant.data.pageSize,
        total: 0,
        current: 0
      }
    };
  }

  componentDidMount() {
    this.getImgList();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  getImgList = async (page = 1, pageSize = constant.data.pageSize) => {
    try {
      this.setState({
        tableLoading: true,
      });
      let para = {
        "pageSize": pageSize,
        "startIndex": (page - 1) * pageSize,
        ...this.state.para
      };
      let res = await Axios.get("/brand/list", para);
      console.log(res.data.items);
      let pagination = { ...this.state.pagination };
      pagination.total = res.data.totalCount;
      pagination.current = page
      res.data.items.map((item: { [x: string]: any; }) => {
        item.key = item.id;
      });
      this.setState({
        tableLoading: false,
        imgList: res.data.items,
        pagination
      })
    } catch (e) {
      console.log(e);
    }
  }

  move = async (id: string, index: number, move: number) => {
    let url = "";
    switch (move) {
      case 1:
        url = "/brand/down/" + id;
        break;
      case -1:
        url = "/brand/up/" + id;
        break;
      case 0:
        url = "/brand/top/" + id;
        break;
    }
    try {
      await Axios.post(url, {});
      let array = this.state.imgList;
      array = arrayMove(array, index, move);
      this.setState({
        imgList: array
      })
    } catch (e) {
      console.log(e);
    }

  }

  del = (id: any) => {
    confirm({
      title: '您确定要删除么?',
      content: '',
      okText: "删除",
      cancelText: "取消",
      onOk: async () => {
        try {
          await Axios.post(`/brand/${id}/delete`, {}, true);
          message.success("删除成功");
          this.getImgList();
        } catch (e) {
          console.log(e);
        }
      },
    });
  }

  handleOk = async () => {
    let { modelObj } = this.state
    if (!modelObj.name) {
      message.warning("请填写图片名称");
      return;
    }
    if (!modelObj.photoFileId) {
      message.warning("请上传图片");
      return;
    }
    if (!modelObj.fileId) {
      message.warning("请上传文件");
      return;
    }

    let url = "";
    if (!modelObj.id) {
      url = "/brand/create";
    } else {
      url = "/brand/modify";
    }

    try {
      this.setState({ loading: true });
      await Axios.post(url, modelObj);
      message.success(modelObj.id ? "编辑成功" : "添加成功");
      this.setState({
        loading: false,
        visible: false
      });
      this.getImgList();
    } catch (e) {
      console.log(e);
      this.setState({
        loading: false,
      });
    }

  }

  // 封面图 及视频更改
  handleChange(attr: string, info: { file: { status: string; response: { retCode: number; data: { fileId: string | number; }; retMsg: React.ReactNode; }; name: any; }; fileList: Array<{ url: string }>; }): void {
    if (info.file.status === 'done') {
      if (info.file.response) {
        if (info.file.response.retCode == 0) {
          let modelObj = this.state.modelObj;
          modelObj[attr] = info.file.response.data.fileId;
          if (attr === 'fileId') {
            modelObj.fileName = info.file.name;
            info.fileList[0].url = this.state.imgUrl + info.file.response.data.fileId
          }
          this.setState({
            modelObj,
          });
        } else {
          message.warning(info.file.response.retMsg);
        }
      }
    }
    let fileList: any[] = info.fileList;
    this.setState({
      pdfList: fileList
    });
  }


  render() {
    let modelObj = this.state.modelObj;
    return (
      <Layout>
        <div style={{ "marginBottom": "10px" }}>
          <Button
            type="primary"
            size="large"
            style={{ "width": "150px" }}
            onClick={() => {
              this.setState({
                visible: true,
                pdfList: [],
                modelObj: {
                  photoFileId: "",
                  name: "",
                }
              })
            }}>
            添加合作品牌
                    </Button>
        </div>
        <div style={{ "marginBottom": "10px" }}>
          <Input
            placeholder="输入合作品牌名称查询"
            value={this.state.para.name}
            onChange={e => {
              let para = this.state.para;
              para.name = e.target.value;
              this.setState({
                para
              })
            }}
            style={{ "width": "250px", marginRight: "10px" }}
          />
          <Button type="primary" style={{ "width": "100px", marginRight: "5px" }}
            onClick={() => {
              this.getImgList()
            }}>搜索</Button>
        </div>
        <Table
          style={{ "backgroundColor": "#FFF" }}
          dataSource={this.state.imgList}
          columns={this.columns}
          pagination={this.state.pagination}
          onChange={(page) => {
            this.getImgList(page.current);
          }}
          loading={this.state.tableLoading}
          bordered={true}
        />
        <Modal
          width="700px"
          visible={this.state.visible}
          title={this.state.modelObj.id == undefined ? "添加合作品牌" : "编辑合作品牌"}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          confirmLoading={this.state.loading}
        >
          <InputCom
            title="合作品牌名称"
            placeholder="请输入合作品牌名称"
            errMsg="合作品牌名称不能为空"
            value={this.state.modelObj.name}
            validate={true}
            onChange={(value: any) => {
              modelObj.name = value;
              this.setState({
                modelObj,
              })
            }}
          />
          <UploadImg
            title="上传封面图"
            imgSize="148px*195px"
            fileList={modelObj.photoFileId ? modelObj.photoFileId.split(',') : []}
            onChange={(fileList) => {
              modelObj.photoFileId = fileList.join(',');
              this.setState({
                modelObj,
              })
            }}
          />
          <div style={{ height: "180px", display: "flex" }}>
            <div style={{ width: "110px", lineHeight: "32px" }}>
              <span>上传文件</span>
            </div>
            <div>
              <div style={{ marginBottom: "10px" }}>
                <span className="small-warning-font">
                  文档格式必须为：doc、docx、xls、xlsx、ppt、pptx	、pdf；且不可大于5M；
                            </span><br />
                <span className="small-warning-font">
                  建议使用pdf格式文件，以保持最佳效果；
                            </span>
              </div>
              <Upload
                name="file"
                showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                fileList={this.state.pdfList}
                action={constant.getUpload() + "/file/upload"}
                onRemove={() => {
                  modelObj.fileId = "";
                  this.setState({
                    pdfList: [],
                    modelObj,
                  })
                }}
                onChange={this.handleChange.bind(this, 'fileId') as any}
                beforeUpload={beforePdfUpload}
              >
                {this.state.pdfList.length >= 1 ? null : (<Button>
                  <Icon type="upload" /> 上传文件
                                </Button>)}
              </Upload>
            </div>
          </div>
        </Modal>
      </Layout>
    )
  }
}
