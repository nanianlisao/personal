import React from 'react';
import { Layout, Table, Button, Modal, message } from 'antd';
import UEditor from '../../../components/ueditor/Ueditor';
import Input from "../../../components/input/InputCom";
import { Axios, arrayMove, clone, ColumnProps } from "../../../utils/util";
import UploadImg from "../../../components/upload/UploadComponent";
import constant from "../../../utils/Constant";
const confirm = Modal.confirm;
const BannerPhotoType = 2
const imgSize = "750px * 448px"
interface IObjectAny {
    [propName: string]: any
}
export interface IBannerState {
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

export default class Banner extends React.Component<IObjectAny, IBannerState> {
    public Ueditor: UEditor | null = null;
    public timer: any = null
    columns: Array<ColumnProps<IObjectAny>> = [{
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (text, record, index) => (
            <span>{index + 1 + (this.state.pagination.current - 1) * 10}</span>
        )
    }, {
        title: 'banner名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '图片',
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

                        this.setState({
                            visible: true,
                            modelObj: clone(record),
                        })
                        let data = record.remark ? record.remark : "";
                        this.timer = setTimeout(() => {
                            (this.Ueditor as UEditor).setContent(data)
                        }, 500);
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
        }
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
                "photoType": BannerPhotoType,
            };
            let res = await Axios.get("/photo/list", para);
            console.log(res.data.items);
            let pagination = { ...this.state.pagination };
            pagination.total = res.data.totalCount;
            pagination.current = page
            res.data.items.map((item: any) => {
                item.key = item.id
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
                url = "/photo/down/" + id + "/" + BannerPhotoType;
                break;
            case -1:
                url = "/photo/up/" + id + "/" + BannerPhotoType;
                break;
            case 0:
                url = "/photo/top/" + id + "/" + BannerPhotoType;
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
        modelObj.remark = (this.Ueditor as UEditor).getContent();
        if (!modelObj.name) {
            message.warning("请填写图片名称");
            return;
        }
        if (!modelObj.photoFileId) {
            message.warning("请上传图片");
            return;
        }
        let url = "";
        if (!modelObj.id) {
            url = "/photo/create";
        } else {
            url = "/photo/modify";
        }

        try {
            this.setState({ loading: true });
            await Axios.post(url, { ...modelObj, photoType: BannerPhotoType }, true);
            message.success(modelObj.id ? "编辑成功" : "添加成功");
            this.setState({
                loading: false,
                visible: false
            });
            this.getImgList();
        } catch (e) {
            console.log(e);
        }

    }

    render() {
        let { modelObj } = this.state
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
                                modelObj: {}
                            })
                            this.timer = setTimeout(() => {
                                (this.Ueditor as UEditor).setContent("")
                            }, 500);
                        }}>
                        添加轮播图
                        </Button>&nbsp;&nbsp;
                        <span className="small-warning-font">详情内容若没有，则小程序端banner不可点击。</span>
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
                    title={modelObj.id == undefined ? "添加banner" : "编辑banner"}
                    onOk={this.handleOk}
                    onCancel={() => {
                        this.setState({ visible: false });
                    }}
                    confirmLoading={this.state.loading}
                >
                    <Input
                        title="banner名称"
                        placeholder="请输入banner名称"
                        errMsg="banner名称不能为空"
                        value={modelObj.name ? modelObj.name : ''}
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
                        onChange={(fileList) => {
                            modelObj.photoFileId = fileList.join(',');
                            this.setState({
                                modelObj
                            })
                        }}
                    />
                    <div className="requrie-icon-wrapper" style={{ position: "relative", display: "flex" }}>
                        <div style={{ width: "110px", lineHeight: "32px" }}>
                            <span>banner详情</span>
                        </div>

                        <UEditor id="content" ref={(el) => this.Ueditor = el as UEditor} />
                    </div>
                </Modal>
            </Layout>
        )
    }
}
