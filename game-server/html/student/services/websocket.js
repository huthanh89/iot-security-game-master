//-------------------------------------------------------------------------------//
// Service
//
// Web Socket logic
// ws://game-server.local:8080/player
//-------------------------------------------------------------------------------//

angular.module('gameApp').factory('WebSocketService', function($rootScope, $location){

  var reconnect = true;
  var url       = 'ws://' + window.location.host + '/player'
  var ws        = new WebSocket(url);
  window.ws     = ws;
  
  return {

    connectToWS: function () {

      ws.onopen = function() {

        // TODO: remove debug
        $rootScope.playerName = 'sally';

        var name = $rootScope.playerName;
        while (name == null || name == "") {
            name = prompt("Name:");
        }
        $rootScope.playerName = name;

        ws.send(JSON.stringify({
            type: 'login',
            name: name,
            ip: $location.search().ip
        }));

        $rootScope.$applyAsync();
      };

      ws.onclose = function() {
          setTimeout(function() {
              connectToWS();
          }, 2000);
          $rootScope.$applyAsync();
      };
      ws.onmessage = function(event) {
          try {

              var msg = JSON.parse(event.data);
              var type = msg['type'];
            
              if (type == 'login') {
                  $rootScope.playerId = msg.id;
                  $rootScope.teamName = null;
              } 
              
              else if (type == 'chat') {
                $rootScope.$broadcast('ws:chat', msg);
              } 
              
              else if (type == 'started') {
                  $rootScope.waiting = false;;
                  $rootScope.$applyAsync();
                  $rootScope.playSound();
                  introJs().start()
              } 
              
              else if (type == 'scores') {
                  if (JSON.stringify(getScores($rootScope.scoreBoard)) != JSON.stringify(getScores(msg.scores))) {
                      $rootScope.playSound();
                  }

                  $rootScope.scoreBoard = msg.scores;
                  $rootScope.updateChatToList();
                  $rootScope.$applyAsync();
              } 
              
              else if (type == 'gameboard') {
                  $rootScope.gameboard = msg.gameboard[$rootScope.teamName];
                  for (var id in $rootScope.gameboard.missions) {
                      var mission = $rootScope.gameboard.missions[id];
                      var missionView = $rootScope.gameboardView.data.missions[id];
                      if (missionView) {
                          if (!mission.unlocked) {
                              missionView.extraStyle = 'fillColor=' + LOCKED_COLOR;
                          } else if (mission.done) {
                              missionView.extraStyle = 'fillColor=' + COMPLETED_COLOR;
                          } else if (mission.playerName) {
                              missionView.extraStyle = 'fillColor=' + IN_PROGRESS_COLOR;
                          } else {
                              missionView.extraStyle = 'fillColor=' + UNLOCKED_COLOR;
                          }
                      }
                  }
                  var levelNum;
                  for (levelNum = 0; levelNum < $rootScope.gameboard.currentRing; levelNum++) {
                      $rootScope.gameboardView.data.levels[levelNum].extraStyle = 'strokeColor=' + COMPLETED_COLOR;
                  }
                  if ($rootScope.gameboardView.data.levels[levelNum])
                      $rootScope.gameboardView.data.levels[levelNum].extraStyle = 'strokeColor=' + IN_PROGRESS_COLOR;

                  $rootScope.gameboardView.view.refresh();

                  $rootScope.$applyAsync();
              } 
              
              else if (type == 'stateData') {
                  $rootScope.missionContent = $sce.trustAsHtml(msg.text);

                  $rootScope.currentTools = [];
                  for (var i in msg.tools) {
                      var tool = msg.tools[i];
                      $rootScope.currentTools.push($rootScope.tools[tool]);
                  }

                  $rootScope.selectedMission = $rootScope.gameboard.missions[msg.missionId];
                  if (!$rootScope.missionContentShown) {
                      $rootScope.missionContentShown = true;
                      var modalInstance = $uibModal.open({
                          animation: true,
                          scope: $rootScope,
                          templateUrl: './missionModel.html',
                          controller: function($uibModalInstance) {
                              $ctrl = this;
                              $ctrl.showContent = true;
                              $ctrl.ok = function() {
                                  $uibModalInstance.dismiss('ok');
                                  $rootScope.missionContentShown = false;
                              };

                              $ctrl.cancel = function() {
                                  $uibModalInstance.dismiss('cancel');
                                  $rootScope.missionContentShown = false;
                              };

                              $ctrl.close = function() {
                                  $uibModalInstance.close('saved');
                                  $rootScope.missionContentShown = false;
                              }

                          },
                          controllerAs: 'ctrl',
                          windowClass: 'mission-modal-window',
                          size: 'sm',
                          backdrop: false
                      });

                      modalInstance.result.then(function(response) {}, function() {});
                  }
                  $rootScope.$applyAsync();
                  $timeout(function() {
                      $('.disable-answers-true input').prop('disabled', true);
                      $('.disable-answers-true textarea').prop('disabled', true);
                      $('.disable-answers-true button').prop('disabled', true);
                  }, 500);

              } 
              
              else if (type == 'incorrectFlag') {
                  $rootScope.openModal("Error", 'Incorrect Flag');

              } 
              
              else if (type == 'error') {
                  $rootScope.openModal("Error", msg.msg);

              } 
              
              else if (type == 'levelsCompleted') {
                  $rootScope.openModal("Success", 'Congratulations! Your team has completed all levels.');

              } 
              
              else if (type == 'endgame') {
                  var winner = msg['winner'];
                  if ($rootScope.loggedInUser.username == winner) {
                      $rootScope.missionCompleted = true;
                      $rootScope.$applyAsync();
                  } else {
                      $rootScope.otherMissionCompleted = true;
                      $rootScope.$applyAsync();
                  }
              }

          } 
          
          catch (e) {
          
          }

      };

  }

  }
});

//-------------------------------------------------------------------------------//
