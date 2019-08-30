var app = getApp();
var util = require('./util');
// var Promise = require('./bluebird');
// var regeneratorRuntime = require('./runtime');  
/**
 * 
 * 导入 var pay = require('../../../utils/pay');
 * 使用方法:
 *     var fn = util.asyncFunction(pay.toBuy);
       var res = await fn({
                  appId: app.globalData.app_id,  //平台APP_ID
                  totalFee:1,  //价格
                  openId: user_id  //用户微信ID
                });
       console.log(res);
 * 
 * 
 * 
 */
 function  toBuy(data){ 
     var out_trade_no  = "";
     var prepay_id = "";
     var payData = { totalFee: data.totalFee, openId: data.openId, out_trade_no: data.out_trade_no };
     if (data.appId){
       payData.App_id =  data.appId;
     }
     if (data.subjectId){
       payData.Subject_id = data.subjectId;
     }
     util.wx_requestPost(app.globalData.requestUrl + "pay", 
       { data: payData}
          ).then(res=>{
            out_trade_no = res.data.out_trade_no;
            prepay_id = res.data.prepay_id;
            var singData = { pk: "prepay_id=" + res.data.prepay_id }; 
            if (data.appId) {
              singData.App_id = data.appId;
            }
            if (data.subjectId) {
              singData.Subject_id = data.subjectId;
            }
            return util.wx_requestPost(app.globalData.requestUrl + "pay/WxSign",
              { data: singData });
          },err=>{
            data.fail({ resultCode: 1, msg: "预订单失败！", err: err});
          }).then(res=>{
            var fn = util.asyncFunction(wx.requestPayment);
            return fn({ 'timeStamp':res.data.timeStamp + "",'nonceStr':res.data.nonceStr + "",'package': res.data.package,'signType':res.data.signType,'paySign': res.data.sign });
          },err=>{
            data.fail({ resultCode: 2, msg: "签名失败！", err: err });
          }).then(res=>{
            data.success({ out_trade_no: out_trade_no, prepay_id: prepay_id,msg:"ok"});
          },err=>{
            data.fail({ resultCode: 3, msg: "支付失败！", err: err }); 
          });
}
module.exports = { toBuy: toBuy}