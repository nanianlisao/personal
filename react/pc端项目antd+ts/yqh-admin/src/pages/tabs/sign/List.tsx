import React from 'react';
import { Layout, Table, Button, Modal, message, Select, DatePicker } from 'antd';
import InputCom from "../../../components/input/InputCom";
import { Axios, clone, ColumnProps ,EventValue} from "../../../utils/util";
import constant from "../../../utils/Constant";
const Option = Select.Option;
const { RangePicker } = DatePicker;
export interface IObjectAny {
  [propName: string]: any
}

export interface IListState {
  [propName: string]: any
  tableLoading: boolean,
  pagination: { current: number, total: number },
  CCpagination: { current: number, total: number }, // 场次表单分页
  formDataList: object[],
  activityList: object[],
  searchPara: {
    beginTime: string,
    endTime: string,
    activityId: number | string
  },
  columns: Array<ColumnProps<IObjectAny>>,
  bohuiVisible: boolean, // 驳回
  previewVisible: boolean, // 预览图片
  changciVisible: boolean, // 修改场次
  previewImg: string
}




export default class List extends React.Component<IObjectAny, IListState> {

  columns: Array<ColumnProps<IObjectAny>> = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    width: '80px',
    render: (text: number, record: IObjectAny, index: number) => (
      <span>{index + 1 + (this.state.pagination.current - 1) * 10}</span>
    )
  }, {
    title: '提交时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: '150px'
  }]


  changciColumns = [{
    title: '场次名称',
    dataIndex: 'activityVenuesName',
    key: 'activityVenuesName',
  }, {
    title: '审核状态',
    dataIndex: 'state',
    key: 'state',
    render: (text: number, record: IObjectAny, index: number) => (
      <span>{text == 1 ? '待审核' : text == 2 ? '审核通过' : '审核驳回'}</span>
    )
  }, {
    title: '操作',
    dataIndex: 'opeator',
    key: 'opeator',
    render: (text: number, record: IObjectAny, index: number) => (
      <div>
        <Button
          disabled={record.state != 1}
          className="margin-right-5"
          onClick={() => {
            this.setState({
              recordId: record.id,
              bohuiVisible: true
            })
          }} type="primary">驳回</Button>
        <Button
          disabled={record.state !== 1}
          className="margin-right-5"
          onClick={async () => {
            try {
              await Axios.post(`/sign/venues/${record.id}/pass`, {});
              message.success("已通过");
              this.setState({
                recordId: '',
                reason: '',
                bohuiVisible: false
              })
              this.getFormData(this.state.pagination.current);
              this.getChangciList(this.state.CCpagination.current)
            } catch (e) {
              console.log(e);
            }
          }} type="primary">通过</Button>
      </div>
    )
  },]
  constructor(props: IObjectAny) {
    super(props);
    this.state = {
      tableLoading: false,
      pagination: { current: 1, total: 0 },
      CCpagination: { current: 1, total: 0 }, // 场次表单分页
      formDataList: [],
      activityList: [],
      searchPara: {
        beginTime: "",
        endTime: "",
        activityId: ""
      },
      columns: [],
      bohuiVisible: false, // 驳回
      previewVisible: false, // 预览图片
      changciVisible: false, // 修改场次
      previewImg: ""
    };
  }

  componentDidMount() {
    this.getActivityList();
  }

  // 查询活动列表 进行筛选活动数据
  getActivityList = async () => {
    let res = await Axios.get("/activity/list", {
      pageSize: 1000,
      startIndex: 0
    });
    this.setState({
      activityList: res.data.items
    })
    console.log("activity", res.data.items);
  }

  // 根据活动id查询报名数据
  getFormData = async (page = 1, pageSize = constant.data.pageSize) => {
    try {
      this.setState({
        tableLoading: true,
      });
      let res = await Axios.get("/sign/record/list", { ...this.state.searchPara, pageSize, ...{ startIndex: (page - 1) * pageSize } });
      let pagination = { ...this.state.pagination };
      pagination.total = res.data.totalCount;
      pagination.current = page;
      let data = res.data.items;
      data.map((item: { key: number }, index: number) => {
        item.key = index
      });
      console.log(data);
      this.setState({
        tableLoading: false,
        formDataList: data,
        pagination,
      });
    } catch (e) {
      console.log(e);
    }
  }

  // 根据不同的活动 生成不同的表头
  createTableHead = (formHeadList: { map: (arg0: (item: any, index: any) => void) => void; }) => {
    let columns: any = clone(this.columns);
    formHeadList.map((item: { fieldName: any; id: any; }, index: string) => {
      columns.push({
        title: item.fieldName,
        dataIndex: index,
        width: '100px',
        key: 's' + index,
        render: (text: any, record: { signFormRecordQueryVos: { find: (arg0: (x: any) => boolean) => void; }; }) => {
          let remark: any = record.signFormRecordQueryVos && record.signFormRecordQueryVos.find((x: { activitySignFormId: any; }) => x.activitySignFormId == item.id);
          if (remark === undefined) {   // 后面新增的字段 
            return ""
          }
          if (remark.activitySignFormType == 8) {
            if (remark.activitySignFormValue) {
              return (<div>
                {remark.activitySignFormValue.split(',').map((x: string, i: string | number | undefined) => (
                  <img
                    key={i}
                    style={{ width: "80px", height: "80px", cursor: "pointer", marginRight: '5px' }}
                    src={constant.getPicUrl() + x}
                    onClick={e => {
                      this.setState({
                        previewVisible: true,
                        previewImg: x
                      })
                    }}
                  />
                ))}
              </div>)
            } else {
              return "";
            }
          } else if (remark.activitySignFormType == 7) {
            return <div>
              {remark.activitySignFormValue.split(',').map((k: React.ReactNode, j: string | number | undefined) => (<div key={j}>{k}</div>))}
            </div>
          } else {
            return <div>{remark.activitySignFormValue}</div>
          }
        }
      })
    });
    columns.push({
      title: "报名场次",
      dataIndex: "changci",
      key: "changci",
      width:"100px",
      render: (text: any, record: { venuesCount: React.ReactNode; venuesPassCount: React.ReactNode; }) => (<span>共{record.venuesCount}场，{record.venuesPassCount}场已通过</span>)
    });
    columns.push({
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      width:"120px",
      render: (text: any, record: { signFormRecordQueryVos: { find: (arg0: (x: any) => boolean) => void; }; id: any; }) => (
        <Button
          onClick={() => {
            const phoneObj: any = record.signFormRecordQueryVos.find((x: { activitySignFormType: number; }) => x.activitySignFormType == 3)
            this.setState({
              signRecordId: record.id,
              signRecordName: phoneObj.activitySignFormValue,
              changciVisible: true
            }, this.getChangciList)
          }} type="primary">处理申请</Button>
      )
    });
    this.setState({
      columns
    });
    this.getFormData();
  }

  // 查看场次列表
  getChangciList = async (page = this.state.CCpagination.current, pageSize = constant.data.pageSize) => {
    this.setState({
      CCtableLoading: true,
    });
    let res = await Axios.get("/sign/venues/list", {
      pageSize,
      startIndex: (page - 1) * pageSize,
      signRecordId: this.state.signRecordId
    });
    let CCpagination = { ...this.state.CCpagination };
    CCpagination.total = res.data.totalCount;
    CCpagination.current = page;
    let data = res.data.items;
    data.map((item: IObjectAny, index: number) => {
      item.key = index
    });
    this.setState({
      CCtableLoading: false,
      changciDataList: data,
      CCpagination,
    });
  };


  render() {
    let activityListOptions = this.state.activityList.map((item: IObjectAny, index: number) => {
      return (
        <Option value={item.id} key={index}>{item.name}</Option>
      )
    })

    return (
      <Layout>
        <div style={{ "marginBottom": "10px", color: '#f00' }}>查看报名列表需要先选择活动名称</div>
        <div style={{ "marginBottom": "10px" }}>
          <Select
            style={{ width: "150px", marginRight: "5px" }}
            defaultValue=""
            onChange={(e: EventValue) => {
              this.state.searchPara.activityId = e as number | string;
              if (e == "") {
                this.setState({
                  formDataList: [],
                  columns: []
                })
              } else {
                this.state.activityList.map((item: IObjectAny) => {
                  if (e == item.id) {
                    this.createTableHead(item.activitySignFormQueryVos)
                  }
                })
              }
            }}
          >
            <Option value="">请选择活动名称</Option>
            {activityListOptions}
          </Select>
          <RangePicker
            placeholder={["提交开始时间", "提交结束时间"]}
            style={{ marginRight: "5px" }}
            onChange={(dates, dateStrings) => {
              if (dateStrings[0]) {
                this.state.searchPara.beginTime = dateStrings[0] + " 00:00:00";
                this.state.searchPara.endTime = dateStrings[1] + " 23:59:59";
              } else {
                this.state.searchPara.beginTime = "";
                this.state.searchPara.endTime = "";
              }
            }}
          />
          <Button type="primary" style={{ "width": "100px", marginRight: "5px" }}
            onClick={() => {
              if (!this.state.searchPara.activityId) {
                message.warning("请选择活动");
                return;
              }
              this.getFormData();
            }}>搜索</Button>
          <Button type="primary" style={{ "width": "140px", marginRight: "5px" }}
            onClick={() => {
              if (!this.state.searchPara.activityId) {
                message.warning("请选择活动");
                return;
              }
              window.open(constant.getNetWork() + "/sign/record/export/" + constant.getToken() + "?activityId=" + this.state.searchPara.activityId);
            }}>下载全部报名数据</Button>
          <Button type="primary" style={{ "width": "140px", marginRight: "5px" }}
            onClick={async () => {
              if (!this.state.searchPara.activityId) {
                message.warning("请选择活动");
                return;
              }
              try {
                message.info("数据量较大时，可能需要耗费大量时间，请耐心等待");
                let res = await Axios.get(`/sign/record/export/photo/${constant.getToken()}`, { activityId: this.state.searchPara.activityId }, true)
                console.log(res)
                window.open(res.data);
              } catch (e) {
                console.log(e)
                // notification.error({
                //     message: '请求超时',
                //     duration: null
                // })
              }
            }}>下载全部报名图片</Button>
        </div>
        <Table
          className="sign-list"
          style={{ "backgroundColor": "#FFF", minWidth: this.state.columns.length * 110 + 'px' }}
          dataSource={this.state.formDataList}
          columns={this.state.columns}
          pagination={this.state.pagination}
          loading={this.state.tableLoading}
          onChange={(pagination) => {
            this.getFormData(pagination.current);
          }}
          bordered={true}
        />
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({
              previewVisible: false
            })
          }}>
          <div style={{ color: '#f00', marginBottom: '0.1rem' }}>提示：可通过右键另存为，保存图片</div>
          <img alt="" style={{ width: '100%' }} src={constant.getPicUrl() + this.state.previewImg} />
        </Modal>
        <Modal
          width="1000px"
          title={"手机号码 " + this.state.signRecordName}
          footer={null}
          visible={this.state.changciVisible}
          onCancel={() => {
            this.setState({
              changciVisible: false
            })
          }}
        >
          <Table
            className="changci-table"
            style={{ "backgroundColor": "#FFF", minWidth: "500px" }}
            dataSource={this.state.changciDataList}
            columns={this.changciColumns}
            loading={this.state.CCtableLoading}
            pagination={this.state.CCpagination}
            onChange={(pagination) => {
              this.getChangciList(pagination.current);
            }}
            bordered={true}
          />
        </Modal>
        <Modal
          width="500px"
          zIndex={1002}
          title="驳回请求"
          visible={this.state.bohuiVisible}
          onCancel={() => {
            this.setState({
              bohuiVisible: false
            })
          }}
          onOk={async () => {
            try {
              await Axios.post(`/sign/venues/${this.state.recordId}/refused/${this.state.reason}`, {});
              message.success("已驳回");
              this.setState({
                recordId: '',
                reason: '',
                bohuiVisible: false
              })
              this.getFormData(this.state.pagination.current);
              this.getChangciList(this.state.CCpagination.current)
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <InputCom
            title="驳回理由"
            inputWidth="200px"
            placeholder="请输入驳回理由"
            errMsg="驳回理由不能为空"
            value={this.state.reason ? this.state.reason : ''}
            validate={true}
            onChange={(value: any) => {
              this.setState({
                reason: value
              })
            }}
          />
        </Modal>
      </Layout>
    )
  }
}
