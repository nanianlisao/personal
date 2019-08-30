import React from 'react'
import { InputItem, SearchBar, Carousel } from 'antd-mobile'
import { goPage } from 'util/util'
export default class QuanziChooseType extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabIndex: 0,
            kindTab: [{
                name: "采购",
                img: require('common/img/cart.png'),
                kind: 1
            }, {
                name: "销售",
                img: require('common/img/bookPlus.png'),
                kind: 2
            }]
        }
    }
    componentDidMount() {
    }
    render() {
        let { kindTab, tabIndex } = this.state
        return (
            <main style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                height: '100%',
                background: '#fff'
            }}>
                {kindTab.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            width: '1.8rem',
                            height: '1.8rem',
                            textAlign: 'center',
                            lineHeight: '1.8rem',
                            color: index == tabIndex ? '#fff' : '#584F60',
                            background: index == tabIndex ? '#24C789' : '#fff',
                            fontSize: '.40rem',
                            borderRadius: '1rem',
                            border: '0.01rem solid #E6E6E6',
                            marginBottom: '0.7rem',
                            boxShadow: '0.02rem 0.02rem 0.02rem 0.02rem rgba(0, 0, 0, 0.09)'
                        }}
                        onClick={() => {
                            this.setState({
                                tabIndex: index
                            })
                            goPage(`/quanzi/release?kind=${item.kind}`)
                        }}
                    >{item.name}</div>
                ))}
            </main >
        )
    }
}