import * as React from 'react';
import { Modal, message, Select } from 'antd';
import InputCom from "../../../components/input/InputCom";
import { Axios, EventValue } from "../../../utils/util";
const Option = Select.Option;

export interface IObjectAny {
    [propName: string]: any
}
export interface IUserModalProps {
    visible: boolean,
    hideModal?: () => void
    obj: {
        userId?: number
        name?: string,
        password?: string
        phone?: string
        storesIds?: (number | string)[],
        storesVos?: object[]
    }
}

export interface IUserModalState {
    loading: boolean
    obj: {
        userId?: number
        name?: string,
        password?: string
        phone?: string,
        storesIds?: (number | string)[],
        storesVos?: object[]
    }
    shopList: { id?: number, name: string }[]
}

export default class UserModal extends React.Component<IUserModalProps, IUserModalState> {
    static defaultProps = {
        visible: false,
        obj: {}
    }
    constructor(props: IUserModalProps) {
        super(props)
        this.state = {
            loading: false,
            obj: {},
            shopList: []
        }
    }
    componentWillReceiveProps(props: IUserModalProps) {
        if (props.visible) {
            this.setState({
                loading: false
            })
        }
        if (props.obj) {
            let obj = props.obj
            obj.storesIds = props.obj.storesVos ? props.obj.storesVos.map((x: any) => x.id) : []
            this.setState({
                obj
            })
        }
    }

    componentDidMount() {
        this.getShopList() // 去查询店铺列表
        let { obj } = this.props
        this.setState({
            obj
        })
    }

    private async getShopList(): Promise<void> {
        let res = await Axios.get("/stores/jin/lun/list", {
            pageSize: 1000,
            startIndex: 0,
        })
        this.setState({
            shopList: res.data.items
        })
    }

    private handleCancel(): void {
        if (this.props.hideModal) {
            this.props.hideModal()
        }
    }

    // 修改|创建员工
    private async handleOk(): Promise<void> {
        let { obj } = this.state
        if (!obj.name) {
            message.warning("请输入员工姓名");
            return
        }
        if (!/^(0?(13|14|15|17|18|19)[0-9]{9})$/.test(obj.phone as string)) {
            message.warning("请输入正确的手机号码");
            return
        }
        if ((!obj.userId) && (!obj.password)) {
            message.warning("请设置密码");
            return
        }
        if (!obj.storesIds || obj.storesIds.length === 0) {
            message.warning("请选择关联店铺");
            return
        }

        this.setState({
            loading: true
        })
        try {
            let url: string = obj.userId ? "/user/modify" : "/user/create/jinlun"
            let res = await Axios.post(url, { ...obj, id: obj.userId })
            message.success(res.retMsg)
            this.handleCancel()
        } catch (e) {
            console.log(e)
        }
        this.setState({
            loading: false
        })

    }

    render() {
        let { obj } = this.state
        return (
            <Modal
                width="400px"
                visible={this.props.visible}
                title={obj.userId ? "修改员工" : "添加员工"}
                onCancel={() => { this.handleCancel() }}
                onOk={() => { this.handleOk() }}
                confirmLoading={this.state.loading}
            >
                <InputCom
                    title="员工姓名"
                    errMsg="请输入员工名称"
                    placeholder="请输入员工名称"
                    inputWidth="200px"
                    value={obj.name ? obj.name : ''}
                    validate={true}
                    onChange={(value: EventValue) => {
                        obj.name = value as string;
                        this.setState({
                            obj
                        })
                    }}
                />
                <div style={{ fontSize: '12px', color: '#f00' }}>注：手机号即为登陆名</div>
                <InputCom
                    title="手机号"
                    errMsg="请输入手机号码"
                    type="number"
                    maxLength={11}
                    placeholder="请输入手机号码"
                    inputWidth="200px"
                    value={obj.phone ? obj.phone : ''}
                    validate={true}
                    onChange={(value: string) => {
                        obj.phone = value;
                        this.setState({
                            obj
                        })
                    }}
                />
                {obj.userId ? null : <InputCom
                    title="操作密码"
                    errMsg="请输入密码"
                    placeholder="请输入密码"
                    inputWidth="200px"
                    value={obj.password ? obj.password : ''}
                    validate={true}
                    onChange={(value: EventValue) => {
                        obj.password = value as string;
                        this.setState({
                            obj
                        })
                    }}
                />}
                <div className="store-list-row-div">
                    <div style={{ width: "110px", lineHeight: "32px" }}>
                        <span>关联店铺</span>
                    </div>
                    <div>
                        <Select
                            mode="multiple"
                            style={{ width: "200px", marginRight: "5px" }}
                            placeholder="请选择关联店铺"
                            value={obj.storesIds ? obj.storesIds : undefined}
                            onChange={(e: any) => {
                                console.log(e)
                                obj.storesIds = e;
                                this.setState({
                                    obj: obj
                                })
                            }}
                        >
                            {this.state.shopList.map((item) => (
                                <Option value={item.id} key={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Modal>
        )
    }
}
