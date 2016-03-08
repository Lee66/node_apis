angular.module('train', ['ionic','controllers','ng.lodash','toaster','services','ngCordova.plugins.jfservice','pipe.services'])

.run(function($ionicPlatform, $msg, $rootScope, $ionicPopup, $location, $window, $ionicHistory, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on("network:error", function(){
    $msg('error','网络异常，请稍候重试！')
  });
  $ionicPlatform.registerBackButtonAction(function (e) {
    if ($location.path() == '/ticket') {
      $window.context.quit();
    }else if($location.path() == '/myOrder'){
      $state.go('ticket',{},{reload: true})
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
    }else if ($ionicHistory.backView()){
      $ionicHistory.goBack();
    }
  }, 100);
})
.config(function($ionicConfigProvider){
  $ionicConfigProvider.backButton.text("&nbsp;&nbsp;").previousTitleText(false);
})
// .constant("API_URL", "http://220.248.45.125:8080/Train/interface/");
// .constant("API_URL", "http://192.180.2.97:8080/Train/interface/");
.constant("API_URL", "http://ticket.jfpal.com/");
