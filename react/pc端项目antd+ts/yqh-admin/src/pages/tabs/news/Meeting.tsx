import React from 'react';
import { Layout, Table, Button, Input, Modal, Cascader, message } from 'antd';
import InputCom from "../../../components/input/InputCom";
import UploadImg from "../../../components/upload/UploadComponent";
import MapCom from "../../../components/map/MapCom";
import { Axios, arrayMove, clone, ColumnProps } from "../../../utils/util";
import constant from "../../../utils/Constant";
import area from "../../../utils/area";

const confirm = Modal.confirm;
const Search = Input.Search;

interface IObjectAny {
  [propName: string]: any
}

export interface IMeetingState {
  [propName: string]: any
}

export default class Meeting extends React.Component<IObjectAny, IMeetingState> {

  columns: Array<ColumnProps<IObjectAny>> = [{
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    render: (text, record, index) => (
      <span>{index + 1 + (this.state.pagination.current - 1) * 10}</span>
    )
  }, {
    title: '会场名称',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    render: (text, record) => {
      return `${record.province}${record.city}${record.area}${text}`
    }
  }, {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone'
  }, {
    title: '关联活动&场次',
    dataIndex: 'activitiesCount',
    key: 'activitiesCount',
    render: (text, record) => (
      <Button onClick={() => {
        if (text) {
          this.setState({
            changciVisible: true,
            roomId: record.id,
            roomName: record.name,
          }, this.getActivitys)

        }
      }}>{text}个场次</Button>
    )
  }, {
    title: '排序',
    dataIndex: 'sort',
    key: 'sort',
    render: (text, record, index) => (
      <div>
        {index !== 0 ?
          <Button style={{ marginRight: "2px" }} onClick={() => {
            this.move(record.id, index, -1)
          }}>上移</Button> : ""}
        {index !== this.state.storeList.length - 1 ?
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
    render: (text, record) => (
      <div>
        <Button
          className="margin-right-5"
          onClick={() => {
            this.showStoreInfo(record)
          }} type="primary">修改</Button>
        <Button onClick={() => {
          this.del(record.id)
        }} type="primary">删除</Button>
      </div>
    )
  }];

  // 场次table头
  changciColumn: Array<ColumnProps<IObjectAny>> = [{
    title: '活动名称',
    dataIndex: 'activityName',
    key: 'activityName'
  }, {
    title: '场次名称',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '场次开始时间',
    dataIndex: 'time',
    key: 'time'
  }]

  constructor(props: IObjectAny) {
    super(props);
    this.state = {
      editLoading: false,
      tableLoading: false,
      visible: false,
      changciVisible: false,
      changciDataList: [], // 会场下关联的场次列表
      pagination: {},
      modalPagination: {}, // 场次列表的分页
      codeImgUrl: "",
      searchValue: "",
      roomId: "",
      roomName: "",
      store: {},
      storeList: [], // 会场列表
    };
  }

  componentDidMount() {
    this.getStoreList();
  }

  // 查询会场列表
  getStoreList = async (page = 1, pageSize = constant.data.pageSize) => {
    try {
      this.setState({
        tableLoading: true,
      });
      let para = {
        "pageSize": pageSize,
        "startIndex": (page - 1) * pageSize,
        "name": this.state.searchValue,
      };
      let res = await Axios.get("/room/list", para);
      let pagination = { ...this.state.pagination };
      pagination.total = res.data.totalCount;
      pagination.current = page;
      let data = res.data.items;
      data.map((item: { [x: string]: any; }) => {
        item.key = item.id;
      });
      this.setState({
        tableLoading: false,
        storeList: data,
        pagination,
      });
    } catch (e) {
      console.log(e);
    }
  }

  // 会场列表table分页改变
  handleTableChange = (pagination: { current: number | undefined; }) => {
    this.getStoreList(pagination.current);
  }

  // 排序
  move = async (id: string, index: number, move: number) => {
    let url = "";
    switch (move) {
      case 1:
        url = "/room/down/" + id;
        break;
      case -1:
        url = "/room/up/" + id;
        break;
      case 0:
        url = "/room/top/" + id;
        break;
    }
    try {
      await Axios.post(url, {});
      if (move == 0) {
        this.getStoreList();
      }
      let array = this.state.storeList;
      array = arrayMove(array, index, move);
      this.setState({
        storeList: array
      })
    } catch (e) {
      console.log(e);
    }
  }

  del = (id: any) => {
    confirm({
      title: '删除会场',
      content: '您确定要删除会场信息么？',
      okText: "删除",
      cancelText: "取消",
      onOk: async () => {
        try {
          await Axios.post(`/room/${id}/delete`, {}, true);
          message.success("删除成功");
          this.getStoreList(this.state.pagination.current);
        } catch (e) {
          console.log(e);
        }
      },
    });
  }

  search = () => {
    this.getStoreList();
  }

  // 添加&修改会场
  handleOk = async () => {
    let { store } = this.state
    if (!store.name) {
      message.warning("请填写会场名称");
      return;
    }
    if (!store.areaCode) {
      message.warning("请选择会场地址");
      return;
    }
    if (!store.address) {
      message.warning("请填写会场详细地址");
      return;
    }
    if (!store.photoFileId) {
      message.warning("请上传会场封面图");
      return;
    }
    if (!store.lat) {
      message.warning("请点击地图选择会场位置");
      return;
    }
    if (!/(^(0[0-9]{2,3})-?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3578]\d{9})$)|(^(400)(\d{3})(\d{1,4})$)|(^(400)-(\d{3})-(\d{4}$))/.test(store.phone)) {
      message.warning("请填写正确的电话号码");
      return;
    }
    if (!store.bannerFileId) {
      message.warning("请上传banner图片");
      return;
    }
    let url = "/room/modify";
    if (!store.id) {
      url = "/room/create";
    }

    try {
      this.setState({ editLoading: true });
      await Axios.post(url, store, true);
      this.getStoreList();
      message.success(store.id ? "编辑成功" : "添加成功");
      this.setState({
        editLoading: false,
        visible: false
      });
    } catch (e) {
      console.log(e);
    }
  }

