//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, PlayerData){

  $scope.playerData = {};

  $scope.$watch(function(){
    return PlayerData.playerData;
  }, function(newVal, oldVal){
    $scope.playerData = newVal;
  });
}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('players', {
  templateUrl: 'instructor/components/players/players.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//