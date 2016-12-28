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

exports.getphotoPal=function(request, response){
  console.log(request.params.photopath);
  var photoname=request.params.photoname;
  var photopath=request.params.photopath;
  var filePath='./uploads/'+photopath+'/'+photoname;

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
      var theData=new Date()
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
        var targetPaths=theData.getFullYear()+'-'+( theData.getMonth()+1)+'-'+theData.getDate();
        //the path is exist
        var folder_exists = fs.existsSync('uploads/' +targetPaths);
        if(folder_exists == true){
        }else{
          fs.mkdir('uploads/'+targetPaths,function(err){
            if (err) {
                   return console.error(err);
               }
             console.log("目录创建成功。");
          });
        }
        var tmp_name = tmp_name+'.'+extension_name;
        targetPath = targetPaths+ '/'+tmp_name;//public/images/
        console.log(tmpPath,targetPaths);
        //将上传的临时文件移动到指定的目录下
        fs.rename(tmpPath, 'uploads/'+targetPath , function(err) {
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
      			photopath:targetPath,
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


exports.photoslist=function(request, response){
    console.log(request.body);
  var data=JSON.parse(request.body.reqContent);
  console.log(data.reqBody.pageNum);
  if(data.reqBody.pageNum==1){
    var pageindex=0;//o biegin
  }else{
    var pageindex=(data.reqBody.pageNum-1)*data.reqBody.numPerPage;
  }
  var skips=pageindex;
  var limit=data.reqBody.numPerPage;
  var totalRecord,allpage;
  var username=data.reqBody.username;

  if(username&&username!=null){
    username={'username':data.reqBody.username}
  }else{
    username={};
  }
  photos.find(username,function(e, docs) {
    totalRecord=docs.length;
    allpage=totalRecord/data.reqBody.numPerPage
    console.log('allpage',allpage,parseInt(allpage),data.reqBody.numPerPage)
    if(allpage>parseInt(allpage)){
      allpage=parseInt(allpage)+1
    }
  });

  photos.find(username,null,{skip:skips,limit:limit,sort:{"createTime":-1}}, function(e, docs) {
    //console.log(docs);
    if(e){
      respondata={
        "code":"500",
        "message":"exports"
      };
    }else{
      respondata={
        "code":"200",
        "message":"success",
        "data":docs,
        "page":{
        "totalRecord":docs.length,
        "pageIndex":data.reqBody.pageNum,
        "pageNum":limit,
        "allpage":allpage
        }
      };
      respondata = JSON.stringify(respondata);
    }
    response.send(respondata);
  });
}
