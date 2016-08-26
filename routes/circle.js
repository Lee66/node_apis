var mongoose = require("mongoose");
var circles = mongoose.model("circles", {
	owner:String,
	circlesname:String,
	info: Object,
	circlefile: Object,
	member:Object,
	createTime:String,
	updateTime:String,
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
	console.log(data.reqBody);
	circles.find({
		circlesname: data.reqBody.circlesname,
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
				owner: data.reqBody.owner,
				circlesname:data.reqBody.circlesname,
				info:data.reqBody.info,
				circlefile:data.reqBody.circlefile,
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
		_id: data.reqBody.circleid,
	}, function(e, docs) {
		console.log(docs);
		var member=docs[0].member;
		if(member){
			console.log('users',member.indexOf(data.reqBody.users));
				if(member.indexOf(data.reqBody.users)>=0){
					respondata={
						"code":"500",
						"message":"exit"
					};
					response.send(respondata);
				}else{
					member.push(data.reqBody.users);
					doupdate(member);
				}
		}else{
			member=[data.reqBody.users];
			doupdate(member);
		}
		console.log(member);
		

	});
	doupdate=function(member){
			circles.update({
			_id: data.reqBody.circleid
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
	if(data.reqBody.pageNum==1){
		var pageindex=0;//o biegin
	}else{
		var pageindex=(data.reqBody.pageNum-1)*data.reqBody.numPerPage;
	}
	var skips=pageindex;
	var limit=data.reqBody.numPerPage;
	var totalRecord;
	var owner=data.reqBody.owner;
	if(owner&&owner!=null){
		owner={'owner':data.reqBody.owner}
	}else{
		owner={};
	}
	circles.find(owner,function(e, docs) {
		totalRecord=docs.length;
	});
	console.log(skips+"/"+limit);
	circles.find(owner,null,{skip:skips,limit:limit,sort:{"createTime":-1}},function(e, docs) {
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
				"data":docs,
				"page":{
				"totalRecord":totalRecord,
				"pageIndex":data.reqBody.pageNum,
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
		_id: data.reqBody.collectid
	}, function(e) {
		console.log(e);
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


