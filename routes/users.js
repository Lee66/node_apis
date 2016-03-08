var mongoose = require("mongoose");

// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var user = mongoose.model("user", {
	username:String,
	phone:String,
	password: String,
	personfile:Object,
	time:String,
	updatetime:String
});
var path = require('path');

exports.register = function(request, response) {
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	// response.setHeader("Access-Control-Allow-Origin", "*");
	// response.writeHead(200, {'Content-Type': 'text/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); 
	var app6 = new user({
		username: data.reqBean.detail.username,
		phone:data.reqBean.detail.phone,
		password: data.reqBean.detail.password,
		time:new Date().getTime(),
		updatetime:new Date().getTime()
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

exports.login = function(request, response) {
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	user.find({
		phone: data.reqBean.detail.phone
	}, function(e, docs) {
		console.log(docs);
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
		}else if(docs.length>0){
			respondata={
				"code":"200",
				"message":"success",
				"docs":docs
			};
		}else{
			respondata={
				"code":"500",
				"message":"exports",
				"docs":docs
			};
		}
		response.send(respondata);
	});
}
exports.finduser=function(request, response){
	console.log(request);
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	// response.setHeader("Access-Control-Allow-Origin", "*");
	// response.writeHead(200, {'Content-Type': 'text/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); 
	user.find({
		_id: data.reqBean.detail.id
	}, function(e, docs) {
		console.log(docs);
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
		}else if(docs){
			respondata={
				"code":"200",
				"message":"success",
				"docs":docs
			};
		}else{
			respondata={
				"code":"500",
				"message":"exports",
				"docs":docs
			};
		}
		response.send(respondata);
	});

	
}
exports.getuserpic=function(request, response){
	console.log(request.params.username);
	user.find({
		username: request.params.username
	}, function(e, docs) {
		console.log('userpic',docs);
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
			response.send(respondata);
		}else if(docs.length>0){
			if(docs[0].personfile){
				var photoname=docs[0].personfile.personimg.photoname;
			targetPath='./uploads/';
			var filePath=path.join(targetPath,photoname);
			response.sendfile(filePath);
			}else{
				respondata={
				"code":"500",
				"message":"null"
				};
				response.send(respondata);
			}
			
		}
		
	});
}
exports.personfile=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	// response.setHeader("Access-Control-Allow-Origin", "*");
	// response.writeHead(200, {'Content-Type': 'text/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); 
	user.update({
	_id: data.reqBean.detail.id
	}, {
		username: data.reqBean.detail.username,
		personfile: data.reqBean.detail,
		updatetime:new Date().getTime()
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

	
}
;