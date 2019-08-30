import * as React from 'react'
import moment from 'moment'
import { Layout, Table, Button, Modal, message, Input, Select, DatePicker, TimePicker } from 'antd'
import InputCom from '../../components/input/InputCom'
import UploadImg from "../../components/upload/UploadComponent"
import UEditor from '../../components/ueditor/Ueditor'
import { Axios, arrayMove, clone, ColumnProps } from "../../utils/util"
import constant from "../../utils/Constant"
const Option = Select.Option
const confirm = Modal.confirm
const { TextArea } = Input
interface IObjectAny {
    [propName: string]: any
}
interface porpsObj {
    name: string, // 中文名
    wkey: string, // 字段名称
    type?: number, // 搜索类型 默认为1 1. input框 2. select 3. date 4 .image 5. ueditor 6. textarea，7. TimePicker
    data?: Array<{ name: string, value: any }>,  // 主要针对type 2 select 时
    format?: string, // 主要针对type 3 datePicker 时
    imgSize?: string, // 主要针对type 4 image 时 图片尺寸
    required?: boolean, // 是否必填  提交时 做验证
    rule?: (value: any) => boolean, // 校验规则 value 为当前值
    ruleErrMsg?: string, // 校验规则 不通过时的提示文字
    children?: porpsObj[], // 关联属性，用于组件之间相互关联
    show?: (value: any) => boolean, // 是否展示该组件 value 为父组件的值，可用于关联组件控制
    extPorps?: IObjectAny, // 额外的属性
    extInputPorps?: IObjectAny, // 额外的Input的属性
}
interface columnObj { //  生成column参数类型
    name: string, // 中文名
    wkey: string, // 字段名称
    type?: number, // 展示类型 1 文字 2 图片 3 排序  // default 1
    render?: ((text: any, record: IObjectAny, index: number) => React.ReactNode) | undefined, // 渲染内容 优先级大于type
}
export interface ITableComProps {
    dataName: string, // 列表的名称
    addDataUrl?: string, // 添加数据url
    delDataUrl?: string, // 删除数据url
    changeDataUrl?: string, // 修改数据url
    getDataUrl: string, // 查询数据url
    exportDataUrl?: string, // 导出数据url
    sortUpUrl?: string, // 排序上移url
    sortDownUrl?: string, // 排序下移url
    sortTopUrl?: string, // 排序置顶url

    delDataName?: string, // 删除别名 比如叫 冻结，下架，隐藏之类
    searchProps?: Array<porpsObj>, // 搜索时的key值
    modalProps?: Array<porpsObj>, // 弹出框 修改的modal
    tableColumn: Array<columnObj>, // 生成的column
    tableWidth?: string, // 给table设一个最小宽度
    topRemark?: string, // 顶部按钮旁的提示语言
    // [propName: string]: any
}

export interface ITableComState {
    columns: Array<ColumnProps<IObjectAny>> // table的columns
    dataList: object[]    // table数据列表
    tableLoading: boolean // table加载loading
    visible: boolean       // 编辑数据对象时 控制modal是否可见
    loading: boolean      // 编辑数据对象时 控制modal的loading
    modalObj: IObjectAny    // 当前选中的数据对象详情
    para: IObjectAny  //  表格筛选条件
    pagination: { total: number, current: number }   // table分页对象
}

export default class TableCom extends React.Component<ITableComProps, ITableComState> {
    [name: string]: any
    static defaultProps = {
        dataName: "",
        addDataUrl: "", // 添加数据url
        delDataUrl: "", // 删除数据url
        changeDataUrl: "", // 修改数据url
        getDataUrl: "", // 查询数据url
        exportDataUrl: "", // 导出数据url
        sortUpUrl: "", // 排序上移url
        sortDownUrl: "", // 排序下移url
        sortTopUrl: "", // 排序置顶url
        tableColumn: [], // 生成的column
        delDataName: '删除',
        modalProps: [],  // 弹出框需要的字段

        // [propName: string]: any 
    }


