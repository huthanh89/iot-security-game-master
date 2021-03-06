//-------------------------------------------------------------------------------//
// Service
//
// Web Socket logic
// ws://game-server.local:8080/player
//-------------------------------------------------------------------------------//

angular.module('gameApp').factory('WebSocketService', function($rootScope, PlayerData){

  var reconnect = true;
  var url       = 'ws://' + window.location.host + '/instructor'
  var ws        = new WebSocket(url);
  window.ws     = ws;
  
  return {

    connectToWS: function () {

      ws.onopen = function() {};
      
      ws.onclose = function() {
        if (reconnect) {
          setTimeout(function() {
            ws.connectToWS();
          }, 2000);
        }
      };

      ws.onmessage = function(event) {

        try {

          var msg  = JSON.parse(event.data);
          var type = msg['type'];

          if (type == 'player') {
              PlayerData.updatePlayerData(msg);
          } 
          
          else if (type == 'device') {
              $rootScope.$broadcast('ws:device', msg);
          } 
          
          else if (type == 'started') {
              $rootScope.gameStarted = true;
              $rootScope.$broadcast('ws:start', msg);
              $rootScope.$applyAsync();
          } 
          
          else if (type == 'scores') {
              $rootScope.$broadcast('ws:scores', msg);
              $rootScope.$broadcast('ws:chatlist', msg);
              $rootScope.$applyAsync();
          } 
          
          else if (type == 'chat') {
              $rootScope.$broadcast('ws:chat', msg);
          } 
          
          else if (type == 'gameboard') {
              $rootScope.$broadcast('ws:gameboard', msg);
          } 
          
          else if (type == 'internet') {
              $rootScope.internetEnabled = msg.enabled;
              $rootScope.$applyAsync();
          } 
          
          else if (type == 'error') {
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

          } 
          
          else if (type == 'grid') {
              $rootScope.gridData = msg.grid;
              $rootScope.$applyAsync();

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
        
        catch (e) {}

      };
    }
  }

});

//-------------------------------------------------------------------------------//
