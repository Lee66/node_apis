var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');

var photos = mongoose.model("photos", {
  photoname:String,
  photopath:String,
  content: String,
  createTime:String
});
exports.getphoto=function(request, response){
	console.log(request.params.photoname);
	var photoname=request.params.photoname;
	targetPath='./uploads/';
	var filePath=path.join(targetPath,photoname);
	response.sendfile(filePath);
}

exports.imgupload = function(request, response) {
	// var data=JSON.parse(request);
	console.log( request.files);
	var item=request.files.file;
  if(item.path){
      var tmpPath = item.path;
      var type = item.type;
      console.log(type);
      var extension_name = "";
      //移动到指定的目录，一般放到public的images文件下面
      //在移动的时候确定路径已经存在，否则会报错
      var tmp_name = (Date.parse(new Date())/1000);
      tmp_name = tmp_name+''+(Math.round(Math.random()*9999));
      //判断文件类型
        switch (type) {
            case 'image/pjpeg':extension_name = 'jpg';
                break;
            case 'image/jpeg':extension_name = 'jpg';
                break;
            case 'image/gif':extension_name = 'gif';
                break;
            case 'image/png':extension_name = 'png';
                break;
            case 'image/x-png':extension_name = 'png';
                break;
            case 'image/bmp':extension_name = 'bmp';
                break;
            case 'application/zip':extension_name='zip';
            break;
        }
        var tmp_name = tmp_name+'.'+extension_name;
        var targetPath = 'uploads/' + tmp_name;//public/images/
        console.log(tmpPath);
        //将上传的临时文件移动到指定的目录下
        fs.rename(tmpPath, targetPath , function(err) {
            if(err){
                throw err;
            }
            //判断是否完成
            //console.log(index);
             //删除临时文件
          fs.unlink(tmpPath, function(){
            if(err) {
                    throw err;
            }else{
                  console.log(targetPath);
                  //上传处理完成
                  //数据
            };

	      	var theproduct = new photos({
      			photoname:tmp_name,
      			photopath:config.appconfig.urlapi+targetPath,
      			content: tmp_name+tmpPath,
      			createTime:new Date().getTime(),
      		});
           theproduct.save(function(e, product, numberAffected) {
        			// if (e) response.send(e.message);
        			console.log(product);
        			console.log(numberAffected);
        			if(product){
        				respondata={
        					"code":"200",
        					"message":"success",
        					"product":product
        				};
        			}else{
        				respondata={
        					"code":"500",
        					"message":"error"
        				};
        			}
        			response.send(respondata);
        		});


	        });

	    });
  }
}