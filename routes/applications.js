var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/wechart");
var fs = require('fs');
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');

var application = mongoose.model("application", {
	module_name:String,
	module_code:String,
	module_path:String,
	module_des:String,
	icon:Object,
  module_status:String,
  module_type:String,
  img_group:Object,
  version:Object,
  preversion:Object,
  createTime:String,
  updateTime:String
});

var photos = mongoose.model("photos", {
	photoname:String,
	photopath:String,
	content: String,
	createTime:String
});
var whitelist=require('./whitelist.js');
exports.application=application;
//createApp updateApp
exports.createApp=function(request, response){
  console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
  var q = Q.defer();

  if(data.reqBody.app_id&&data.reqBody.app_id!=''){
    update(data.reqBody.app_id).then(function(result){
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
    var app6 = new application({
      module_name: data.reqBody.module_name,
    	module_code:data.reqBody.module_code,
    	module_path:data.reqBody.module_path,
    	module_des:data.reqBody.module_des,
    	icon:data.reqBody.icon,
      module_status:config.status.UNPUBLIC,
      module_type:data.reqBody.module_type,
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
    application.update({
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

//修改App
exports.updateAPP=function(module_name, parmarys, values){
    application.update({
		  module_code: module_name,
		}, {
      parmarys: values,
      updateTime:new Date().getTime()
		}, function(e, numberAffected, raw) {
			if(e){
        respondata={
          "code":"500",
          "message":"error"
        };
        response.send(respondata);
			}else{
        respondata={
          "code":"200",
          "message":"success"
        };
        response.send(respondata);
			}
		});

}
//修改应用状态
exports.changeAppStatus=function(request, response) {
  console.log(request.body);
  var data=JSON.parse(request.body.reqContent);
  application.find({
    _id: data.reqBody.appid
  }, function(e, docs) {
    // console.log(docs);
    if(docs&&docs.length>0){
      if(data.reqBody.style=='status'){
        var params={
          module_status:data.reqBody.module_status,
          updateTime:new Date().getTime()
        }
        update(data.reqBody.appid,params).then(function(result){
           console.log('status result',result)
           response.send(result);
        },function(error){
                  response.send(error);
        });
      }else if(data.reqBody.style=="type"){
        var params={
          module_type:data.reqBody.module_type,
          updateTime:new Date().getTime()
        }
        update(data.reqBody.appid,params).then(function(result){
           console.log('type result',result)
           response.send(result);
        },function(error){
                  response.send(error);
        });
      }

    }else{
      // var results=updateAPP(data.reqBody.belong,'version',result.docs)
      response.send(respon.pushdata("500",'can not find version'));
    }

  });

 function update(appid,parmarys){
   var q = Q.defer();
   console.log('do update')
   application.update({
     _id: appid
   }, parmarys, function(e, numberAffected, raw) {
      if(e){
        respondata={
          "code":"500",
          "message":"error"
        };
        q.reject(respondata);
      }else{
        respondata={
          "code":"200",
          "message":"success",
          "numberAffected":numberAffected
        };
        q.resolve(respondata);
      }
    });
    return q.promise;
  }

}

//预览版列表接口
exports.getpreapplist=function(request, response) {
  console.log(request.query.mobile);
	var phone=request.query.mobile;
  application.find({},'-_id module_name module_code module_path icon.photopath module_status createTime module_type version preversion',{sort:{"updateTime":-1}}, function(e, docs) {
    if(e){
      respondata={
        "code":"500",
        "message":"exports"
      };
      response.send(respondata);
    }else{
      checkphone(phone).then(function(result){
       console.log('type result',result)
      
       if(result.result){
         console.log('in white list')
          getprenewarr(docs).then(function(result){
            respondata={
              "code":"200",
              "message":"success",
              "data":result,
            };
          response.send(respondata);
          })
       }else{
          getnewarr(docs).then(function(result){
            respondata={
              "code":"200",
              "message":"success",
              "data":result,
            };
          response.send(respondata);
          })
       }
      },function(error){
          response.send(error);
      });
      
    }

  });

}

  function getnewarr(docs){
    var q = Q.defer();
      var newarr=[],module_version='',module_url='',isshow=true
    
    for(var i=0;i<docs.length;i++)
    {
      //console.log(docs[i])
			if(docs[i].version){
				module_version=docs[i].version.version_number
				module_url=docs[i].version.code.filepath
			}
      if(docs[i].module_status=="UNPUBLIC"){
        docs[i].isshow=false
      }else if(docs[i].module_status=='PREVIEW'){
        docs[i].isshow=false
      }else{
        docs[i].isshow=true
      }
      var arr= {
        'module_id':docs[i].module_code,
        'module_name':docs[i].module_name,
        'module_code':docs[i].module_code,
        'img_url':docs[i].icon.photopath,
        'link_url':docs[i].module_path,
        'module_version':module_version,
        'module_url':module_url,
        'module_type':docs[i].module_type,
        'module_des':docs[i].module_des,
        'is_show':docs[i].isshow,
       }
     newarr[i]=arr
    }
    q.resolve(newarr);
    return q.promise;
}


  function getprenewarr(docs){
    var q = Q.defer();
      var newarr=[],module_version='',module_url='',isshow=true
    
    for(var i=0;i<docs.length;i++)
    {
      // console.log(docs[i])
			if(docs[i].preversion){
				module_version=docs[i].preversion.version_number
				module_url=docs[i].preversion.code.filepath
			}else{
        module_version=docs[i].version.version_number
				module_url=docs[i].version.code.filepath
      }
      if(docs[i].module_status=="UNPUBLIC"){
        docs[i].isshow=false
      }else if(docs[i].module_status=='PREVIEW'){
        docs[i].isshow=true
      }else{
        docs[i].isshow=true
      }
      var arr= {
        'module_id':docs[i].module_code,
        'module_name':docs[i].module_name,
        'module_code':docs[i].module_code,
        'img_url':docs[i].icon.photopath,
        'link_url':docs[i].module_path,
        'module_version':module_version,
        'module_url':module_url,
        'module_type':docs[i].module_type,
        'module_des':docs[i].module_des,
        'is_show':docs[i].isshow,
       }
     newarr[i]=arr
    }
    q.resolve(newarr);
    return q.promise;
}

 function checkphone(phone){
    var q = Q.defer();
    var username={'phone':phone}
    whitelist.whitelist.find(username,null,{sort:{"createTime":-1}},function(e, docs) {
        	if(e){
			respondata={
				"code":"500",
				"message":"error"
			};
      q.reject(respondata);
		}else{
			if(docs.length>0){
          respondata={
						"code":"200",
						"message":"find it",
            "result":true
					};
         q.resolve(respondata);
			}else{
				 respondata={
						"code":"200",
						"message":"not fond",
            "result":false
					};
           q.resolve(respondata);
			}
		}
	});
  return q.promise;
  }

//预览版主页接口
exports.getpreapplistHome=function(request, response) {
  console.log(request.query.mobile);//request.params.phone
	var phone=request.query.mobile;
  application.find({module_type:'FIRST'},'-_id module_name module_code module_path icon.photopath module_status createTime module_type version preversion',{sort:{"updateTime":-1}}, function(e, docs) {
    if(e){
      respondata={
        "code":"500",
        "message":"exports"
      };
      response.send(respondata);
    }else{
      checkphone(phone).then(function(result){
       console.log('type result',result)
      
       if(result.result){
         console.log('in white list')
          getprenewarr(docs).then(function(result){
            respondata={
              "code":"200",
              "message":"success",
              "data":result,
            };
          response.send(respondata);
          })
       }else{
          getnewarr(docs).then(function(result){
            respondata={
              "code":"200",
              "message":"success",
              "data":result,
            };
          response.send(respondata);
          })
       }
      },function(error){
          response.send(error);
      });
      
    }

  });

}

exports.getapplist=function(request, response) {
  console.log(request.query.phone);
  application.find({},'-_id module_name module_code module_path icon.photopath module_status createTime module_type version.version_number version.version_des version.version_status version.code.filepath version.code.createTime',{sort:{"createTime":-1}}, function(e, docs) {
    var newarr=[],module_version='',module_url='',isshow=true
    for(var i=0;i<docs.length;i++)
    {
      // console.log(docs[i])

			if(docs[i].version){
				module_version=docs[i].version.version_number
				module_url=docs[i].version.code.filepath
			}
      if(docs[i].module_status=="UNPUBLIC"){
        docs[i].isshow=false
      }else{
        docs[i].isshow=true
      }
      var arr= {
        'module_id':docs[i].module_code,
        'module_name':docs[i].module_name,
        'module_code':docs[i].module_code,
        'img_url':docs[i].icon.photopath,
        'link_url':docs[i].module_path,
        'module_version':module_version,
        'module_url':module_url,
        'module_type':docs[i].module_type,
        'module_des':docs[i].module_des,
        'is_show':docs[i].isshow,
       }
     newarr[i]=arr
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
        "data":newarr,
      };
    }
    response.send(respondata);
  });
}
exports.getapplistHome=function(request, response) {
  application.find({module_type:'FIRST'},'-_id module_name module_code module_path icon.photopath module_status createTime module_type version.version_number version.version_des version.version_status version.code.filepath version.code.createTime',{sort:{"updateTime":-1}}, function(e, docs) {
    var newarr=[],module_version='',module_url='',isshow=true
    for(var i=0;i<docs.length;i++)
    {
      console.log(docs[i])

      if(docs[i].version){
        module_version=docs[i].version.version_number
        module_url=docs[i].version.code.filepath
      }
      if(docs[i].module_status=="UNPUBLIC"){
        docs[i].isshow=false
      }else{
        docs[i].isshow=true
      }
      var arr= {
        'module_id':docs[i].module_code,
        'module_name':docs[i].module_name,
        'module_code':docs[i].module_code,
        'img_url':docs[i].icon.photopath,
        'link_url':docs[i].module_path,
        'module_version':module_version,
        'module_url':module_url,
        'module_type':docs[i].module_type,
        'module_des':docs[i].module_des,
        'is_show':docs[i].isshow,
       }
     newarr[i]=arr
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
        "data":newarr,
      };
    }
    response.send(respondata);
  });
}
//预览版
exports.getpreappDetail=function(request, response) {
  console.log(request.params.modelname);
  var module_version='',module_url='',version_des='',version_name='',module_size='',create_time='';
  var phone=request.query.mobile;
  application.find({module_code:request.params.modelname,module_status:'PUBLIC'},'-_id module_name module_code module_path module_des icon.photopath img_group.photopath version preversion ',{sort:{"createTime":-1}}, function(e, docs) {
    if(e){
        respondata={
          "code":"500",
          "message":"exports"
        };
        response.send(respondata);
    }else{
        if(docs&&docs.length>0){

       checkphone(phone).then(function(result){
       console.log('type result',result)
       if(result.result){
         console.log('in white list')
           if(docs[0].preversion){
                module_version=docs[0].preversion.version_number
                module_url=docs[0].preversion.code.filepath
                version_des=docs[0].preversion.version_des
                version_name=docs[0].preversion.version_name
                create_time=docs[0].preversion.updateTime
                module_size=parseFloat(docs[0].preversion.code_size/(1024*1024)).toFixed(2)+'M'
              }else{
                  module_version=docs[0].version.version_number
                  module_url=docs[0].version.code.filepath
                  version_des=docs[0].version.version_des
                  version_name=docs[0].version.version_name
                  create_time=docs[0].version.updateTime
                  module_size=parseFloat(docs[0].version.code_size/(1024*1024)).toFixed(2)+'M'
                }
              var arr= {
                'module_id':docs[0].module_code,
                'module_name':docs[0].module_name,
                'module_code':docs[0].module_code,
                'img_url':docs[0].icon.photopath,
                'img_group':docs[0].img_group,
                'link_url':docs[0].module_path,
                'module_type':docs[0].module_type,
                'module_des':docs[0].module_des,
                'module_size':module_size,
                'is_show':docs[0].isshow,
                'module_version':module_version,
                'version_name':version_name,
                'version_des':version_des,
                'module_url':module_url,
                'create_time':create_time
              }
               respondata={
                "code":"200",
                "message":"success",
                "data":arr,
              };
              response.send(respondata);
       }else{
             if(docs[0].version){
                  module_version=docs[0].version.version_number
                  module_url=docs[0].version.code.filepath
                  version_des=docs[0].version.version_des
                  version_name=docs[0].version.version_name
                  create_time=docs[0].version.updateTime
                  module_size=parseFloat(docs[0].version.code_size/(1024*1024)).toFixed(2)+'M'
                }
                var arr= {
                  'module_id':docs[0].module_code,
                  'module_name':docs[0].module_name,
                  'module_code':docs[0].module_code,
                  'img_url':docs[0].icon.photopath,
                  'img_group':docs[0].img_group,
                  'link_url':docs[0].module_path,
                  'module_type':docs[0].module_type,
                  'module_des':docs[0].module_des,
                  'module_size':module_size,
                  'is_show':docs[0].isshow,
                  'module_version':module_version,
                  'version_name':version_name,
                  'version_des':version_des,
                  'module_url':module_url,
                  'create_time':create_time
                }
          respondata={
                "code":"200",
                "message":"success",
                "data":arr,
              };
              response.send(respondata);
       }
      },function(error){
          response.send(error);
      });
      
    }else{
      respondata={
        "code":"200",
        "message":"not fund"
      };
        response.send(respondata);
    }

    }
  });
}

exports.getappDetail=function(request, response) {
  console.log(request.params.modelname);
  application.find({module_code:request.params.modelname,module_status:'PUBLIC'},'-_id module_name module_code module_path module_des icon.photopath img_group.photopath version ',{sort:{"createTime":-1}}, function(e, docs) {
    if(e){
      respondata={
        "code":"500",
        "message":"exports"
      };
    }else{
      if(docs[0].version){
        module_version=docs[0].version.version_number
        module_url=docs[0].version.code.filepath
        version_des=docs[0].version.version_des
        version_name=docs[0].version.version_name
        create_time=docs[0].version.updateTime
        module_size=parseFloat(docs[0].version.code_size/(1024*1024)).toFixed(2)+'M'
      }
      var arr= {
        'module_id':docs[0].module_code,
        'module_name':docs[0].module_name,
        'module_code':docs[0].module_code,
        'img_url':docs[0].icon.photopath,
        'img_group':docs[0].img_group,
        'link_url':docs[0].module_path,
        'module_type':docs[0].module_type,
        'module_des':docs[0].module_des,
        'module_size':module_size,
        'is_show':docs[0].isshow,
        'module_version':module_version,
        'version_name':version_name,
        'version_des':version_des,
        'module_url':module_url,
        'create_time':create_time

       }

      respondata={
        "code":"200",
        "message":"success",
        "data":arr,
      };
    }
    response.send(respondata);
  });
}

//Applist
exports.applist=function(request, response){
  console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	console.log(data);
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
    username={'username':data.reqBody.username}
  }else{
    username={};
  }
  application.find(username,function(e, docs) {
    totalRecord=docs.length;
  });

  application.find(username,null,{skip:skips,limit:limit,sort:{"createTime":-1}}, function(e, docs) {
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
        "totalRecord":totalRecord,
        "pageIndex":data.reqBody.pageNum,
        "pageNum":limit,
        }
      };
      respondata = JSON.stringify(respondata);
    }
    response.send(respondata);
  });
}

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
