var config=require('./config.js');
exports.pushdata=function (code,msg,data) {
	var respon={
		'respHead':{
			'code':code,
			'message':msg
		},
		'respBody':{data}
	}
	// return encodeURI(JSON.stringify(respon));
	return respon;
};
exports.reqdata=function (code,msg,data) {
	var requst={
		'reqHead':{
			'code':code,
			'message':msg
		},
		'reqBody':{data}
	}
	return JSON.stringify(requst);
};
exports.loggers=function(msg){
	if(config.appconfig.islog){
		console.log(msg)
	}
};
exports.checknull=function(arr){
  var newarr={}
  for(var p in arr){
      if(arr[p]&&arr[p]!=''&&arr[p]!=null){
        if(typeof(arr[p])=='object'){
            for(var x in arr[p]){
                if(x!=undefined){
                    newarr[p]=arr[p]
                }
            }
        }else{
            newarr[p]=arr[p]
        }
      }
  }
  return  newarr
}
