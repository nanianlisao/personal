import * as React from 'react';

export interface IContainProps {
}

export interface IContainState {
    dom: Array<any>
}

export default class Contain extends React.Component<IContainProps, IContainState> {
    constructor(props: IContainProps) {
        super(props);

        this.state = {
            dom: []
        }
    }
    componentDidMount() {
        document.ondragover = function (evt) {
            // 取消事件的默认行为
            return false;
        }
        document.ondragleave = function (evt) {
            //取消被拖动的元素离开本元素时触发该事件
            return false;

        }
        document.ondrop = function (evt) {
            // 取消事件的默认行为
            return false;
        }
    }

     render() {
        let { dom } = this.state
        console.log(dom)
        return (
            <div>
                <div className="phone-wrapper"
                    onDrop={(e) => {
                        let newDom = e.dataTransfer.getData('name')
                        dom.push(JSON.parse(newDom))
                        this.setState({
                            dom
                        })
                    }} >
                    {dom.map((x) => (
                        <div key={x.name}>{x.name}</div>
                    ))}
                </div>
            </div>
        )
    }
}
