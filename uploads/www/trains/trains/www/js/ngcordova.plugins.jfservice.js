(function (ng) {
ng.module('ngCordova.plugins.jfservice', ['ng'])
  .factory('$jf', ['$q', '$window','$timeout','$rootScope', function ($q, $window,$timeout,$rootScope) {
    return {
      onNotification: function (notification) {
        $timeout(function () {
          $rootScope.$broadcast('$jf:notificationReceived', notification);
        });
      },
      getEnv: function(config){
        var q = $q.defer();
        $window.jfservice.getEnv(config,function (resp) {
          q.resolve(resp);
        }, function (error) {
          q.reject(error);
        });
        // var  resp = {
        //     "osType": "android4.1.1",
        //     "transDate": "20150423",
        //     "transLog": "000001",
        //     "transTime": "052206",
        //     "version": "1.0.0"
        // };
        //  q.resolve(resp);
        return q.promise;
      },
      encodeWithRSA: function(account, password){
        var q = $q.defer();
        $window.jfservice.RSAEncode({account: account, password: password}, function(resp){
          q.resolve(resp);
        }, function (error) {
          q.reject(error);
        });
        // q.resolve("encodewithrsa");
        return q.promise;
      },
      digestWithMD5: function(plaintext){
        var q = $q.defer();
        $window.jfservice.MD5Encode(plaintext, function(resp){
          q.resolve(resp);
        }, function (error) {
          q.reject(error);
        });
        // q.resolve("digestWithMD5");
        return q.promise;
      },
      getTokenData: function(data){
        var q = $q.defer();
        $window.jfservice.getTokenData(data, function(resp){
          q.resolve(resp);
        }, function (error) {
          q.reject(error);
        });
        // var resp = {
        //     "mobileSerialNum":  "ec2e7ffd7078afa98a4b099699a186c000000000",
        //     "clientType":       "04",
        //     "phone":            "13022199055",//15121074003 13816443721
        //     "appUser":          "jfpal",
        //     "token":            "0000",
        //     "jfpalVersion":     "3.3.1"
        // };
        // q.resolve(resp);
        return q.promise;
      },
       hideBottombar:function(data){
         var q = $q.defer();
         $window.jfservice.isHiddenTabBar(data, function(resp){
            q.resolve(resp);
          }, function (error) {
            q.reject(error);
          });
         // q.resolve("hide");
         return q.promise;
      },
      //获取参数
      getAppInfo: function(data){
        var q = $q.defer();
          $window.jfservice.spellPacakageParam(data, function(resp){
            q.resolve(resp);
          }, function (error) {
            q.reject(error);
          });
          // var resp = {
          //     "body": {
          //         "sign": "36f9c59d46ad450f84c47f81e10b429c",
          //         "transLogNo": "15",
          //         "transDate": "20151015",
          //         "transTime": "164139"
          //     },
          //     "header": {
          //         "appUser": "jfpal",
          //         "phone": "13022199055",
          //         "userIP": "localhost/127.0.0.1",
          //         "token": "0000",
          //         "mobileSerialNum": "A4888EE7A2E4E8C3C2B5DC92D171B654300000000",
          //         "osType": "android4.4.2",
          //         "version": "3.3.2",
          //         "clientType": "02"
          //     }
          // }
          // q.resolve(resp);
        return q.promise;
      },
      //sign
      getSign: function(data){
        var q = $q.defer();
        $window.jfservice.spellPacakage(data, function(resp){
          q.resolve(resp);
        }, function (error) {
          q.reject(error);
        });
        return q.promise;
      },
      doPay: function(data){
        var q = $q.defer();
        $window.jfservice.doPay(data, function(resp){
          q.resolve(resp);
        }, function (error) {
          q.reject(error);
        });
        return q.promise;
      }
  };
}]);
}(angular));
