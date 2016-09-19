var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');
// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var article = mongoose.model("article", {
	user:String,
	tirtle: String,
    info:String,
	content:String,
 	type:Object,
	 typecode:String,
    img_group:Object,
	createTime:String,
    updateTime:String,
	comment:Object,
});
var comments = mongoose.model("comments", {
	user:String,
	repayuser:String,
	content: String,
	createTime:String,
    updateTime:String
});
var articletype = mongoose.model("articletype", {
	typename:String,
	typecode:String,
	typedes: String,
	createTime:String,
    updateTime:String
});

//创建文章
exports.createArticle=function(request, response){
  console.log(request.body.reqContent);
	var data=JSON.parse(request.body.reqContent);
  var q = Q.defer();

  if(data.reqBody.art_id&&data.reqBody.art_id!=''){
    update(data.reqBody.art_id).then(function(result){
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
    var app6 = new article({
      tirtle: data.reqBody.tirtle,
      info:data.reqBody.info,
			type:data.reqBody.type,
			typecode:data.reqBody.type.typecode,
      content:data.reqBody.content,
      img_group:data.reqBody.img_group,
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
		arr['typecode']=data.reqBody.type.typecode,
    console.log(arr)
    article.update({
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


//添加评论
exports.MKcommit=function(request, response){
	var data=JSON.parse(request.body.reqContent);
	var status;
	// console.log(data.reqBean);
	// console.log(data.reqBean.detail);
	var comment = new comments({
		user:data.reqBean.detail.comment.user,
		repayuser:data.reqBean.detail.comment.repayuser,
		content: data.reqBean.detail.comment.content,
		createTime:new Date().getTime(),
        updateTime:new Date().getTime()
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

//文章列表
exports.articleList= function(request, response) {
	console.log(request.body);
		var data=JSON.parse(request.body.reqContent);
	console.log(data.reqBody.pageNum);
  if(data.reqBody.pageNum==1){
    var pageindex=0;//o biegin
  }else{
    var pageindex=(data.reqBody.pageNum-1)*data.reqBody.numPerPage;
  }
  var skips=pageindex;
  var limit=data.reqBody.numPerPage;
  var totalRecord;
  var username=data.reqBody.username;

  if(username&&username!=null){
    username={'username':data.reqBody.username}
  }else{
    username={};
  }
  article.find(username,function(e, docs) {
    totalRecord=docs.length;
    allpage=totalRecord/data.reqBody.numPerPage
    console.log('allpage',allpage,parseInt(allpage),data.reqBody.numPerPage)
    if(allpage>parseInt(allpage)){
      allpage=parseInt(allpage)+1
    }
  });
	article.find(username,null,{skip:skips,limit:limit,sort:{"createTime":-1}},function(e, docs) {
		var head={
			"code":"200",
			"message":"success",
			"data":docs,
			"page":{
				 "totalRecord":totalRecord,
                "pageIndex":data.reqBody.pageNum,
                "pageNum":limit,
                "allpage":allpage
			}
		};
		var html = JSON.stringify(head);
		response.send(html);
	});
	// conn.close();
};

//文章列表
exports.getallArticle= function(request, response) {
	console.log(request.body);
	console.log(request.params);
		var data=request.params
	console.log(data.pageNum);
  if(parseInt(data.pageNum)==1){
    var pageindex=0;//o biegin
  }else{
    var pageindex=(data.pageNum-1)*data.numPerPage;
  }
  var skips=pageindex;
  var limit=parseInt(data.numPerPage);
  var totalRecord;
  var username=data.typecode;

  if(username&&username!=null){
    username={'typecode':data.typecode}
  }else{
    username={};
  }
	console.log(username)
  article.find(username,function(e, docs) {
    totalRecord=docs.length;
    allpage=totalRecord/data.numPerPage
    console.log('allpage',allpage,parseInt(allpage),data.numPerPage)
    if(allpage>parseInt(allpage)){
      allpage=parseInt(allpage)+1
    }
  });
	console.log(skips,limit)
	article.find(username,'_id tirtle info typecode type.typename type.typecode img_group.photopath  createTime',{skip:skips,limit:limit,sort:{"createTime":-1}},function(e, docs) {
		var head={
			"code":"200",
			"message":"success",
			"data":docs,
			"page":{
				 "totalRecord":totalRecord,
                "pageIndex":parseInt(data.pageNum),
                "pageNum":limit,
                "allpage":allpage
			}
		};
		// var html = JSON.stringify(head);
		response.send(head);
	});
	// conn.close();
};


//home page getarticlelist
exports.getarticlelist= function(request, response) {
	articletype.find({},null,{sort:{"createTime":-1}},function(e, docs) {
		if(e){
			respondata={
          "code":"500",
          "message":"error"
        };
				response.send(respondata)
		}else{
			var article={}
			var com=docs
				getlist().then(function(result){
						var rusl=connet(com,result)
						respondata={
						"code":"200",
						"message":"success",
						"data":rusl
					};
					response.send(respondata)
				},function(error){
						console.log(error)
							response.send(error)
				});

			// response.send(docs)
		}

	});
	function connet(com,result){
				var newcom=[]
						for(var i=0;i<com.length;i++)
						{
									newcom[i]={}
									newcom[i]['article']=[]
									for(var j=0;j<result.length;j++){
											if(result[j].typecode==com[i].typecode){
												newcom[i]['type']=result[j].type
													newcom[i]['article'].push(result[j])
												// console.log('com new',com[i].articles)
											}
									}
							}
							console.log(newcom)
		return newcom	
	}
	function getlist(code){
		var q = Q.defer();
		article.find({},'_id tirtle info typecode type.typename type.typecode img_group.photopath  createTime',{sort:{"createTime":-1}},function(e, docs) {
			if(e){
				q.reject(respondata);
			}else{
				// console.log(docs)
				var head={
				"code":"200",
				"message":"success",
				"data":docs,
			};
				q.resolve(docs);
			}
		});
		return q.promise;
	}

	// conn.close();
};



//getArticle
exports.getArticle = function(request, response) {
	console.log(request.params.name);
	article.find({
		_id: request.params.name
	}, function(e, docs) {
		console.log(docs);
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
		}else{
			// respondata={
			// 	"code":"200",
			// 	"message":"success",
			// 	"data":docs
			// };
			if(docs.length>0){
				respondata=docs[0].content
			}else{
				 respondata={
						"code":"500",
						"message":"not fond"
					};
			}
			
		}
		response.format({
			'text/plain': function(){
				response.send(respondata);
			},

			'text/html': function(){
				var head='<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width"><title>home</title><style type="text/css">body{background:#fff;padding-bottom:10%}  img{width: 100%} h3{margin-bottom:0} p{margin:0} ul{list-style:none;margin:0;padding-left:5%}</style></head><body >'
				response.send(head+respondata
				+' </body></html>');
			},
		});

	});
};

exports.delArticle = function(request, response) {
	console.log(request.body);
	var data=JSON.parse(request.body.reqContent);
	article.remove({
		_id: data.reqBody.id
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


//创建文章类型
exports.createArticleType=function(request, response){
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
    var app6 = new articletype({
      typename:data.reqBody.typename,
      typecode:data.reqBody.typecode,
      typedes: data.reqBody.typedes,
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
    articletype.update({
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
exports.articleTypeList= function(request, response) {
	console.log(request.body);
		var data=JSON.parse(request.body.reqContent);
  var username=data.reqBody.username;
  if(username&&username!=null){
    username={'username':data.reqBody.username}
  }else{
    username={};
  }
	articletype.find(username,null,{sort:{"createTime":-1}},function(e, docs) {
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