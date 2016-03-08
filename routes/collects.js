var mongoose = require("mongoose");

// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var collects = mongoose.model("collects", {
	username:String,
	collects: Object,
	collectsid:String,
	time:String,
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
exports.createCollects=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean.detail);
	collects.find({
		username: data.reqBean.detail.username,
		collectsid:data.reqBean.detail.collectsid,
	}, function(e, docs) {
		console.log(docs);
		if(docs&&docs.length>0){
				respondata={
					"code":"500",
					"message":"exports"
				};
				response.send(respondata);
			
		}else{
			var app6 = new collects({
				username: data.reqBean.detail.username,
				collectsid:data.reqBean.detail.collectsid,
				collects:data.reqBean.detail.collects,
				time:new Date().getTime(),
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

exports.find = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	collects.find({
		username: data.reqBean.detail.username
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

exports.removeCollects = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	collects.remove({
		_id: data.reqBean.detail.collectid
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


