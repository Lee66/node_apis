var mongoose = require("mongoose");
var EmailList = mongoose.model("EmailList", {
	owner:String,
	email:String,
	createTime:String,
	updateTime:String,
});
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


exports.sendEmail=function(request, response){
	// create reusable transporter object using SMTP transport
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
	    to: 'liuyahui991@gmail.com, liuyahui@jfpal.com', // list of receivers
	    subject: 'Hello ✔', // Subject line
	    text: 'Hello world ✔', // plaintext body
	    html: '<b>Hello world ✔</b>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);

	});
	
};

exports.sendSMTPmail= function(request, response){
	// 开启一个 SMTP 连接池
var transport = nodemailer.createTransport(smtpTransport({
	 host: "smtp.exmail.qq.com", // 主机
	 secure: true, // 使用 SSL
	 secureConnection: true, // 使用 SSL
	 port: 465, // SMTP 端口
	 auth: {
	  user: "liuyahui@jfpal.com", // 账号
	  pass: "lyh123" // 密码
	 }
	}));
	// 设置邮件内容
	var mailOptions = {
	 from: "liuyahui@jfpal.com", // 发件地址
	 to: "690385384@qq.com,cl@jfpal.com", // 收件列表
	 subject: "Hello world", // 标题
	 text:"hello",
	 html: "<b>thanks a for visiting!</b> 世界，你好！邮件测试" // html 内容
	}
	// 发送邮件
	transport.sendMail(mailOptions, function(error, response) {
	 if (error) {
	  console.error(error);
	 } else {
	  console.log(response);
	 }
	 transport.close(); // 如果没用，关闭连接池
	});
}