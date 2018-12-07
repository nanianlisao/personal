Page({
  flag: false,
  onShow(){
    if(this.flag){
      this.flag = false
      wx.switchTab({
        url: '/pages/custom/custom_579582629', // tab页的url
      })
    }else{
      this.flag = true
      wx.navigateTo({	
        url: '/pages/store/store-ruzhu/index',	// 重定向的url
      })	
    }
  }
})