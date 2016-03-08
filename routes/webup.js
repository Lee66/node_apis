var mongoose = require("mongoose");
var fs = require('fs'); 
// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var apidoc = mongoose.model("webups", {
	codename:String,
	packagebag: Object,
	contents:String,
	version:String,
	path:String,
	time:String,
});
var files = mongoose.model("webfiles", {
	filename:String,
	filepath:String,
	content: String,
	time:String
});
var webapps = mongoose.model("webapplication", {
	module_name:String,
	module_version:String,
	url:String,
	lastup: Object,
	time:String
});
var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
// 监听事件some_event
// emitter.on("some_event", function(){
//   console.log("事件触发，调用此回调函数");
// });
// setTimeout(function(){
//   emitter.emit("some_event");   //触发事件some_event
// },3000);

exports.connect = function(request, response) {
	mongoose.connect("mongodb://localhost/app6", function(e) {
		if (e) response.send(e.message);
		response.send("connect yes!");
	});
};
exports.createrecode=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	var apiurl='http://172.16.2.35:8002/';
	//console.log(data.reqBean);
	console.log(data.reqBean.detail);
	apidoc.find({
		codename: data.reqBean.detail.codename
	},null,{sort:{ "time":-1}}, function(e, docs) {
		console.log(docs);
		var versions;
		var path='www/'+data.reqBean.detail.codename;
		if(docs&&docs.length>0){
			console.log('exict');
			visions=parseInt(docs[0].version)+1;
			versions=parseInt(docs[0].version)+1;
		}else{
			versions=1;
		}
		var type=data.reqBean.detail.packagebag.type.split('/');
		var app6 = new apidoc({
			codename: data.reqBean.detail.codename,
			packagebag: data.reqBean.detail.packagebag,
			contents:data.reqBean.detail.contents,
			version:versions,
			path:path+'/'+data.reqBean.detail.codename+'_'+versions+'.'+type[1],
			time:new Date().getTime(),
		});
		app6.save(function(e, product, numberAffected) {
			// if (e) response.send(e.message);
			console.log(product);
			console.log(numberAffected);
			if(product){
				updateapplist(product);
				respondata={
					"code":"200",
					"message":"success"
				};
			}else{
				respondata={
					"code":"500",
					"message":"exports"
				};
			}
			response.send(respondata);
		});
	});

 	var updateapplist=function(version){
		webapps.update({
			module_name: data.reqBean.detail.codename
		}, {
			module_version:version.version,
			url:apiurl+version.path,
			lastup: version,
			time:new Date().getTime(),
		}, function(e, numberAffected, raw) {
			if (e){
				response.send(e.message);
			}else{
				respondata={
					"code":"200",
					"message":"success"
				};
				response.send(respondata);
			} 
			
		});
 	};
	
};
exports.upload = function(request, response) {
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
		apidoc.find({
		codename: name[0]
		},null,{sort:{ "time":-1}}, function(e, docs) {
			console.log(docs);
			var filename;
			if(docs&&docs.length>0){
				console.log('exict');
				filename=name[0]+'_'+(parseInt(docs[0].version)+1)+'.'+name[1];
			}else{
				filename=name[0]+'_1'+'.'+name[1];
			}
			console.log(filename);
			movefile(filename,targetPaths);
		});
             	
            }	
            var movefile=function(filename,filepath){
             		// var tmp_name = item.name;
	            var targetPath = filepath+'/'+filename;//public/images/
	            console.log(targetPath);
	            //将上传的临时文件移动到指定的目录下
	            	fs.rename(tmpPath, targetPath , function(err) {
	                if(err){
	                    throw err;
	            	    }
	                 //删除临时文件
	             fs.unlink(tmpPath, function(){
		             if(err) {
		                        throw err;
		             }else{
			                    console.log(targetPath);
			                    //上传处理完成
			};

		      	var theproduct = new files({
				filename:filename,
				filepath:targetPath,
				content: filename+tmpPath,
				time:new Date().getTime(),
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
             	}//
}

exports.find = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	apidoc.find({
		_id: data.reqBean.detail.id
	}, function(e, docs) {
		console.log(docs);
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
		}else{
			respondata={
				"code":"200",
				"message":"success",
				"docs":docs
			};
		}
		response.send(respondata);
	});
};

exports.uplist= function(request, response) {
	console.log(request.body);

	apidoc.find({},null,{sort:{ "time":-1}},function(e, docs) {
		// response.setHeader("Access-Control-Allow-Origin", "*");
		// if (e) response.send(e.message);
		var head={
			"code":"200",
			"message":"success",
			"respondata":docs,
			
		};
		var html = JSON.stringify(head);
		response.send(html);
	});
	// conn.close();
};

exports.applist= function(request, response) {
	console.log(request.body);
	webapps.find({},null,{sort:{ "module_name":1}},function(e, docs) {
		if (e) response.send(e.message);
		var head={
			"code":"200",
			"message":"success",
			"respondata":docs,
			
		};
		var html = JSON.stringify(head);
		response.send(html);
	});
	// conn.close();
};

exports.applicaitionList=function(request, response){
	console.log(request.body);
	webapps.find({},'-_id module_name module_version url time',{sort:{ "module_name":1}},function(e, docs) {
		if (e) response.send(e.message);
		var head={
			"code":"200",
			"message":"success",
			"respondata":docs,
			
		};
		var html = JSON.stringify(head);
		response.send(html);
	});
	// conn.close();
};

exports.createapp=function(request, response){
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	webapps.find({
		module_name: data.reqBean.detail.appname
	}, function(e, docs) {
		console.log(docs);
		if(docs&&docs.length>0){
			console.log('exict');
			respondata={
						"code":"500",
						"message":"exict"
					};
			response.send(respondata);
		}else{
			var app6 = new webapps({
				module_name: data.reqBean.detail.appname,
				time:new Date().getTime(),
			});
			app6.save(function(e, product, numberAffected) {
				// if (e) response.send(e.message);
				console.log(product);
				console.log(numberAffected);
				if(product){
					respondata={
						"code":"200",
						"message":"success"
					};
				}else{
					respondata={
						"code":"500",
						"message":"exports"
					};
				}
				response.send(respondata);
			});
		}
	});
};

exports.visioncheck=function(request, response){
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	apidoc.find({
		codename: data.reqBean.detail.codename,
	},null,{sort:{ "time":-1}}, function(e, docs) {
		console.log(docs);
		console.log()
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
		}else{
			if(docs&&docs.length>0){
				if(data.reqBean.detail.version){
					if(docs[0].version>data.reqBean.detail.version){
						respondata={
						"code":"200",
						"message":"success",
						"docs":docs[0]
						};
					}else{
						respondata={
						"code":"200",
						"message":"you version is the newest",
						};
					}
				}else{
					respondata={
					"code":"200",
					"message":"success",
					"docs":docs[0]
					};	
				}
			}else{
				respondata={
						"code":"200",
						"message":"no update",
				};
			}
			
			
		}
		response.send(respondata);
	});
};

exports.lastversion=function(request, response){
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	apidoc.find({
		codename: data.reqBean.detail.codename,
	},null,{sort:{ "time":-1}}, function(e, docs) {
		console.log(docs);
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
		}else{
			if(docs&&docs.length>0){
				respondata={
						"code":"200",
						"message":"success",
						"docs":docs[0]
				};
			}else{
				respondata={
						"code":"200",
						"message":"no update",
				};
			}
		}
		response.send(respondata);
	});
};
exports.removeapp = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	webapps.remove({
		_id: data.reqBean.detail.id
	}, function(e) {
		console.log(e);
		// if (e) response.send(e.message);
		// response.setHeader("Access-Control-Allow-Origin", "*")
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
		}else{
			respondata={
				"code":"200",
				"message":"success"
			};
		}
		
		response.send(respondata);
	});
};
exports.reqpost=function(request, response){
	console.log(request.body);
	// console.log(request.body.reqContent);
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	// response.setHeader("Access-Control-Allow-Origin", "*");
	// response.writeHead(200, {'Content-Type': 'text/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); 
	response.send("req成功");
};