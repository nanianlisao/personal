import React from 'react'
import './Assemble.less'
import { goPage } from 'util/util'
import { PintuanGoodsStyles } from 'components/goods-style/GoodsStyles'
export default class Assemble extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentWillMount() {

    }

    render() {
        return (
            <main className="page-assemble">
                <section className="top flex-center">
                    <img src={require('common/img/0.jpg')} alt="" />
                    <span className="nick-name">用户昵称</span>
                    <span className="pintuan-invite">邀请你参与拼团！</span>
                </section>
                <section className="banner">
                    <img src={require('common/img/0.jpg')} alt="" />
                </section>
                <section className="content">
                    <PintuanGoodsStyles
                        style={{
                            flexShrink: 0,
                            border: 'none'
                        }}
                        onClick={() => {
                            goPage(`/home/goodsDetail?id=23`)
                        }}
                        price="99.00"
                        oldPrice="499.00"
                        pintuanCount="2"
                        showPintuan={false}
                        name="商品名字"
                        // fileId=""
                    />
                    <div className="btn">立即参团</div>
                </section>
            </main>
        )
    }
}