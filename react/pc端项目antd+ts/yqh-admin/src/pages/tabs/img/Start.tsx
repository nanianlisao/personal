import React, { Fragment } from 'react';
import moment from 'moment'
import { Layout, Table, Button, Modal, Radio, message, Icon, DatePicker, TimePicker } from 'antd';
import Input from "../../../components/input/InputCom";
import UploadImg from "../../../components/upload/UploadComponent";
import { Axios, arrayMove, clone, ColumnProps } from "../../../utils/util";
import constant from "../../../utils/Constant";
const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const StartPhotoType = 1
const imgSize = "750px * 1334px"

interface IObjectAny {
    [propName: string]: any
}

export interface IIndexState {
    imgList: object[]
    loading: boolean
    modelObj: IObjectAny
    pagination: {
        pageSize: number,
        total: number,
        current: number
    }
    tableLoading: boolean
    visible: boolean
}

interface DataFormt {
    addTime: string,
    id: number,
    name: string,
    photoFileId: string
    photoShowQueryVoList: any[] | object
    key: number
    photoType: number
    showDateBegin: null | string
    showDateEnd: null | string
}

export default class Index extends React.Component<IObjectAny, IIndexState> {

    columns: Array<ColumnProps<IObjectAny>> = [{
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => (
            <span>{index + 1 + (this.state.pagination.current - 1) * 10}</span>
        )
    }, {
        title: '启动页名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '图片',
        dataIndex: 'photoFileId',
        key: 'photoFileId',
        render: (text: any) => (
            <img style={{ "width": "60px" }} src={constant.getPicUrl() + text} />
        )
    }, {
        title: '展示时间',
        dataIndex: 'showType',
        key: 'showType',
        render: (text, record) => (
            <div>{text == 1 ? '长期' : <div><div>{record.showDateBegin}至{record.showDateEnd}</div>{record.photoShowQueryVoList && (record.photoShowQueryVoList as object[]).map((x: any, i: number) => (
                <div key={i}>{x.showTimeBegin}-{x.showTimeEnd}</div>
            ))}</div>}</div>
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

                        this.setState({
                            visible: true,
                            modelObj: clone(record),
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
            imgList: [],
            visible: false,
            loading: false,
            modelObj: {},
            pagination: {
                pageSize: constant.data.pageSize,
                total: 0,
                current: 1
            }
        };
    }

    componentDidMount() {
        this.getImgList();
    }

    getImgList = async (page = 1, pageSize = constant.data.pageSize) => {
        try {
            this.setState({
                tableLoading: true,
            });
            let para = {
                "pageSize": pageSize,
                "startIndex": (page - 1) * pageSize,
                "photoType": StartPhotoType,
            };
            let res = await Axios.get("/photo/list", para);
            let pagination = { ...this.state.pagination };
            pagination.total = res.data.totalCount;
            pagination.current = page
            res.data.items.forEach((item: DataFormt) => {
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

    move = async (id: number, index: number, move: number) => {
        // move: 1 下移 0 置顶 -1 上移
        let url = "";
        switch (move) {
            case 1:
                url = "/photo/down/" + id + "/" + StartPhotoType;
                break;
            case -1:
                url = "/photo/up/" + id + "/" + StartPhotoType;
                break;
            case 0:
                url = "/photo/top/" + id + "/" + StartPhotoType;
                break;
        }
        try {
            await Axios.post(url, {}, true);
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
                    await Axios.post(`/photo/${id}/delete`, {}, true);
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
        if (!modelObj.showType) {
            message.warning("请设置展示时间");
            return;
        }
        if (modelObj.showType == 2) {
            if (!modelObj.showDateBegin) {
                message.warning("请设置自定义日期");
                return;
            }
            let arr: any[] = []
            modelObj.photoShowQueryVoList.forEach((x: { showTimeBegin: string; showTimeEnd: string; }) => {
                if (x.showTimeBegin && x.showTimeEnd) {
                    x.showTimeBegin = x.showTimeBegin < x.showTimeEnd ? x.showTimeBegin : x.showTimeEnd
                    x.showTimeEnd = x.showTimeBegin < x.showTimeEnd ? x.showTimeEnd : x.showTimeBegin
                    arr.push(x)
                }
            })
            if (arr.length == 0) {
                message.warning("请设置自定义时间段");
                return
            }
            modelObj.photoShowRequestList = arr
        }
        let url = "";
        if (!modelObj.id) {
            url = "/photo/create";
        } else {
            url = "/photo/modify";
        }

        try {
            this.setState({ loading: true });
            await Axios.post(url, { ...modelObj, photoType: StartPhotoType });
            message.success(modelObj.id ? "编辑成功" : "添加成功");
            this.getImgList();
        } catch (e) {
            console.log(e);
        }
        this.setState({
            loading: false,
            visible: false
        });
    }


    public render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        let { modelObj } = this.state
        if (!modelObj.photoShowQueryVoList) {
            modelObj.photoShowQueryVoList = [{ showTimeBegin: '', showTimeEnd: '' }]
        }
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
                                modelObj: {
                                    photoFileId: "",
                                    name: "",
                                }
                            })
                        }}>
                        添加启动页
                        </Button>&nbsp;&nbsp;
                        <span className="small-warning-font">展示时间相同，则按照排序的顺序按顺序展示。</span>
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
                    title={modelObj.id == undefined ? "添加启动页" : "编辑启动页"}
                    onOk={this.handleOk}
                    onCancel={() => {
                        this.setState({ visible: false });
                    }}
                    confirmLoading={this.state.loading}
                >
                    <Input
                        title="启动页名称"
                        placeholder="请输入启动页名称"
                        errMsg="启动页名称不能为空"
                        value={modelObj.name}
                        validate={true}
                        onChange={(value: any) => {
                            modelObj.name = value;
                            this.setState({
                                modelObj
                            })
                        }}
                    />
                    <UploadImg
                        title="上传图片"
                        imgSize={imgSize}
                        fileList={modelObj.photoFileId ? modelObj.photoFileId.split(',') : []}
                        onChange={(fileList: string[]) => {
                            modelObj.photoFileId = fileList.join(',');
                            this.setState({
                                modelObj
                            })
                        }}
                    />
                    <div className="requrie-icon-wrapper" style={{ position: "relative", display: "flex", marginBottom: '15px' }}>
                        <div style={{ width: "110px", lineHeight: "32px" }}>
                            <span>设置展示时间</span>
                        </div>
                        <RadioGroup
                            style={{ display: 'flex' }}
                            onChange={(e) => {
                                modelObj.showType = e.target.value;
                                this.setState({
                                    modelObj,
                                });
                            }}
                            value={modelObj.showType}>
                            <Radio style={radioStyle} key={1} value={1}>长期</Radio>
                            <Radio style={radioStyle} key={2} value={2}>自定义时间</Radio>
                        </RadioGroup>
                    </div>
                    {modelObj.showType == 2 ? <Fragment>
                        <div className="requrie-icon-wrapper"
                            style={{ display: "flex", position: "relative", marginBottom: '15px' }}>
                            <div style={{ width: "110px", lineHeight: "32px" }}>
                                <span>自定义日期</span>
                            </div>
                            <RangePicker
                                value={modelObj.showDateBegin ? [moment(modelObj.showDateBegin), moment(modelObj.showDateEnd)] : [undefined, undefined]}
                                placeholder={["开始时间", "结束时间"]}
                                style={{ marginRight: "5px", width: '305px' }}
                                onChange={(dates, dateStrings) => {
                                    modelObj.showDateBegin = dateStrings[0];
                                    modelObj.showDateEnd = dateStrings[1];
                                    this.setState({
                                        modelObj
                                    });
                                }}
                            />
                        </div>
                        <div className="requrie-icon-wrapper"
                            style={{ display: "flex", position: "relative", marginBottom: "15px" }}>
                            <div style={{ width: "110px", lineHeight: "32px" }}>
                                <span>自定义时间段</span>
                            </div>
                            <div>
                                {modelObj.photoShowQueryVoList && modelObj.photoShowQueryVoList.map((x: any, i: number) => {
                                    return (
                                        <div key={i} style={{ marginBottom: "15px" }}>
                                            <TimePicker
                                                placeholder="开始时间"
                                                value={x.showTimeBegin ? moment(x.showTimeBegin, 'HH:mm') : undefined}
                                                format="HH:mm"
                                                onChange={(time, timeString) => {
                                                    x.showTimeBegin = timeString
                                                    this.setState({
                                                        modelObj
                                                    })
                                                }}
                                            />
                                            <span style={{ margin: '0 10px' }}>-</span>
                                            <TimePicker
                                                placeholder="结束时间"
                                                value={x.showTimeEnd ? moment(x.showTimeEnd, 'HH:mm') : undefined}
                                                format="HH:mm"
                                                onChange={(time, timeString) => {
                                                    x.showTimeEnd = timeString
                                                    this.setState({
                                                        modelObj
                                                    })
                                                }}
                                            />
                                            {i == modelObj.photoShowQueryVoList.length - 1
                                                ? <Icon type="plus-circle"
                                                    theme="twoTone" style={{ fontSize: '20px', lineHeight: '32px', marginLeft: '10px' }}
                                                    onClick={() => {
                                                        modelObj.photoShowQueryVoList.push({})
                                                        this.setState({
                                                            modelObj
                                                        })
                                                    }} />
                                                : <Icon type="minus-circle"
                                                    style={{ fontSize: '20px', color: '#D36767', marginLeft: '10px' }}
                                                    onClick={() => {
                                                        modelObj.photoShowQueryVoList.splice(i, 1)
                                                        this.setState({
                                                            modelObj
                                                        })
                                                    }} />}

                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </Fragment> : ""}
                </Modal>
            </Layout>
        )
    }
}
