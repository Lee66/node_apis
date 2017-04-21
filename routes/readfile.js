var fs = require('fs'); 
var events = require("events");
var Q= require('q');
var join = require('path').join;

exports.readfil=function(request, response){
	var path = './img'
	function getcontent(path){
		var q = Q.defer();
		var tmp=[]
		fs.readdir(path, function(err, files){
	    //err 为错误 , files 文件名列表包含文件夹与文件
	    if(err){
	        console.log('error:\n' + err);
	        return;
	    }
		var files=fs.readdirSync(path);
		files.forEach(function(file){
		var fPath=join(path,file);
        var stats=fs.statSync(fPath);
        if(stats.isDirectory()){                 
                // 如果是文件夹遍历
            getcontent(fPath).then(function(result){
            	var obj={
                    "name":file,
                    "type":"dir",
                    "content":result
	            }
	            console.log(obj)
	            tmp.push(obj)
            },function(error){
            	console.log(obj)
            });
            
        }else{
            // 读出所有的文件
            var obj={
                "name":file,
                "type":"file"
            }
            // console.log(obj)
           tmp.push(obj)
        } 
        
    	});
    	q.resolve(tmp);
	})
    	return q.promise;

	}

	getcontent(path).then(function(result){
		console.log(result)
		fs.writeFile('./result.json', result,  function(err) {
               if (err) {
                   return console.error(err);
               }
         });
	})

}

exports.getphoto=function(request, response){
  console.log(request.params.photopath);
  var photoname=request.params.photoname;
  var photopath=request.params.photopath;
  var filePath='./img/'+photopath+'/'+photoname;

  response.sendfile(filePath);
}
