//-------------------------------------------------------------------------------//
// Service
//
// Web Socket logic
// ws://game-server.local:8080/player
//-------------------------------------------------------------------------------//

angular.module('gameApp').factory('WebSocketService', function($rootScope){

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
              $rootScope.$broadcast('ws:player', msg);
              $rootScope.$broadcast('ws:teamdata', msg);
          } 
          
          else if (type == 'device') {
              $rootScope.$broadcast('ws:device', msg);
          } 
          
          else if (type == 'started') {
              $rootScope.hideConfig = true;
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
        } catch (e) {}
      };
    }
  }

  return service;
});

//-------------------------------------------------------------------------------//
