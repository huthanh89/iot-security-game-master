//------------------------------------------------------------------------------//
// Acquire application module
//------------------------------------------------------------------------------//

var app = angular.module('gameApp');

//-------------------------------------------------------------------------------//
// Main Controller
//-------------------------------------------------------------------------------//

app.controller('instructorCtrl', function($rootScope, WebSocketService) {

    /** Initialize scope variables. */
    $rootScope.internetEnabled = false;

    /** Initialize scope variable for update view */
    $rootScope.hideConfig = false;

    /** Function to play beep sound */
    $rootScope.playSound = function() {
      var sound = document.getElementById('play');
      sound.play();
    }

    // Connect to Web Socket.
    WebSocketService.connectToWS();

});

//-------------------------------------------------------------------------------//
// Form Controller; Used for user Form logic.
//-------------------------------------------------------------------------------//

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

//------------------------------------------------------------------------------//