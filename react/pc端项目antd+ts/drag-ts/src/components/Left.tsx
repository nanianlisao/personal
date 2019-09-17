import * as React from 'react';
import { Icon } from 'antd'
import { IChildProps } from '../types/tag'

export interface ILeftProps {
    [name: string]: any
}

export interface ILeftState {
}

export default class Left extends React.Component<ILeftProps, ILeftState> {

    private arr: Array<IChildProps> = [
        { ComName: '文字', iconType: 'file-text' },
        { ComName: '图片', iconType: 'picture' },
        { ComName: '按钮', iconType: 'tag' },
        { ComName: '轮播', iconType: 'schedule' },
        { ComName: '分类', iconType: 'schedule' },
        { ComName: '图片列表', iconType: 'schedule' },
        { ComName: '标题', iconType: 'schedule' },
        { ComName: '自由面板', iconType: 'schedule' },
        { ComName: '底部导航', iconType: 'schedule' },
        { ComName: '滑块', iconType: 'schedule' },
        { ComName: '动态文章', iconType: 'schedule' },
        { ComName: '一键分享', iconType: 'schedule' },
    ]


    constructor(props: ILeftProps) {
        super(props);

        this.state = {
        }
    }


    handleDropStart = (event: React.DragEvent<HTMLDivElement>, item: IChildProps) => {
        event.dataTransfer.setData("name", JSON.stringify(item))
    }

    public render() {
        return (
            <div className="left">
                {this.arr.map((item) => (
                    <div className="left-item" key={item.ComName} draggable={true} onDragStart={(e) => {
                        this.handleDropStart(e, item)
                    }} >
                        <Icon type={item.iconType} theme="twoTone" className="Icon" />
                        <span>{item.ComName}</span>
                    </div>
                ))}
            </div>
        );
    }
}
