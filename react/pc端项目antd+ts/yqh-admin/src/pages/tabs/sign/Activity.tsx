import * as React from 'react';
import { Layout, Table, Button, Modal, message, Select, DatePicker, Icon, Input, Switch, Radio } from 'antd';
import { Axios, clone, arrayMove, ColumnProps } from "../../../utils/util";
import UEditor from '../../../components/ueditor/Ueditor';
import InputCom from "../../../components/input/InputCom";
import UploadImg from "../../../components/upload/UploadComponent";
import constant from "../../../utils/Constant";
import moment from "moment";
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const formatTime = 'YYYY-MM-DD HH:mm';
const PhoneType = 3
const raidoOptions = [{
  type: 1,
  name: '地址（带定位）'
}, {
  type: 2,
  name: '文本'
}, {
  type: 4,
  name: '数字'
}, {
  type: 5,
  name: '日期'
}]

const findTypeName = (type: number): string => {
  return ['0', '地址', '文本', '手机号', '数字', '日期', '单选', '多选', '图片'][type]
}

export interface IObjectAny {
  [propName: string]: any
}

export interface IActivityState {
  [propName: string]: any
}

export default class Activity extends React.Component<IObjectAny, IActivityState> {
  public Ueditor: UEditor | null;
  public Ueditor1: UEditor | null;
  formColumns: Array<ColumnProps<IObjectAny>> = [{
    title: '字段名称',
    dataIndex: 'fieldName',
    key: 'fieldName'
  }, {
    title: '字段类型',
    dataIndex: 'type',
    key: 'type',
    render: (text) => (
      <span>{findTypeName(text)}</span>
    )
  }, {
    title: '是否必填',
    dataIndex: 'mustFill',
    key: 'mustFill',
    render: (text) => (
      <span>{text == 1 ? '必填' : '非必填'}</span>
    )
  }, {
    title: '排序',
    dataIndex: 'order',
    key: 'order',
    render: (text, record, index) => (
      <div>
        {index !== 0 ?
          <Button style={{ marginRight: "2px" }} onClick={() => {
            this.move(record.id, index, -1)
          }}>上移</Button> : ""}
        {index !== this.state.formDataList.length - 1 ?
          <Button style={{ marginRight: "2px" }} onClick={() => {
            this.move(record.id, index, 1)
          }}>下移</Button> : ""}
        {index !== 0 ? <Button onClick={() => {
          this.move(record.id, index, 0);
        }}>置顶</Button> : ""}
      </div>
    )
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => (
      <div>
        <Button
          className="margin-right-5"
          onClick={() => {
            let formObj: IObjectAny = clone(record)
            if (formObj.type == 6 || formObj.type == 7) {
              formObj.typeRemark = JSON.parse(formObj.typeRemark)
            }
            this.setState({
              formObj,
              optionsVisible: true
            })
          }} type="primary">修改</Button>
        <Button
          disabled={record.type == PhoneType}
          onClick={() => {
            this.del(record.id, index)
          }} type="primary">删除</Button>
      </div>
    )
  }]

