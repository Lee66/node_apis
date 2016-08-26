var mongoose = require("mongoose");


var collects = mongoose.model("collects", {
	user:String,
	collects: Object,
	collectsid:String,
	time:String,
});

var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
exports.createCollects=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBody);
	collects.find({
		user: data.reqBody.username,
		collectsid:data.reqBody.collectsid,
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
				user: data.reqBody.username,
				collectsid:data.reqBody.collectsid,
				collects:data.reqBody.collects,
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
		user: data.reqBody.username
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
		_id: data.reqBody.collectid
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


