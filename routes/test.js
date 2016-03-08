var mongoose = require("mongoose");
 // mongoose.connect("mongodb://localhost/app6");

// 新建一个数据模型
// 参数1：数据表
// 参数2：数据格式
var App6 = mongoose.model("App6", {
	id: Number,
	name: String,
});

exports.connect = function(request, response) {
	mongoose.connect("mongodb://localhost/app6", function(e) {
		if (e) response.send(e.message);
		response.send("connect yes!");
	});
};

exports.insert = function(request, response) {
	var app6 = new App6({
		id: 2,
		name: "liuyahui",
	});
	app6.save(function(e, product, numberAffected) {
		if (e) response.send(e.message);
		var html = "<p>新增的数据为：" + JSON.stringify(product);
		html += "<p>影响的数据量为：" + numberAffected;
		response.send(html);
	});
};
exports.find = function(request, response) {
	App6.find({
		id: 1
	}, function(e, docs) {
		if (e) response.send(e.message);
		var html = "<p> 查询到的数据为：" + JSON.stringify(docs);
		console.log(docs);
		response.send(JSON.stringify(docs));
	});
};
exports.productlist= function(request, response) {
	console.log(request.body);
	App6.find({
		id: 1
	}, function(e, docs) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		// if (e) response.send(e.message);
		var head={'respondata':docs}
		var html = JSON.stringify(head);
		response.send(html);
	});
	// conn.close();
};
exports.update = function(request, response) {
	App6.update({
		id: 1
	}, {
		name: "new admin"
	}, function(e, numberAffected, raw) {
		if (e) response.send(e.message);
		var html = "<p>修改的结果为：" + JSON.stringify(raw);
		html += "<p>影响的数据量为：" + numberAffected;
		response.send(html);
	});
};
exports.remove = function(request, response) {
	App6.remove({
		id: 1
	}, function(e) {
		if (e) response.send(e.message);
		response.send("删除成功");
	});
};
exports.reqpost=function(request, response){
	console.log(request.body);
	console.log('123');
	response.setHeader("Access-Control-Allow-Origin", "*");
	// response.writeHead(200, {'Content-Type': 'text/json;charset=utf-8','Access-Control-Allow-Origin':'*'}); 
	response.send("req成功");
};