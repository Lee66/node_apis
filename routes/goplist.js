var http = require('http');
var fs = require('fs');
var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象
// 监听事件some_event
// emitter.on("some_event", function(){
//   console.log("事件触发，调用此回调函数");
// });
// setTimeout(function(){
//   emitter.emit("some_event");   //触发事件some_event
// },3000);
exports.goplist = function(request, response) {
	var api='192.150.1.156:2016/lastversion';
// var codename='88881';

var reqdate='reqContent='+encodeURI(JSON.stringify(dates));
var options = {
            method: 'get',
            hostname: '192.150.1.156:2016',  
    		port: 2016,  
    		path: '/lastversion',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
            }
};
var req = http.request(options, function (res) {  
    console.log('STATUS: ' + res.statusCode);  
    console.log('HEADERS: ' + JSON.stringify(res.headers));  
    res.setEncoding('utf8');  
    res.on('data', function (chunk) {  
    	var result=JSON.parse(chunk);
        console.log('BODY: ' + chunk);
        var packages={
		  "model_name": codename,
		  "model_version": parseInt(result.docs.version)+1,
		  "info": "this is the wangxin licia",
		  "updatecontent": "add some change",
		};
		fs.writeFile('../'+codename+'/package.json', JSON.stringify(packages),  function(err) {
			   if (err) {
			       return console.error(err);
			   }
		});
    });  
});  
req.write(reqdate);
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
});  
  
req.end();

};