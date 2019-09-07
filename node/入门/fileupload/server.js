var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser');
var multer  = require('multer');
const app = express()
app.use('public',express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('img'));
app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
 })
 app.post('/fileUpload',function(req,res){
    console.log(req.files[0]);  // 上传的文件信息
    let fileName = __dirname + "/public/" + req.files[0].originalname
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(fileName, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully', 
                   filename:req.files[0].originalname
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
 })


 //添加的新用户数据
var user = {
    "user4" : {
       "name" : "mohit",
       "password" : "password4",
       "profession" : "teacher",
       "id": 4
    }
 }
 
 app.get('/addUser', function (req, res) {
    // 读取已存在的数据
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        data["user4"] = user["user4"];
        console.log( data );
        res.end( JSON.stringify(data));
    });
 })


 var server = app.listen(8081, function () {
 
    var host = server.address().address
    var port = server.address().port
   
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
   
  })