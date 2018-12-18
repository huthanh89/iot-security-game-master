//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){

  $scope.playerData = {};

  function updatePlayerData(player) {

    var oldPlayer = $scope.playerData[player.id];

    if (oldPlayer) {
        for (var i in player)
            oldPlayer[i] = player[i];
    } else {
        $scope.playerData[player.id] = player;
    }
    $scope.$applyAsync();
  }

  $rootScope.$on('ws:player', function(event, msg) {
    updatePlayerData(msg);
    $rootScope.playSound();
  });

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('players', {
  templateUrl: 'instructor/components/players.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//