// 获取可视区域的宽度/750，赋值给html的fontsize
// window.onload = function() {
//   // font-size 最小为12

// }
(function() {
  document.getElementsByTagName('html')[0].style.fontSize = Math.min(Math.round(document.documentElement.clientWidth / 375 * 100), 120) + 'px'
})()
// 测试用代码
window.onresize = function() {
  document.getElementsByTagName('html')[0].style.fontSize = Math.min(Math.round(document.documentElement.clientWidth / 375 * 100), 120) + 'px'
}
