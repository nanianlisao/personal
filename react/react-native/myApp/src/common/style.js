import {PixelRatio,Dimensions,StyleSheet} from 'react-native';
let designSize = {width:750,height:1334}; //假设设计尺寸为：750*1334
let win_width = Dimensions.get("window").width;
let win_height = Dimensions.get("window").height;
let width = designSize.width
// console.log(width) // 1080
// console.log(win_width) //360
let design_scale = designSize.width/width;

export let scale = win_width/designSize.width; // 0.48
let height = designSize.height
 const styles = StyleSheet.create({ 
    container: {
        width: width, //1080
        height: height,
        transform: [{translateX: -width * .5}, {translateY: -height * .5},
             {scale: scale}, {translateX: width * .5}, {translateY: height * .5}],
    }
})

export default styles


 
// 设备宽度，单位 dp
const deviceWidthDp = Dimensions.get('window').width;
 
// 设计稿宽度（这里为640px），单位 px
const uiWidthPx = 750;
 
// px 转 dp（设计稿中的 px 转 rn 中的 dp）
export const px = (uiElePx) => {
 return uiElePx * deviceWidthDp / uiWidthPx;
}
  