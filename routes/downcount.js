var mongoose = require("mongoose");
var fs = require('fs'); 
var downcount = mongoose.model("downcount", {
	appversion:String,
	appname: String,
	ostype:String,
	ostypedetail:String,
	count:Number,
	createtime:String,
	updatetime:String
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
exports.downconts=function(request, response){
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	downcount.find({
		appname:data.reqBean.detail.appname
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
				console.log('do updeta',docs[0].count);
				update(docs[0].count);
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
		var app6 = new downcount({
			appversion: data.reqBean.detail.appversion,
			appname:data.reqBean.detail.appname,
			ostype:data.reqBean.detail.ostype,
			ostypedetail:data.reqBean.detail.ostypedetail,
			count:1,
			createtime:new Date().getTime(),
			updatetime:new Date().getTime(),
		});
		app6.save(function(e, product, numberAffected) {
			// if (e) response.send(e.message);
			console.log(product);
			if(product){
				emitter.emit("done"); 
			}else{
				emitter.emit("error"); 
			}
		});
	};

	var update=function(count){
		downcount.update({
		appname: data.reqBean.detail.appname
		}, {
			count: count+1,
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
exports.downlist=function(request, response){
	console.log(request.body);
	downcount.find({},null,{sort:{ "time":-1}},function(e, docs) {
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
exports.getplists=function(request, response){
	console.log('123');
	console.log(request.params.v,request.params.app,request.params.update);
	var file='./plist/'+request.params.app+'.plist';
	var str='';
	if(request.params.update){
		console.log('do update');
		//json to xml plist
		var docheck=function (list) {
			    console.log('docheck');
			    if(list instanceof Array){}
			    else{
			      str+="<dict>";   
			    }
			    for(var item in list){
			        debugger;
			        if(typeof(list[item])!='undefined')
			        {
			            if(list[item] instanceof Array){
			                str+="<key>"+item+"<key>";
			                console.log('Array',item,list[item].length);
			                if(list[item].length>0){
			                    str+="<array>";
			                     docheck(list[item]);   
			                     str+="</array>";
			                }           
			            }else if(typeof(list[item])=='object'){ 
			                  if(/^[0-9]*$/.test(item)){
			                    // console.log('item is 0',item);
			                }else{
			                  str+="<key>"+item+"<key>";   
			                }
			                console.log('object',item);             
			                     docheck(list[item]);  
			            }else{
			                str+="<key>"+item+"</key>";
			                if(typeof(list[item])=='boolean'){
			                    str+="<"+list[item]+"/>";
			                }else{
			                    str+="<string>"+list[item]+"</string>";
			                }
			                 console.log(typeof(list[item]),item);
			            }
			        }
			    }
			     if(list instanceof Array){}
			    else{
			      str+="</dict>";   
			    }
		};
		var docreate=function(){
			var i=0;
			var list={
			    "item":[{
			        "assets":
			            [{"kind":"software-package","url":"http://app.jfpal.com/jfpal/"+request.params.app+".ipa?9088"},
			            {"kind":"display-image","needs-shine":false,"url":"http://app.jfpal.com/jfpal/image.57x57.png"},
			            {"kind":"display-image","needs-shine":true,"url":"http://app.jfpal.com/jfpal/image.512x512.jpg"}]
			            ,
			         "metadata":{
			            "bundle-identifier":"com.UnionPay.jfpal2.u",
			            "bundle-version":request.params.v,
			            "kind":"software",
			            "subtitle":"即付宝个人版",
			            "title":"即付宝个人版"
			         }
			        }]
			};
			docheck(list);
			var newstr='<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0">'+str+'</plist>';
			fs.writeFile(file,newstr,  function(err) {
				   if (err) {
				       return console.error(err);
				   }else{
				   	var filePath='itms-services://?action=download-manifest&url=http://172.16.2.35:8003/plist/'+request.params.app+'.plist';
					response.redirect(filePath);
				   }
			});	
		}();

	}else{
		fs.exists(file, function(exists) {
		//docreate();
		  if (exists) {
		    // serve file
		    var filePath='itms-services://?action=download-manifest&url=http://app.jfpal.com/jfpal/'+request.params.app+'.plist';
				response.redirect(filePath);
		  } 
		});
	}
	
	
	// var filePath='itms-services://?action=download-manifest&url=http://172.16.2.31:8002/plist/jfpal.plist';
	// response.redirect(filePath);
	//response.send(filePath);
};
exports.createPlist=function(request, response){
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	var codename=data.reqBean.detail.appname;
	var file='./plist/'+codename+'.plist';
	var str='';
	fs.exists(file, function(exists) {
		docreate();
	  // if (exists) {
	  //   // serve file
	  //   var respondata={
			// 		"code":"200",
			// 		"message":"exists",
			// 		"plist":'http://172.16.2.43:8002/plist/'+codename+'.plist',
			// };
			// response.send(respondata);
	  // } else {
	  // 	docreate();
	  //   // mongodb
	  // }
	});
	var docreate=function(){
		var i=0;
		var list={
		    "item":[{
		        "assets":
		            [{"kind":"software-package","url":"http://app.jfpal.com/jfpal/jfpal_u.ipa?9088"},
		            {"kind":"display-image","needs-shine":false,"url":"http://app.jfpal.com/jfpal/image.57x57.png"},
		            {"kind":"display-image","needs-shine":true,"url":"http://app.jfpal.com/jfpal/image.512x512.jpg"}]
		            ,
		         "metadata":{
		            "bundle-identifier":"com.UnionPay.jfpal2.u",
		            "bundle-version":"3.5.5",
		            "kind":"software",
		            "subtitle":"即付宝个人版",
		            "title":"即付宝个人版"
		         }
		        }]
		};
		docheck(list);
		console.log(str);
		var newstr='<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0">'+str+'</plist>';
		console.log(newstr);
		fs.writeFile(file,newstr,  function(err) {
			   if (err) {
			       return console.error(err);
			   }else{
			   	var respondata={
					"code":"200",
					"message":"success",
					"plist":'http://172.16.2.31:8002/plist/'+codename+'.plist',
				};
				response.send(respondata);
			   }
		});
	}
	

	var docheck=function (list) {
	    //console.log(list);
	    if(list instanceof Array){}
	    else{
	      str+="<dict>";   
	    }
	    for(var item in list){
	        debugger;
	        if(typeof(list[item])!='undefined')
	        {
	            if(list[item] instanceof Array){
	                str+="<key>"+item+"<key>";
	                console.log('Array',item,list[item].length);
	                if(list[item].length>0){
	                    str+="<array>";
	                     docheck(list[item]);   
	                     str+="</array>";
	                }           
	            }else if(typeof(list[item])=='object'){ 
	                  if(/^[0-9]*$/.test(item)){
	                    // console.log('item is 0',item);
	                }else{
	                  str+="<key>"+item+"<key>";   
	                }
	                console.log('object',item);             
	                     docheck(list[item]);  
	            }else{
	                str+="<key>"+item+"</key>";
	                if(typeof(list[item])=='boolean'){
	                    str+="<"+list[item]+"/>";
	                }else{
	                    str+="<string>"+list[item]+"</string>";
	                }
	                 console.log(typeof(list[item]),item);
	            }
	        }
	    }
	     if(list instanceof Array){}
	    else{
	      str+="</dict>";   
	    }
	};

};


