var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');

var whitelist=mongoose.model("whitelist", {
	phone:String,
	content: String,
	createTime:String,
  updateTime:String
});

exports.whitelist=whitelist;


//创建文章类型
exports.createWhite=function(request, response){
  console.log(request.body.reqContent);
	var data=JSON.parse(request.body.reqContent);
  var q = Q.defer();

  if(data.reqBody.type_id&&data.reqBody.type_id!=''){
    update(data.reqBody.type_id).then(function(result){
       console.log('type result',result)
       response.send(result);
    },function(error){
        response.send(error);
    });

  }else{
    create().then(function(result){
       console.log('type result',result)
       response.send(result);
    },function(error){
        response.send(error);
    });

  }
  function create(){
    var app6 = new whitelist({
      phone:data.reqBody.phone,
      content:data.reqBody.content,
      createTime:new Date().getTime(),
      updateTime:new Date().getTime()
    });
    app6.save(function(e, product, numberAffected) {
      // if (e) response.send(e.message);
        console.log(product);
        if(product){
          respondata={
            "code":"200",
            "message":"success"
          };
          q.resolve(respondata);
        }else{
          respondata={
            "code":"500",
            "message":"exports"
          };
          q.reject(respondata);
        }
      });
      return q.promise;
  }
  function update(id){
    var arr=respon.checknull(data.reqBody)
    arr['updateTime']=new Date().getTime()
    console.log(arr)
    whitelist.update({
		  _id: id,
		}, arr, function(e, numberAffected, raw) {
			if(e){
        respondata={
          "code":"500",
          "message":"error"
        };
        q.reject(respondata);
			}else{
        respondata={
          "code":"200",
          "message":"success"
        };
        q.resolve(respondata);
			}
		});
    return q.promise;
  }

}


//articleTypeList
exports.whiteList= function(request, response) {
	console.log(request.body);
		var data=JSON.parse(request.body.reqContent);
	whitelist.find({},null,{sort:{"createTime":-1}},function(e, docs) {
		var head={
			"code":"200",
			"message":"success",
			"data":docs,
		};
		var html = JSON.stringify(head);
		response.send(html);
	});
	// conn.close();
};