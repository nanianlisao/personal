<template>
  <!--地图容器-->
  <div id="footer" class="footer-map"></div>
</template>
<script>
// import BMap from 'BMap'
// export default {
//   name: '',
//   data() {
//     return {

//     }
//   },
//   mounted() {
//     this.ready()
//   },
//   methods: {
//     ready: function() {
//       var map = new BMap.Map('footer') // 创建地图实例
//       var point = new BMap.Point(118.7894622371, 32.0237885088) // 设置地图中心点
//       map.centerAndZoom(point, 14)
//       map.addControl(new BMap.GeolocationControl()) // Map.addControl()方法向地图添加定位控件
//       // map.addControl(new BMap.MapTypeControl()) // Map.addControl()方法向地图添加控件  MapTypeControl 地图类型
//       map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
//       map.enableDoubleClickZoom(true) // 开启双击缩放
//       var marker = new BMap.Marker(point)
//       var opts = {
//         width: 100, // 信息窗口宽度
//         height: 80, // 信息窗口高度
//         title: '南京集梦文化传媒有限公司' // 信息窗口标题
//       }
//       var infoWindow = new BMap.InfoWindow('地址:南京市秦淮区中华路420号江苏科技创业大厦703室', opts) // 创建信息窗口对象
//       map.addOverlay(marker) // 将标注添加到地图中
//       map.centerAndZoom(point, 15) // 初始化地图，设置中心点坐标和地图级别
//       marker.addEventListener('click', function() {
//         map.openInfoWindow(infoWindow, point) // 开启信息窗口
//       })
//     }
//   }
// }

</script>
<style scoped>
html,
body,
.footer-map {
  width: 100%;
  height: 2rem;
  overflow: hidden;
  margin: 0;
  font-family: "微软雅黑";
}

</style>
