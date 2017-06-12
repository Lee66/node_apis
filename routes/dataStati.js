var mongoose = require("mongoose");
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');
var dataStati = mongoose.model("dataStati", {
	user:String,
	host: String,
	ostype:String,
	createTime:String,
	updateTime:String
});

var os = require('os');
var ifaces = os.networkInterfaces();

exports.connect = function(req, resp) {
	var data=JSON.parse(req.body.reqContent);
	var ipAddress;
	var headers = req.headers;
	var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
	forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
	if (!ipAddress) {
	ipAddress = req.connection.remoteAddress;
	}
	console.log(req.headers,"req:",ipAddress,headers['user-agent'])
	var dataSta={
	  user: data.reqBody.wetalks_user,
	  host: ipAddress,
	  ostype:headers['user-agent'],
	}
	create(dataSta).then(function(result){
       console.log('type result',result)
       resp.send(result);
    },function(error){
       resp.send(error);
    });
	// return ipAddress;
};

function create(data){
	var q = Q.defer();
    var app6 = new dataStati({
      user:data.user,
	  host: data.host,
	  ostype:data.ostype,
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


 //文章列表
exports.dataStatiList= function(request, response) {
  console.log(request.body);
  var data=JSON.parse(request.body.reqContent);
  var typecode
  if(data.reqBody.typecode&&data.reqBody.typecode!=null){
    typecode={'typecode':data.reqBody.typecode}
  }else{
    typecode={};
  }
  dataStati.count(typecode, function (err, count) {
  if (err) {
    console.log(err)
  }
  console.log('there are %d jungle adventures', count);
  });
  dataStati.find(typecode,null,{sort:{"createTime":-1}},function(e, docs) {
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

 //文章列表
exports.dataStatiCount= function(request, response) {
  console.log(request.body);
  var data=JSON.parse(request.body.reqContent);
  var typecode
  if(data.reqBody.typecode&&data.reqBody.typecode!=null){
    typecode={'typecode':data.reqBody.typecode}
  }else{
    typecode={};
  }
  dataStati.count(typecode, function (err, count) {
  if (err) {
    console.log(err)
  }
  console.log('there are %d jungle adventures', count);
  var head={
      "code":"200",
      "message":"success",
      "data":count,
  };
  var html = JSON.stringify(head);
  response.send(html);
  });
};