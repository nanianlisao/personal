import * as React from 'react';
import { Icon } from 'antd'


export interface ILeftProps {
    [name:string]:any
}

export interface ILeftState {
}

export default class Left extends React.Component<ILeftProps, ILeftState> {

    arr = [
        { name: '文字', type: 'file-text' },
        { name: '图片', type: 'picture' },
        { name: '按钮', type: 'tag' },
        { name: '轮播', type: 'schedule' },
        { name: '分类', type: 'schedule' },
        { name: '图片列表', type: 'schedule' },
        { name: '标题', type: 'schedule' },
        { name: '自由面板', type: 'schedule' },
        { name: '底部导航', type: 'schedule' },
        { name: '滑块', type: 'schedule' },
        { name: '动态文章', type: 'schedule' },
        { name: '一键分享', type: 'schedule' },
    ]


    constructor(props: ILeftProps) {
        super(props);

        this.state = {
        }
    }


    handleDropStart = (event:React.DragEvent<HTMLDivElement>, item:ILeftProps) => {
        event.dataTransfer.setData("name", JSON.stringify(item))
    }

    public render() {
        return (
            <div className="left">
                {this.arr.map((item) => (
                    <div className="left-item" key={item.name} draggable={true} onDragStart={(e) => {
                        this.handleDropStart(e, item)
                    }} >
                        <Icon type={item.type} theme="twoTone" className="Icon" />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        );
    }
}
