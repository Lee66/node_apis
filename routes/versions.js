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
  system_type:String,
  version_type:Object,
  version_typeName:String,
  version_typeCode:String,
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

var versiontype = mongoose.model("versiontype", {
  typename:String,
  typecode:String,
  typedes: String,
  createTime:String,
  updateTime:String
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
      system_type:data.reqBody.system_type,
      version_type:data.reqBody.version_type,
      version_typeName:data.reqBody.version_typeName,
      version_typeCode:data.reqBody.version_type.typecode,
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

  var surch={
    'version_typeCode':data.reqBody.version_type,
    'system_type':data.reqBody.system_type,
    'belong':data.reqBody.belong,
  }
  surch=respon.checknull(surch)
  console.log('surch',surch)
  versions.find(surch,function(e, docs) {
    totalRecord=docs.length;
    allpage=totalRecord/data.reqBody.numPerPage
    console.log('allpage',allpage,parseInt(allpage),data.reqBody.numPerPage)
    if(allpage>parseInt(allpage)){
      allpage=parseInt(allpage)+1
    }
  });

  versions.find(surch,null,{skip:skips,limit:limit,sort:{"createTime":-1}}, function(e, docs) {
    //console.log(docs);
    if(e){
      respondata={
        "code":"500",
        "message":"exports"
      };
    }else{
      var newarr=[]
      for(var i=0;i<docs.length;i++)
      {
        var filepath = ''
        if(docs[i].code){
          filepath=docs[i].code.filepath
        }
        var arr= {
        '_id':docs[i]._id,
        'version_name':docs[i].version_name,
        'version_number':docs[i].version_number,
        'version_typeCode':docs[i].version_typeCode,
        'belong':docs[i].belong,
        'system_type':docs[i].system_type,
        'version_status':docs[i].version_status,
        'version_type':docs[i].version_type,
        'version_des':docs[i].version_des,
        'downloadUrl':config.appconfig.urlapi+filepath,
        'code_size':docs[i].code_size,
        'code':docs[i].code,
        'createTime':docs[i].createTime,
        'updateTime':docs[i].updateTime,
        }
        newarr[i]=arr
      }
      respondata={
        "code":"200",
        "message":"success",
        "data":newarr,
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

exports.getfilePal=function(request, response){
  console.log(request.params.photopath);
  var photoname=request.params.photoname;
  var filePath='./'+photoname;
  response.sendfile(filePath);
}

//production //preproduction //test
exports.getVersionList=function(request, response){
  console.log(request.body);
  var appUser=request.params.appUser;
  console.log(appUser);
  versions.find({'belong':appUser},null,{sort:{"createTime":-1}}, function(e, docs) {
    var newarr={};
    newarr['production']=[]
    newarr['preproduction']=[]
    newarr['test']=[]
    for(var i=0;i<docs.length;i++)
    {
      console.log(docs[i].version_typeCode)
      if(docs[i].version_typeCode=='production'){
       newarr['production'].push(docs[i])
      }
      else if(docs[i].version_typeCode=='preproduction'){
       newarr['preproduction'].push(docs[i])
      }
      else if(docs[i].version_typeCode=='test'){
       newarr['test'].push(docs[i])
      }
    }
    if(e){
      respondata={
        "code":"500",
        "message":"exports"
      };
    }else{
      respondata={
        "code":"200",
        "message":"success",
        "docs":newarr,
      };
      
    }
    console.log(newarr)
    response.send(respondata);
  });
}

//版本上传
exports.fileupload = function(request, response) {
	// var data=JSON.parse(request);
	console.log( request.files);

	var item=request.files.file;
  var theData=new Date();
  var tmp_name = (Date.parse(new Date())/1000);
      tmp_name = tmp_name+''+(Math.round(Math.random()*9999));
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
      var uname=item.name.split('-');
      console.log(name);
      var targetPaths='uploads/www/'+uname[0]+'-'+uname[1];
      var no_versions=uname[2].split('.apk')
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
  		    belong: uname[0]
  		},null,{sort:{ "createTime":-1}}, function(e, docs) {
  			console.log(docs);
  			var filename;
  			if(docs&&docs.length>0){
  				console.log('exict',name.length);
  				filename=uname[0]+'-'+uname[1]+'-'+no_versions[0]+'-'+tmp_name+'.'+name[name.length-1];
  			}else{
  				filename=uname[0]+'-'+uname[1]+'-'+no_versions[0]+'-'+tmp_name+'.'+name[name.length-1];
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
    filepath:targetPath,
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
  versions.remove({
    _id: data.reqBody.id
  }, function(e) {
    console.log(e);
    // if (e) response.send(e.message);
    // response.setHeader("Access-Control-Allow-Origin", "*")
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
    
    response.send(respondata);
  });
  // versions.update({
  //     version_number: data.reqBody.version_number
  // }, {
  //   version_status:'DELETE'
  // },function(e) {
  //     respon.loggers(e);
  //     if(e){
  //       var respondata={
  //         "code":"500",
  //         "message":"error"
  //       };
  //         response.send(respondata);
  //     }else{
  //       var respondata={
  //         "code":"0000",
  //         "message":"success",
  //       };
  //       response.send(respondata);
  //       // respon.pushdata("0000","success")
  //     }

  // });
}

//创建文章类型
exports.createVersionType=function(request, response){
  console.log(request.body.reqContent);
  var data=JSON.parse(request.body.reqContent);
  var q = Q.defer();

  if(data.reqBody.type_id&&data.reqBody.type_id!=''){
    update(data.reqBody.type_id).then(function(result){
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
    var app6 = new versiontype({
      typename:data.reqBody.typename,
      typecode:data.reqBody.typecode,
      typedes: data.reqBody.typedes,
      createTime:new Date().getTime(),
      updateTime:new Date().getTime()
    });
    app6.save(function(e, product, numberAffected) {
      // if (e) response.send(e.message);
        console.log(product);
        if(product){
          respondata={
            "code":"200",
            "message":"success"
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
    var arr=respon.checknull(data.reqBody)
    arr['updateTime']=new Date().getTime()
    console.log(arr)
    versiontype.update({
      _id: id,
    }, arr, function(e, numberAffected, raw) {
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

//articleTypeList
exports.versionTypeList= function(request, response) {
  console.log(request.body);
    var data=JSON.parse(request.body.reqContent);
  var username=data.reqBody.username;
  if(username&&username!=null){
    username={'username':data.reqBody.username}
  }else{
    username={};
  }
  versiontype.find(username,null,{sort:{"createTime":-1}},function(e, docs) {
    var head={
      "code":"200",
      "message":"success",
      "data":docs,
    };
    var html = JSON.stringify(head);
    response.send(html);
  });
  // conn.close();
};