  // 添加或修改会场时 弹出model前的数据更新
  showStoreInfo = (store: IObjectAny | undefined = undefined) => {
    if (!store) {
      store = {
        beginTime: "09:00",
        endTime: "23:00",
        provinceCode: "0",
        name: "",
        areaCode: "",
        address: "",
        lat: "",
        tel: "",
      }
    } else {
      store.provinceCode = store.areaCode.substring(0, 2) + "0000000000";
      store.cityCode = store.areaCode.substring(0, 4) + "00000000";
    }
    let newStore = clone(store);
    this.setState({
      store: newStore,
      visible: true,
    })
  }

  // 根据会场id查询
  getActivitys = async (page = 1, pageSize = constant.data.pageSize) => {
    try {
      let res = await Axios.get("/activity/venues/list", {
        roomId: this.state.roomId,
        "pageSize": pageSize,
        "startIndex": (page - 1) * pageSize,
      });
      let pagination = { ...this.state.modalPagination };
      pagination.total = res.data.totalCount;
      pagination.current = page;
      let data = res.data.items;
      data.map((item: { [x: string]: any; }) => {
        item.key = item.id;
      });
      this.setState({
        changciVisible: true,
        changciDataList: data,
        modalPagination: pagination,
      });
    } catch (e) {
      console.log(e);
    }
  }

  // 地址更改
  addressChange = (value: any, selectedOptions: Array<{ value: string, label: string }>) => {
    let store = this.state.store;
    store.province = selectedOptions[0].label;
    store.provinceCode = selectedOptions[0].value;
    store.city = selectedOptions[1].label;
    store.cityCode = selectedOptions[1].value;
    store.area = selectedOptions[2].label;
    store.areaCode = selectedOptions[2].value;
    this.setState({
      store
    })
    if (store.address) {
      this.getLocation();
    }
  };

  // 查询地址
  getLocation = () => {
    let address = "";
    if (this.state.store.area) {
      address += this.state.store.city;
      address += this.state.store.province;
      address += this.state.store.area;
    } else {
      message.warning("请选择省市区");
      return;
    }
    if (!this.state.store.address) {
      message.warning("请输入详细地址");
      return;
    }
    address += this.state.store.address;
    (window as any).geocoder.getLocation(address, (status: string, result: { geocodes: Array<{ location: { lat: number, lng: number }; }> }) => {
      if (status === 'complete' && result.geocodes.length) {
        let store = this.state.store;
        store.lon = result.geocodes[0].location.lng;
        store.lat = result.geocodes[0].location.lat;
        this.setState({
          store
        })
      }
    });
  }

