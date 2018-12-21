//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){
    
  /** Function to append notification to the notification view*/
  $scope.appendNotification = function(from, msg) {
    var notiDiv = $('#notificationhistory');
    notiDiv.html(notiDiv.html() + from + ': ' + msg + '<br>');
    $('.notification-history').scrollTop(notiDiv[0].scrollHeight);
  }

  $rootScope.$on('ws:notification', function(event, msg) {
    $scope.appendNotification(msg.from, msg.to, msg.msg);
    $rootScope.playSound();
  });
  
}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('notification', {
  templateUrl: 'student/components/notification/notification.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//