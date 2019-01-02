//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){
  
  $scope.enableInternet = $rootScope.internetEnabled;

  $scope.ok = function() {
    ws.send(JSON.stringify({
      type: 'internet',
      enable: $scope.enableInternet
    }));
  }

  console.log('------------------');

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('locked', {
  templateUrl: 'student/components/modal/locked.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//