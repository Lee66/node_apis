
// 创建Promise实例p1
var p1 = new Promise(function(resovle, reject){
  setTimeout(function(){
    console.log('hello1');
    // 1秒后修改promise实例的状态为fulfilled
    resolve('hello1');
  },1000);
});
// 订阅p1的执行成功事件处理函数，并创建Promise实例p2
// 该处理函数将立即返回结果
var p2 = p1.then(function(val){
  var newVal = 'hello2';
  console.log(val);
  console.log(newVal);
  return newVal;
})
// 订阅p2的执行成功事件处理函数，并创建Promise实例p3
// 该处理函数返回一个Promise实例，并1秒后该Promise实例的状态转换为rejected
var p3 = p2.then(function(val){
  console.log(val);
  var tmp = new Promise(function(resolve, reject){
     setTimeout(function(){
       reject(new Error('my error!'));
     }, 1000);
  });
  return tmp;
});
// 订阅p3的执行成功事件处理函数，并创建Promise实例p4
// 由于p2的处理函数所返回的Promise实例状态为rejected，因此p3的执行成功事件处理函数将不被执行，并且p3没有执行失败事件处理函数，因此会将控制权往下传递给p4的执行失败事件处理函数。
var p4 = p3.then(function(val){
  console.log('skip');
})
//  订阅p4的执行成功事件处理函数，并创建Promise实例p5
var p5 = p4.catch(function(reason){
  console.log(reason);
});

var tests={
	add:function(){
		var restult=[];
		for(var i=0;i<10;i++){
			restult[i]=function (num) {
				return num;
			}(i);
		}	
		return restult;
	},
	show:function(){
		return 1;
	}
};
var test=function(){
	var restult=[];
		for(var i=0;i<10;i++){
			restult[i]=function (num) {
				return num;
			}(i);
		}	
}
var a=tests.add();
console.log(a);

