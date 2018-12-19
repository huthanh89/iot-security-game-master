//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope, $location, PlayerData){

  // Initialize player and team data.

  $scope.playerData = {};
  $scope.teamData = {
    teams:       [],
    players:     [],
    teamPlayers: []
  };

  $scope.$watch(function(){
    return PlayerData.playerData;
  }, function(newVal, oldVal){
    $scope.playerData = newVal;
  });

  $scope.$watch(function(){
    return PlayerData.teamData;
  }, function(newVal, oldVal){
    $scope.teamData = newVal;
  });

  /** Function to start the game .*/
  $scope.start = function() {
    var data = {
        'type': 'start',
        'piCount': 9,
        'teams': [],
        'otherConfig': {
            'cheat': ($location.search().cheat == true)
        }
    };
    let teams = {}
    angular.forEach($scope.teamData.teamPlayers, function(t) {
        if (teams[t.selectedTeam]) {
            teams[t.selectedTeam].players.push(t.id);
        } else {
            teams[t.selectedTeam] = { name: t.selectedTeam, players: [t.id] }
        }
    });

    for (var i in teams)
        data.teams.push(teams[i]);
    ws.send(JSON.stringify(data));
  }

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('start', {
  templateUrl: 'instructor/components/start.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//