var mongoose = require("mongoose");
var fs = require('fs'); 
var path = require('path');
// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var product = mongoose.model("product", {
	username:String,
	produname:String,
	producontent: String,
	photos:Object,
	comments:Object,
	time:String
});
var photos = mongoose.model("photos", {
	photoname:String,
	photopath:String,
	content: String,
	time:String
});
var comments = mongoose.model("piccomments", {
	user:String,
	repayuser:String,
	content: String,
	time:String,
});
var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
exports.products=function(request, response){
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
	var username=data.reqBean.detail.username;
	if(username&&username!=null){
		username={'username':data.reqBean.detail.username}
	}else{
		username={};
	}
	product.find(username,function(e, docs) {
		totalRecord=docs.length;
	});
	console.log(skips+"/"+limit);
	product.find(username,null,{skip:skips,limit:limit,sort:{"time":-1}}, function(e, docs) {
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
				"docs":docs,
				"page":{
				"totalRecord":totalRecord,
				"pageIndex":data.reqBean.detail.pageNum,
				"pageNum":limit,
				}
			};
			respondata = JSON.stringify(respondata);
		}
		response.send(respondata);
	});
}
exports.upload = function(request, response) {
	// var data=JSON.parse(request);
	console.log( request.files);
	var item=request.files.file;		
            if(item.path){
            var tmpPath = item.path;
            var type = item.type;
            console.log(type);
            var extension_name = "";
            //移动到指定的目录，一般放到public的images文件下面
            //在移动的时候确定路径已经存在，否则会报错
            var tmp_name = (Date.parse(new Date())/1000);
            tmp_name = tmp_name+''+(Math.round(Math.random()*9999));
            //判断文件类型
	            switch (type) {
	                case 'image/pjpeg':extension_name = 'jpg';
	                    break;
	                case 'image/jpeg':extension_name = 'jpg';
	                    break;
	                case 'image/gif':extension_name = 'gif';
	                    break;
	                case 'image/png':extension_name = 'png';
	                    break;
	                case 'image/x-png':extension_name = 'png';
	                    break;
	                case 'image/bmp':extension_name = 'bmp';
	                    break;
	                case 'application/zip':extension_name='zip';
	                break;
	            }
	            var tmp_name = tmp_name+'.'+extension_name;
	            var targetPath = 'uploads/' + tmp_name;//public/images/
	            console.log(tmpPath);
	            //将上传的临时文件移动到指定的目录下
	            	fs.rename(tmpPath, targetPath , function(err) {
	                if(err){
	                    throw err;
	                }
	                //判断是否完成
	                //console.log(index);
	                 //删除临时文件
	                fs.unlink(tmpPath, function(){
	                    if(err) {
	                        throw err;
	                    }else{
		                    console.log(targetPath);
		                    //上传处理完成
		                    //数据
		    };

	      	var theproduct = new photos({
			photoname:tmp_name,
			photopath:targetPath,
			content: tmp_name+tmpPath,
			time:new Date().getTime(),
		});
                    	 theproduct.save(function(e, product, numberAffected) {
			// if (e) response.send(e.message);
			console.log(product);
			console.log(numberAffected);
			if(product){
				respondata={
					"code":"200",
					"message":"success",
					"product":product
				};
			}else{
				respondata={
					"code":"500",
					"message":"error"
				};
			}
			response.send(respondata);
		});


	                });

	            });
            }	
}
exports.createproduct=function(request, response){
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	 	var theproduct = new product({
			username:data.reqBean.detail.username,
			produname:data.reqBean.detail.produname,
			producontent: data.reqBean.detail.producontent,
			photos:data.reqBean.detail.photos,
			time:new Date().getTime(),
		});
                    	 theproduct.save(function(e, product, numberAffected) {
			// if (e) response.send(e.message);
			console.log(product);
			console.log(numberAffected);
			if(product){
				respondata={
					"code":"200",
					"message":"success",
					"product":product
				};
			}else{
				respondata={
					"code":"500",
					"message":"error"
				};
			}
			response.send(respondata);
		});
}
exports.getphoto=function(request, response){
	console.log(request.params.photoname);
	var photoname=request.params.photoname;
	targetPath='./uploads/';
	var filePath=path.join(targetPath,photoname);
	response.sendfile(filePath);
}
exports.productDetail=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	product.find({
		_id:data.reqBean.detail.id,
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
}
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
	comment.save(function(e, comment, numberAffected) {
		// if (e) response.send(e.message);
		// console.log(product);
		// console.log(numberAffected);
		if(comment){
			upActicle(comment);
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

	upActicle=function(comment){
		var allcommernts=[];
		return product.find({
			_id: data.reqBean.detail.id
		}, function(e, docs) {
			console.log(docs[0].comments);
			if(docs[0].comments){
				allcommernts=docs[0].comments;
			}else{
				allcommernts=[];
			}
			// console.log(allcommernts);
			allcommernts.push(comment);
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
		return product.update({
				_id: data.reqBean.detail.id
			}, {
				comments:allcommernts
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
exports.delProduct = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	product.remove({
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
;