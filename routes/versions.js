var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');
var applications=require('./applications.js');
var versions = mongoose.model("versions", {
	version_name:String,
	version_number:String,
	version_des:String,
  belong:String,
	code:Object,
  code_size:String,
  version_status:String,
  createTime:String,
  updateTime:String
});

var files = mongoose.model("files", {
	filename:String,
	filepath:String,
  size:String,
	content: String,
	createTime:String
});
//版本 status  未发布 UNPUBLIC 预览版 PREVIEW 已发布 PUBLIC
//应用 status  未发布 UNPUBLIC 已发布 PUBLIC 已下架 UNSHELVE

//createApp updateApp 创建版本 修改版本
exports.createVersion=function(request, response){
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
    var app6 = new versions({
      version_name:data.reqBody.version_name,
    	version_number:data.reqBody.version_number,
    	version_des:data.reqBody.version_des,
      belong:data.reqBody.belong,
    	code:data.reqBody.code,
      code_size:data.reqBody.code_size,
      version_status:config.status.UNPUBLIC,
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
			arr['version_status']=config.status.UNPUBLIC
      console.log(arr)
      versions.update({
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

//关联应用
function updateAPP(module_code, parmarys, values){
  console.log('do up app')
  var qe = Q.defer();
  console.log(module_code,parmarys,values)
    applications.application.update({
      module_code: module_code,
    }, {
      version: values,
       preversion: values,
      updateTime:new Date().getTime()
    }, function(e, numberAffected, raw) {
      if(e){
        respondata={
          "code":"500",
          "message":"error"
        };
        qe.reject(respondata);
      }else{
        respondata={
          "code":"200",
          "message":"success"
        };
        qe.resolve(respondata);
      }
    });
    return qe.promise;
}

//关联预览版本应用
function updatePreeAPP(module_code, parmarys, values){
  console.log('do up app')
  var qe = Q.defer();
  console.log(module_code,parmarys,values)
    applications.application.update({
      module_code: module_code,
    }, {
      preversion: values,
      updateTime:new Date().getTime()
    }, function(e, numberAffected, raw) {
      if(e){
        respondata={
          "code":"500",
          "message":"error"
        };
        qe.reject(respondata);
      }else{
        respondata={
          "code":"200",
          "message":"success"
        };
        qe.resolve(respondata);
      }
    });
    return qe.promise;
}

//修改版本状态
exports.changeVersionStatus=function(request, response) {

  console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
  versions.find({
    _id: data.reqBody.versionid
  }, function(e, docs) {
    console.log(docs);
    if(docs&&docs.length>0){
      update().then(function(result){
        console.log('result',result)
        if(data.reqBody.version_status==config.status.PUBLIC){
          updateAPP(data.reqBody.belong,'version',result.product[0]).then(function(result){
                console.log("updateAPP invoke in",result);
                response.send(result);
          },function(error){
                  console.log("updateAPP invoke in deferd",error);
          });
        }else if(data.reqBody.version_status==config.status.PREVIEW){
            updatePreeAPP(data.reqBody.belong,'version',result.product[0]).then(function(result){
                  console.log("updateAPP invoke in",result);
                  response.send(result);
            },function(error){
                    console.log("updateAPP invoke in deferd",error);
            });
        }else{
          response.send(result);
        }
      },function(error){
                response.send(error);
      });

    }else{
      // var results=updateAPP(data.reqBody.belong,'version',result.docs)
      response.send(respon.pushdata("500",'can not find version'));
    }

  });

  function update(){
    var q = Q.defer();
  console.log('do update')
   versions.update({
     _id: data.reqBody.versionid,
   }, {
     version_status:data.reqBody.version_status,
     updateTime:new Date().getTime()
   }, function(e, numberAffected, raw) {
      if(e){
        respondata={
          "code":"500",
          "message":"error"
        };
        q.reject(respondata);
      }else{

        versions.find({
          _id: data.reqBody.versionid
        }, function(e, docs) {
          console.log(docs);
          if(docs&&docs.length>0){
            respondata={
              "code":"200",
              "message":"success",
              "product":docs
            };
            q.resolve(respondata);
          }else{
            respondata={
              "code":"500",
              "message":"errors"
            };
            q.reject(respondata);
          }
        })

      }
    });
    return q.promise;
  }

}

//版本列表
exports.versionlist=function(request, response){
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
  versions.find(username,function(e, docs) {
    totalRecord=docs.length;
    allpage=totalRecord/data.reqBody.numPerPage
    console.log('allpage',allpage,parseInt(allpage),data.reqBody.numPerPage)
    if(allpage>parseInt(allpage)){
      allpage=parseInt(allpage)+1
    }
  });

  versions.find(username,null,{skip:skips,limit:limit,sort:{"createTime":-1}}, function(e, docs) {
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
        "docs":docs,
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

//版本上传
exports.fileupload = function(request, response) {
	// var data=JSON.parse(request);
	console.log( request.files);

	var item=request.files.file;
    if(item.path){
      var tmpPath = item.path;
      var type = item.type;
      console.log(type);
      // var extension_name = "";
      //移动到指定的目录，一般放到public的images文件下面
      //在移动的时候确定路径已经存在，否则会报错
       // var tmp_name = (Date.parse(new Date())/1000);
       // tmp_name = tmp_name+''+(Math.round(Math.random()*9999));
      var name=item.name.split('.');
      console.log(name);
      var targetPaths='uploads/www/'+name[0];
      //the path is exist
      var folder_exists = fs.existsSync(targetPaths);
		  if(folder_exists == true){
		  }else{
		  	fs.mkdir(targetPaths,function(err){
    			if (err) {
    			       return console.error(err);
    			   }
  			   console.log("目录创建成功。");
  			});
		  }
  		versions.find({
  		    belong: name[0]
  		},null,{sort:{ "createTime":-1}}, function(e, docs) {
  			console.log(docs);
  			var filename;
  			if(docs&&docs.length>0){
  				console.log('exict');
  				filename=name[0]+'_'+(parseFloat(docs[0].version_number)+0.1).toFixed(1)+'.'+name[1];
  			}else{
  				filename=name[0]+'_1'+'.'+name[1];
  			}
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
  		});

    }

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

// 删除应用
exports.removeVersion=function(request, response){
  respon.loggers(request.body);
  var data=JSON.parse(request.body.reqContent);
  versions.update({
      version_number: data.reqBody.version_number
  }, {
    version_status:'DELETE'
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
