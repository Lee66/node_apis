angular.module('controllers', [])
//火车票
.controller('TicketCtrl', function($scope, $r, $ionicActionSheet, $ionicModal, $state, $cache, $window, validation, $msg) {
  var form = $scope.form = {};
  $r("trainSeach.do").then(function(data){
    form.stationInfo = data.data.resultBean
    console.log(data)
  },function(err){
      console.log(err);
  });
  $scope.$on('$ionicView.enter', function() {
    form.button = true;
    form.seaStatus = true;
    form.outCity ? form.outCity = form.outCity : form.outCity = '上海';
    form.arrCity ? form.arrCity = form.arrCity : form.arrCity = '北京';
    form.outDate = new Date();
    form.trainTime ? form.trainTime = form.trainTime : form.trainTime = '00:00-24:00';
  })
  $scope.getTrainTime = function() {
    $r("trainTimeQuantum.do").then(function(data){
      var trainTime = data.data.resultBean;
      console.log(trainTime)
      var trainTimeList = [];
      for(var keyname in trainTime) {
        var item = trainTime[keyname];
        trainTimeList.push({text: item});
      }
      $ionicActionSheet.show({
        buttons: trainTimeList,
        cssClass: 'trainType',
        buttonClicked:function(index){
          form.trainTime = (this.buttons[index].text).match(/\d{2}:\d{2}-\d{2}:\d{2}/g)[0]
          return true;
        }
      });
    },function(err){
        console.log(err);
    });
  };
  $scope.getTrainType = function(){
    $r("trainType.do").then(function(data){
      var trainType = data.data.resultBean;
      var trainTypeList=[];
      trainTypeList.push({text: '全部车型'})
      for(var keyname in trainType) {
        var item = keyname + "("+trainType[keyname] +")";
        trainTypeList.push({text: item});
      }
      $ionicActionSheet.show({
        buttons: trainTypeList,
        cssClass: 'trainType',
        buttonClicked:function(index){
          form.trainType = this.buttons[index].text
          return true;
        }
      });
    },function(err){
        console.log(err);
    });
  }
  $scope.changeStation = function(){
    var out =  form.outCity,
      arr = form.arrCity;
    form.outCity = arr;
    form.arrCity = out;
  }
  //stationInfo
  $ionicModal.fromTemplateUrl('templates/stationInfo.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.stationInfo = modal;
    form.viewArrBox = ""
    form.viewcount = 1
  });
  $scope.loadMore = function(){
    var viewCount = 65 //91
    for(var i = 65; i < viewCount + form.viewcount; i++){
      form.viewArrBox += String.fromCharCode(i)
    }
    form.viewcount += 1
    // console.log(form.viewcount += 1)
  }
    //rules
  $ionicModal.fromTemplateUrl('templates/rules.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.ruleInfo = modal;
  });
  $scope.showRules = function(){
    $scope.ruleInfo.show();
  }
  $scope.rulesHide = function(){
    $scope.ruleInfo.hide();
  }
  $scope.getStation = function(val){
    $scope.stationInfo.show();
    if (val == 'out') {
      form.out_arr = 'out'
    }else if(val == 'arr'){
      form.out_arr = 'arr'
    }
  }
  $scope.stationHide = function() {
    $scope.stationInfo.hide();
    form.viewcount = 1
    form.viewArrBox = ""
  };
  $scope.backStation = function(val){
    console.log(val)
    var station;
    for (var key in val){
      console.log(key)
      station = key;
      break;
    }
    if (form.out_arr == 'out') {
      form.outCity = station;
    }else if(form.out_arr == 'arr'){
      form.arrCity = station;
    }
    $scope.stationInfo.hide();
    form.viewcount = 1
    form.viewArrBox = ""
    form.seaStation = ""
  }
  $scope.search = function(){
    var trainType;
    if (form.trainType && form.trainType != '全部车型') {
      trainType = form.trainType.substr(form.trainType.length-2,1)
    }else{
      trainType = '1'
    }
    var now = new Date()
    var dateCount = Math.floor((form.outDate - now) / 1000 / 60 / 60 / 24) + 1
    console.log(dateCount)
    if (!form.outDate) {
      $msg('error','请输入出发时间')
    }else if(dateCount >= 60 || dateCount < 0){
      $msg('error','请查询距今60天的车票信息')
    }else{
      var req = {
        'outCity': form.outCity,
        'arrCity': form.arrCity,
        'outDate': form.outDate,
        'trainType': trainType,
        'timeQuantum': form.trainTime
      }
      $cache.setReqTicket('search',req);
      console.log($cache.getReqTicket('search'))
      $state.go('ticketInfo',{reload: true});
    }
  }
  $scope.toOrder = function(){
    $state.go('myOrder',{});
  }
  $scope.$watch("form.seaStation", function(newV, oldV){
    var lg;
    newV  === undefined ? lg = 0 : lg = newV.length;
    if (lg == 0) {
      form.seaStatus = true
    };
  });
  $scope.searchStation = function(){
    if(!form.seaStation){
      $msg('error','请输入地名')
    }else if (!validation.chinese(form.seaStation)) {
      $msg('error','请输入汉字或拼音')
    }else{
      form.seaStatus = false;
      console.log(form.seaStation)
      var req = {
        trainDimInfo: form.seaStation.replace(/\s/g,"")
      }
      $r("trainDimSelect.do",req).then(function(data){
        form.seaData = data.data.resultBean[0]
        console.log(data)
      },function(err){
          console.log(err);
      });
    }
  }
  $scope.backToApp = function() {
    $window.context.quit();
  };
})
//车票信息
.controller('TicketInfoCtrl', function($scope, $r, $cache, $state, _, $dateFormat, $jf, $msg, $ionicScrollDelegate) {
  var form = $scope.form = {};
  var req;
  $scope.$on('$ionicView.enter', function() {
    var req = $cache.getReqTicket('search')
    console.log(req)
    form.date = $cache.getReqTicket('search').outDate
    var load = function(val){
      req.outDate = $dateFormat(val, 2)
      console.log(req)
      $r("trainTicketsSeach.do", req).then(function(data){
        console.log(data)
        form.ticketInfo = data.data.resultBean;
      },function(err){
        console.log(err);
      });
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    }
    load(form.date);
    $scope.get_date = function(val){
      form.dateChange = getDate(val)
      console.log(form.dateChange)
      if (form.dateChange) {
        load(form.dateChange)
      }else{
        $msg('error','请查询距今60天的车票信息')
      }
    }
  })
  $scope.order = function(val1, val2){
    $r("trainTimeCheck.do").then(function(data){
      if (data.data.resultBean.ERROR_CODE == 0) {
        console.log(val2)
        var data = _.merge(val1, val2)
        $cache.setOrderInfo(data);
        $jf.getTokenData().then(function(tokenData){
          var req = {
            userId: tokenData.phone
          }
          $r("contactStatusUpdate.do", req).then(function(data){
            if (data.data.resultBean.ERROR_CODE == 0) {
              $state.go('ticketBooking',{})
            }else{
              $msg('error',data.data.resultBean.ERROR_MSG)
            }
          },function(err){
            console.log(err);
          });
        });
      }else{
        $msg('error',data.data.resultBean.ERROR_MSG)
      }
    },function(err){
       console.log(err);
    })
  }
  function getDate(which) {
    if (typeof(form.date) === "string") {
      form.date =  new Date(form.date);
    };
    var dd = form.date;
    var now = new Date()
    console.log(form.date)
    dd.setDate(dd.getDate() + which);//获取which天后的日期
    var dateCount = Math.floor((dd - now) / 1000 / 60 / 60 / 24) + 1
    if (dateCount < 0 || dateCount >= 60) {
      dd.setDate(dd.getDate() - which)
      return
    }else{
      var y = dd.getFullYear();
      var m = dd.getMonth()+1;//获取当前月份的日期
      var d = dd.getDate();
      return y+"-"+fix(m,2)+"-"+fix(d,2);
    }
  }
  function fix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
  }
})
// 车票预订 
.controller('TicketBookingCtrl', function($scope, $cache, $dateFormat, $jf, $r, $msg, $state, validation) {
  var form = $scope.form = {};
  // $cache.setPassenger('')
  $scope.$on('$ionicView.enter', function() {
    $scope.ticket = $cache.getOrderInfo();
    console.log($scope.ticket)
    var seatArr = [];
    for(var i = 0; i < $scope.ticket.SEAT.length; i++){
      if (parseFloat($scope.ticket.SEAT[i].PRICE) > 0 && parseFloat($scope.ticket.SEAT[i].REMAIN) > 0) {
        seatArr.push($scope.ticket.SEAT[i])
      }
    }
    if (seatArr.length >= 2) {
      for(var i = 0; i < seatArr.length; i++){
        if (seatArr[i].NAME== '无座') {
          form.seatSelect = false
        }
      }
    };
    load()
  })
  $scope.delPas = function(item){
    var checked;
    item.CHECKED === 'false' ? checked = true : checked = false;
    $jf.getTokenData().then(function(tokenData){
      var req = {
        userId: tokenData.phone,
        cName: item.CNAME,
        // cType: item.CTYPE,
        mobileNo: item.MOBILENO,
        pIdType: item.PIDTYPE,
        pId: item.PID,
        sex: item.SEX,
        cId: item.CID,
        checked: checked
      }
      console.log(req)
      $r("contactUpdate.do", req).then(function(data){
        if (data.data.resultBean.ERROR_CODE == 0) {
          load()
        }else{
          $msg('error',data.data.resultBean.ERROR_MSG)
        }
      },function(err){
        console.log(err);
      });
    });
  }
  var load = function(){
    $jf.getTokenData().then(function(tokenData){
      var req = {
        userId: tokenData.phone
      }
      $r("contactSeach.do", req).then(function(data){
        form.passenger = data.data.resultBean.USER
        form.pasArr = []
        if (form.passenger.length > 0) {
          for(var i = 0; i < form.passenger.length; i++){
            if (form.passenger[i].CHECKED === 'true') {
              var pasDatasReq = {
                passengerid: form.passenger[i].CID,
                passengersename: form.passenger[i].CNAME,
                piaotypename: form.passenger[i].CTYPE,
                passporttypeseidname: form.passenger[i].PIDTYPE,
                passportseno: form.passenger[i].PID,
                // price: form.whichSeat.PRICE,
                // zwname: form.whichSeat.NAME,
                mobile: form.passenger[i].MOBILENO
              }
              form.pasArr.push(pasDatasReq)
            };
          }
        };
        form.pasCount = form.pasArr.length
      },function(err){
        console.log(err);
      });
    })
  }
  $scope.selectPhone = function() {
    // var self = this;
    try {
      window.plugins.ContactChooser.chooseContact(function(contactInfo) {
        if (contactInfo.phoneNumber === "" && contactInfo.displayName === "") {
          $scope.$broadcast("$selectPhone.error");
        }else{
          form.contactPhone = contactInfo.phoneNumber;
          form.contactName = contactInfo.displayName;
        }
        $scope.$broadcast("$ionicView.enter");
      }, function(err){
        $msg('error',err)
      });
    } catch (e) {
      $msg('error','您的系统不支持手机联系人选择')
    }
  };
  $scope.$on('$selectPhone.error', function() {
    $msg('error','选择系统联系人失败')
  })
  $scope.subOrder = function(){
    if(!form.whichSeat){
      $msg('error','请选择座位类型')
    }else if(form.pasCount === 0){
      $msg('error','请添加乘客')
    }else if(!form.contactName){
      $msg('error','请填写联系人姓名')
    }else if(!form.contactPhone){
      $msg('error','请填写联系人号码')
    }else if(!validation.mobile(form.contactPhone)){
      $msg('error','请输入正确的联系人号码')
    }else if(form.whichSeat.REMAIN < form.pasCount){
      $msg('error','此车次类型暂无过多余票')
    }else{
     for(var i = 0; i < form.pasArr.length; i++){
      form.pasArr[i] = _.merge(form.pasArr[i],{price: form.whichSeat.PRICE,zwname: form.whichSeat.NAME})
     }
      $jf.getTokenData().then(function(tokenData){
        var req = {
          userId: tokenData.phone,
          checi: $scope.ticket.TRAIN_NO,
          trainDate:  $scope.ticket.OUTDATE,
          fromStation: $scope.ticket.DEP_STATION,
          toStation: $scope.ticket.ARR_STATION,
          goTime: $scope.ticket.GO_TIME,
          toTime: $scope.ticket.TO_TIME,
          passengers: form.pasArr,
          contactName: form.contactName,
          contactMobileno: form.contactPhone,
          priceAll: form.whichSeat.PRICE * form.pasCount,
          serviceAtm: 10 * form.pasCount
        }
        console.log(req)
        $r("trainTimeCheck.do", req).then(function(data){
          if (data.data.resultBean.ERROR_CODE == 0) {
            $r("order.do", req).then(function(data){
              if (data.data.resultBean.ERROR_CODE == 0) {
                $cache.setOrderInfo('')
                form.whichSeat = undefined
                $state.go('myOrder',{reload: true})
                form = $scope.form = {};
              }else{
                $msg('error',data.data.resultBean.ERROR_MSG)
              }
              console.log(data)
            },function(err){
              console.log(err);
            });
          }else{
            $msg('error',data.data.resultBean.ERROR_MSG)
          }
        },function(err){
          console.log(err);
        });
      })
    }
  }
})
// 乘客列表
.controller('PassengerListCtrl', function($scope, $jf, $r, $cache, $msg, $state, _) {
  var form = $scope.form = {};
  $scope.$on('$ionicView.enter', function() {
    load()
  })
  var load = function(){
    $jf.getTokenData().then(function(tokenData){
      var req = {
        userId: tokenData.phone
      }
      $r("contactSeach.do", req).then(function(data){
        form.passenger = data.data.resultBean
        console.log(form.passenger)
      },function(err){
        console.log(err);
      });
    })
  }
  $scope.choosePas = function(pas, id){
    var checked;
    pas.CHECKED === 'false' ? checked = true : checked = false;
    $jf.getTokenData().then(function(tokenData){
      var req = {
        userId: tokenData.phone,
        cName: pas.CNAME,
        // cType: pas.CTYPE,
        mobileNo: pas.MOBILENO,
        pIdType: pas.PIDTYPE,
        pId: pas.PID,
        sex: pas.SEX,
        cId: pas.CID,
        checked: checked
      }
      console.log(req)
      $r("contactUpdate.do", req).then(function(data){
        if (data.data.resultBean.ERROR_CODE == 0) {
          load()
        }else{
          $msg('error',data.data.resultBean.ERROR_MSG)
        }
      },function(err){
        console.log(err);
      });
    });
  }
  $scope.pasDel = function(item,id){
    $jf.getTokenData().then(function(tokenData){
      var req = {
        userId: tokenData.phone,
        cId: item.CID
      }
      $r("contactDel.do", req).then(function(data){
        if (data.data.resultBean.ERROR_CODE == 0) {
          form.passenger.USER.splice(form.passenger.USER.indexOf(item), 1);
          $msg('success','删除乘客成功')
        }else{
          $msg('error',data.data.resultBean.ERROR_MSG)
        }
      },function(err){
        console.log(err);
      });
    })
  }
  $scope.pasEit = function(val){
    $cache.setPasEdit(val)
    $state.go('passengerEdit',{})
  }
})
// 新增乘客
.controller('PassengerAddCtrl', function($scope, validation, $msg, $jf, $r, $ionicHistory) {
  var form = $scope.form = {};
  form.cardTypeData = [
    { name: '二代身份证' },
    { name: '一代身份证' },
    { name: '港澳通行证' },
    { name: '护照' },
    { name: '台湾通行证' }
  ];
  form.sexData =  [
    { name: '男' },
    { name: '女' }
  ];
  $scope.contactFinsh = function(){
    if (!form.name) {
      $msg('error','请输入乘客姓名')
    }else if(!form.sex){
      $msg('error','请选择性别')
    }else if(!form.phoneNum){
      $msg('error','请输入手机号码')
    }else if(!form.cardType){
      $msg('error','请选择证件类型')
    }else if(!form.cardId){
      $msg('error','请输入证件号')
    }else if(!validation.mobile(form.phoneNum)){
      $msg('error','请输入正确的手机号码')
    }else{
      if ((form.cardType.name == "二代身份证" || form.cardType.name == "一代身份证")  && !validation.idCard(form.cardId)) {
        $msg('error','请输入正确的身份证号')
      }else if (form.cardType.name == "港澳通行证" && !validation.HKMacao(form.cardId)) {
        $msg('error','请输入正确的港澳通行证号')
      }else if (form.cardType.name == "护照" && !validation.passport(form.cardId)) {
        $msg('error','请输入正确的护照号')
      }else if (form.cardType.name == "台湾通行证" && !validation.Taiwan(form.cardId)) {
        $msg('error','请输入正确的台湾通行证号')
      }else{
        $jf.getTokenData().then(function(tokenData){
          var req = {
            userId: tokenData.phone,
            cName: form.name,
            // cType: '成人',
            mobileNo: form.phoneNum,
            pIdType: form.cardType.name,
            pId: form.cardId,
            sex: form.sex,
            checked: "false"
          }
          console.log(req)
          $r("contactInsert.do", req).then(function(data){
            if (data.data.resultBean.ERROR_CODE == 0) {
              $msg('success','添加成功')
              $ionicHistory.goBack();
            }else{
              $msg('error',data.data.resultBean.ERROR_MSG)
            }
          },function(err){
            console.log(err);
          });
        })
      }
    }
  }
})
// 我的订单
.controller('MyOrderCtrl', function($scope,$jf,$r, $state, $ionicHistory, $msg, $interval) {
  var form=$scope.form={}
  var timer;
  var load = function(){
    $jf.getTokenData().then(function(tokenData){
      var req={
        userId:tokenData.phone
      }
      $r("oldOrder.do",req).then(function(data){
        console.log(data);
        if(data.data.resultBean.ERROR_CODE == 0){
          form.contactPerson = data.data.resultBean.DATA;
        }
      },function(err){
        console.log(err);
      })
    })
  }
  $scope.$on('$ionicView.enter', function() {
    timer = $interval(function (){
      load()
    },10000)
    load()
  })
  $scope.payOrder = function(item){
    console.log(item)
    if ((item.STATE == 2 && item.PAY_STATUS == 1) || item.STATE == 3 || item.STATE == 4) {
      $interval.cancel(timer)
      $state.go('orderDetail',{orderId: item.OID},{reload: true})
    }else{
      load()
      $msg('error','请选择未支付、订票成功、待出票等订单进行操作')
    }
  }
  $scope.delOrder = function(val){
    console.log(val)
  }
  $scope.toIndex = function(){
    $interval.cancel(timer)
    $ionicHistory.clearHistory();
    $state.go('ticket',{},{reload: true})
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
  }
})
.controller('PassengerEditCtrl', function($scope, $cache, $r, $jf, validation, $msg, $ionicHistory) {
  var form = $scope.form = {};
  var eleIndex;
  form.cardTypeData = [
    { name: '二代身份证' },
    { name: '一代身份证' },
    { name: '港澳通行证' },
    { name: '护照' },
    { name: '台湾通行证' }
  ];
  form.sexData =  [
    { name: '男' },
    { name: '女' }
  ];
  var result = $cache.getPasEdit();
  switch (result.PIDTYPE) {
    case '二代身份证':
      eleIndex = 0;
      break;
    case '一代身份证':
      eleIndex = 1;
      break;
    case '港澳通行证':
      eleIndex = 2;
      break;
    case '护照':
      eleIndex = 3;
      break;
    case '台湾通行证':
      eleIndex = 4;
      break;
  }
  form.name = result.CNAME
  form.phoneNum = result.MOBILENO
  form.cardId = result.PID
  form.sex = result.SEX
  form.cardType = form.cardTypeData[eleIndex]
  console.log(result)
  $scope.contactFinsh = function(){
    if (!form.name) {
      $msg('error','请输入乘客姓名')
    }else if(!form.sex){
      $msg('error','请选择性别')
    }else if(!form.phoneNum){
      $msg('error','请输入手机号码')
    }else if(!form.cardType){
      $msg('error','请选择证件类型')
    }else if(!form.cardId){
      $msg('error','请输入证件号')
    }else if(!validation.mobile(form.phoneNum)){
      $msg('error','请输入正确的手机号码')
    }else{
      $jf.getTokenData().then(function(tokenData){

        var req = {
          userId: tokenData.phone,
          cName: form.name,
          // cType: '成人票',
          mobileNo: form.phoneNum,
          pIdType: form.cardType.name,
          pId: form.cardId,
          sex: form.sex,
          cId: result.CID,
          checked: ""
        }
        console.log(req)
        $r("contactUpdate.do", req).then(function(data){
          if (data.data.resultBean.ERROR_CODE == 0) {
            $msg('success','修改成功')
            $ionicHistory.goBack();
          }else{
            $msg('error',data.data.resultBean.ERROR_MSG)
          }
        },function(err){
          console.log(err);
        });
      })
    }
  }
})
// 订单详情
.controller('OrderDetailCtrl', function($scope,$jf,$r, $state, $ionicHistory, $msg, $stateParams, $ionicPopup) {
  console.log($stateParams.orderId)
  var form = $scope.form = {};
  var load = function(){
    var req = {
      "oid": $stateParams.orderId
    }
    $r("selectOrderInfo.do",req).then(function(data){
      console.log(data);
      form.data = data.data.resultBean
      var code = data.data.resultBean.TRAININFO
      if (code.STATUS == 2 && code.PAY_STATUS == 1) {
        form.payStatus = true
      }else{
        form.payStatus = false
      }
      if ((code.STATUS == 2 && code.PAY_STATUS == 1) || code.STATUS == 3 || code.STATUS == 4) {
        // do some thing
      }else{
        $ionicHistory.goBack()
      }
    },function(err){
      console.log(err);
    })
  }
  $scope.$on('$ionicView.enter', function() {
    load()
  })
  $scope.delOrder = function(){
    $ionicPopup.alert({
      title:"温馨提示！",
      template:"<div class='text-center'>是否取消订单？</div>",
      buttons:[{
        text:"确认",
        type: "button-calm",
        onTap:function(){
          var req={
            orderid: form.data.ORDERIDINFO.ORDERID
          }
          $r("trainOrderCancel.do",req).then(function(data){
            console.log(data);
            if(data.data.resultBean.ERROR_CODE == 0){
              $ionicHistory.goBack()
            }
          },function(err){
            console.log(err);
          })
          return true;
        }
      },
      {
        text:"取消",
        type: "button-stable",
        onTap:function(){
          return true;
        }
      }]
    });
  }
  $scope.payOrder = function(){
    $ionicPopup.alert({
      title:"温馨提示！",
      template:"<div class='text-center f_s_120b'>车厢信息确认无误？</div>",
      buttons:[{
        text:"确认",
        type: "button-calm",
        onTap:function(){
          var req = {
            "oid": $stateParams.orderId
          }
          $r("selectOrderInfo.do",req).then(function(data){
            console.log(data);
            var code = data.data.resultBean.TRAININFO
            if (code.STATUS == 2 && code.PAY_STATUS == 1) {
              $jf.getTokenData().then(function(tokenData){
                var order = {
                  "merchantId": "0004000021",
                  "merchantName": '火车票订单',
                  "productId": "0000000000",
                  "orderAmt": (parseFloat(form.data.TRAININFO.AMOUNT) * 100) + "",
                  "orderDesc" : tokenData.phone,
                  "orderRemark": "",
                  "orgOrderNo": $stateParams.orderId
                }
                $jf.doPay(order).then(function(data){
                  $ionicHistory.goBack()
                  $msg('error','付款成功')
                },function(err){
                  console.log(err);
                  $msg('error','付款失败')
                });
              },function(err){
                console.log(err)
              })
            }else{
              load()
              $msg('error','此订单状态有所改变')
            }
          },function(err){
            console.log(err);
          })
          return true;
        }
      },
      {
        text:"取消",
        type: "button-stable",
        onTap:function(){
          return true;
        }
      }]
    });
  }
})
;