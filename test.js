// function f1(){
// 　　var n=999;
// 　　nAdd=function(){n+=1}
// 　　function f2(){
// 　　　　console.log(n)
// 　　}
// 　　return f2;
// }
// 　var result=f1();
// 　result(); // 999
// 　nAdd();
// 　result(); // 1000

// function a() { 
//  console.log(i) 
//  for(var i=0;i<3;i++){   //如果换成let 就会报错
//  	console.log(i)
//  }
//  function b() {  console.log(++i); } 
//  return b;
// }
// var c = a();
// c();
// console.log(">>>>>>>>>>>>>>>>>>")
// 执行结果
// undefined
// 0
// 1
// 2
// 4

// function a() { 
//  console.log(i) //i在函数体里定义 也会报错
//  for(let i=0;i<3;i++){
//  	console.log(i)
//  }
//  function b() { var i=0; console.log(++i); }  
//  return b;
// }
// var c = a();
// c();


// function a() { 
// 	let i=5
//  console.log('first:',i) 
//  for(let i=0;i<3;i++){
//  	console.log(i)
//  }
//  function b() {  console.log(++i); } 
//  return b;
// }
// var c = a();
// c();
// console.log(">>>>>>>>>>>>>>>>>>")
// 执行结果
// first: 5
// 0
// 1
// 2
// 6



// function a() { 
// 	i=1
//  console.log(i) 
//  for(let i=0;i<3;i++){
//  	console.log(i)
//  }
//  function b() {  console.log(++i); } 
//  return b;
// }
// var c = a();
// c();
// 执行结果
// 1
// 0
// 1
// 2
// 2



// // 只有function 里定义的变量才是闭包  for只是循环体 if 定义
// function a() { 
//  console.log(i)  //undefined
//  for(var i=0;i<3;i++){  //i累加到3 停止
//  	console.log(i)
//  }
//  (function con(){
//  	var i=1  //重新定义不会修改外层的变量 是闭包
// 	 	console.log('con',++i)
//  })()
//  function b() {   console.log('b',++i); } 
//   console.log('endi',i) 

//  return b;
// }
// var c = a();
// c();
// 执行结果
// undefined
// 0
// 1
// 2
// con 2
// endi 3
// b 4




// function a(){
// 	var result= new Array()
// 	for(var i=0;i<10;i++){
// 		// result[i]=function(num){
// 		// 	return num
// 		// }(i)
// 		//[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]

// 		result[i]=function(){
// 			return i
// 		}
// 		// [ [Function],[Function],[Function],[Function],[Function],[Function],[Function],[Function],[Function],[Function] ]  10
// 		//
// 		// result[i]=function(num){
// 		// 	return function(){
// 		// 		return num
// 		// 	}
// 		// }(i)
// 		// [ [Function],[Function],[Function],[Function],[Function],[Function],[Function],[Function],[Function],[Function] ] 2

// 	}
// 	return result
// }
// var c=a()
// console.log(a(),c[2](2))

// 变量置换
// var a1=1,a2=2,c;
// console.log(a1,a2)
// c=a1;
// a1=a2
// a2=c;
// console.log(a1,a2)


// var person={}
// Object.defineProperty(person,"name",{writable:false,value:"liuyahui"})
// console.log(person.name)
// person.name='123'
// console.log(person.name)


//property
// var person=function(x){
// 	this.x=x
// 	this.name="123"
// 	this.introduct=function(){
// 		console.log("My name is "+this.name,this.x);
// 	}
// }
// var b=function(){
// 	this.abb="345"
// }
// person.prototype.IntroduceChinese=function(){

//   console.log("我的名字是"+this.name);

// };
// // b.prototype = new person()
// var p1=new person(12)
// p1.introduct()
// p1.IntroduceChinese()

// b.prototype=new person() //b的原型指向person

// // b.introduct() 错误方法
// b.prototype.com='com' //相当于给person赋值

// var p2= new b() //创建实例
// p2.introduct()
// person.prototype.name=123
// console.log('p1.name:',p1.name,'p1.abb:',p1.abb,'p1.com:',p1.com,
// 	'abb:',p2.abb,'p2.name:',p2.name,'b.name:',b.name,
// 	'p2.com:',p2.com)


// class point{
// 	constructor(x,y){
// 		this.x=x
// 		this.y=y
// 	}
// 	tosrting(){
// 		return (this.x+'1')
// 	}
// }

// let a= new point(1,2)
// let anw= a.tosrting()
// console.log(anw)
// var length =10
// function fn(){
// 	console.log(this)
// 	console.log(this.length)
// }
// var obj={
// 	length:5,
// 	method:function(fn){
// 		fn()
// 		arguments[0]();
// 	}
// }
// obj.method(fn)


