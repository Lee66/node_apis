var mongoose = require("mongoose");
var fs = require('fs'); 
var appversions = mongoose.model("appversions", {
	versionname:String,
	ioscontent: String,
	androidcontent: String,
	webcontent: String,
	createtime:String,
	updatetime:String
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
exports.createAppVersion=function(request, response){
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	appversions.find({
		versionname:data.reqBean.detail.versionname
	}, function(e, docs) {
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
			response.send(respondata);
		}else{
			console.log(docs);
			if(docs.length>0){
				respondata={
				"code":"200",
				"message":"the version is exit"
				};
				response.send(respondata);
			}else{
				createnew();
			}
			emitter.on("done", function(){
  				respondata={
					"code":"200",
					"message":"success",
				};
				response.send(respondata);
			});
			emitter.on("error", function(){
  				respondata={
					"code":"500",
					"message":"error",
				};
				response.send(respondata);
			});
			
		}
		
	});

	var createnew=function(){
		var apps = new appversions({
			versionname: data.reqBean.detail.versionname,
			createtime:new Date().getTime(),
			updatetime:new Date().getTime(),
		});
		apps.save(function(e, product, numberAffected) {
			// if (e) response.send(e.message);
			console.log(product);
			if(product){
				emitter.emit("done"); 
			}else{
				emitter.emit("error"); 
			}
		});
	};

};
exports.doupdate=function(request, response){
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	appversions.find({
		versionname:data.reqBean.detail.versionname
	}, function(e, docs) {
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
			response.send(respondata);
		}else{
			console.log(docs);
			if(docs.length>0){
				update();
			}
			emitter.on("done", function(){
  				respondata={
					"code":"200",
					"message":"success",
				};
				response.send(respondata);
			});
			emitter.on("error", function(){
  				respondata={
					"code":"500",
					"message":"error",
				};
				response.send(respondata);
			});
			
		}
		
	});
	var update=function(){
		appversions.update({
		versionname: data.reqBean.detail.versionname
		}, {	
			ioscontent:data.reqBean.detail.ioscontent,
			androidcontent:data.reqBean.detail.androidcontent,
			webcontent:data.reqBean.detail.webcontent,
			updatetime:new Date().getTime(),
		}, function(e, numberAffected, raw) {
			if(e){
				emitter.emit("error");
			}else{
				emitter.emit("done"); 
			}
		});
	};
};
//获取downlist列表
exports.appversionlist=function(request, response){
	console.log(request.body);
	appversions.find({},null,{sort:{ "time":-1}},function(e, docs) {
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
};