var mongoose = require("mongoose");
var collect = mongoose.model("collect", {
	tirtle:String,
	collectId:String,
	owner:String,
	limintmoney:String,
	liminttime:String,
	content: Object,
	nowmoney: String,
	status:String,
	participator:Object,
	createtime:String,
	updatetime:String
});
var orders = mongoose.model("orders", {
	orderId:String,
	collect:String,
	user:String,
	money:String,
	status:String,
	createtime:String,
	updatetime:String
});
var http = require('http');
var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
var respon=require('./respon.js');
var config=require('./config.js');
//获取collect值
exports.getcollect=function(request, response){
	var data=request.body.reqBody;
	collect.find({
		_id: data.id
	}, function(e, docs) {
		if(e){
			var msg="exports";
			response.send(respon.pushdata("500",msg));
		}else{
			respon.loggers(docs);
			if(docs.length>0){
				response.send(respon.pushdata("200",'success',docs[0]));
			}else{
				response.send(respon.pushdata("500",'undefind'));
			}
		}

	});
}
//获取downlist列表
exports.getCollectList=function(request, response){
	respon.loggers(request.body);
	var serach=request.body.reqBody;//search={"owner":"MrAndsen","status":"unexpect"}
	if(!serach){
		serach={};
	}
	collect.find(serach,null,{sort:{ "createtime":-1}},function(e, docs) {
		if(e){
			var msg="exports";
			response.send(respon.pushdata("500",msg));
		}else{
			//respon.loggers(docs);
			if(docs.length>0){
				response.send(respon.pushdata("200",'success',docs));
			}else{
				response.send(respon.pushdata("500",'empty'));
			}
		}
	});
};
//创建collect
exports.createCollect=function(request, response){
	respon.loggers(request.body);
	var data=request.body.reqBody;
	var emitter = new events.EventEmitter();
	collect.find({
		tirtle:data.tirtle
	}, function(e, docs) {
		if(e){
			var msg="exports";
			response.send(respon.pushdata("500",msg));
		}else{
			respon.loggers(docs);
			if(docs.length>0){
				var msg="the tirtle is exit";
				response.send(respon.pushdata("300",msg));
			}else{
				createnew();
                emitter.on("done", function(){
  				response.send(respon.pushdata("200","success"));
                });
                emitter.on("error", function(){
                    response.send(respon.pushdata("500","error"));
                });
			}
		}
	});

	var createnew=function(){
		var apps = new collect({
			tirtle:data.tirtle,
			collectId: new Date().getTime()+Math.round(Math.random()*1000).toString(),//时间戳＋3位随机数
			owner:data.owner,
			limintmoney:data.limintmoney,
			liminttime:new Date().getTime()+(data.liminttime*24*3600),
			content: data.content,
			nowmoney: 0,
			status:'START',
			createtime:new Date().getTime(),
			updatetime:new Date().getTime(),
		});
		apps.save(function(e, product, numberAffected) {
			// if (e) response.send(e.message);
			respon.loggers(product);
			if(product){
				emitter.emit("done");
			}else{
				emitter.emit("error");
			}
		});
	};

};
exports.doupdate=function(request, response){
	var data=request.body.reqBody;
	collect.find({
		tirtle:data.tirtle
	}, function(e, docs) {
		if(e){
			response.send(respon.pushdata("500","sql error"));
		}else{
			respon.loggers(docs);
			if(docs.length>0){
				update();
			}
			emitter.on("done", function(){
				response.send(respon.pushdata("200","success"));
			});
			emitter.on("error", function(){
				response.send(respon.pushdata("500","update error"));
			});

		}

	});
	update=function(){
		collect.update({
		_id: data.id
		}, {
			tirtle:data.tirtle,
			owner:data.owner,
			limintmoney:data.limintmoney,
			liminttime:data.liminttime,
			content: data.content,
			nowmoney: 0,
			status:'START',
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
//remove
exports.removeApp = function(request, response) {
    respon.loggers(request.body);
    var data=request.body.reqBody;
    collect.update({
        collectId: data.collectId
    }, {
			status:'DELETE'
		},function(e) {
        respon.loggers(e);
        if(e){
            response.send(respon.pushdata("500","error"));
        }else{
            response.send(respon.pushdata("200","success"));
        }

    });
};

//changeStatus
changeStatus=function(ordersId,theStatus){
	//orderchangedone
	if(!ordersId){
		status={
			'code':'500','msg':'no id'
		}
		emitter.emit("orderchangedone",status);
	}
	orders.find({
		orderId:ordersId
	}, function(e, docs) {
		if(e){
			status={
			'code':'500','msg':'sql error'
			}
			emitter.emit("orderchangedone",status);
		}else{
			respon.loggers(docs);
			if(docs.length>0){
				update(theStatus);
			}
			emitter.on("done", function(){
				status={
				'code':'200','msg':'success'
				}
				emitter.emit("orderchangedone",status);
			});
			emitter.on("error", function(){
				status={
				'code':'500','msg':'sql error'
				}
				emitter.emit("orderchangedone",status);
			});

		}

	});
	update=function(theStatus){
		collect.update({
		orderId: ordersId
		}, {
			status:theStatus,
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
//orders
exports.createOrder=function(request, response){
	console.log(request.body);
	var data=request.body.reqBody;
	var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
	if(!data.collect){
		status={
			'code':'500','msg':'no id'
		}
		emitter.emit("changedone",status);
	}
	collect.find({
		collectId:data.collect
	}, function(e, docs) {
		if(e){
			response.send(respon.pushdata("500",'sql error'));
		}else{
			if(docs.length>0){
			if(parseFloat(docs[0].nowmoney)>=parseFloat(docs[0].limintmoney)){
					response.send(respon.pushdata("300",'the collect is over'));
			}else {
				var apps = new orders({
					orderId: new Date().getTime()+Math.round(Math.random()*10000).toString(),//时间戳＋4位随机数
					collect:data.collect,
					user:data.user,
					money:data.money,
					status:'UNPAY',
					createtime:new Date().getTime(),
					updatetime:new Date().getTime(),
				});
				apps.save(function(e, product, numberAffected) {
					// if (e) response.send(e.message);
					console.log(product);
					if(product){
						var nowmoney=parseFloat(docs[0].nowmoney)+parseFloat(data.money);
						changeMoney(data.user,data.collect,nowmoney,docs[0]);
						emitter.on("changedone", function(resu){
							respon.loggers(resu);
							if(resu.code=='200'){
													 response.send(respon.pushdata("200",resu.msg));
							}else if(resu.code=='500'){
													response.send(respon.pushdata("300",'create success but alert'+resu.msg));
											}
						});

					}else if(e){
						response.send(respon.pushdata("500",'sql error'));
					}
				});
			}
		}else{
			response.send(respon.pushdata("300",'no collects'));
		}
	}


	//changeMoeny
	changeMoney=function(user,collectsId,money,docs){
		var status={};
	    var emitter_c = new events.EventEmitter();//创建了事件监听器的一个对象
			var contains = function (arr,obj) {
		    var i = arr.length;
		    while (i--) {
		        if (arr[i] === obj) {
		            return true;
		        }
		    }
		    return false;
			};
			var update=function(nowmoney,userarr,statue){
				collect.update({
				collectId: data.collect
				}, {
					nowmoney: nowmoney,
					status:statue,
					participator:userarr,
					updatetime:new Date().getTime(),
				}, function(e, numberAffected, raw) {
					if(e){
						emitter_c.emit("error");
					}else{
						emitter_c.emit("done");
					}
				});
			};
			var dopush=function(date){
				var options = {
			        method: 'POST',
			        hostname: config.appconfig.api,
							port: 80,
			        path: '/pushToUsers',
			        headers: {
			            'Content-Type': "application/json",
			            "Content-Length": date.length
			        }
			    };
			    var req = http.request(options, function (res) {
			        res.setEncoding('utf8');
			        res.on('data', function (chunk) {
			            console.log('BODYBBBBB: ' + chunk);
			        });
			    });
			    req.write(date);
			    req.on('error', function (e) {
			        console.log(e);
			        console.log('problem request: ' + e.message);
			    });

			    req.end();
			}
			respon.loggers(docs);
					var userarr=[];
					var statue='IMCOM';
	        if(docs.participator){
                userarr=docs.participator;
                respon.loggers(contains(docs.participator,user));
                if(!contains(docs.participator,user)){
			   				userarr.push(user);
                }
	        }else{
                userarr.push(user);
	        }
					if(money>=docs.limintmoney){
						statue="COMPLATE";
					}
					update(money,userarr,statue);
	        emitter_c.on("done", function(){
						status={
						'code':'200','msg':'success'
						}
						var temp='';
						for(var i=0;i<userarr.length;i++){
							temp+=userarr[i]+'|'
						}
						var comp={
							'users':temp+'null',
							'mesg':'the collect is complate'
						}
						var result=respon.reqdata("200",'success',comp)
						console.log(result);
						dopush(result);
						emitter.emit("changedone",status);
	        });
          emitter_c.on("error", function(){
              status={
              'code':'500','msg':'sql error'
              }
              emitter.emit("changedone",status);
          });

}


	});
};

exports.orderList=function(request, response){
	respon.loggers(request.body);
	var serach=request.body.reqBody;//search={"user":"MrAndsen","status":"unexpect"}
	if(!serach){
		serach={};
	}
	orders.find(serach,null,{sort:{ "createtime":-1}},function(e, docs) {
		if(e){
			var msg="exports";
			response.send(respon.pushdata("500",msg));
		}else{
			respon.loggers(docs);
			if(docs.length>0){
				response.send(respon.pushdata("200",'success',docs));
			}else{
				response.send(respon.pushdata("500",'empty'));
			}
		}
	});
}
exports.orderChange=function(request, response){
	var data=request.body.reqBody;
	var result=changeStatus(data.id,data.status);
	emitter.on("orderchangedone", function(resu){
		if(result.code=='200'){
				response.send(respon.pushdata("200",result.msg));
		}else if(result.code=='500'){
			response.send(respon.pushdata("300",'create success but alert'+result.msg));
		}else{
			response.send(respon.pushdata("500",result.msg));
		}
	});

}

exports.changeStatus=changeStatus();
