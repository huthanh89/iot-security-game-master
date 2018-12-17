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
  $scope.updateChatToList = function() {
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

  /** Function to send  the chat */
  $scope.sendChat = function() {
    var msg = $scope.chatMsg;
    $scope.chatMsg = '';
    if (!msg)
        return;
    $scope.appendChat('Me', $scope.chatTo.name, msg);
    ws.send(JSON.stringify({
        type: 'chat',
        to: $scope.chatTo.id,
        msg: msg
    }));
  };

  /** Function to append chat to the chat view */
  $scope.appendChat = function(from, to, msg) {
    var chatDiv = $('#chathistory');
    chatDiv.html(chatDiv.html() + '<br>' + from + ' to ' + to + ': ' + msg);
    $('.chat-history').scrollTop(chatDiv[0].scrollHeight);
  }

  $rootScope.$on('ws:chat', function(event, msg) {
    $scope.appendChat(msg.from, msg.to, msg.msg);
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