var mongoose = require("mongoose");

var fs = require('fs');
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');
// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var article = mongoose.model("talks", {
	user:String,
	tirtle: String,
	content:String,
	createTime:String,
    updateTime:String,
	comment:Object,
});
var comments = mongoose.model("talkcomments", {
	user:String,
	repayuser:String,
	content: String,
	createTime:String,
    updateTime:String
});
var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象

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
      user:data.reqBody.user,
      tirtle: data.reqBody.tirtle,
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
	// console.log(data.reqBody);
	var comment = new comments({
		user:data.reqBody.comment.user,
		repayuser:data.reqBody.comment.repayuser,
		content: data.reqBody.comment.content,
		createTime:new Date().getTime(),
        updateTime:new Date().getTime()
	});
	comment.save(function(e, product, numberAffected) {
		// if (e) response.send(e.message);
		// console.log(product);
		if(product){
			upActicle(product).then(function(result){
			       console.log('type result',result)
			      respondata={
					"code":"200",
					"message":"success"
					};
			       response.send(respondata);
			    },function(error){
			        respondata={
					"code":"500",
					"message":"add commit error"
					};
			 		response.send(respondata);
			    });
			
		}else{
			respondata={
				"code":"500",
				"message":"create commit error"
			};
			response.send(respondata);
		}
		
	});

	function upActicle(product){
		var q = Q.defer();
		var allcommernts=[];
		article.find({
			_id: data.reqBody.id
		}, function(e, docs) {
			if(e){
				respondata={
		            "code":"500",
		            "message":"exports"
		          };
		          q.reject(respondata);
			}else{
				console.log(docs[0].comment);
				if(docs[0].comment){
					allcommernts=docs[0].comment;
				}else{
					allcommernts=[];
				}
				// console.log(allcommernts);
				allcommernts.push(product);
				upcomment(allcommernts).then(function(result){
			       console.log('type result',result)
			      
			       q.resolve(result);
			    },function(error){
			        
			        q.reject(error);
			    });
				
			}
			
		});
		return q.promise;
	}
	function upcomment(allcommernts){
		var q = Q.defer();
		article.update({
				_id: data.reqBody.id
			}, {
				comment:allcommernts
			}, function(e, numberAffected, raw) {
				if(e){
					respondata={
			            "code":"500",
			            "message":"exports"
			          };
					q.reject(respondata);
				}else{
					respondata={
			            "code":"200",
			            "message":"update success"
			          };
					q.resolve(respondata);
				}
				
			});
		return q.promise;
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
    username={'user':data.reqBody.username}
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

//getArticle
exports.ArticleDetail = function(request, response) {
	var data=JSON.parse(request.body.reqContent);
	article.find({
		_id: data.reqBody.id
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
				"message":"exports",
				"data":docs[0]
			};
			response.send(respondata);
			
		}

	});
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





