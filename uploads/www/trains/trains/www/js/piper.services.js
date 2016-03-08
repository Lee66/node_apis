angular.module('pipe.services', ['ionic'])
.factory('$r_xml', function($http, $rootScope, _, $jf, $q, $pipe){
  return function (api, reqbody){
    var q = $q.defer();
    // 拼请求头  env + token + api
    // 拿token信息
    $jf.getAppInfo().then(function (data){
      // data.header
      // data.body
      console.log(data)
      var reqhead = {
        "reqHead": {
          "application": api,
        }
      };
      reqhead.reqHead = _.merge(reqhead.reqHead, data.header);
      reqbody = _.merge(reqbody, data.body)
      // 拼请求体
      var reqbean = {
        "reqBean": reqbody
      };
      var msg = _.merge(reqhead, reqbean);
      console.log(msg)
      var xmlRequst = $pipe.request(msg)
      console.log(xmlRequst);
      // sign change true
      $jf.getSign(xmlRequst).then(function (reqData){
        // req xml string
        var req = {
          method: 'POST',
          url: 'https://mfront.jfpal.com:443/unifiedAction.do',//生产
          // url: 'https://mfront.jfpal.com:5557/unifiedAction.do',//准生成
          headers: {
              'Content-Type': "application/x-www-form-urlencoded",
          },
          data: reqData
        };
        console.log(reqData)
        $http(req).error(function(err){
              console.log(err);
              $rootScope.$broadcast("network:error", err);
              q.reject(err);
            }).success(function(data){
              console.log("success====>" + data + "success")
               var data = $pipe.response(data)
            });
      }, function(err){
        q.reject(err);
      })
    }, function(err){
      q.reject(err);
    });
    return q.promise;
  }
})
.factory('$format', function (){
  return {
    xml2json: function(str){
      var arr = str.split('\<\/');
      var arr_new = [];
      for(i = 0; i <arr.length - 1; i++){
        var keyname = arr[i].replace(/(.*)<(.*)>(.*)/g,"$2");
        var m = arr[i].indexOf(keyname) + keyname.length + 1;
        var n = arr[i].length;
        var keyvalue = arr[i].substr(m,n);
        arr_new[keyname] = keyvalue;
      }
      var json = {};
      for (var key in arr_new) {
        json[key] = arr_new[key]
      }
      return json
    }
  };
})
.factory('$pipe', function ($format, _){
  return {
    request: function(json){
      var reqHead_str = '';
      var request_str = '';
      for(var keyname in json.reqHead) {
        var val = json.reqHead[keyname];
        reqHead_str = reqHead_str + ' ' +keyname + '="' + val + '"'
      }
      reqHead_str = '<JFPay' + reqHead_str +'>'
      if (json.reqBean != undefined && typeof(json.reqBean) === 'object' && json.reqBean) {
        var hasProp = false;
        for (var prop in json.reqBean){
          hasProp = true;
          break;
        }  
        if (hasProp){
          var reqBean_str = '';
          for(var keyname in json.reqBean) {
            var val = json.reqBean[keyname];
            reqBean_str = reqBean_str + '<' + keyname + '>' + val + '</' + keyname + '>'
          }
          request_str = reqHead_str + reqBean_str;
        }else{
          request_str =  reqHead_str;
        }
        return request_str + '</JFPay>'
      }
    },
    response: function(xml){
      // xml
      var xml = xml.substr(xml.indexOf("\<JFPay"), xml.length - xml.indexOf("\<JFPay"));

      var dataIndex = xml.indexOf("\<data\>")
      var resultData;
      var dataXml;
      if (dataIndex != -1) {
        dataXml = xml.substr(dataIndex, xml.indexOf("\<\/data\>") - dataIndex + 7);
        resultData = eval("(" + dataXml.replace(/(.+)\<\!\[CDATA\[(.+)\]\](.+)\>/g,"$2") + ")")
      }else{
        dataXml = ""
      }
      var resultHead = xml.replace(dataXml,"")
      var userInfo = resultHead.substr(resultHead.indexOf(">") + 1,resultHead.indexOf("<\/JFPay>") - (resultHead.indexOf(">") + 1))
      var appInfo = resultHead.substr(resultHead.indexOf("\<JFPay") + 7,resultHead.indexOf("\>") - 7)

      userInfo = $format.xml2json(userInfo)
      appInfo = eval("(" + "{" + appInfo.replace(/\s+/g,',').replace(/\=/g,":") + "}" + ")")

      var response = {
        "respHead": appInfo,
        "respBean": _.merge(userInfo, resultData)
      }

      return response
    }
  };
})
;
