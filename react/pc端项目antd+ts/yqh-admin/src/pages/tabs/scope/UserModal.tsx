import * as React from 'react';
import { Modal, message } from 'antd';
import InputCom from "../../../components/input/InputCom";
import { Axios, EventValue } from "../../../utils/util";

export interface IObjectAny {
    [propName: string]: any
}
export interface IUserModalProps {
    visible: boolean,
    hideModel?: ()=> void
    obj: {
        id?: number
        name?: string,
        password?: string
        phone?: string
    }
}

export interface IUserModalState {
    loading: boolean
    obj: {
        id?: number
        name?: string,
        password?: string
        phone?: string
    }
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
            obj: {}
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
            this.setState({
                obj
            })
        }
    }

    async componentDidMount() {
        let { obj } = this.props
        this.setState({
            obj
        })
    }

    handleCancel = () => {
        if (this.props.hideModel) {
            this.props.hideModel()
        }
    }

    handleOk = async () => {
        let { obj } = this.state
        if (!obj.name) {
            message.warning("请输入员工姓名");
            return
        }
        if (!/^(0?(13|14|15|17|18|19)[0-9]{9})$/.test(obj.phone as string)) {
            message.warning("请输入正确的手机号码");
            return
        }
        if ((!obj.id) && (!obj.password)) {
            message.warning("请设置密码");
            return
        }

        this.setState({
            loading: true
        })
        try {
            let res = null
            if (obj.id) {
                res = await Axios.post('/user/modify', obj)
            } else {
                res = await Axios.post('/user/create', obj)
            }
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
                title={obj.id ? "修改员工" : "添加员工"}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                confirmLoading={this.state.loading}
            >
                <InputCom
                    title="员工姓名"
                    errMsg="请输入员工名称"
                    type="text"
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
                    onChange={(value: EventValue) => {
                        obj.phone = value as string;
                        this.setState({
                            obj
                        })
                    }}
                />
                {obj.id ? null : <InputCom
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
            </Modal>
        )
    }
}
