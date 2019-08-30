import * as React from 'react';

export interface IUeditorProps {
    width: string
    height: string
    id?: string
}


export interface IUeditorState {
    config: {
        toolbars: any
    }
}

export default class Ueditor extends React.Component<IUeditorProps, IUeditorState> {

    static defaultProps = {
        width: '500px',
        height: '200px'
    }

    public ue: any;
    constructor(props: IUeditorProps) {
        super(props);

        this.state = {
            config: {
                toolbars: [[
                    'fullscreen', 'source', '|', 'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                    'link', 'simpleupload',
                    // 'directionalityltr', 'directionalityrtl', 'indent', '|',
                    // 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                    // 'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    // 'insertimage', // 插入图片和多图上传功能禁用
                    // 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                    // 'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
                    // 'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                    // 'print', 'preview', 'searchreplace', 'help', 'drafts'
                ]]
            }
        }
    }
    componentDidMount() {
        const UE = (window as any).UE
        this.ue = UE.getEditor(this.props.id, this.state.config);
    }
    componentWillUnmount() {
        // 组件卸载后，清除放入库的id
        (window as any).UE.delEditor(this.props.id);
    }
    getContent() {
        return this.ue.getContent()
    }
    setContent(text: string) {
        this.ue.setContent(text ? text : "");
    }

    render() {
        return (
            <div>
                <div>
                    <div id={this.props.id} style={{ width: this.props.width, height: this.props.height }} />
                </div>
                <div id="btns">
                    <div />
                </div>

            </div>
        )
    }
}
