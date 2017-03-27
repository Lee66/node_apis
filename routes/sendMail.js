var mongoose = require("mongoose");
var path = require('path');
var Q= require('q');
var respon=require('./respon.js');
var config=require('./config.js');

var EmailList = mongoose.model("EmailList", {
	name:String,
	email:String,
	phone:String,
	content:String,
	createTime:String,
	updateTime:String,
});

var EmailLog = mongoose.model("EmailLog", {
	from:String,
	toemail:String,
	content:String,
	createTime:String,
	updateTime:String,
});

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


exports.sendEmail=function(request, response){
	// create reusable transporter object using SMTP transport
 console.log(request.body.reqContent);
	var data=JSON.parse(request.body.reqContent);
	var tirtle=data.reqBody.tirtle
	var toEmail=data.reqBody.toEmail
	var content=data.reqBody.content
	var transporter = nodemailer.createTransport({
	    // service: 'Gmail',
	    service: 'qq',
	    port: 465, // SMTP 端口
	    secureConnection: true,
	    auth: {
	        user: '690385384@qq.com',
	        pass: 'yiugauppxdwubcgd'
	    }

	});
	// NB! No need to recreate the transporter object. You can use
	// the same transporter object for all e-mails

	var mailOptions = {
	    from: '690385384@qq.com', // sender address
	    to: toEmail, // list of receivers
	    subject: tirtle, // Subject line
	    text: 'Hello world ✔', // plaintext body
	    html: content // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
		 createLog(mailOptions.from,toEmail,content).then(function(result){
			console.log('type result',result)
			response.send(result);
		},function(error){
			response.send(error);
		});
		var head={
			"code":"200",
			"message":"success",
		};
		var html = JSON.stringify(head);
		response.send(html);
	});
	
};

exports.sendSMTPmail= function(request, responseEd){
	// 开启一个 SMTP 连接池
	 console.log(request.body.reqContent);
	var data=JSON.parse(request.body.reqContent);
	var tirtle=data.reqBody.tirtle
	var toEmail=data.reqBody.toEmail
	var content=data.reqBody.content
	var transport = nodemailer.createTransport(smtpTransport({
		host: "smtp.exmail.qq.com", // 主机
		secure: true, // 使用 SSL
		secureConnection: true, // 使用 SSL
		port: 465, // SMTP 端口
		auth: {
		user: "frontend@jfpal.com", // 账号
		pass: "JFpal888" // 密码
		}
	}));
	// 设置邮件内容
	var mailOptions = {
	 from: "frontend@jfpal.com", // 发件地址
	 to: toEmail, // 收件列表
	 subject: tirtle, // 标题
	 text:"hello",
	 html: content // html 内容
	}
	// 发送邮件
	transport.sendMail(mailOptions, function(error, response) {
		if (error) {
			console.error(error);
			var head={
						"code":"500",
						"message":error,
			};
			responseEd.send(head);
		} else {
			console.log(response);
			createLog(mailOptions.from,toEmail,content).then(function(result){
				console.log('type result',result)
			},function(error){
			});
			var head={
					"code":"200",
					"message":"success",
				};
				responseEd.send(head);
		}
		transport.close(); // 如果没用，关闭连接池
		
	});
}


 function createLog(from,toemail,content){
	 var q = Q.defer();
    var app6 = new EmailLog({
	 from:from,
	toemail:toemail,
      content:content,
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
//创建文章类型
exports.createEmail=function(request, response){
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
    var app6 = new EmailList({
	 name:data.reqBody.name,
	 email:data.reqBody.email,
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
    EmailList.update({
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
exports.EmailList= function(request, response) {
	console.log(request.body);
		var data=JSON.parse(request.body.reqContent);
	EmailList.find({},null,{sort:{"createTime":-1}},function(e, docs) {
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


// 删除应用
exports.removeMail=function(request, response){
  respon.loggers(request.body);
  var data=JSON.parse(request.body.reqContent);
  EmailList.remove({
    _id: data.reqBody.id
  }, function(e) {
    console.log(e);
    // if (e) response.send(e.message);
    // response.setHeader("Access-Control-Allow-Origin", "*")
    if(e){
        var respondata={
          "code":"500",
          "message":"error"
        };
          response.send(respondata);
      }else{
        var respondata={
          "code":"200",
          "message":"success",
        };
        response.send(respondata);
        // respon.pushdata("0000","success")
      }
    
    response.send(respondata);
  });
}