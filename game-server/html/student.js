//------------------------------------------------------------------------------//
// Acquire application module
//------------------------------------------------------------------------------//

var app = angular.module('gameApp', ['ui.bootstrap' , 'angular-bind-html-compile']);
//var app = angular.module('gameApp');

//-------------------------------------------------------------------------------//
// Main Controller
//-------------------------------------------------------------------------------//

app.controller('studentCtrl', function($scope, $rootScope, WebSocketService) {
    
    // Initialize scope variables

    $rootScope.waiting = true;

    // Function to play beep sound
    //TODO: enable sound for production build.

    $rootScope.playSound = function() {
      //var sound = document.getElementById('play');
      //sound.play();
    }

    // Connect to Web Socket.
    
    WebSocketService.connectToWS();
    
});

//-------------------------------------------------------------------------------//
