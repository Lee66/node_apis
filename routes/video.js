var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');

var videos = mongoose.model("videos", {
  videos_name:String,
  videos_des:String,
  link_url:String,
  info:String,
  code:Object,
  code_size:String,
  img_group:Object,
  createTime:String,
  updateTime:String
});

var files = mongoose.model("videofiles", {
	filename:String,
	filepath:String,
  size:String,
	content: String,
	createTime:String
});
//createApp updateApp 创建版本 修改版本
exports.createVideo=function(request, response){
  console.log(request.body);
  var data=JSON.parse(request.body.reqContent);
  var q = Q.defer();
	if(data.reqBody.version_id&&data.reqBody.version_id!=''){
		update(data.reqBody.version_id).then(function(result){
			 console.log('type result',result)
			 response.send(result);
		},function(error){
				response.send(error);
		});
	}else{
		create().then(function(result){
			 console.log('type result',result)
			 response.send(result);
		},function(error){
				response.send(error);
		});
	}
function create(){
    console.log('do create')
    var app6 = new videos({
      videos_name:data.reqBody.videos_name,
	  videos_des:data.reqBody.videos_des,
	  link_url:data.reqBody.link_url,
	  info:data.reqBody.info,
	  code:data.reqBody.code,
      code_size:data.reqBody.code_size,
      img_group:data.reqBody.img_group,
      createTime:new Date().getTime(),
      updateTime:new Date().getTime()
    });
    app6.save(function(e, product, numberAffected) {
      // if (e) response.send(e.message);
        console.log(product);
        if(product){
          respondata={
            "code":"200",
            "message":"success",
            "docs":product
          };
          q.resolve(respondata);
        }else{
          respondata={
            "code":"500",
            "message":"exports"
          };
          q.reject(respondata);
        }
      });
      return q.promise;
    }
    function update(id){
      console.log('do update')
      var arr=respon.checknull(data.reqBody)
      arr['updateTime']=new Date().getTime()
      console.log(arr)
      videos.update({
  		 _id: id,
  		}, arr, function(e, numberAffected, raw) {
        console.log(raw)
  			if(e){
          respondata={
            "code":"500",
            "message":"error"
          };
          q.reject(respondata);
  			}else{
          respondata={
            "code":"200",
            "message":"success"
          };
          q.resolve(respondata);
  			}
  		});
      return q.promise;
    }

}

exports.videoupload = function(request, response) {
	// var data=JSON.parse(request);
	console.log( request.files);
	var item=request.files.file;
    if(item.path){
      var tmpPath = item.path;
      var type = item.type;
      console.log(type);
       // var tmp_name = (Date.parse(new Date())/1000);
       // tmp_name = tmp_name+''+(Math.round(Math.random()*9999));
      var name=item.name.split('.');
      console.log(name);
      var targetPaths='uploads/music';
      //the path is exist
  	  var filename=name[0]+'.'+name[1];
  	  console.log(filename);
       movefile(filename,targetPaths,tmpPath).then(function(result){
          console.log("invoke in,",result);

          response.format({
            'text/plain': function(){
              response.send(result);
            },

            'text/html': function(){
              response.send(result);
            },

            'application/json': function(){
              response.send(result);
            },

            'default': function() {
              // log the request and respond with 406
              response.status(406).send(result);
            }
          });
      },function(error){
          console.log("invoke in deferd,",error);
          response.send(error);
      });

    }

}

//文章列表
exports.videosList= function(request, response) {
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
  var totalRecord;
  var username=data.reqBody.username;

  if(username&&username!=null){
    username={'user':data.reqBody.username}
  }else{
    username={};
  }
  videos.find(username,function(e, docs) {
    totalRecord=docs.length;
    allpage=totalRecord/data.reqBody.numPerPage
    console.log('allpage',allpage,parseInt(allpage),data.reqBody.numPerPage)
    if(allpage>parseInt(allpage)){
      allpage=parseInt(allpage)+1
    }
  });
	videos.find(username,null,{skip:skips,limit:limit,sort:{"createTime":-1}},function(e, docs) {
		var head={
			"code":"200",
			"message":"success",
			"data":docs,
			"page":{
				 "totalRecord":totalRecord,
                "pageIndex":data.reqBody.pageNum,
                "pageNum":limit,
                "allpage":allpage
			}
		};
		var html = JSON.stringify(head);
		response.send(html);
	});
	// conn.close();
};

// 删除应用
exports.removeVideo=function(request, response){
  respon.loggers(request.body);
  var data=JSON.parse(request.body.reqContent);
  videos.remove({
      _id: data.reqBody.id,
  },function(e) {
      respon.loggers(e);
      if(e){
        var respondata={
          "code":"500",
          "message":"error"
        };
          response.send(respondata);
      }else{
        var respondata={
          "code":"0000",
          "message":"success",
        };
        response.send(respondata);
        // respon.pushdata("0000","success")
      }

  });
}

function movefile(filename,filepath,tmpPath){
      // var tmp_name = item.name;
    var qs =new Q.defer();
    var targetPath = filepath+'/'+filename;
    //将上传的临时文件移动到指定的目录下
    fs.rename(tmpPath, targetPath , function(err) {
       if(err){
         qs.reject(err)
         throw err;
        }
             //删除临时文件
    return unlinkfile(filename,targetPath,tmpPath).then(function(result){
         console.log("movefile invoke in",result);
         qs.resolve(result);
     },function(error){
         console.log("movefile invoke in deferd",error);
         qs.reject(error)
     });

    });
  return qs.promise
}//
function unlinkfile(filename,targetPath,tmpPath){
  var qse =new Q.defer();
  fs.unlink(tmpPath, function(){
    return  creatfile(filename,targetPath,tmpPath).then(function(result){
          console.log("unlinkfile invoke in",result);
          qse.resolve(result);
      },function(error){
          console.log("unlinkfile invoke in deferd",error);
          qse.reject(error)
      });

    });
  return qse.promise
}
function creatfile(filename,targetPath,tmpPath){
  var q =new Q.defer();
  var theproduct = new files({
    filename:filename,
    filepath:config.appconfig.urlapi+targetPath,
    content: filename+tmpPath,
    createTime:new Date().getTime(),
  });
  theproduct.save(function(e, product, numberAffected) {
  // if (e) response.send(e.message);
  console.log(product);
  console.log(numberAffected);
  if(product){
    var respondata={
      "code":"200",
      "message":"success",
      "product":product
    };
    q.resolve(respondata);
  }else{
    var respondata={
      "code":"500",
      "message":"error"
    };
    q.reject(respondata);
  }
 });
 return q.promise;
}