  changciColumns: Array<ColumnProps<IObjectAny>> = [{
    title: '场次名称',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => (
      <Input
        style={{ width: '160px' }}
        value={text}
        onChange={(e) => {
          record.name = e.target.value
          this.setState({
            changciDataList: this.state.changciDataList
          })
        }} />
    )
  }, {
    title: '场次时间',
    dataIndex: 'time',
    key: 'time',
    render: (text, record) => (
      <DatePicker
        style={{ width: '150px', minWidth: 0 }}
        placeholder="开始时间"
        showTime={true}
        format={formatTime}
        value={text ? moment(text, formatTime) : undefined}
        onChange={(time, timeString) => {
          record.time = timeString + ':00'
          this.setState({
            changciDataList: this.state.changciDataList
          })
        }}
      />
    )
  }, {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    render: (text) => (
      <Input
        disabled={true}
        style={{ width: '70px' }}
        value={text}
      />
    )
  }, {
    title: '限购人数',
    dataIndex: 'inventory',
    key: 'inventory',
    render: (text, record) => (
      <Input
        style={{ width: '70px' }}
        value={text} onChange={(e) => {
          record.inventory = e.target.value
          this.setState({
            changciDataList: this.state.changciDataList
          })
        }} />
    )
  }, {
    title: '单人限购',
    dataIndex: 'times',
    key: 'times',
    render: (text, record) => (
      <Input
        style={{ width: '70px' }}
        value={text} onChange={(e) => {
          record.times = e.target.value
          this.setState({
            changciDataList: this.state.changciDataList
          })
        }} />
    )
  }, {
    title: '所在会场',
    dataIndex: 'roomId',
    key: 'roomId',
    render: (text, record, index) => (
      <Select
        style={{ width: "100px" }}
        placeholder="选择会场"
        value={text}
        onChange={(e: any) => {
          record.roomId = e
          this.setState({
            changciDataList: this.state.changciDataList
          })
        }}
      >
        {this.state.storeList.map((x: IObjectAny, i: number) => (
          <Option value={x.id} key={i}>{x.name}</Option>
        ))}
      </Select>
    )
  }, {
    title: '详细位置',
    dataIndex: 'address',
    key: 'address',
    render: (text, record, index) => (
      <Input
        style={{ width: '160px' }}
        value={text} onChange={(e: any) => {
          record.address = e.target.value
          this.setState({
            changciDataList: this.state.changciDataList
          })
        }} />
    )
  }, {
    title: '开启审核',
    dataIndex: 'validate',
    key: 'validate',
    render: (text, record, index) => (
      <Select
        style={{ width: "80px" }}
        value={text} onChange={(e: any) => {
          record.validate = e
          this.setState({
            changciDataList: this.state.changciDataList
          })
        }}
      >
        <Option value={1} key={2}>开启</Option>
        <Option value={2} key={3}>不开启</Option>
      </Select>
    )
  }, {
    title: '操作',
    dataIndex: 'opeator',
    key: 'opeator',
    render: (text, record, index) => (
      <Button
        onClick={() => {
          this.changeChangci(record)
        }} type="primary">保存</Button>
    )
  },]