  render() {
    let store = this.state.store;
    return (
      <Layout>
        <div style={{ "marginBottom": "10px" }}>
          <Button onClick={() => {
            this.showStoreInfo()
          }} type="primary" size="large" style={{ "width": "150px", marginRight: "10px" }}>添加会场</Button>
        </div>
        <div style={{ "marginBottom": "10px" }}>
          <Search
            placeholder="输入会场名称查询"
            onChange={e => {
              this.setState({
                searchValue: e.target.value
              })
            }}
            onSearch={this.search}
            style={{ "width": "200px" }}
          />&nbsp;&nbsp;
                <Button type="primary" style={{ "width": "100px", marginRight: "5px" }}
            onClick={this.search}>搜索</Button>
        </div>
        <Table
          style={{ "backgroundColor": "#FFF", minWidth: "1200px" }}
          dataSource={this.state.storeList}
          columns={this.columns}
          pagination={this.state.pagination}
          loading={this.state.tableLoading}
          onChange={this.handleTableChange as any}
          bordered={true}
        />
        <Modal
          visible={this.state.visible}
          title={store.id ? "编辑会场" : "添加会场"}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          onOk={this.handleOk}
          confirmLoading={this.state.editLoading}
        >
          <div className="store-list-row-div requrie-icon-wrapper">
            <InputCom
              title="会场名称"
              inputWidth="300px"
              placeholder="请输入会场名称"
              value={store.name}
              onChange={(value: any) => {
                store.name = value;
                this.setState({
                  store
                })
              }}
            />
          </div>
          <UploadImg
            title="店铺封面图"
            imgSize="670px*400px"
            fileList={store.photoFileId ? store.photoFileId.split(',') : []}
            onChange={(fileList) => {
              store.photoFileId = fileList.join(',');
              this.setState({
                store
              })
            }}
          />

          <div className="store-list-row-div requrie-icon-wrapper">
            <div style={{ width: "110px", lineHeight: "32px" }}>
              <span>会场地址</span>
            </div>
            <div>
              <Cascader
                placeholder="请选择省市区"
                value={[this.state.store.provinceCode, this.state.store.cityCode, this.state.store.areaCode]}
                options={area.areaArray}
                onChange={this.addressChange as any}
                style={{ "width": "300px" }}
              />
            </div>
          </div>
          <div className="store-list-row-div requrie-icon-wrapper">
            <div style={{ width: "110px", lineHeight: "32px" }}>
              <span>详细地址</span>
            </div>
            <div>
              <Search
                placeholder="请输入详细地址"
                value={this.state.store.address}
                onChange={e => {
                  store.address = e.target.value;
                  this.setState({
                    store
                  })
                }}
                onBlur={this.getLocation}
                onSearch={this.getLocation}
                style={{ "width": "300px" }}
              />
            </div>
          </div>
          <div className="store-list-row-div requrie-icon-wrapper" style={{ height: "270px" }}>
            <div style={{ width: "109px", lineHeight: "32px" }}>
              <span>位置坐标</span>
            </div>
            <div>
              <div style={{ marginBottom: "5px" }}>
                <Input
                  style={{ width: "140px" }}
                  disabled={true}
                  value={store.lon ? store.lon : ""}
                />
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <Input style={{ width: "140px" }}
                  disabled={true}
                  value={store.lat ? store.lat : ""}
                />
              </div>
              <span className="small-warning-font">
                点击地图设置位置坐标
                        </span>
              <MapCom
                defaultValue={store.lon ? {
                  longitude: store.lon,
                  latitude: store.lat
                } : null}
                callback={(e) => {
                  store.lon = e.lng;
                  store.lat = e.lat;
                  this.setState({
                    store
                  })
                }}
              />
            </div>
          </div>
          <div className="store-list-row-div requrie-icon-wrapper">
            <InputCom
              title="会场电话"
              inputWidth="300px"
              placeholder="请填写会场电话"
              value={store.phone}
              onChange={(value: any) => {
                store.phone = value;
                this.setState({
                  store
                })
              }}
            />
          </div>
          <UploadImg
            title="上传图片"
            imgSize="750px*400px"
            maxLength={5}
            fileList={store.bannerFileId ? store.bannerFileId.split(',') : []}
            onChange={(fileList) => {
              store.bannerFileId = fileList.join(',');
              this.setState({
                store
              })
            }}
          />
        </Modal>
        <Modal
          title="关联场次"
          visible={this.state.changciVisible}
          footer={null}
          onCancel={() => {
            this.setState({
              changciVisible: false
            })
          }}>
          <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>{this.state.roomName}</div>
          <Table
            className="changci-table"
            style={{ "backgroundColor": "#FFF" }}
            dataSource={this.state.changciDataList}
            columns={this.changciColumn}
            pagination={this.state.modalPagination}
            onChange={(page) => {
              this.getActivitys(page.current)
            }}
            bordered={true}
          />
        </Modal>

      </Layout>
    )
  }
}
