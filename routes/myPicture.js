var mongoose = require("mongoose");
var fs = require('fs');
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');
// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var picture = mongoose.model("picture", {
	user:String,
	tirtle: String,
	content:String,
 	type:Object,
	typecode:String,
    img_group:Object,
	createTime:String,
    updateTime:String,
	comment:Object,
	sea:Number,
});

var comments = mongoose.model("piccomments", {
	user:String,
	repayuser:String,
	content: String,
	createTime:String,
    updateTime:String
});

var picturetype = mongoose.model("picturetype", {
	typename:String,
	typecode:String,
	typedes: String,
	img_group:Object,
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
    var app6 = new picture({
      user:data.reqBody.user,
      tirtle: data.reqBody.tirtle,
	  type:data.reqBody.type,
	  typecode:data.reqBody.type.typecode,
      content:data.reqBody.content,
      img_group:data.reqBody.img_group,
      sea:1,
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
		// arr['content']=decodeURI(data.reqBody.content),
    console.log(arr)
    picture.update({
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
		picture.find({
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
		picture.update({
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
  var typecode
  if(data.reqBody.typecode&&data.reqBody.typecode!=null){
    typecode={'typecode':data.reqBody.typecode}
  }else{
    typecode={};
  }
  picture.find(typecode,function(e, docs) {
    totalRecord=docs.length;
    allpage=totalRecord/data.reqBody.numPerPage
    console.log('allpage',allpage,parseInt(allpage),data.reqBody.numPerPage)
    if(allpage>parseInt(allpage)){
      allpage=parseInt(allpage)+1
    }
  });
	picture.find(typecode,null,{skip:skips,limit:limit,sort:{"createTime":-1}},function(e, docs) {
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
	picture.find({
		_id: data.reqBody.id
	}, function(e, docs) {
		console.log(docs);
		if(e){
			respondata={
				"code":"500",
				"message":"exports"
			};
		}else{
			var newSea
			if(docs[0].sea){
				newSea=docs[0].sea+1
			}else{
				newSea=1
			}
			update(data.reqBody.id,newSea).then(function(result){
		       console.log('type result',result)
		       response.send(result);
		    },function(error){
		        response.send(error);
		    });
			respondata={
				"code":"200",
				"message":"exports",
				"data":docs[0]
			};
			response.send(respondata);
			
		}


	});
	function update(id,newSea){
	var q = Q.defer();
    var arr=respon.checknull(data.reqBody)
	arr['sea']=newSea
		// arr['content']=decodeURI(data.reqBody.content),
    console.log(arr)
    picture.update({
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
  picture.find(username,function(e, docs) {
    totalRecord=docs.length;
    allpage=totalRecord/data.numPerPage
    console.log('allpage',allpage,parseInt(allpage),data.numPerPage)
    if(allpage>parseInt(allpage)){
      allpage=parseInt(allpage)+1
    }
  });
	console.log(skips,limit)
	picture.find(username,'_id tirtle info typecode type.typename type.typecode img_group.photopath  createTime',{skip:skips,limit:limit,sort:{"createTime":-1}},function(e, docs) {
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
	picturetype.find({},null,{sort:{"createTime":-1}},function(e, docs) {
		if(e){
			respondata={
          "code":"500",
          "message":"error"
        };
				response.send(respondata)
		}else{
			var picture={}
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
									newcom[i]['picture']=[]
									for(var j=0;j<result.length;j++){
											if(result[j].typecode==com[i].typecode){
												newcom[i]['type']=result[j].type
													newcom[i]['picture'].push(result[j])
												// console.log('com new',com[i].articles)
											}
									}
							}
							console.log(newcom)
		return newcom	
	}
	function getlist(code){
		var q = Q.defer();
		picture.find({},'_id tirtle info typecode type.typename type.typecode img_group.photopath  createTime',{sort:{"createTime":-1}},function(e, docs) {
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
	picture.find({
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
			respondata=docs[0].content
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
	picture.remove({
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
    var app6 = new picturetype({
      typename:data.reqBody.typename,
      typecode:data.reqBody.typecode,
      typedes: data.reqBody.typedes,
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
    console.log(arr)
    picturetype.update({
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
	picturetype.find(username,null,{sort:{"createTime":-1}},function(e, docs) {
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