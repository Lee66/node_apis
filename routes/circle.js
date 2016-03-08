var mongoose = require("mongoose");
var circles = mongoose.model("circles", {
	owner:String,
	circlesname:String,
	info: Object,
	circlefile: Object,
	member:Object,
	time:String,
	updatetime:String,
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
exports.createcircles=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean.detail);
	circles.find({
		circlesname: data.reqBean.detail.circlesname,
	}, function(e, docs) {
		console.log(docs);
		if(docs&&docs.length>0){
				respondata={
					"code":"500",
					"message":"exports"
				};
				response.send(respondata);
			
		}else{
			var app6 = new circles({
				owner: data.reqBean.detail.owner,
				circlesname:data.reqBean.detail.circlesname,
				info:data.reqBean.detail.info,
				circlefile:data.reqBean.detail.circlefile,
				time:new Date().getTime(),
				updatetime:new Date().getTime()
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
exports.joincircle=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	circles.find({
		_id: data.reqBean.detail.circleid,
	}, function(e, docs) {
		console.log(docs);
		var member=docs[0].member;
		if(member){
			console.log('users',member.indexOf(data.reqBean.detail.users));
				if(member.indexOf(data.reqBean.detail.users)>=0){
					respondata={
						"code":"500",
						"message":"exit"
					};
					response.send(respondata);
				}else{
					member.push(data.reqBean.detail.users);
					doupdate(member);
				}
		}else{
			member=[data.reqBean.detail.users];
			doupdate(member);
		}
		console.log(member);
		

	});
	doupdate=function(member){
			circles.update({
			_id: data.reqBean.detail.circleid
			}, {
				member: member
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
};
exports.circleList = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	if(data.reqBean.detail.pageNum==1){
		var pageindex=0;//o biegin
	}else{
		var pageindex=(data.reqBean.detail.pageNum-1)*data.reqBean.detail.numPerPage;
	}
	var skips=pageindex;
	var limit=data.reqBean.detail.numPerPage;
	var totalRecord;
	var owner=data.reqBean.detail.owner;
	if(owner&&owner!=null){
		owner={'owner':data.reqBean.detail.owner}
	}else{
		owner={};
	}
	circles.find(owner,function(e, docs) {
		totalRecord=docs.length;
	});
	console.log(skips+"/"+limit);
	circles.find(owner,null,{skip:skips,limit:limit,sort:{"time":-1}},function(e, docs) {
		console.log(docs);
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
			response.send(respondata);
		}else{
			respondata={
				"code":"200",
				"message":"success",
				"docs":docs,
				"page":{
				"totalRecord":totalRecord,
				"pageIndex":data.reqBean.detail.pageNum,
				"pageNum":limit,
				}
			};
			var html = JSON.stringify(respondata);
			response.send(html);
		}
		
	});
};

exports.removecircles = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	circles.remove({
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


