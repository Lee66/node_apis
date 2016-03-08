var mongoose = require("mongoose");
 mongoose.connect("mongodb://localhost/app6");

// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var article = mongoose.model("article", {
	id: Number,
	user:String,
	tirtle: String,
	content:String,
	time:String,
	comment:Object,
	updatetime:String,
});
var comments = mongoose.model("comments", {
	user:String,
	repayuser:String,
	content: String,
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

exports.connect = function(request, response) {
	mongoose.connect("mongodb://localhost/app6", function(e) {
		if (e) response.send(e.message);
		response.send("connect yes!");
	});
};

exports.cretirtle = function(request, response) {
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBean.detail);
	// response.setHeader("Access-Control-Allow-Origin", "*");
	// response.writeHead(200, {'Content-Type': 'text/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); 
	var app6 = new article({
		id: 1,
		user: data.reqBean.detail.users,
		tirtle: data.reqBean.detail.tirtle,
		content: data.reqBean.detail.content,
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
};
exports.find = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	article.find({
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
	article.update({
		_id: data.reqBean.detail.id
	}, {
		tirtle: data.reqBean.detail.tirtle,
		content: data.reqBean.detail.content,
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
};
exports.MKcommit=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	var status;
	// console.log(data.reqBean);
	// console.log(data.reqBean.detail);
	var comment = new comments({
		user:data.reqBean.detail.comment.user,
		repayuser:data.reqBean.detail.comment.repayuser,
		content: data.reqBean.detail.comment.content,
		time:new Date().getTime(),
	});
	comment.save(function(e, product, numberAffected) {
		// if (e) response.send(e.message);
		// console.log(product);
		// console.log(numberAffected);
		if(product){
			upActicle(product);
			emitter.on("updatedown", function(){
			  console.log("事件触发，调用此回调函数");
			  console.log(status);
				if(status){
					respondata={
					"code":"200",
					"message":"success"
					};
				}else{
					respondata={
					"code":"500",
					"message":"add commit error"
					};
				}
			});
			
		}else{
			respondata={
				"code":"500",
				"message":"create commit error"
			};
		}
		response.send(respondata);
	});

	upActicle=function(product){
		var allcommernts=[];
		return article.find({
			_id: data.reqBean.detail.id
		}, function(e, docs) {
			console.log(docs[0].comment);
			if(docs[0].comment){
				allcommernts=docs[0].comment;
			}else{
				allcommernts=[];
			}
			// console.log(allcommernts);
			allcommernts.push(product);
			upcomment(allcommernts);
			// console.log('status'+status);
			if(status){
				return true;
			}else{
				return false;
			}
		});
	}
	upcomment=function(allcommernts){
		return article.update({
				_id: data.reqBean.detail.id
			}, {
				comment:allcommernts
			}, function(e, numberAffected, raw) {
				if(e){
					status=false;
					emitter.emit("updatedown");
					return false;
				}else{
					status=true;
					emitter.emit("updatedown");
					return true;
				}
				
			});
	}	
		 
	
	
};
exports.articleList= function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean.detail.pageNum);
	if(data.reqBean.detail.pageNum==1){
		var pageindex=0;//o biegin
	}else{
		var pageindex=(data.reqBean.detail.pageNum-1)*data.reqBean.detail.numPerPage;
	}
	var skips=pageindex;
	var limit=data.reqBean.detail.numPerPage;
	var totalRecord;
	var user=data.reqBean.detail.user;
	if(user&&user!=null){
		user={'user':data.reqBean.detail.user}
	}else{
		user={};
	}
	article.find(user,function(e, docs) {
		totalRecord=docs.length;
	});
	console.log(skips+"/"+limit);
	article.find(user,null,{skip:skips,limit:limit,sort:{"time":-1}},function(e, docs) {
		// response.setHeader("Access-Control-Allow-Origin", "*");
		// if (e) response.send(e.message);
		var head={
			"code":"200",
			"message":"success",
			"respondata":docs,
			"page":{
				"totalRecord":totalRecord,
				"pageIndex":data.reqBean.detail.pageNum,
				"pageNum":limit,
			}
		};
		var html = JSON.stringify(head);
		response.send(html);
	});
	// conn.close();
};
exports.update = function(request, response) {
	article.update({
		id: 1
	}, {
		name: "new admin"
	}, function(e, numberAffected, raw) {
		if (e) response.send(e.message);
		var html = "<p>修改的结果为：" + JSON.stringify(raw);
		html += "<p>影响的数据量为：" + numberAffected;
		response.send(html);
	});
};
exports.delArticle = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	article.remove({
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