  columns: Array<ColumnProps<IObjectAny>> = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => (
      <span>{index + 1 + (this.state.pagination.current - 1) * 10}</span>
    )
  }, {
    title: '创建时间',
    dataIndex: 'addTime',
    key: 'addTime'
  }, {
    title: '活动名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '活动时间',
    dataIndex: 'signUpBeginDate',
    key: 'signUpBeginDate',
    render: (text, record) => {
      return (<div style={{ minWidth: "200px" }}>
        <span>{record.beginTime}至{record.endTime}</span></div>)
    }
  }, {
    title: '活动状态',
    dataIndex: 'state',
    key: 'state',
    render: (text) => {
      return text == 1 ? "未开始" : text == 2 ? "进行中" : "已结束"
    }
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record) => (
      <div>
        <Button
          className="margin-right-5"
          disabled={record.state == 3}
          onClick={() => {
            setTimeout(() => {
              record.mettingScheduleContent ? (this.Ueditor as UEditor).setContent(record.mettingScheduleContent) : (this.Ueditor as UEditor).setContent("");
              record.mettingManualContent ? (this.Ueditor1 as UEditor).setContent(record.mettingManualContent) : (this.Ueditor1 as UEditor).setContent("");
            }, 500);


            this.setState({
              activity: clone(record),
              editVisible: true,
              modalState: 2,
              formDataList: record.activitySignFormQueryVos ? record.activitySignFormQueryVos.map((x: { id: any; }) => ({ ...x, key: x.id })) : []
            })
          }} type="primary">修改</Button>
        <Button
          className="margin-right-5"
          disabled={record.state == 3}
          onClick={() => {
            this.close(record)
          }} type="primary">停止</Button>
        <Button
          className="margin-right-5"
          disabled={record.state == 3}
          onClick={() => {
            this.setState({
              changciVisible: true,
              activityId: record.id
            }, this.getChangciDataList)

          }} type="primary">修改场次</Button>
      </div>
    )
  }];


  constructor(props: IObjectAny) {
    super(props);
    this.Ueditor = null
    this.Ueditor1 = null
    this.state = {
      modalState: 0,  // 1: 新增活动 2: 修改活动  3: 修改场次
      editLoading: false,
      tableLoading: false,
      editVisible: false,   // 编辑活动modal 的隐藏显示
      optionsVisible: false, // 编辑字段选项modal 的隐藏显示
      changciVisible: false, // 修改场次modal 的隐藏显示
      changciDataList: [],
      searchPara: {}, // 搜索参数
      formObj: {}, // 编辑字段时弹窗obj
      pagination: { current: 1 }, // 表单数据分页
      CCpagination: { current: 1 }, // 场次表单分页
      storeList: [],
      activityList: [], // table主数据列表
      activity: {},  // 编辑活动时弹窗obj
      formDataList: [],
      previewVisible: false,  // 控制图片预览 的隐藏显示
      previewImg: "",
    };
  }


  componentDidMount() {
    this.getActivityList(); // 查看所有活动列表
    this.getStoreList() // 查询所有的会场 添加活动时需要用到
  }

  changeChangci = async (obj: IObjectAny) => {
    if (!obj.name) {
      message.warning("请输入场次名称");
      return;
    }
    if (!obj.time) {
      message.warning("请选择场次时间");
      return;
    }
    if (!obj.address) {
      message.warning("请输入详细地址");
      return;
    }
    if (!obj.inventory) {
      message.warning("请输入限购人数");
      return;
    }
    if (!obj.roomId) {
      message.warning("请选择会场");
      return;
    }
    await Axios.post('/activity/venues/modify', obj, true)
    message.success("保存成功");
  }


  getActivityList = async (page = this.state.pagination.current, pageSize = constant.data.pageSize) => {
    try {
      this.setState({
        tableLoading: true,
      });
      let res = await Axios.get("/activity/list", {
        pageSize,
        startIndex: (page - 1) * pageSize,
        ...this.state.searchParaObj
      });
      let pagination = { ...this.state.pagination };
      pagination.total = res.data.totalCount;
      pagination.current = page;
      let data = res.data.items;
      data.map((item: { [x: string]: any; }, index: any) => {
        item.key = index;
      });
      console.log("activity", data);
      this.setState({
        tableLoading: false,
        activityList: data,
        pagination,
      });
    } catch (e) {
      console.log(e);
    }
  };

  getStoreList = async () => {
    let res = await Axios.get("/room/list", {
      pageSize: 100,
      startIndex: 0
    })
    this.setState({
      storeList: res.data.items,
    });
  }


  // 查看场次列表
  getChangciDataList = async (page = this.state.CCpagination.current, pageSize = constant.data.pageSize) => {
    try {
      this.setState({
        CCtableLoading: true,
      });
      let res = await Axios.get("/activity/venues/list", {
        pageSize,
        startIndex: (page - 1) * pageSize,
        activityId: this.state.activityId
      });
      console.log('changciDataList', res)
      let CCpagination = { ...this.state.CCpagination };
      CCpagination.total = res.data.totalCount;
      CCpagination.current = page;
      let data = res.data.items;
      data.map((item: { [x: string]: any; }, index: any) => {
        item.key = index;
      });
      this.setState({
        CCtableLoading: false,
        changciDataList: data,
        CCpagination,
      });
    } catch (e) {
      console.log(e);
    }
  };


  // 添加或者修改字段
  addFormItem = async () => {
    let { formObj } = this.state
    if (!formObj.fieldName) {
      message.warning("请填写字段名称");
      return;
    }
    if (!formObj.type) {
      message.warning("请选择字段类型");
      return;
    }
    let typeRemark = formObj.typeRemark
    if (formObj.type == 6 || formObj.type == 7) {
      if (!formObj.typeRemark[0].name) {
        message.warning("请输入选项");
        return;
      }
      typeRemark = JSON.stringify(typeRemark)
    }
    if (formObj.type == 8 && (!formObj.typeRemark)) {
      message.warning("请输入图片张数");
      return;
    }
    formObj.mustFill = formObj.mustFill ? formObj.mustFill : 2
    if (this.state.activity.id) {
      formObj.activityId = this.state.activity.id
    }
    let url = "/activity/sign/form/create";
    if (formObj.id) {
      url = "/activity/sign/form/modify";
    }

    try {
      let res = await Axios.post(url, { ...formObj, typeRemark }, true);
      let formDataList = this.state.formDataList
      if (formObj.id) {
        let Index = formDataList.findIndex((x: { id: any; }) => x.id == formObj.id)
        formDataList[Index] = { ...formObj, typeRemark }
      } else if (formObj.type == PhoneType) {
        let Index = formDataList.findIndex((x: { type: number; }) => x.type == PhoneType)
        formDataList[Index] = { ...formObj, typeRemark, id: res.data, }
      } else {
        formDataList.unshift({
          ...formObj,
          id: res.data,
          key: res.data,
          typeRemark
        })
      }
      this.setState({
        optionsVisible: false,
        formObj: {},
        formDataList
      });
    } catch (e) {
      console.log(e);
    }

  }


  sure = async () => {
    let { activity, formDataList } = this.state
    activity.mettingManualContent = (this.Ueditor1 as UEditor).getContent();
    activity.mettingScheduleContent = (this.Ueditor as UEditor).getContent();
    let activitySignFormIds = formDataList.map((x: { id: any; }) => x.id)
    console.log(activitySignFormIds)

    if (activitySignFormIds.some((x: any) => !x)) {
      message.warning("编辑报名表中有字段未填写完整")
      return;
    }
    if (!activity.name) {
      message.warning("活动名称不能为空")
      return;
    }
    if (!activity.beginTime) {
      message.warning("活动时间不能为空")
      return;
    }
    if (!activity.bannerFileId) {
      message.warning("请上传banner")
      return;
    }
    if (!activity.bannerFileId) {
      message.warning("请上传banner")
      return;
    }
    if (!activity.mettingManualContent) {
      message.warning("请上传会议手册内容")
      return;
    }
    if (!activity.mettingScheduleContent) {
      message.warning("请上传会议日程内容")
      return;
    }

    if (activity.activityVenuesRequests.length == 0) {
      message.warning("活动场次不能为空")
      return;
    }
    if (this.state.modalState == 1 && activity.activityVenuesRequests.some((x: { name: any; time: any; inventory: any; roomId: any; price: number; }) => !x.name || !x.time || !x.inventory || !x.roomId || ((!x.price) && x.price !== 0))) {
      console.log(activity.activityVenuesRequests)
      message.warning("活动场次中有必填项未填写")
      return;
    }

    this.setState({ editLoading: true });
    try {
      await Axios.post(activity.id ? "/activity/modify" : "/activity/create", { ...activity, activitySignFormIds });
      message.success("保存成功");
      this.setState({
        editVisible: false,
        editLoading: false
      });
      this.getActivityList();
    } catch (e) {
      this.setState({
        editLoading: false
      });
    }

  }

  // 排序
  move = async (id: string, index: number, move: number) => {
    if (!id) {
      message.warning('请先完善字段后再进行排序')
      return
    }
    let url = "";
    switch (move) {
      case 1:
        url = "/activity/sign/form/move/down/" + id;
        break;
      case -1:
        url = "/activity/sign/form/move/up/" + id;
        break;
      case 0:
        url = "/activity/sign/form/move/top/" + id;
        break;
    }
    try {
      await Axios.post(url, {});
      let array = this.state.formDataList;
      array = arrayMove(array, index, move);
      this.setState({
        formDataList: array
      })
    } catch (e) {
      console.log(e);
    }
  }

  del = (id: any, index: any) => {
    confirm({
      title: '删除会场',
      content: '您确定要删除会场信息么？',
      okText: "删除",
      cancelText: "取消",
      onOk: async () => {
        try {
          await Axios.post(`/activity/sign/form/${id}/delete`, {}, true);
          message.success("删除成功");
          let formDataList = this.state.formDataList
          formDataList.splice(index, 1)
          this.setState({ formDataList })
        } catch (e) {
          console.log(e);
        }
      },
    });
  }


  close = (record: IObjectAny) => {
    confirm({
      title: '提前关闭活动',
      content: '您确定要提前关闭 ' + record.name + ' 活动么？',
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await Axios.post(`/activity/${record.id}/stop`, {});
          message.success("关闭成功");
          this.getActivityList();
        } catch (e) {
          console.log(e);
        }
      },
    });
  }


  render() {
    let { activity, formObj, searchPara } = this.state
    if (!activity.activityVenuesRequests) {
      activity.activityVenuesRequests = [{
        validate: 2
      }]
    }
    return (
      <Layout>
        <div style={{ "marginBottom": "10px" }}>
          <Button onClick={() => {
            this.setState({
              editVisible: true,
              activity: {},
              formDataList: [{
                type: PhoneType,
                mustFill: 1,
                key: 'uni'
              }],   // 表单数据
              modalState: 1,
            }, () => {
              setTimeout(() => {
                (this.Ueditor as UEditor).setContent("");
                (this.Ueditor1 as UEditor).setContent("")
              }, 500);
            })
          }} type="primary" size="large" style={{ "width": "150px" }}>创建活动</Button> <span className="small-warning-font">相同时间内仅可有一个进行中的活动，无法同时创建</span><br />
        </div>
        <div style={{ "marginBottom": "10px" }}>
          <Input
            placeholder="活动名称"
            onChange={e => {
              searchPara.name = e.target.value
            }}
            style={{ "width": "150px", marginRight: "5px" }}
          />
          <RangePicker
            placeholder={["提交开始时间", "提交结束时间"]}
            style={{ marginRight: "5px" }}
            onChange={(dates, dateStrings) => {
              if (dateStrings[0]) {
                searchPara.beginTime = dateStrings[0] + " 00:00:00";
                searchPara.endTime = dateStrings[1] + " 23:59:59";
              } else {
                searchPara.beginTime = "";
                searchPara.endTime = "";
              }
            }}
          />
          <Select
            style={{ width: "150px", marginRight: "5px" }}
            defaultValue=""
            onChange={(e: any) => {
              searchPara.state = e;
            }}
          >
            <Option value="" key={1}>全部活动</Option>
            <Option value={1} key={2}>未开始</Option>
            <Option value={2} key={3}>进行中</Option>
            <Option value={3} key={4}>已结束</Option>
          </Select>
          <Button type="primary" style={{ "width": "100px", marginRight: "5px" }}
            onClick={() => {
              this.setState({
                searchParaObj: searchPara
              }, () => {
                this.getActivityList();
              })

            }}>搜索</Button>
        </div>
        <Table
          style={{ "backgroundColor": "#FFF", minWidth: "1000px" }}
          dataSource={this.state.activityList}
          columns={this.columns}
          pagination={this.state.pagination}
          loading={this.state.tableLoading}
          onChange={(pagination) => {
            this.getActivityList(pagination.current);
          }}
          bordered={true}
        />
        <Modal
          width="800px"
          visible={this.state.editVisible}
          title={activity.id ? "修改投票活动" : "创建投票活动"}
          confirmLoading={this.state.editLoading}
          onCancel={e => {
            this.setState({ editVisible: false });
            this.getActivityList()
          }}
          onOk={e => {
            this.sure();
          }}
        >
          <InputCom
            title="活动名称"
            inputWidth="200px"
            placeholder="请输入活动名称"
            errMsg="活动名称不能为空"
            validate={true}
            value={activity.name ? activity.name : ""}
            onChange={(value: any) => {
              activity.name = value;
              this.setState({
                activity
              })
            }}
          />
          <div className="requrie-icon-wrapper"
            style={{ display: "flex", position: "relative", height: "55px" }}>
            <div style={{ width: "110px", lineHeight: "32px" }}>
              <span>活动时间</span>
            </div>
            <div>
              <RangePicker
                placeholder={["报名开始时间", "报名结束时间"]}
                showTime={{ format: 'HH:mm' }}
                format={formatTime}
                value={activity.beginTime ? [moment(activity.beginTime, formatTime), moment(activity.endTime, formatTime)] : undefined}
                onChange={(dates, dateStrings) => {
                  activity.beginTime = dateStrings[0] + ":00";
                  activity.endTime = dateStrings[1] + ":00";
                  this.setState({
                    activity
                  })
                }}
              />
            </div>
          </div>

          <UploadImg
            title="上传封面图"
            imgSize="277px*140px"
            fileList={activity.topicFileId ? activity.topicFileId.split(',') : []}
            onChange={(fileList) => {
              activity.topicFileId = fileList.join(',');
              this.setState({
                activity
              })
            }}
          />

          <UploadImg
            title="上传banner"
            imgSize="375px*160px"
            maxLength={5}
            fileList={activity.bannerFileId ? activity.bannerFileId.split(',') : []}
            onChange={(fileList) => {
              activity.bannerFileId = fileList.join(',');
              this.setState({
                activity
              })
            }}
          />

          <div className="requrie-icon-wrapper"
            style={{ display: "flex", position: "relative", lineHeight: "32px" }}>
            <div style={{ width: "110px", }}>
              活动场次
                  </div>
            <div className="small-warning-font">{this.state.modalState === 2 ? '活动场次请单独进行修改' : '一旦定价，不可调价，请谨慎填写，（其余项可修改）'}</div>
          </div>

          {this.state.modalState == 1 ? <div>
            {activity.activityVenuesRequests && activity.activityVenuesRequests.map((item: { name: any; time: string; roomId: any; address: any; price: any; inventory: any; times: any; validate: number; }, index: number) => {
              return (
                <li style={{ marginBottom: '20px', marginLeft: '110px' }} key={index}>
                  <div style={{ display: 'flex' }}>
                    <InputCom
                      title=""
                      inputWidth="200px"
                      placeholder="请输入活动场次名称（必填）"
                      errMsg="活动场次名称不能为空"
                      validate={true}
                      value={item.name}
                      onChange={(value: any) => {
                        item.name = value;
                        this.setState({
                          activity
                        })
                      }}
                    />
                    <div>
                      <DatePicker
                        placeholder="开始时间 （必填）"
                        format={formatTime}
                        showTime={true}
                        value={item.time ? moment(item.time, formatTime) : undefined}
                        onChange={(time, timeString) => {
                          item.time = timeString + ":00"
                          this.setState({
                            activity
                          })
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <Select
                      style={{ width: "200px", marginRight: "10px" }}
                      value={item.roomId}
                      placeholder="请选择会场 （必填）"
                      onChange={(e: number) => {
                        item.roomId = e
                        this.setState({
                          activity
                        })
                      }}
                    >
                      {this.state.storeList.map((x: { id: string | number | undefined; name: any }, i: number) => (
                        <Option value={x.id} key={i}>{x.name}</Option>
                      ))}
                    </Select>
                    <InputCom
                      title=""
                      inputWidth="200px"
                      placeholder="请输入详细地址，非必填"
                      errMsg="活动名称不能为空"
                      value={item.address}
                      onChange={(value: any) => {
                        item.address = value;
                        this.setState({
                          activity
                        })
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <InputCom
                      title=""
                      inputWidth="200px"
                      placeholder="请填写价格 （必填）"
                      errMsg="价格不能为空"
                      validate={true}
                      value={item.price}
                      onChange={(value: any) => {
                        item.price = value;
                        this.setState({
                          activity
                        })
                      }}
                    />
                    <InputCom
                      title=""
                      inputWidth="200px"
                      placeholder="请填写限购人数 （必填）"
                      errMsg="限购人数不能为空"
                      type="number"
                      value={item.inventory}
                      onChange={(value: any) => {
                        item.inventory = value;
                        this.setState({
                          activity
                        })
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <InputCom
                      title=""
                      inputWidth="200px"
                      placeholder="限制单人报名次数（非必填）"
                      errMsg="限购人数不能为空"
                      type="number"
                      value={item.times}
                      onChange={(value: any) => {
                        item.times = value;
                        this.setState({
                          activity
                        })
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '200px', marginRight: '10px', height: '32px' }}>
                      <span>是否开启审核</span>
                      <Switch
                        style={{ marginLeft: '20px' }}
                        checked={item.validate == 1}
                        onChange={(e) => {
                          item.validate = e ? 1 : 2
                          this.setState({ activity })
                        }} />
                    </div>
                    {index == activity.activityVenuesRequests.length - 1 ? <Icon type="plus-circle"
                      theme="twoTone" style={{ fontSize: '20px', marginTop: "6px" }}
                      onClick={() => {
                        activity.activityVenuesRequests.push({
                          validate: 2
                        })
                        this.setState({
                          activity
                        })
                      }} /> : <Icon type="minus-circle"
                        style={{ fontSize: '20px', color: '#D36767', marginTop: "6px" }}
                        onClick={() => {
                          activity.activityVenuesRequests.splice(index, 1)
                          this.setState({
                            activity
                          })
                        }} />
                    }
                  </div>
                </li>
              )
            })}
          </div> : ""}
          <div className="requrie-icon-wrapper"
            style={{ display: "flex", position: "relative", lineHeight: "32px" }}>
            <div style={{ width: "110px", }}>
              编辑报名表
                  </div>
            <div>
              <Button
                type="primary"
                style={{ "width": "110px", marginRight: '15px' }}
                onClick={() => {
                  this.setState({
                    optionsVisible: true,
                    formObj: { mustFill: 2 }
                  })
                }}>添加字段</Button>
              <span className="small-warning-font">手机号选项为必填项，请先完善字段名称</span>
            </div>
          </div>
          <div>
            <Table
              style={{ "backgroundColor": "#FFF", minWidth: "500px", margin: '15px 0' }}
              dataSource={this.state.formDataList}
              columns={this.formColumns}
              pagination={false}
              bordered={true}
            />
          </div>

          <div style={{ position: "relative", display: "flex" }}>
            <div style={{ width: "110px", lineHeight: "32px" }}>
              <span>会议日程内容</span>
            </div>
            <UEditor id="content" ref={(el) => this.Ueditor = el as UEditor} />
          </div>

          <div style={{ position: "relative", display: "flex", marginTop: "15px" }}>
            <div style={{ width: "110px", lineHeight: "32px" }}>
              <span>会议手册内容</span>
            </div>
            <UEditor id="content2" ref={(el) => (this.Ueditor1 as UEditor) = el as UEditor} />
          </div>
        </Modal>

        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({
              previewVisible: false
            })
          }}>
          <img alt="" style={{ width: '100%' }} src={constant.getPicUrl() + this.state.previewImg} />
        </Modal>
        <Modal
          title={formObj.id ? "修改字段属性" : "创建字段属性"}
          visible={this.state.optionsVisible}
          zIndex={1001}
          width="500px"
          onOk={e => {
            this.addFormItem();
          }}
          onCancel={() => {
            this.setState({
              optionsVisible: false
            })
          }}
        >
          <InputCom
            title="字段名称"
            inputWidth="200px"
            placeholder="请输入字段名称"
            errMsg="字段名称不能为空"
            validate={true}
            value={formObj.fieldName ? formObj.fieldName : ''}
            onChange={(value: any) => {
              formObj.fieldName = value;
              this.setState({
                formObj
              })
            }}
          />
          <div className="store-list-row-div requrie-icon-wrapper">
            <div style={{ width: "110px", lineHeight: "32px" }}>
              <span>是否必填</span>
            </div>
            <div>
              <Switch
                checked={formObj.mustFill === 1}
                disabled={formObj.type == PhoneType}
                onChange={(e) => {
                  formObj.mustFill = e ? 1 : 2
                  this.setState({
                    formObj
                  })
                }} />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <span>设置字段类型</span>
          </div>
          <RadioGroup className="test-group"
            disabled={formObj.type == PhoneType}
            value={formObj.type} onChange={(e) => {
              formObj.type = e.target.value
              if (e.target.value == 6 || e.target.value == 7) {
                formObj.typeRemark = [{}]
              } else {
                formObj.typeRemark = ""
              }
              this.setState({
                formObj,
              });
            }}>
            {raidoOptions.map((item, index) => (
              <Radio value={item.type} key={index} style={{
                display: 'block',
                height: '30px',
                lineHeight: '30px'
              }}>
                {item.name}
              </Radio>
            ))}
            <Radio
              value={PhoneType}
              disabled={true}
              style={{
                display: 'block',
                height: '30px',
                lineHeight: '30px'
              }}>
              手机号
                      </Radio>
            <Radio value={6} className="radio-spec">
              单选
                         {formObj.type == 6 ? <div>
                {formObj.typeRemark && formObj.typeRemark.map((item: { name: any; }, index: string | number | undefined) => (
                  <InputCom
                    key={index}
                    inputWidth="200px"
                    maxLength={3000}
                    style={{ marginLeft: '50px' }}
                    remark={index === 0 ? <Icon type="plus-circle"
                      theme="twoTone" style={{ fontSize: '20px', marginLeft: '0px' }}
                      onClick={() => {
                        formObj.typeRemark.push({})
                        this.setState({
                          formObj
                        })
                      }} /> : <Icon type="minus-circle"
                        style={{ fontSize: '20px', color: '#D36767', marginLeft: '0px' }}
                        onClick={() => {
                          formObj.typeRemark.splice(index, 1)
                          this.setState({
                            formObj
                          })
                        }} />
                    }
                    errMsg="选项不能为空"
                    value={item.name}
                    validate={true}
                    onChange={(value: any) => {
                      item.name = value
                      this.setState({
                        formObj
                      })
                    }}
                  />
                ))}
              </div> : ""}
            </Radio>
            <Radio value={7} className="radio-spec" >
              多选
                          {formObj.type == 7 ? <div>
                {formObj.typeRemark && formObj.typeRemark.map((item: { name: any; }, index: string | number | undefined) => (
                  <InputCom
                    key={index}
                    inputWidth="200px"
                    maxLength={3000}
                    style={{ marginLeft: '50px' }}
                    remark={index === 0 ? <Icon type="plus-circle"
                      theme="twoTone" style={{ fontSize: '20px', marginLeft: '0px' }}
                      onClick={() => {
                        formObj.typeRemark.push({})
                        this.setState({
                          formObj
                        })
                      }} /> : <Icon type="minus-circle"
                        style={{ fontSize: '20px', color: '#D36767', marginLeft: '0px' }}
                        onClick={() => {
                          formObj.typeRemark.splice(index, 1)
                          this.setState({
                            formObj
                          })
                        }} />
                    }
                    errMsg="选项不能为空"
                    value={item.name}
                    validate={true}
                    onChange={(value: any) => {
                      item.name = value
                      this.setState({
                        formObj
                      })
                    }}
                  />
                ))}
              </div> : ""}
            </Radio>
            <Radio value={8} style={{
              display: 'block',
              height: '30px',
              lineHeight: '30px'
            }}>
              图片
                          {formObj.type == 8 ? <InputCom
                inputWidth="100px"
                type="number"
                titleWidth="66px"
                maxLength={3000}
                title="最大数量"
                style={{ marginLeft: '74px' }}
                remark="张"
                value={formObj.typeRemark}
                errMsg="选项不能为空"
                validate={true}
                onChange={(value: any) => {
                  formObj.typeRemark = value
                  this.setState({
                    formObj
                  })
                }}
              /> : ""}
            </Radio>
          </RadioGroup>
        </Modal>
        <Modal
          width="1100px"
          title="修改场次"
          footer={null}
          visible={this.state.changciVisible}
          onCancel={() => {
            this.setState({
              changciVisible: false
            })
          }}

        >

          <div className="small-warning-font">请谨慎调整场次信息，避免影响已报名与会者</div>
          <Table
            className="changci-table"
            style={{ "backgroundColor": "#FFF", minWidth: "500px" }}
            dataSource={this.state.changciDataList}
            columns={this.changciColumns}
            loading={this.state.CCtableLoading}
            pagination={this.state.CCpagination}
            onChange={(pagination) => {
              this.getChangciDataList(pagination.current);
            }}
            bordered={true}
          />
        </Modal>
      </Layout>
    )
  }
}
