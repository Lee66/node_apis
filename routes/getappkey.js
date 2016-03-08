var http = require('http');
var fs = require('fs'); 
var events = require("events");
var emitter = new events.EventEmitter();//创建了事件监听器的一个对象

exports.getAppkey=function(request, response){
var api='http://192.168.1.201:8081/pm-core/prepClientVersion/savePrepClientVersion';
// var codename='88881';
var dates=[];
dates['name']='jfpal';
dates['description']='jfpal';
dates['phonenum']='13162698766';
dates['email']='pm@jfpal.com';
dates['comname']='jfpal';
dates['companyname']='jfpal';
dates['comuphttp']='jfpal';
dates['comhttp']='jfpal';
dates['status']='1';
dates['clientVersion']='3.5.1';
dates['clientType']="02;04";
dates['clientAlias'] =  'iphone;android';
dates['appuser']='jfpal';
dates['updatePath']='jfpal';
dates['isMustUpdate']='0';
dates['updateContent']='jfpal';
dates['versionstatus']='0';
dates['oldVersion']='0';
dates['appPhone']='6238-239123';

var reqdate=encodeURI(JSON.stringify(dates));
var options = {
            method: 'POST',
            hostname: '192.168.1.201',  
    		port: 8081,  
    		path: '/pm-core/prepClientVersion/savePrepClientVersion',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
            }
};
var req = http.request(options, function (res) {  
    console.log('STATUS: ' + res.statusCode);  
    console.log('HEADERS: ' + JSON.stringify(res.headers));  
    res.setEncoding('utf8');  
    res.on('data', function (chunk) {  
        console.log('respone:',chunk);
    	// var result=JSON.parse(chunk);
     //    console.log('BODY: ' + chunk);

		// fs.writeFile('../'+codename+'/package.json', JSON.stringify(packages),  function(err) {
		// 	   if (err) {
		// 	       return console.error(err);
		// 	   }
		// });
    });  
});  
req.write(reqdate);
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
});  
  
req.end();


};
