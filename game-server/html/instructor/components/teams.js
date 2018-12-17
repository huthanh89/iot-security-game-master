//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope, $location){

  $scope.playerData = {};
  $scope.teamData = {
    teams: [],
    players: [],
    teamPlayers: []
  };

  function updatePlayerData(player) {
    var oldPlayer = $scope.playerData[player.id];
    if (oldPlayer) {
        for (var i in player)
            oldPlayer[i] = player[i];
        angular.forEach($scope.teamData.players, function(t, i) { 
            if (t.id == player.id) {
                t = player;
            }
        });
    } else {
        $scope.playerData[player.id] = player;
        $scope.teamData.players.push(player);
    }
    $scope.$applyAsync();
  }

  /** Function to move the selected players to right(Team Players)*/
  $scope.moveRight = function() {
    var filterList = $scope.teamData.teams.filter(function(t, id) {
        return t.isSelected;
    });
    if (filterList.length > 1) {
        return;
    }
    var selectedList = [];
    var unSelectedList = [];
    angular.forEach($scope.teamData.players, function(team) {
        if (team.isSelected) {
            team.isSelected = false;
            team.selectedTeam = filterList[0].name;
            selectedList.push(team);
        } else {
            unSelectedList.push(team);
        }
    });
    $scope.teamData.players = unSelectedList;
    $scope.teamData.teamPlayers = $scope.teamData.teamPlayers.concat(selectedList);
  };

  /** Function to move the selected team players toleft(Players) */
  $scope.moveLeft = function() {
      var selectedList = [];
      var unSelectedList = [];
      angular.forEach($scope.teamData.teamPlayers, function(team) {
          if (team.isSelected) {
              team.isSelected = false;
              team.selectedTeam = '';
              selectedList.push(team);

          } else {
              unSelectedList.push(team);
          }
      });
      $scope.teamData.teamPlayers = unSelectedList;
      $scope.teamData.players = $scope.teamData.players.concat(selectedList);
  }

  /** Function to select a player for moving team player list */
  $scope.selectPlayer = function(team) {
      var filterList = $scope.teamData.teams.filter(function(t, id) {
          return t.isSelected;
      });
      if (!team.isSelected && filterList.length != 1) {
          var text = filterList.length > 1 ? "Please select single team to rename" : "Please Select Team";
          alert(text);
      } else {
          team.isSelected = !team.isSelected;
      }
  }

  /** Function to  unselect all teams*/
  $scope.unselectAll = function(team) {
      angular.forEach($scope.teamData.teams, (function(t, id) {
          if (team.name != t.name) {
              t.isSelected = false;
          }
      }));
      if (!team.isSelected) {
          team.isSelected = true;
          $scope.selectedTeam = team.name;
      } else {
          team.isSelected = false;
          $scope.selectedTeam = '';
      }

  }

  /** Function to add team*/
  $scope.addTeam = function() {
      if ($scope.teamText) {
          var filterList = $scope.teamData.teams.filter(function(t) {
              return t.name == $scope.teamText;
          })
          if (filterList.length == 0) {
              $scope.teamData.teams.push({ name: $scope.teamText, id: $scope.teamText });
          } else {
              alert("This Name has already taken Please Enter new Name");
          }
          $scope.teamText = '';
      } else {
          alert("Enter Team Name");
      }
  }

  /** Function to update team*/
  $scope.updateTeam = function(team) {
      if (!team.isEdit) {
          team.isEdit = !team.isEdit;
          return;
      }
      var filterList = $scope.teamData.teams.filter(function(t) {
          return t.name == team.name;
      })
      if (filterList.length > 1) {
          team.name = '';
          alert("Dulplicate Team name");
          return;
      }
      angular.forEach($scope.teamData.teamPlayers, function(tp) {
          if (tp.selectedTeam == team.id) {
              tp.selectedTeam = team.name;
          }
      });
      team.id = team.name;
      team.isEdit = !team.isEdit
  }

  /** Function to remove team */
  $scope.removeTeam = function(team, index) {
      var selectedList = [];
      var unSelectedList = [];
      angular.forEach($scope.teamData.teamPlayers, function(tp) {
          if (team.name == tp.selectedTeam) {
              tp.selectedTeam = '';
              selectedList.push(tp);
          } else {
              unSelectedList.push(tp);
          }
      });
      $scope.teamData.players = $scope.teamData.players.concat(selectedList);
      $scope.teamData.teamPlayers = unSelectedList;
      $scope.teamData.teams.splice(index, 1);
  }

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

  $rootScope.$on('ws:teamdata', function(event, msg) {
    updatePlayerData(msg);
  });

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('teams', {
  templateUrl: 'instructor/components/teams.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//