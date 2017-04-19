var property=localStorage.property
// 对象结构 property={ start: 1491782400000-24*60*60*1000, end: 1491868800000-24*60*60*1000, key: 0 }

function fix(num, length) {
      return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}


function getStartAndEnd(data){
        var date = new Date(data)
        var dateStr=Date.parse(date)
        return {'start':dateStr,'end':dateStr+24*60*60*1000}
}

function pushLocal(value){
		localStorage.property=value
}

function charge(){
	var timestamp=new Date().getTime()
	var dd = new Date()
    var y = dd.getFullYear();
	var m = dd.getMonth() + 1;
	var d = dd.getDate()
	var today=y + '-' + fix(m,2) + '-' + fix(d,2)
	var todayStr=getStartAndEnd(today)
	console.log(property)
	if(property&&property.end){
		if(timestamp>=property.start&&timestamp<=property.end){
			return property.key
		}else if(timestamp>property.end){
			property.key+=2
			todayStr.key=property.key
			pushLocal(todayStr)
			return todayStr.key
		}
	}else{
		todayStr.key=0
		pushLocal(todayStr)
		return 0
	}

}


var key=charge()
console.log(property)
console.log('key',key)