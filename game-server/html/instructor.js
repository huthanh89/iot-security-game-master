/** Get the module */
var app = angular.module('gameApp');

/** Angular injections. */
app.controller('instructorCtrl', function($scope, $sce, $rootScope, WebSocketService) {

    /** Initialize scope variables. */
    $rootScope.internetEnabled = false;

    /** Initialize scope variable for update view */
    $rootScope.hideConfig = false;

    /** Function to play beep sound */
    $rootScope.playSound = function() {
      var sound = document.getElementById('play');
      sound.play();
    }

    /** web socket logic start here */
    // ws://game-server.local:8080/player
    let url = 'ws://' + window.location.host + '/instructor'
    let ws = null;

    // Connect to Web Socket.

    WebSocketService.connectToWS();
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