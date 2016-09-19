var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/applications");
var appversions = mongoose.model("appversions", {
	appname:String,
	appuser:String,
	versionname:String,
	iosbundleid:String,
	ioscontent: Object,
	androidcontent: Object,
	webcontent: Object,
	delstatus:Boolean,
	createtime:String,
	updatetime:String
});
var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
//获取plist文件
exports.getplist=function(request, response){
	console.log(request.params.v,request.params.app);
	var appip='https://www.jfpal.com/apps/';
	appversions.find({
		versionname:request.params.v,appuser:request.params.app
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
				response.set("content-type","text/plain").render('manifest',{ appip:appip,version: docs[0].versionname,appuser:docs[0].appuser,appname:docs[0].appname,iosbundleid:docs[0].iosbundleid });
			}else{
				respondata={
				"code":"500",
				"message":"undefind"
				};
				response.send(respondata);
			}
		}

	});

}
//获取tag值
exports.gettag=function(request, response){
	appversions.find({
		versionname:request.params.v
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
					"data":{
							"iostag":docs[0].ioscontent.tag,
							"androidtag":docs[0].androidcontent.tag,
							"webtag":docs[0].webcontent.tag
					}
				};
				response.send(respondata);
			}else{
				respondata={
				"code":"500",
				"message":"undefind"
				};
				response.send(respondata);
			}
		}

	});
}
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
			appname:data.reqBean.detail.appname,
			appuser:data.reqBean.detail.appuser,
			iosbundleid:data.reqBean.detail.iosbundleid,
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
	appversions.find({"delstatus":null},null,{sort:{ "time":-1}},function(e, docs) {
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
//remove
exports.removeApp = function(request, response) {
    console.log(request.body);
    var data=JSON.parse(request.body.reqContent);
    appversions.update({
        _id: data.reqBean.detail.id
    }, {
			delstatus:true
		},function(e) {
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
