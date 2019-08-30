import React from 'react'
import AreaPicker from 'common/areaPicker/AreaPicker'
import Constant from 'util/Constant'
import { Axios } from 'util/util'
import HuangyeList from 'components/huangyeList/HuangyeList'
import { Picker } from 'antd-mobile'
import 'pages/index/huangye/Huangye.less'
export default class Huangye extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeListIndex: [],
            areaCode: '',
            memberIndustryId: ''
        }
    }
    componentDidMount() {
        console.log('黄页')
        this.getTypeList()
    }

    async getTypeList() {
        let res = await Axios.get(`/member/industry/list/app/${Constant.data.app_id}`, {
            startIndex: 0,
            pageSize: 10000
        })
        res.data.items.unshift({
            name: '全部',
            id: ''
        })
        res.data.items.map((x, index) => {
            x.value = index
            x.label = x.name
        })
        this.setState({
            typeList: res.data.items
        })
    }

    render() {
        let { typeListIndex, typeList } = this.state
        return (
            <main className="huangye-page">
                <div className='tabs-wrapper'>
                    <div className="tabs">
                        <Picker
                            data={this.state.typeList}
                            cols={1}
                            value={typeListIndex}
                            onChange={(e) => {
                                this.setState({
                                    typeListIndex: e,
                                    memberIndustryId: typeList[e[0]].id
                                })
                            }}
                        >
                            <div className="tab">
                                <div className="txt">{typeListIndex.length > 0 ? typeList[typeListIndex[0]].name : '行业'}</div>
                                <div className="imgCtn">
                                    <img alt="" src={require("common/img/triangle_down.png")}></img>
                                </div>
                            </div>
                        </Picker>
                        <div className="line"></div>
                        <AreaPicker
                            type="search"
                            onChange={(e) => {
                                let [provinceObj, cityObj, areaObj] = e
                                this.setState({
                                    areaCode: areaObj.value.slice(0, 6)
                                })
                            }}>
                            <div className="tab">
                                <div className="txt">区域</div>
                                <div className="imgCtn">
                                    <img src={require("common/img/triangle_down.png")}></img>
                                </div>
                            </div>
                        </AreaPicker>
                    </div>
                </div>
                <HuangyeList loadUrl='/member/list/app' json={{
                    memberIndustryId: this.state.memberIndustryId,
                    areaCode: this.state.areaCode
                }} />
            </main >
        )
    }
}