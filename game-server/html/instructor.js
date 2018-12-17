/** Get the module */
var app = angular.module('gameApp');

/** Angular injections. */
app.controller('instructorCtrl', function($scope, $location, $sce, $rootScope, WebSocketService) {

    /**
     * Dependency injectors:
     * @param $scope    Angular scope
     * @param $uibModal Angular UI modal
     * @param $sce      Angular sce service
     */

    /** Intialize scope variables. */
    window.scope = $scope;
    $scope.teamData = {
        teams: [],
        players: [],
        teamPlayers: []
    };

    $scope.internetEnabled = false;

    /** Intialize scope variables to display this data in Arrange Mission and Player Block */
    $scope.playerData = {};
    $scope.arrangeList = [];

    /** Repeat the for loop for pushing the player data to arrange list */
    for (var i = 0; i < 9; i++) {
        $scope.arrangeList.push({
            playerData:  $scope.playerData,
            missionType: "Webcam",
            device:      "null",
            playerType:  "null"
        });
    }

    /** Function to update the player data
      @param : player to update
     */
    function updatePlayerData(player) {
        var oldPlayer = $scope.playerData[player.id];
        if (oldPlayer) {
            for (var i in player)
                oldPlayer[i] = player[i];
            angular.forEach(scope.teamData.players, function(t, i) {
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

    /** Function to update the mission
      @param : block is selected mission
    */
    $scope.updatePlayer = function(block) {
        return;
        var missionList = $scope.playerData;
        angular.forEach($scope.arrangeList, function(value, key) {
            if (key != block && $scope.arrangeList[block].missionType == value.missionType) {
                missionList = missionList.filter(function(player) { return value.playerType != player });
            }
        });
        $scope.arrangeList[block].playerData = missionList;
    }

    /** Function to update the player
      @param : block is selected player
     */
    $scope.updatePlayerList = function(block) {
        return;
        var missionList = [];
        angular.forEach($scope.arrangeList, function(value, key) {
            if ($scope.arrangeList[block].missionType == value.missionType) {
                missionList.push(value.playerType);
            }
        });
        angular.forEach($scope.arrangeList, function(value, key) {
            if (key != block && $scope.arrangeList[block].missionType == value.missionType) {
                value.playerData = $scope.playerData.filter(function(player) {
                    return missionList.indexOf(player) == -1 || value.playerType == player;
                });
            }
        });
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

    /** Intialize scope variable for update view */
    $scope.hideConfig = false;

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

    /** Function to play beep sound */
    
    $rootScope.playSound = function() {
      var sound = document.getElementById('play');
      sound.play();
    }

    /** web socket logic start here */
    // ws://game-server.local:8080/player
    let url = 'ws://' + window.location.host + '/instructor'
    let ws = null;

    function connectToWS() {
        var toReconnect = true;
        ws = new WebSocket(url);
        window.ws = ws;
        ws.onopen = function() {};
        ws.onclose = function() {
            if (toReconnect) {
                setTimeout(function() {
                    connectToWS();
                }, 2000);
            }
        };
        ws.onmessage = function(event) {
          try {
              var msg = JSON.parse(event.data);
              var type = msg['type'];
              
              if (type == 'player') {
                  updatePlayerData(msg);
                  $rootScope.playSound();
              } 
              else if (type == 'started') {
                  $scope.hideConfig = true;
                  $scope.$applyAsync();
              } 
              
              else if (type == 'internet') {
                  $scope.internetEnabled = msg.enabled;
                  $scope.$applyAsync();

              } else if (type == 'error') {
                  if (msg.code != 'not_instructor_vlan') {
                      alert(msg.msg);
                  } else {
                      toReconnect = false;
                      var template = $('.blocking-modal-template').html();
                      template = template.replace('[[name]]', 'Error').replace('[[description]]', msg.msg);
                      var modalInstance = $uibModal.open({
                          animation: true,
                          template: template,
                          scope: $scope,
                          controllerAs: 'ctrl',
                          windowClass: 'alert-modal-window',
                          size: 'sm',
                          backdrop: 'static'
                      });
                  }

              } else if (type == 'grid') {
                  $scope.gridData = msg.grid;
                  $scope.$applyAsync();

              } else if (type == 'endgame') {
                  var winner = msg['winner'];
                  if ($scope.loggedInUser.username == winner) {
                      $scope.missionCompleted = true;
                      $scope.$applyAsync();
                  } else {
                      $scope.otherMissionCompleted = true;
                      $scope.$applyAsync();
                  }
              }
          } catch (e) {}
        };
    }

    // Connect to Web Socket.

    WebSocketService.connectToWS();
    connectToWS();
    /** web socket logic ends here */
});



/** User Form logic goes here */

/** Angular injections. */
app.controller('formCtrl', ['$scope', function($scope) {

    /**
     * Dependency injectors .
     * @param $scope Angular scope     
     */

    /** Initialize scope variables. */
    $scope.registerUser = false;

    /** Function to show register button */
    $scope.showRegister = function() {
        $scope.registerUser = $scope.registerUser ? false : true;
    }
}])

/** User Form logic ends here */