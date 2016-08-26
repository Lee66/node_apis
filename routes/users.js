var mongoose = require("mongoose");
var md5=require("nodejs-md5");
var Q= require('q');
// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var users = mongoose.model("user", {
	username:String,
	phone:String,
	password: String,
	personfile:Object,
	createTime:String,
	updateTime:String
});
var path = require('path');

exports.register = function(request, response) {
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	users.find({
        phone:data.reqBody.phone
    }, function(e, docs) {
        if(e){
                respondata={
                    "code":"500",
                    "message":"find error",
                };
                response.send(respondata);
        }else{
            console.log('docs:',docs);
            if(docs&&docs.length>0){
                respondata={
                    "code":"200",
                    "message":"the emial has bean used",
                };
                response.send(respondata);
            }else{
                createnew().then(function(result){
			       console.log('type result',result)
			       response.send(result);
			    },function(error){
			        response.send(error);
			    });
            }
            
        }
    function createnew(){
        console.log('do create');
        var q = Q.defer();
        var apps = new users({
            username:data.reqBody.username,
            password:md5.string.quiet(data.reqBody.password),
            phone:data.reqBody.phone,
            emial: data.reqBody.emial,
            createTime:new Date().getTime(),
            updateTime:new Date().getTime(),
        });
        apps.save(function(e, product, numberAffected) {
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
    };

    });	
    
}

exports.login = function(request, response) {
	console.log(request.body.reqContent)
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBody)
    var userpassword=md5.string.quiet(data.reqBody.password);
    users.find({
        phone:data.reqBody.phone
    }, function(e, docs) {
        if(e){
                respondata={
                    "code":"500",
                    "message":"find error",
                };
                response.send(respondata);
        }else{
            console.log('docs:',docs);
            if(docs&&docs.length>0){
            	if(userpassword==docs[0].password){
            		respondata={
                    "code":"200",
                    "message":"login success",
                    "data":docs[0]
                	};
            	}else{
            		respondata={
                    "code":"500",
                    "message":"password is wrong",
                	};
            	}
                
                response.send(respondata);
            }else{
               	respondata={
                    "code":"500",
                    "message":"the user is not exist",
                };
                response.send(respondata);
            }
            
            
        }
        
    });
}
//remove
exports.removeUser = function(request, response) {
    console.log(request.body);
    var data=JSON.parse(request.body.reqContent);
    users.update({
        _id: data.reqBody.id
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
exports.finduser=function(request, response){
	console.log(request);
	var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBean);
	console.log(data.reqBody);
	users.find({
		_id: data.reqBody.id
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
	users.find({
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
	console.log(data.reqBody);
	users.update({
	_id: data.reqBody.id
	}, {
		username: data.reqBody.username,
		personfile: data.reqBody,
		updateTime:new Date().getTime()
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