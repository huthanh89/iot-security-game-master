//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){

  /** Intialize scope variable for chat view */
  $scope.chatHistory = '';
  $scope.chatMsg = '';
  $scope.chatToList = [{
      id: 'everyone',
      name: 'Everyone'
  }, {
      id: 'notification',
      name: 'Notification'
  }];
  $scope.chatTo = $scope.chatToList[0];

  /** Function to update the chat to the list */
  var updateChatList = function () {
    if ($scope.chatToList.length == 2) {
        $scope.chatToList.push({ disabled: true, id: '__', name: '--' });
        for (var t in $scope.scoreBoard) {
            var team = $scope.scoreBoard[t];
            $scope.chatToList.push({ id: 'team:' + team.name, name: team.name });
        }

        $scope.chatToList.push({ disabled: true, id: '__', name: '--' });
        for (var t in $scope.scoreBoard) {
            var team = $scope.scoreBoard[t];
            for (var p in team.players) {
                var player = team.players[p];
                $scope.chatToList.push({ id: player.id, name: player.name });
            }
        }
    }
  };

  $rootScope.$on('ws:scores', function(event, msg) {
  });
  
}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('chat', {

  templateUrl:  'instructor/components/chat.html',
  controller:    Controller,
  controllerAs: 'ctrl'

});

//------------------------------------------------------------------------------//