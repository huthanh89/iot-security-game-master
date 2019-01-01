//------------------------------------------------------------------------------//
// Acquire application module
//------------------------------------------------------------------------------//

var app = angular.module('gameApp');

//-------------------------------------------------------------------------------//
// Main Controller
//-------------------------------------------------------------------------------//

app.controller('studentCtrl', function($scope, $rootScope, WebSocketService) {
    
    // Intialize scope variables

    $scope.waiting = true;

    // TODO: Remove.

    $scope.waiting = false;

    // Function to play beep sound
    //TODO: enable sound for production build.

    $rootScope.playSound = function() {
      //var sound = document.getElementById('play');
      //sound.play();
    }

    $rootScope.teamName = 'asdf';
    $rootScope.playerName = 'asdf';


    // Connect to Web Socket.
    
    WebSocketService.connectToWS();
    
});

//-------------------------------------------------------------------------------//
