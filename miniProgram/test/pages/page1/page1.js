const app = getApp()

Page({

  data: {
    show: false
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    this.dialog2 = this.selectComponent("#foot-dialog");
    this.dialog3 = this.selectComponent("#foot-dialog2");
    this.top = this.selectComponent("#top-dialog");

  },

  onLoad() {
    console.log(111)
  },
  
  showDialog() {
    this.dialog2.showDialog();
  },
  showDialog2() {
    this.dialog3.showDialog();
  },

  showtop() {
    this.top.showDialog();
  },

  //取消事件
  _cancelEvent() {
    console.log('你点击了取消');
    this.dialog.hideDialog();
    this.dialog2.showDialog()
  },
  //确认事件
  _confirmEvent() {
    console.log('你点击了确定');
    this.dialog.hideDialog();
  }

})