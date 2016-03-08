var mongoose = require("mongoose");
var fs = require('fs'); 
exports.getone=function(request, response) {
//	console.log(request.params.id);
	response.send(request.params.id);
	var a={};
	a.name='tom';
	a.obe=function(){
		var b=0;
		b=b+1;
		console.log(b);
	};
	
	function People(name)
	{
	  this.name=name;
	  console.log(this.name);
	  //对象方法
	  this.Introduce=function(){
	    console.log("My name is "+this.name);
	  };
	}
	//类方法
	People.Run=function(){
	  console.log("I can run "+this.name);
	};
	//原型方法
	People.prototype.IntroduceChinese=function(){
	  console.log("我的名字是"+this.name);
//	  this.Introduce();
	};
	
	//prototype的意义在于,向构造函数里直接加入方法.也可以理解为继承
	//直接调用构造函数
	People("liuya");
	People.name='xiaomi';
	//People.Introduce();无法直接调用构造函数里边的私有方法，必须重新new
	//People.IntroduceChinese();也无法直接调用prototype过的方法
	People.Run();//构造函数体外定义反复.
	
	//测试
	var p1=new People("Windking");
	p1.name='xiaomi';
	p1.Introduce();
//	p1.Run();new的新对象无法直接调用没有prototype的方法.
	
	p1.IntroduceChinese(); //定义时使用prototype
	
	var p2=People("liuyahui");//这样是直接调用构造函数方法，但是构造函数里边的属性和方法不能被调用
//	console.log('p2'+p2.name);
//	p2.Introduce();
	console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
	
	
	function extendClass()
	{
	    this.showMsg =function()
	    {
	        console.log("extendClass::showMsg");
	    }
	}
	extendClass.prototype=new People();
	//错误调用方法
	//	extendClass.Run();
	//	extendClass.Introduce();
	var b2=new extendClass();
	b2.name='b2';
	//	b2.Run();错误调用
	b2.Introduce();
	b2.showMsg();
	b2.IntroduceChinese();

};
exports.getdownload=function(request, response){
//	fs.readFile('./public/show.txt', 'utf-8',function(err, data) { 
//	if(err) { 
//		console.error(err); 
//	} else{ 
//		console.log(data); 
//	} 
//}); 
	response.download("./public/001.png", 'show.png', function(err){
  	if (err) {
    // handle error, keep in mind the response may be partially-sent
     	response.send('download faild');
  	} else {
    // decrement a download credit etc
		response.send('download success');
  	}
	});
};
exports.testfun=function(request, response) {
	function create(){
		var result=new Array();
		for(var i=0;i<10;i++){
			// result[i]= add(i);
			result[i]=function(i){
				console.log(i);
				return i;
			};
			console.log(result[i]);
		};
		return result;
	};
	function add(i){
		return i+1;
	}
	var resp=create();
	 response.send(resp);
	//  function create(){
	// 	var result=new Array();
	// 	for(var i=0;i<10;i++){
	// 		result[i] =  function(num){
	// 			return function(){
	// 				return num;
	// 			};
	// 		}
	// 		console.log(result[i]);
	// 	};
	// 	console.log(result);
	// 	return result;
	// };

};