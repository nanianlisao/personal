import React from 'react'
// import "./areaPicker.less"
import { goPage,objDeepCopy } from 'util/util'
import { areaArray } from './area'
import { SwipeAction, Picker } from 'antd-mobile';
export default class AreaPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            areaArray:[]
        }
    }

    static defaultProps = {

    }



    componentWillMount() {
        var areaArray2 = objDeepCopy(areaArray)
        if (this.props.type == 'search') {
            areaArray2.map((x) => {
                if (x.children) {
                    x.children.map(y => {
                        if (y.children) {
                            y.children.unshift({
                                label: '全部',
                                value: y.value.slice(0, 4),
                            })
                        }
                    })
                    x.children.unshift({
                        label: '全部',
                        value: x.value.slice(0, 2),
                        children: [{
                            label: '全部',
                            value: x.value.slice(0, 2)
                        }]
                    })
                }
            })
            areaArray2.unshift({
                label: '全部',
                value: '',
                children: [{
                    label: '全部',
                    value: '',
                    children: [{
                        label: '全部',
                        value: ''
                    }]
                }]
            })
        }
        this.setState({
            areaArray:areaArray2
        })
    }

    onChange = (e) => {
        let [pCode, cCode, aCode] = e
        var arr = []
        this.state.areaArray.map((x) => {
            if (x.value === pCode) {
                arr[0] = {
                    label: x.label,
                    value: x.value
                }
                x.children && x.children.map((y) => {
                    if (y.value === cCode) {
                        arr[1] = {
                            label: y.label,
                            value: y.value
                        }
                        y.children && y.children.map((z) => {
                            if (z.value === aCode) {
                                arr[2] = {
                                    label: z.label,
                                    value: z.value
                                }
                            }
                        })
                    }
                })
            }
        })
        this.props.onChange && this.props.onChange(arr)
    }
    render() {
        return (
            <main className="AreaPicker-page">
                <Picker
                    onChange={this.onChange}
                    data={this.state.areaArray}
                >
                    {this.props.children}
                </Picker>
            </main >
        )
    }
}