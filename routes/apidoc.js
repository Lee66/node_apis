var mongoose = require("mongoose");

// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var apidoc = mongoose.model("apidoc", {
	apiname:String,
	atribute: Object,
	url:String,
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
exports.notfond=function(request, response){
	respondata={
						"code":"404",
						"message":"notfond"
					};
	response.send(respondata);
};
exports.connect = function(request, response) {
	mongoose.connect("mongodb://localhost/app6", function(e) {
		if (e) response.send(e.message);
		response.send("connect yes!");
	});
};
exports.createapi=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	apidoc.find({
		apiname: data.reqBean.detail.apiname
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
			var app6 = new apidoc({
				apiname: data.reqBean.detail.apiname,
				time:new Date(),
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

exports.changeapiname=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	apidoc.update({
		_id: data.reqBean.detail.id
	}, {
		apiname: data.reqBean.detail.apiname,
		time:new Date(),
	}, function(e, numberAffected, raw) {
		console.log(e);
		if(e){
			respondata={
				"code":"500",
				"message":"error"
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
exports.editapi = function(request, response) {
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	//exict
	apidoc.update({
		_id: data.reqBean.detail.id
	}, {
		apiname: data.reqBean.detail.apiname,
		atribute: data.reqBean.detail.atribute,
		time:new Date(),
	}, function(e, numberAffected, raw) {
		console.log(e);
		if(e){
			respondata={
				"code":"500",
				"message":"error"
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
exports.updCirtle=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	apidoc.update({
		_id: data.reqBean.detail.id
	}, {
		tirtle: data.reqBean.detail.tirtle,
		content: data.reqBean.detail.content,
		time:new Date(),
	}, function(e, numberAffected, raw) {
		if(e){
			respondata={
				"code":"500",
				"message":"error"
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

exports.ApiList= function(request, response) {
	console.log(request.body);

	apidoc.find({},function(e, docs) {
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

exports.removeApis = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	apidoc.remove({
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