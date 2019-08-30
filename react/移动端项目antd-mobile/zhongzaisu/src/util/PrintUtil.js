/**
 * Created by chenlu on 2018/11/12.
 */
import {notification} from "antd";
let Print = {
        //打印配置
        setting: {
            system: 1,
            printSetting: []
        },

        //打印模板
        models: [{
            system: 1,
            model: [{
                id: 1,
                type: 1,
                name: "收银模板",
                method: (order, width, size)=> {
                    return Print.getCashierModel1(order, width, size)
                }
            }, {
                id: 2,
                type: 2,
                name: "厨房模板",
                method: (order, width, size)=> {
                    return Print.getKitchenModel1(order, width, size)
                }
            }]
        }, {
            system: 2,
            model: [{
                id: 10,
                type: 1,
                name: "收银模板",
                method: (order, width, size)=> {
                    return Print.getCashierModel2(order, width, size)
                }
            }, {
                id: 11,
                type: 2,
                name: "厨房模板",
                method: (order, width, size)=> {
                    return Print.getKitchenModel2(order, width, size)
                }
            }]
        }],

        //模拟订单数据
        order: {
            "storeName": "#门店名称",
            "id": "#订单号",
            "code": "#取餐码",
            "style": "#取餐方式",
            "addTime": "#下单时间",
            "price": "#原价",
            "count": "#总数",
            "preferential": "#优惠",
            "payPrice": "#实收",
            "payStyle": "#支付方式",
            "address": "#地址",
            "remark": "#备注",
            "tableNo": "#桌号",
            "goods": [{
                "goodName": "#商品名称",
                "goodPrice": "#单价",
                "goodCount": "#数量",
                "goodSubtotal": "#小计"
            }, {
                "goodName": "#商品名称",
                "goodPrice": "#单价",
                "goodCount": "#数量",
                "goodSubtotal": "#小计"
            }]
        },

        replaceOrder: {
            "#门店名称": "storeName",
            "#订单号": "id",
            "#取餐码": "code",
            "#取餐方式": "style",
            "#下单时间": "addTime",
            "#原价": "price",
            "#总数": "count",
            "#优惠": "preferential",
            "#实收": "payPrice",
            "#支付方式": "payStyle",
            "#地址": "address",
            "#商品名称": "goodName",
            "#单价": "goodPrice",
            "#数量": "goodCount",
            "#小计": "goodSubtotal",
            "#备注": "remark",
            "#桌号": "tableNo",
            "#size": "size",
            "#width": "width",
            "#titleSize": "titleSize"
        },

        // 获取打印机列表
        getPrintList: ()=> {
            let printMachines = [];
            if (window.LODOP&&window.LODOP.GET_PRINTER_COUNT()) {
                for (let i = 0; i < window.LODOP.GET_PRINTER_COUNT(); i++) {
                    printMachines[i] = {
                        id: i,
                        name: window.LODOP.GET_PRINTER_NAME(i)
                    }
                }
            }else{
                notification.warning({
                    message: '打印机警告',
                    description: '如需添加、修改打印机，请先安装插件并为电脑设置好打印机然后刷新页面',
                    duration: '30'
                });
            }
            return printMachines;
        },

        //检测打印机是否存在
        checkPrint: (name)=> {
            return window.LODOP.SET_PRINTER_INDEXA(name);
        },

        //打印
        print: (order, printSetting)=> {
            let printOrder = Print.changeOrder(order);
            printOrder["titleSize"] = printSetting.width == "58mm" ? "14px" : "18px";
            printOrder["width"] = Print.getSize(printSetting.width);
            printOrder["size"] = Print.getSize(printSetting.size);
            let strHtml = "";
            Print.models.map(model=> {
                if (model.system == Print.setting.system) {
                    model.model.map(item=> {
                        if (item.type == printSetting.type) {
                            strHtml = item.method(printOrder)
                        }
                    })
                }
            })
            if (window.LODOP&&window.LODOP.SET_PRINTER_INDEXA(printSetting.printName)) {
                Print.sendPrint(printSetting.printName, printOrder["width"], strHtml);
            }else{
                notification.warning({
                    message: '打印机警告',
                    description: '如需添加、修改打印机，请先安装插件并为电脑设置好打印机然后刷新页面',
                    duration: '30'
                });
            }
        },

        //发送打印信息
        sendPrint: (printName, width, strHTML)=> {
            window.LODOP.PRINT_INIT("小程序在线点餐打印");
            window.LODOP.SET_PRINT_PAGESIZE(3, width, 0, ''); //纵向打印，宽度55mm，高度自适应,纸张类型名（A4、A3）需宽度为0时才有效
            window.LODOP.ADD_PRINT_HTM(0, 2, "100%", "100%", strHTML);//上左间距5像素，纸张可打印范围100%，超文本字符串
            if (window.LODOP.SET_PRINTER_INDEXA(printName))
                window.LODOP.PRINT();
        },

        //根据打印类型获取模板列表
        getModel: (system, type, width, size, order = Print.order)=> {
            let models = new Array();
            order["titleSize"] = width == "58mm" ? "14px" : "18px";
            order["width"] = Print.getSize(width);
            order["size"] = Print.getSize(size);
            Print.models.map(model=> {
                if (model.system == system) {
                    model.model.map(item=> {
                        if (item.type == type) {
                            models.push({
                                type: item.name,
                                modelHtml: item.method(order, width, size)
                            });
                        }
                    })
                }
            });
            return models;
        },

        //获取简餐收银模板html
        getCashierModel1: (order, width, size)=> {
            let headHtml = "<!doctype><body style='width: #width'><table style='width: 100%'><tr style='width: 100%'><td style='text-align: center;width: 100%' colspan=2><span style='font-size: #titleSize;'>微信小程序在线点餐</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>#门店名称</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>订单号</span></td><td style='width: 65%'><span style='font-size: #size'>#订单号</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>取餐码</span></td><td style='width: 65%'><span style='font-size: #size'>#取餐码</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>取餐方式</span></td><td style='width: 65%'><span style='font-size: #size'>#取餐方式</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>下单时间</span></td><td style='width: 65%'><span style='font-size: #size'>#下单时间</span></td></tr><tr><td style='width:100%' colspan=2><hr style='border: 1px dashed #000000; width: 100%' /></td></tr></table>";
            let footHtml = "<table style='width: 100%'><tr><td style='width:100%' colspan=3><hr style='border: 1px dashed #000000; width: 100%' /></td></tr><tr style='width: 100%'><td style='width: 50%'><span style='font-size: #size'>原价&nbsp;#原价</span></td><td style='width: 50%'><span style='font-size: #size'>总数&nbsp;#总数</span></td></tr><tr style='width: 100%'><td style='width: 50%'><span style='font-size: #size'>优惠&nbsp;#优惠</span></td><td style='width: 50%'><span style='font-size: #size'>实收&nbsp;#实收</span></td></tr><tr style='width: 100%'><td style='width: 100%' colspan=2><span style='font-size: #size'>支付方式&nbsp;#支付方式</span></td></tr><tr><td style='width:100%' colspan=2><hr style='border: 1px dashed #000000; width: 100%' /></td></tr><tr><td style='width:100%' colspan=2><span style='font-size: #size'>#地址</span><br /><span style='font-size: #size'>欢迎光临</span></td></tr><tr><td style='width:100%' colspan=2><p></p></td></tr></table></body>";
            let centerHtml = "<table style='width: 100%'>";
            let goodForHtml = "<tr><td style='width: 100%' colspan=3><span style='font-size: #size'>#商品名称</span></td></tr><tr><td style='width: 30%'><span style='font-size: #size'>单价&nbsp;#单价</span></td><td style='width: 30%'><span style='font-size: #size'>数量&nbsp;#数量</span></td><td style='width: 40%'><span style='font-size: #size'>小计&nbsp;#小计</span></td></tr>";
            let goodsRemarkHtml = "<tr><td colspan=3><span style='font-size: #size'>备注&nbsp;#备注</span></td></tr></table>";
            let goodForHtmls = "";
            order.goods.map(good=> {
                good["size"] = order["size"];
                goodForHtmls += Print.initDate(good, goodForHtml);
            })
            goodsRemarkHtml = Print.initDate(order, goodsRemarkHtml);
            centerHtml = centerHtml + goodForHtmls + goodsRemarkHtml;
            headHtml = Print.initDate(order, headHtml);
            footHtml = Print.initDate(order, footHtml);

            return headHtml + centerHtml + footHtml;
        },

        //获取正餐收银模板html
        getCashierModel2: (order, width, size)=> {
            let headHtml = "<!doctype><body style='width: #width'><table style='width: 100%'><tr style='width: 100%'><td style='text-align: center;width: 100%' colspan=2><span style='font-size: #titleSize;'>微信小程序在线点餐</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>#门店名称</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>订单号</span></td><td style='width: 65%'><span style='font-size: #size'>#订单号</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>桌号</span></td><td style='width: 65%'><span style='font-size: #size'>#桌号</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>下单时间</span></td><td style='width: 65%'><span style='font-size: #size'>#下单时间</span></td></tr><tr><td style='width:100%' colspan=2><hr style='border: 1px dashed #000000; width: 100%' /></td></tr></table>";
            let footHtml = "<table style='width: 100%'><tr><td style='width:100%' colspan=3><hr style='border: 1px dashed #000000; width: 100%' /></td></tr><tr style='width: 100%'><td style='width: 50%'><span style='font-size: #size'>原价&nbsp;#原价</span></td><td style='width: 50%'><span style='font-size: #size'>总数&nbsp;#总数</span></td></tr><tr style='width: 100%'><td style='width: 50%'><span style='font-size: #size'>优惠&nbsp;#优惠</span></td><td style='width: 50%'><span style='font-size: #size'>实收&nbsp;#实收</span></td></tr><tr style='width: 100%'><td style='width: 100%' colspan=2><span style='font-size: #size'>支付方式&nbsp;#支付方式</span></td></tr><tr><td style='width:100%' colspan=2><hr style='border: 1px dashed #000000; width: 100%' /></td></tr><tr><td style='width:100%' colspan=2><span style='font-size: #size'>#地址</span><br /><span style='font-size: #size'>欢迎光临</span></td></tr><tr><td style='width:100%' colspan=2><p></p></td></tr></table></body>";
            let centerHtml = "<table style='width: 100%'>";
            let goodForHtml = "<tr><td style='width: 100%' colspan=3><span style='font-size: #size'>#商品名称</span></td></tr><tr><td style='width: 30%'><span style='font-size: #size'>单价&nbsp;#单价</span></td><td style='width: 30%'><span style='font-size: #size'>数量&nbsp;#数量</span></td><td style='width: 40%'><span style='font-size: #size'>小计&nbsp;#小计</span></td></tr>";
            let goodsRemarkHtml = "<tr><td colspan=3><span style='font-size: #size'>备注&nbsp;#备注</span></td></tr></table>";
            let goodForHtmls = "";
            order.goods.map(good=> {
                good["size"] = order["size"];
                goodForHtmls += Print.initDate(good, goodForHtml);
            })
            goodsRemarkHtml = Print.initDate(order, goodsRemarkHtml);
            centerHtml = centerHtml + goodForHtmls + goodsRemarkHtml;
            headHtml = Print.initDate(order, headHtml);
            footHtml = Print.initDate(order, footHtml);

            return headHtml + centerHtml + footHtml;
        },

        //获取轻餐厨房模板1
        getKitchenModel1: (order, width, size)=> {
            let headHtml = "<!doctype><body style='width: #width'><table style='width: 100%'><tr style='width: 100%'><td style='text-align: center;width: 100%' colspan=2><span style='font-size: #titleSize;'>微信小程序在线点餐</span> </td> </tr> <tr> <td style='width: 35%'> <span style='font-size: #size'>#门店名称</span> </td> </tr> <tr> <td style='width: 35%'> <span style='font-size: #size'>订单号:</span></td><td style='width: 65%'><span style='font-size: #size'>#订单号</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>下单时间:</span></td><td style='width: 65%'><span style='font-size: #size'>#下单时间</span></td></tr><tr><td style='width:100%' colspan=2><hr style='border: 1px dashed #000000; width: 100%' /></td></tr></table>";
            let centerHtml = "<table style='width: 100%'></body>";
            let goodForHtml = "<tr><td style='width: 75%'><span style='font-size: #size'>#商品名称</span></td> <td style='width: 25%'><span style='font-size: #size'>#数量</span></td></tr>";
            let goodsRemarkHtml = "<tr><td colspan=3><span style='font-size: #size'>备注&nbsp;#备注</span></td></tr></table>";
            let goodForHtmls = "";
            order.goods.map(good=> {
                good["size"] = order["size"];
                goodForHtmls += Print.initDate(good, goodForHtml);
            })
            goodsRemarkHtml = Print.initDate(order, goodsRemarkHtml);
            centerHtml = centerHtml + goodForHtmls + goodsRemarkHtml;
            headHtml = Print.initDate(order, headHtml);
            return headHtml + centerHtml;
        },

        //获取正餐厨房模板1
        getKitchenModel2: (order, width, size)=> {
            let headHtml = "<!doctype><body style='width: #width'><table style='width: 100%'><tr style='width: 100%'><td style='text-align: center;width: 100%' colspan=2><span style='font-size: #titleSize;'>微信小程序在线点餐</span> </td> </tr> <tr> <td style='width: 35%'> <span style='font-size: #size'>#门店名称</span> </td> </tr> <tr> <td style='width: 35%'> <span style='font-size: #size'>订单号:</span></td><td style='width: 65%'><span style='font-size: #size'>#订单号</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>桌号:</span></td><td style='width: 65%'><span style='font-size: #size'>#桌号</span></td></tr><tr><td style='width: 35%'><span style='font-size: #size'>下单时间:</span></td><td style='width: 65%'><span style='font-size: #size'>#下单时间</span></td></tr><tr><td style='width:100%' colspan=2><hr style='border: 1px dashed #000000; width: 100%' /></td></tr></table>";
            let centerHtml = "<table style='width: 100%'></body>";
            let goodForHtml = "<tr><td style='width: 75%'><span style='font-size: #size'>#商品名称</span></td> <td style='width: 25%'><span style='font-size: #size'>#数量</span></td></tr>";
            let goodsRemarkHtml = "<tr><td colspan=3><span style='font-size: #size'>备注&nbsp;#备注</span></td></tr></table>";
            let goodForHtmls = "";
            order.goods.map(good=> {
                good["size"] = order["size"];
                goodForHtmls += Print.initDate(good, goodForHtml);
            })
            goodsRemarkHtml = Print.initDate(order, goodsRemarkHtml);
            centerHtml = centerHtml + goodForHtmls + goodsRemarkHtml;
            headHtml = Print.initDate(order, headHtml);
            return headHtml + centerHtml;
        },

        //替换占位符
        initDate: (obj, strHtml)=> {
            for (let key in Print.replaceOrder) {
                if (strHtml.indexOf(key) > 0) {
                    strHtml = strHtml.replace(new RegExp(key, "gm"), obj[Print.replaceOrder[key]]);
                }
            }
            return strHtml;
        },

        //转换打印order
        changeOrder: (order)=> {
            let goods = order.orderGoodsVos.map(info=> {
                let obj = {
                    "goodName": info.goodsName,
                    "goodPrice": info.price,
                    "goodCount": info.quantity+"份",
                    "goodSubtotal": info.price * info.quantity
                }
                if(info.orderGoodsSpecificationVos){
                    info.orderGoodsSpecificationVos.map(spec=> {
                        obj.goodName += (" " + spec.specificationValueName);
                    })
                }
                return obj;
            });
            let newOrder = {
                "storeName": order.storesVo ? order.storesVo.name : "",
                "id": order.id,
                "code": order.takeCode?order.takeCode:"",
                "style": order.wayDesc ? order.wayDesc.name : "",
                "addTime": order.createTime,
                "price": order.amount,
                "count": order.normalQuantity,
                "preferential": order.allDiscounts,
                "payPrice": order.amount - (order.allDiscounts ? order.allDiscounts : 0),
                "payStyle": order.payTypeDesc ? order.payTypeDesc.name : "",
                "address": order.storesVo.city + order.storesVo.area + order.storesVo.address,
                "remark": order.remark?order.remark:"",
                "tableNo": order.tableId,
                "goods": goods
            }
            return newOrder
        },

        getSize: (size)=> {
            switch (size) {
                case 1:
                    size = "12px";
                    break;
                case 2:
                    size = "14px";
                    break;
                case 3:
                    size = "16px";
                    break;
            }
            return size;
        },

        getWidth: (width)=> {
            switch (width) {
                case "58mm":
                    width = "200px";
                    break;
                case "80mm":
                    width = "280px";
                    break;
            }
            return width
        }
    }
    ;
export default Print;