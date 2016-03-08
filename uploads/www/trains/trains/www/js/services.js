angular.module('services', ['ionic'])
.factory('$r', function($http, $interface, $rootScope, _, $jf, $q, $msg, $ionicLoading) {
  return function(api, reqbody){
    var q = $q.defer();
    var req = {
      method: 'POST',
      url: $interface.getUrl(api),
      headers: {
          'Content-Type': "application/x-www-form-urlencoded",
      },
      data: 'data='+JSON.stringify(reqbody)
    };
    console.log(req)
    if (api != 'oldOrder.do') {
      $ionicLoading.show({
        // template: '请稍等...'
      });
    };
    $http(req).error(function(err){
      $ionicLoading.hide();
      console.log(err);
      $rootScope.$broadcast("network:error", err);
      q.reject(err);
    }).success(function(data){
      $ionicLoading.hide();
      if(data.respCode == '0000'){
        q.resolve(data);
      }else {
        $msg('error',data.respMsg)
        q.reject(data);
      }
    });
    return q.promise;
  };
})
.factory('$interface', function(API_URL){
  return {
    getUrl: function(api){
      return API_URL + api;
    }
  };
})
// .service('$jfpal', function($q) {
//   this.doPay  = function (order) {
//     var dfd = $q.defer()
//         if( typeof jfpal !== 'undefined' && jfpal && jfpal.jfPay) {
//                 jfpal.jfPay({
//                         "merchantId": "0004000021",
//                         "merchantName": '火车票订单',
//                         "productId": "0000000000",
//                         "orderAmt": (parseFloat(order.orderAmt) * 100) + "",
//                         "orderDesc": order.orderDesc,
//                         "orderRemark": "",
//                         "orgOrderNo": order.orgOrderNo
//         },
//         function () {
//           dfd.resolve();
//         },
//         function (){
//           dfd.reject();
//         }
//       );
//     } else {
//         dfd.reject();
//     }
//     return dfd.promise;
//   }
// })
// error, info, wait, success, warning
.factory('$msg', function(toaster){
  return function (val, msg){
    toaster.pop(val, null, '<ul><li>'+  msg + '</li></ul>', null, 'trustedHtml');
  }
})
.factory("$cache", function(){
  var req_ticket = {},
  req_order = {},
  pasEdit = {}
  return {
    setReqTicket: function(key,val){
        req_ticket[key] = val;
    },
    getReqTicket: function(key){
        return req_ticket[key];
    },
    setOrderInfo: function(val){
        req_order = val;
    },
    getOrderInfo: function(){
        return req_order;
    },
    setPasEdit: function(val){
        pasEdit = val;
    },
    getPasEdit: function(){
        return pasEdit;
    }
  };
})
.factory("$dateFormat", function(){
  return function(date, length){
    if (typeof(date) == 'object') {
      //固定位数
      function fix(num, length) {
        return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
      }
      // 2015-09日期格式化
      function dateFormat(val, length){
        var year = val.getFullYear(),
           month = fix(val.getMonth() + 1, length),
           date = fix(val.getDate(), length)
        return year + '-' + month + '-' + date;
      }
      return dateFormat(date, length)
    }else{
      return date
    }
  };
})
.service("validation", function(){
  // 手机
  this.mobile =function(mobile){
    return (/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile));
  };
  // 数字
  this.number = function(number){
    return(/^[1-9]+\d*$/.test(number));
  };
  // 银行卡ID
  this.bankId = function(bankId){
    return(/^(\d{16}|\d{19})$/.test(bankId));
  };
  // 汉字或拼音
  this.chinese = function(chinese){
    return(/^[\u4e00-\u9fa5]+|[a-zA-Z]+$/.test(chinese));
  }
  // 身份证验证
  this.idCard = function(idCard){
    return(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard));
  }
  // 护照验证
  this.passport = function(passport){
    return(/^([a-zA-Z]{5,17}|[a-zA-Z0-9]{5,17})$/.test(passport));
  }
  // 港澳通行证验证
  this.HKMacao = function(HKMacao){
    return(/^[a-zA-Z]{1}([0-9]{10}|[0-9]{8})$/.test(HKMacao));
  }
  // 台湾通行证验证
  this.Taiwan = function(Taiwan){
    return(/^[a-zA-Z]{1}([0-9]{8}|[0-9]{10})$/.test(Taiwan));
  }
})

.filter('icon_url', function() {
  return function(url) {
    return "./img/public/" + url+"@2x.png";
  };
})
.filter('getKey', function() {
  return function (val) {
    for (var key in val){
      return key;
    }
  };
})
.filter('min2hour', function() {
  return function (val) {
    var h = parseInt(val/60);
    var m = val%60;
    return h + '小时' + m + '分钟'
  };
})
.filter('trainType', function() {
  return function (val) {
    if (val) {
      var type = val.substr(0,1)
      if (type == 'G') {
        type = '高铁'
      }else if(type == 'D'){
        type = '动车'
      }else if(type == 'Z'){
        type = '直达'
      }else if(type == 'K'){
        type = '快速'
      }else if(type == 'T'){
        type = '特快'
      }else if(type == 'C'){
        type = '城际'
      }else{
        type = '普通'
      }
      return type;
    }else{
      return
    }
  };
})
.filter('ticketCount', function() {
  return function (val) {
    if (val <= 50) {
      return val;
    }else if(val > 50){
      return '>50'
    }
  }
})
.filter('orderTime', function() {
  return function (val) {
    var y = val.substr(0, 4);
    var str = '';
    for(var i = 4; i < 8; i = i +2){
      str = str + '-' +val.substr(i, 2);
    }
    return y + str
  }
})
;
