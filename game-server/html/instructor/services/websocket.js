//-------------------------------------------------------------------------------//
// Service
//
// Web Socket logic
// ws://game-server.local:8080/player
//-------------------------------------------------------------------------------//

angular.module('gameApp').factory('WebSocketService', function($rootScope){

  /** Initialize rootScope variables. */
  
  window.rootScope = $rootScope;
  
  $rootScope.teamData = {
    teams:       [],
    players:     [],
    teamPlayers: []
  };
  $rootScope.scoreBoard = [];
  $rootScope.gameboards = {};
  $rootScope.internetEnabled = false;

  var url = 'ws://' + window.location.host + '/instructor'
  var ws = null;
  
  service = {

    connectToWS: function () {

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
          } else if (type == 'device') {
              updateDeviceData(msg);
              $rootScope.playSound();
          } else if (type == 'started') {
              $rootScope.hideConfig = true;
              $rootScope.$applyAsync();
          } else if (type == 'scores') {
              $rootScope.$broadcast('ws:scores', msg);
              $rootScope.$broadcast('ws:chatlist', msg);
              $rootScope.$applyAsync();
          } else if (type == 'chat') {
              $rootScope.$broadcast('ws:chat', msg);
              $rootScope.playSound();
          } else if (type == 'gameboard') {
              $rootScope.gameboards = msg.gameboard;
              $rootScope.chartData = [];
              for (var teamName in $rootScope.gameboards) {
                  var gameboard = $rootScope.gameboards[teamName];
                  $rootScope.chartData.push({ name: gameboard.team, y: gameboard.progress });
              }
              $rootScope.chartData = $filter('orderBy')($rootScope.chartData, "name");
              $rootScope.updateChart();
              $rootScope.$applyAsync();

          } else if (type == 'internet') {
              $rootScope.internetEnabled = msg.enabled;
              $rootScope.$applyAsync();

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
                      rootScope: $rootScope,
                      controllerAs: 'ctrl',
                      windowClass: 'alert-modal-window',
                      size: 'sm',
                      backdrop: 'static'
                  });
              }

          } else if (type == 'grid') {
              $rootScope.gridData = msg.grid;
              $rootScope.$applyAsync();

          } else if (type == 'endgame') {
              var winner = msg['winner'];
              if ($rootScope.loggedInUser.username == winner) {
                  $rootScope.missionCompleted = true;
                  $rootScope.$applyAsync();
              } else {
                  $rootScope.otherMissionCompleted = true;
                  $rootScope.$applyAsync();
              }
          }
        } catch (e) {}
      };
    }
  }

  return service;
});

//-------------------------------------------------------------------------------//