    constructor(props: ITableComProps) {
        super(props)
        if (props.modalProps) {
            let ueditorArr = props.modalProps.filter(x => x.type === 5) // 如果需要ueditor
            ueditorArr.forEach((item) => {
                this[`Ueditor${item.wkey}`] = null
            })
        }
        this.state = {
            columns: [],  // table的columns
            dataList: [],    // table数据列表
            tableLoading: false, // table加载loading
            visible: false,      // 编辑数据对象时 控制modal是否可见
            loading: false,     // 编辑数据对象时 控制modal的loading
            modalObj: {},   // 当前选中的数据对象详情
            para: {}, //  表格筛选条件
            pagination: { total: 1, current: 1 },   // table分页对象
        }
    }

    componentWillMount() {
        this.initTableHeader()  // 先初始化表格columns
        this.getDataList()
        console.log(this.props.delDataName)
    }

    // 先初始化表格columns
    initTableHeader(): void {
        let { tableColumn, sortUpUrl, sortDownUrl, sortTopUrl, delDataUrl, changeDataUrl, modalProps, delDataName } = this.props
        let { columns } = this.state
        tableColumn.forEach((item) => {
            let colunmsObj: ColumnProps<IObjectAny> = {  // 每个column的内容
                title: item.name,
                dataIndex: item.wkey,
                key: item.wkey,
            }
            if (item.render) {
                colunmsObj.render = item.render
            } else if (item.type == 2) { // 图片类型
                colunmsObj.render = (text) => (
                    <img style={{ "width": "60px" }} src={constant.getPicUrl() + text} />
                )
            } else if (item.type == 3) { // 序号
                colunmsObj.render = (text, record, index) => (
                    <span>{index + 1 + (this.state.pagination.current - 1) * 10}</span>
                )
            }

            columns.push(colunmsObj)
        })
        if (this._getBoolean(sortUpUrl, sortDownUrl, sortTopUrl)) {  // 是否有排序这一栏
            columns.push({
                title: '排序',
                dataIndex: 'order',
                key: 'order',
                render: (text, record, index) => (
                    <div>
                        {index != 0 ? <Button style={{ marginRight: "2px" }} onClick={() => {
                            this.move(record.id, index, -1)
                        }}>上移</Button> : ""}
                        {index != this.state.dataList.length - 1 ? <Button style={{ marginRight: "2px" }} onClick={() => {
                            this.move(record.id, index, 1)
                        }}>下移</Button> : ""}
                        {index != 0 ? <Button onClick={() => {
                            this.move(record.id, index, 0)
                        }}>置顶</Button> : ""}
                    </div>
                )
            })
        }
        if (changeDataUrl || delDataUrl) {
            columns.push({  // 每个column的内容
                title: "操作",
                dataIndex: "operate",
                key: "operate",
                render: (text, record) => (
                    <div>
                        {changeDataUrl ?
                            <Button
                                type="primary"
                                className="margin-right-5"
                                onClick={() => {
                                    // 如果有富文本内容 进行setContent
                                    let ueditorArr = modalProps && modalProps.filter(x => x.type === 5)
                                    setTimeout(() => {
                                        ueditorArr && ueditorArr.forEach((item) => {
                                            (this[`Ueditor${item.wkey}`] as UEditor).setContent(record[item.wkey])
                                        })
                                    }, 500)
                                    this.setState({
                                        visible: true,
                                        modalObj: clone(record),
                                    })
                                }}>修改</Button>
                            : null}
                        {delDataUrl ?
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.del(record.id)
                                }} >{delDataName}</Button>
                            : null}
                    </div>
                )
            })
        }
        this.setState({
            columns: columns
        })
    }

    // 获取表格数据
    private async  getDataList(page: number = this.state.pagination.current, pageSize: number = constant.data.pageSize): Promise<void> {
        try {
            this.setState({
                tableLoading: true,
            })
            let res = await Axios.get(this.props.getDataUrl, {
                ...this.state.para,
                pageSize,
                startIndex: (page - 1) * pageSize,
            })
            let pagination = {    // 修改pagination
                ...this.state.pagination,
                total: res.data.totalCount,
                current: page
            }
            res.data.items.forEach((item: IObjectAny) => {
                item.key = item.id
            })
            this.setState({
                tableLoading: false,
                dataList: res.data.items,
                pagination
            })
        } catch (e) {
            console.log(e)
        }
    }

    // 对列表进行上下移动
    private async move(id: string, index: number, move: number): Promise<void> {
        let url = ""
        switch (move) {
            case 1:
                url = (this.props.sortDownUrl as string).replace(/##/, id)
                break
            case -1:
                url = (this.props.sortUpUrl as string).replace(/##/, id)
                break
            case 0:
                url = (this.props.sortTopUrl as string).replace(/##/, id)
                break
        }
        await Axios.post(url)
        // 对this.state.dataList进行排序
        let array = arrayMove(this.state.dataList, index, move)
        this.setState({
            dataList: array
        })
    }

    // 删除该条数据
    private del(id: string): void {
        const { delDataName } = this.props
        confirm({
            title: `您确定要${delDataName}么?`,
            content: '',
            okText: delDataName,
            cancelText: "取消",
            onOk: async () => {
                let url = (this.props.delDataUrl as string).replace(/##/, id)
                await Axios.post(url)
                message.success(`${delDataName}成功`)
                this.getDataList()
            },
        })
    }

    // 添加或修改数据成功
    private async handleOk(): Promise<void> {
        const { addDataUrl, changeDataUrl, modalProps } = this.props
        if (!(changeDataUrl && addDataUrl)) { // 如果没有修改或者添加的url 直接ruturn
            message.warning("未传入添加或修改的url")
            return
        }
        if (!modalProps) {
            message.warning("未传入任何modalProps")
            return
        }
        let { modalObj } = this.state
        // 如果有富文本内容 先获取值
        let ueditorArr = modalProps.filter(x => x.type === 5)
        ueditorArr.forEach((item) => {
            modalObj[item.wkey] = (this[`Ueditor${item.wkey}`] as UEditor).getContent()
        })
        // 验证required
        let flag = false
        // 检查必填项， 树遍历（深度遍历）  val为父组件val时 控制是否
        let checkRequire = (modalProps: porpsObj[], val?: any) => {
            modalProps.forEach((item) => {
                // 如果是子组件 且没显示 则跳过
                if (item.show && !item.show(val)) {
                    return ""
                }
                // 如果是必填项 且是第一次遍历 
                if (item.required && !flag) {
                    // 如果没填写，提示填写完整
                    if (modalObj[item.wkey] === undefined || modalObj[item.wkey] === "") {
                        message.warning(`${item.name}为必填项，请填写完整`)
                        flag = true
                    } else if (item.rule && !item.rule(modalObj[item.wkey])) {
                        // 如果有额外的规则，则校验规则是否通过
                        message.warning(item.ruleErrMsg ? item.ruleErrMsg : `${item.name}选项填写规则错误，请重新填写`)
                        flag = true
                    }
                }
                // 如果有子组件 继续遍历
                if (item.children && !flag) {
                    checkRequire(item.children, modalObj[item.wkey])
                }
            })
        }

        checkRequire(modalProps)


        if (flag) return

        // 根据是否有id判断当前操作为修改还是添加，请求的url也会改变
        let url = modalObj.id ? changeDataUrl : addDataUrl
        try {
            this.setState({ loading: true })
            await Axios.post(url, modalObj)
            message.success(modalObj.id ? "编辑成功" : "添加成功")
            this.setState({
                visible: false
            })
            this.getDataList()
        } catch (e) {
            console.log(e)
        }
        this.setState({
            loading: false,
        })

    }

    // 根据一组数据 返回是否满足有其中一个
    private _getBoolean(...rest: (string | undefined)[]): boolean {
        return rest.some(item => Boolean(item))
    }

    render() {
        let { modalObj, para } = this.state
        const { addDataUrl, exportDataUrl, dataName, searchProps, modalProps, tableWidth, topRemark } = this.props
        // 根据传入的数组 生成ReactNode， 因为组件可能下面会关联组件，所以需要进行递归操作
        const modalContent = (arr: Array<porpsObj> | undefined, val?: any): React.ReactNode[] | undefined => {
            return arr && arr.map(item => {
                // 如果是子组件 通过show来控制，如果没有show则默认显示
                if (item.show && !item.show(val)) {
                    return ""
                }
                const baseRender = (() => {
                    if (item.type === 1 || (!item.type)) {
                        return (
                            <InputCom
                                title={item.name}
                                placeholder={`请输入${item.name}`}
                                errMsg={`${item.name}不能为空`}
                                value={modalObj[item.wkey] ? modalObj[item.wkey] : ""}
                                validate={item.required}
                                onChange={(value: any) => {
                                    modalObj[item.wkey] = value
                                    this.setState({
                                        modalObj,
                                    })
                                }}
                                extPorps={item.extInputPorps} // 因为InputCom是二次封装组件 所以可以通过extPorps修改默认属性
                                {...item.extPorps}
                            />
                        )
                    } else if (item.type === 2) {
                        return (
                            <div className={["modelObj-list-row-div", item.required ? "required-mark" : ""].join(" ")}>
                                <div style={{ width: "110px", lineHeight: "32px" }}>
                                    <span>{item.name}</span>
                                </div>
                                <div>
                                    <Select
                                        style={{ width: "200px" }}
                                        value={modalObj[item.wkey] ? modalObj[item.wkey] : undefined}
                                        placeholder={`请选择${item.name}`}
                                        onChange={(value: string) => {
                                            modalObj[item.wkey] = value
                                            this.setState({
                                                modalObj
                                            })
                                        }}
                                        {...item.extPorps}
                                    >
                                        {item.data && item.data.map((data) => (
                                            <Option value={data.value} key={data.value}>{data.name}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        )
                    } else if (item.type === 3) {
                        return (
                            <div className={["modelObj-list-row-div", item.required ? "required-mark" : ""].join(" ")}>
                                <div style={{ width: "110px", lineHeight: "32px" }}>
                                    <span>{item.name}</span>
                                </div>
                                <div>
                                    <DatePicker
                                        {...item.extPorps}
                                        style={{ "width": "200px" }}
                                        showTime={true}
                                        format={item.format}
                                        value={modalObj[item.wkey] ? moment(modalObj[item.wkey], item.format) : undefined}
                                        placeholder={item.name}
                                        onChange={(e, dataString) => {
                                            modalObj[item.wkey] = dataString
                                            this.setState({
                                                modalObj
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    } else if (item.type === 4) {
                        return (
                            <UploadImg
                                title={item.name}
                                required={item.required}
                                imgSize={item.imgSize ? item.imgSize : "100px*100px"}
                                fileList={modalObj[item.wkey] ? modalObj[item.wkey].split(',') : []}
                                onChange={(fileList) => {
                                    modalObj[item.wkey] = fileList.join(',')
                                    this.setState({
                                        modalObj
                                    })
                                }}
                            />
                        )
                    } else if (item.type === 5) {
                        return (
                            <div
                                className={item.required ? " required-mark" : ""}
                                style={{ position: "relative", display: "flex", marginBottom: '22px', }}
                            >
                                <div style={{ width: "110px", lineHeight: "32px", flexShrink: 0 }}>
                                    <span>{item.name}</span>
                                </div>
                                <div>
                                    <UEditor
                                        id={`content${item.wkey}`}
                                        width="600px"
                                        height="300px"
                                        ref={(el: UEditor) => this[`Ueditor${item.wkey}`] = el}
                                        {...item.extPorps}
                                    />
                                </div>
                            </div>
                        )
                    } else if (item.type === 6) {
                        return (
                            <div
                                className={["flex-middle", item.required ? " required-mark" : ""].join(" ")}
                                style={{ marginBottom: '22px', lineHeight: '32px' }}
                            >
                                <span style={{ width: '110px', display: 'inline-block', verticalAlign: 'top' }}>{item.name}</span>
                                <TextArea rows={4}
                                    style={{ width: '500px' }}
                                    value={modalObj[item.wkey]}
                                    placeholder={`请填写${item.name}`}
                                    onChange={(e) => {
                                        modalObj[item.wkey] = e.target.value
                                        this.setState({
                                            modalObj
                                        })
                                    }}
                                    {...item.extPorps}
                                />
                            </div>
                        )
                    } else if (item.type === 7) {
                        return (
                            <div className={["modelObj-list-row-div", item.required ? "required-mark" : ""].join(" ")} >
                                <div style={{ width: "110px", lineHeight: "32px" }}>
                                    <span>{item.name}</span>
                                </div>
                                <div>
                                    <TimePicker
                                        style={{ "width": "200px" }}
                                        format={item.format}
                                        value={modalObj[item.wkey] ? moment(modalObj[item.wkey], item.format) : undefined}
                                        placeholder={item.name}
                                        onChange={(e, dataString) => {
                                            modalObj[item.wkey] = dataString
                                            this.setState({
                                                modalObj
                                            })
                                        }}
                                        {...item.extPorps}
                                    />
                                </div>
                            </div>
                        )
                    }
                })()
                return (
                    <div key={item.wkey}>
                        {baseRender}
                        {item.children ? modalContent(item.children, modalObj[item.wkey]) : ""}
                    </div>
                )

            })
        }
        return (
            <Layout>
                {addDataUrl || exportDataUrl ? <div style={{ "marginBottom": "10px" }}>
                    {addDataUrl ? <Button
                        type="primary"
                        size="large"
                        style={{ "width": "150px", marginRight: "5px" }}
                        onClick={() => {
                            let ueditorArr = modalProps && modalProps.filter(x => x.type === 5)
                            setTimeout(() => {
                                ueditorArr && ueditorArr.forEach((item) => {
                                    (this[`Ueditor${item.wkey}`] as UEditor).setContent("")
                                })
                            }, 500)
                            this.setState({
                                visible: true,
                                modalObj: {}
                            })
                        }}> 添加{dataName}</Button> : null}
                    {exportDataUrl ? <Button
                        type="primary"
                        size="large"
                        style={{ "width": "150px", marginRight: "5px" }}
                        onClick={() => {
                            window.open(exportDataUrl);
                        }}>导出全部</Button> : null}
                    {topRemark ? <span className="small-warning-font">{topRemark}</span> : null}
                </div> : null}
                {searchProps ? <div style={{ "marginBottom": "10px" }}>
                    {searchProps.map(item => {
                        if (item.type === 1 || (!item.type)) {
                            return (
                                <Input
                                    key={item.wkey}
                                    style={{ "width": "140px", marginRight: "10px" }}
                                    placeholder={`输入${item.name}查询`}
                                    value={para[item.wkey]}
                                    onChange={e => {
                                        para[item.wkey] = e.target.value
                                        this.setState({
                                            para
                                        })
                                    }}
                                />
                            )
                        }
                        else if (item.type === 2) {
                            return (
                                <Select
                                    key={item.wkey}
                                    style={{ width: "140px", marginRight: "5px" }}
                                    value={para[item.wkey]}
                                    placeholder={`选择${item.name}查询`}
                                    onChange={(value: string) => {
                                        para[item.wkey] = value
                                        this.setState({
                                            para
                                        })
                                    }}
                                >
                                    {item.data && item.data.map((data) => (
                                        <Option value={data.value} key={data.value}>{data.name}</Option>
                                    ))}
                                </Select>
                            )
                        } else if (item.type === 3) {
                            return (
                                <DatePicker
                                    style={{ "width": "140px", marginRight: "10px" }}
                                    showTime={true}
                                    format={item.format}
                                    value={para[item.wkey] ? moment(para[item.wkey], item.format) : undefined}
                                    placeholder={item.name}
                                    onChange={(e, dataString) => {
                                        para[item.wkey] = dataString
                                        this.setState({
                                            para
                                        })
                                    }}
                                    key={item.wkey}
                                />
                            )
                        }
                    })}

                    <Button type="primary" style={{ "width": "100px", marginRight: "5px" }}
                        onClick={() => {
                            this.getDataList()
                        }}>搜索</Button>
                </div> : null}
                <Table
                    style={{ "backgroundColor": "#FFF", minWidth: tableWidth ? tableWidth : 'auto' }}
                    dataSource={this.state.dataList}
                    columns={this.state.columns}
                    pagination={this.state.pagination}
                    onChange={(page) => {
                        this.getDataList(page.current)
                    }}
                    loading={this.state.tableLoading}
                    bordered={true}
                />
                <Modal
                    width="800px"
                    visible={this.state.visible}
                    title={this.state.modalObj.id ? `编辑${this.props.dataName}` : `添加${this.props.dataName}`}
                    onOk={() => {
                        this.handleOk()
                    }}
                    onCancel={() => {
                        this.setState({ visible: false })
                    }}
                    confirmLoading={this.state.loading}
                >
                    {modalContent(modalProps)}
                </Modal>
            </Layout>
        )
    }
}
