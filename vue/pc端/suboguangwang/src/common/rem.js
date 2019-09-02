// 获取可视区域的宽度/750，赋值给html的fontsize
// window.onload = function() {
//   // font-size 最小为12

// }
(function() {
  document.getElementsByTagName('html')[0].style.fontSize = Math.max(Math.round(document.documentElement.clientWidth / 1920 * 100), 78) + 'px'
})()
// 测试用代码
window.onresize = function() {
  document.getElementsByTagName('html')[0].style.fontSize = Math.max(Math.round(document.documentElement.clientWidth / 1920 * 100), 78) + 'px'
}
