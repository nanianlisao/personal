const Koa = require("koa");
const router = require("koa-router")();
const fs=require("fs");
const nodeExcel = require('excel-export');
const app = new Koa();
app.use(router.routes());
router.get("/",(ctx)=>{
    ctx.body = fs.readFileSync("./index.html","utf-8");
});

//导出Excel，xlsx格式
router.get('/exportexcel',async (ctx) => {
    async function readydata() {
        //做点什么，如从数据库取数据
        let exceldata=[
            {name:"张三",age:"20",sex:"男",birthday:"1998-10-10"},
            {name:"李四",age:"21",sex:"男",birthday:"1997-08-08"},
            {name:"王五",age:"22",sex:"男",birthday:"1996-06-06"},
            {name:"赵六",age:"20",sex:"男",birthday:"1998-12-12"},
        ];
        return exceldata;
    }
    //导出
    async function exportdata(v) {
        let conf ={};
        conf.name = "mysheet";//表格名
        let alldata = new Array();
        for(let i = 0;i<v.length;i++){
            let arr = new Array();
            arr.push(v[i].name);
            arr.push(v[i].age);
            arr.push(v[i].sex);
            arr.push(v[i].birthday);
            alldata.push(arr);
        }
        //决定列名和类型
        conf.cols = [{
            caption:'姓名',
            type:'string'
        },{
            caption:'年龄',
            type:'number'
        },{
            caption:'性别',
            type:'string'
        },{
            caption:'出生日期',
            type:'string',
            //width:280
        }];
        conf.rows = alldata;//填充数据
        let result = nodeExcel.execute(conf);
        //最后3行express框架是这样写
        // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        // res.end(result, 'binary');
        let data = Buffer.from(result,'binary');
        ctx.set('Content-Type', 'application/vnd.openxmlformats');
        ctx.set("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        ctx.body=data;
    }
    let r=await readydata();
    r=await exportdata(r);
});

app.listen(3000);
console.log("listen on 3000");