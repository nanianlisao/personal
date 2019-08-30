import React from 'react'
import { withRouter } from 'react-router-dom';
import { Axios, goPage, postMessage, parseQueryString } from 'util/util'
import Constant from 'util/Constant'
import './Share.less'

class Share extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgUrl: Constant.getPicUrl(),
            image: {},
            defaultImgUrl: '225120f92cc71c6dedc10d8d85694f87',
        }
    }
    componentDidMount() {
        var options = parseQueryString(this.props.location.pathname + this.props.location.search)
        let item = JSON.parse(decodeURIComponent(options.item))
        console.log(item)
        this.setState({
            item: item
        }, this.initCanvas)
    }

    async initCanvas() {
        let canvas = document.getElementById('canvas');
        let { item, imgUrl, defaultImgUrl } = this.state
        let context = canvas.getContext('2d');
        context.fillStyle = "#F5F5F5";
        context.fillRect(0, 0, 700, 1000);
        let bannerImg = item.img ? imgUrl + item.img : imgUrl + defaultImgUrl
        // let codeFileRes = await Axios.get(`/app/query/currency/qrcode/${item.goodsId + ',' + Constant.user_id.userId + ',' + Constant.data.storesId}`)
        let codeFileRes = await Axios.get('/goodsTemplate/wx/qrcode', {
            qrUrl: "pages/index/index",
            scene: `${item.goodsId + ',' + Constant.user_id.userId + ',' + Constant.data.storesId}`
        })

        let codeImg = imgUrl + codeFileRes.data
        // let codeImg = imgUrl + '36721d11187a65690e1481022ec417a0'
        await this.drawImage(context, bannerImg, 20, 20, 660, 660)
        await this.drawImage(context, codeImg, 405, 730, 262, 262)
        this.drawText(context, item.name, 44, 730, 300)
        var image = this.convertCanvasToImage(canvas)
        this.setState({
            image: image
        })
    }

    // 居中裁剪图片
    drawImage(context, src, x, y, width, height) {
        return new Promise((resolve, reject) => {
            let img = new Image()
            img.onload = function () {
                var w = img.width
                var h = img.height
                var dw = width / w          //canvas与图片的宽高比
                var dh = height / h
                // 裁剪图片中间部分
                if (w > width && h > height || w < width && h < height) {
                    if (dw > dh) {
                        context.drawImage(img, 0, (h - height / dw) / 2, w, height / dw, x, y, width, height)
                    } else {
                        context.drawImage(img, (w - width / dh) / 2, 0, width / dh, h, x, y, width, height)
                    }
                }
                // 拉伸图片
                else {
                    if (w < width) {
                        context.drawImage(img, 0, (h - height / dw) / 2, w, height / dw, x, y, width, height)
                    } else {
                        context.drawImage(img, (w - width / dh) / 2, 0, width / dh, h, x, y, width, height)
                    }
                }
                resolve()
            }
            img.setAttribute("crossOrigin", 'anonymous')
            img.src = src + '?' + Math.random() * 1000

        }).catch((E) => {
            alert('出错了：', E)
        })

    }

    // 绘制标题
    drawText(context, title, x, y, w) {
        var c = document.getElementById("canvas");
        var context = c.getContext("2d");
        var chr = title.split("");
        var temp = "";
        var row = [];

        context.font = "400 30px Arial";

        context.fillStyle = "#111111";
        context.textBaseline = "middle";
        for (var a = 0; a < chr.length; a++) {
            if (context.measureText(temp).width < w) {
                ;
            } else {
                row.push(temp);
                temp = "";
            }
            temp += chr[a];
        }

        row.push(temp);

        for (var b = 0; b < row.length; b++) {
            context.fillText(row[b], x, y + (b + 1) * 40);
        }
    }

    convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    }


    async saveImg() {
        let res = await Axios.post(`/file/upload/base64`, {
            base64: this.state.image.src,
            fileName: this.state.item.name
        }, false, Constant.getUpload())
        console.log(res)
        let fileId = res.data.fileId
        postMessage('saveImg', fileId)
    }



    render() {

        return (
            <main className="page-share">
                <canvas id="canvas" width="700" height="1000" className="my-canvas"></canvas>
                {/* <img src={this.state.image.src} alt="" style={{ width: '7rem' }} /> */}
                <div className="footer flex-middle" id="btn">
                    <div onClick={() => {
                        this.saveImg()
                    }}>保存图片分享给好友  </div>
                </div>
            </main>
        )
    }
}

export default withRouter(Share)