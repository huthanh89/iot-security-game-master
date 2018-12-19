//-------------------------------------------------------------------------------//
// Service
//
// Contain Player Data
//-------------------------------------------------------------------------------//

angular.module('gameApp').factory('PlayerData', function($rootScope){

  return {
    playerData = {},
    updatePlayerData: updatePlayerData(player) {

      var oldPlayer = $scope.playerData[player.id];
  
      if (oldPlayer) {
          for (var i in player)
              oldPlayer[i] = player[i];
      } else {
          $scope.playerData[player.id] = player;
      }
      $scope.$applyAsync();
    }
  }

});

//-------------------------------------------------------------------------------//
