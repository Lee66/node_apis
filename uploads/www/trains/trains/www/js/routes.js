angular.module('train')
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  //火车票
  .state('ticket', {
    url: "/ticket",
    templateUrl: "templates/ticket.html",
    controller: 'TicketCtrl'
  })
  //车票信息
  .state('ticketInfo', {
    url: "/ticketInfo",
    templateUrl: "templates/ticketInfo.html",
    controller: 'TicketInfoCtrl'
  })
  // 车票预订
  .state('ticketBooking', {
    url: "/ticketBooking",
    templateUrl: "templates/ticketBooking.html",
    controller: 'TicketBookingCtrl'
  })
  // 乘客列表
  .state('passengerList', {
    url: "/passengerList",
    templateUrl: "templates/passengerList.html",
    controller: 'PassengerListCtrl'
  })
  // 新增乘客
  .state('passengerAdd', {
    url: "/passengerAdd",
    templateUrl: "templates/passengerAdd.html",
    controller: 'PassengerAddCtrl'
  })
  // 修改乘客
  .state('passengerEdit', {
    url: "/passengerEdit",
    templateUrl: "templates/passengerEdit.html",
    controller: 'PassengerEditCtrl'
  })
  // 我的订单
  .state('myOrder', {
    url: "/myOrder",
    templateUrl: "templates/myOrder.html",
    controller: 'MyOrderCtrl'
  })
  // 订单详情
  .state('orderDetail', {
    url: "/orderDetail/:orderId",
    templateUrl: "templates/orderDetail.html",
    controller: 'OrderDetailCtrl'
  })
  ;
  $urlRouterProvider.otherwise('/ticket');
});
