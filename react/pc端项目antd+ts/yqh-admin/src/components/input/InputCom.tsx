/* Created by chenlu on 2018/11/1.
*/
import * as React from "react";
import { Input } from "antd";
import "./InputCom.css";

interface Iprops {
    [propName: string]: any
}


interface Istate {
    isErr: boolean,
    value: string
}

type InputEvent = React.ChangeEvent<HTMLInputElement>


class InputComponent extends React.Component<Iprops, Istate> {
    static defaultProps: Iprops = {
        disabled: false,
        title: "",
        value: null,
        inputWidth: "200px",
        titleWidth: "110px",
        maxLength: 32,
        type: "text",
        validate: false,
        regex: null,
        placeholder: "",
        errMsg: "",
        remark: "",
        id: "",
        style: {},
        onChange: () => {
            console.log(111)
        }
    }

    constructor(props: Iprops) {
        super(props);
        this.state = {
            isErr: false,
            value: ''
        };
    }

    componentWillReceiveProps(props: Iprops) {
        if ((this.props.validate || this.props.regex) && props.value) {
            let isErr = (this.props.regex && this.props.regex.test(props.value)) || (!this.props.regex && props.value)
            this.setState({
                isErr: !isErr
            })
        }
    }

    showErr = () => {
        this.setState({
            isErr: true,
        })
    }

    onBlur = (e: InputEvent) => {
        this.check(e)
    };

    onChange = (e: InputEvent) => {
        if (e.target.value.length > this.props.maxLength) {
            e.target.value = this.props.value;
        }
        if (this.props.value === null) {
            this.setState({
                value: e.target.value
            })
        }
        this.check(e)
        this.props.onChange(e.target.value);
    };

    check = (e: InputEvent) => {
        if (this.props.validate || this.props.regex) {
            let isErr = (this.props.regex && this.props.regex.test(e.target.value)) || (!this.props.regex && e.target.value)
            this.setState({
                isErr: !isErr
            })
        }
    }
    render() {
        return (
            <div className={['inputComponent-div', (this.props.validate || this.props.regex) ? '' : ''].join(" ")} style={{ height: this.props.errMsg ? "55px" : "auto", ...this.props.style }}>
                <div className={this.props.title ==
                    "" ? "inputComponent-span-div-hide" : "inputComponent-span-div"} style={{ width: this.props.titleWidth }}>
                    <span>
                        {this.props.title}
                    </span>
                </div>
                <div className="inputComponent-input-div">
                    <Input
                        className={this.state.isErr ? "inputComponent-err-border" : ""}
                        disabled={this.props.disabled}
                        style={{ "width": this.props.inputWidth }}
                        placeholder={this.props.placeholder}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                        value={this.props.value !== null ? this.props.value : this.state.value}
                        type={this.props.type}
                    />
                    <span style={{ marginLeft: '10px' }}>{this.props.remark}</span>
                    <div className={this.state.isErr ? "inputComponent-message-div-err" : "inputComponent-message-div"}>
                        {this.props.errMsg}
                    </div>
                </div>
            </div>
        )
    }
}
export default InputComponent
