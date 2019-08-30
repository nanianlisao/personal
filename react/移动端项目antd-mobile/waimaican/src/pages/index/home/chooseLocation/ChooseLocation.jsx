import React from 'react'
import './ChooseLocation.less'
import { Axios, goPage } from 'util/util'
import { Button } from 'antd-mobile';
import NoToken from 'components/noToken/NoToken'
import Constant from 'util/Constant'
export default class ChooseLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 1000,
            page: 1,
            selectIndex: null,
            imgUrl: Constant.getPicUrl(),
            dizhiList: [],
            token: localStorage.getItem('token'),
        };
    }
    componentWillMount() {
        document.title = '选择地址'
        this.getUserAddress()
    }

    // 查询用户地址列表
    async getUserAddress() {
        let res = await Axios.get('/user/address/list', {
            startIndex: (this.state.page - 1) * this.state.pageSize,
            pageSize: this.state.pageSize,
        })
        this.setState({
            dizhiList: res.data
        })
    }



    render() {
        let { dizhiList, selectIndex } = this.state
        return (
            <div className="page-chooseLocation">
                <div className="top">
                    <img src={require('common/img/test.png')} alt="" />
                </div>
                <div className="wrapper">
                    <div className="header flex">
                        <img src={require('common/img/dizhi2.png')} alt="" />
                        <span>我的送餐地址</span>
                    </div>
                    <div className="content">
                        {dizhiList.length > 0 ? <div className="dizhi-list">
                            {dizhiList.map((item, index) => (
                                <div className="dizhi-item flex" key={index} onClick={() => {
                                    goPage(`/changeLocation?dizhiObj=${encodeURIComponent(JSON.stringify(item))}`)
                                }}>
                                    <div className="check" onClick={(e) => {
                                        e.stopPropagation()
                                        this.setState({
                                            selectIndex: index,
                                        })
                                    }}><img src={selectIndex === index ? require('common/img/circle_ac.png') : require('common/img/circle.png')} alt="" /></div>
                                    <div className="info">
                                        <div className="info-top flex">
                                            <span>{item.receiveName}</span>
                                            <span>{item.receivePhone}</span>
                                        </div>
                                        <div className="dizhi overflow-1">{item.roughAddress + item.address}</div>
                                    </div>
                                    <img src={require('common/img/arrow_right.png')} alt="" className="arrow" />
                                </div>
                            ))}
                        </div> :
                            <div className="noDizhi flex"><img src={require('common/img/dizhi3.png')} alt="" /> <span>暂无地址</span> </div>
                        }
                    </div>
                    <div className={[dizhiList.length === 0 ? 'bottom-reset' : '', "footer"].join(' ')}>
                        {dizhiList.length > 0 ? <Button className="btn" activeClassName="hover-btn" onClick={() => {
                            if (selectIndex !== null) {
                                Constant.data.userAddress = dizhiList[selectIndex]
                                goPage('/chooseCanShop')
                            }
                        }}>确认选择</Button> : ""}
                        <Button className="btn" activeClassName="hover-btn" onClick={() => {
                            goPage('/changeLocation?dizhiObj={}')
                        }}>添加送餐地址</Button>
                    </div>
                </div>
            </div>
        )
    }
}