//------------------------------------------------------------------------------//
// Acquire application module
//------------------------------------------------------------------------------//

var app = angular.module('gameApp');

//-------------------------------------------------------------------------------//
// Main Controller
//-------------------------------------------------------------------------------//

app.controller('instructorCtrl', function($scope, $rootScope, WebSocketService) {

    /** Initialize scope variables. */
    $rootScope.internetEnabled = false;

    /** Initialize scope variable for update view */
    $rootScope.gameStarted = false;

    /** Function to play beep sound */
    $rootScope.playSound = function() {
      var sound = document.getElementById('play');
      sound.play();
    }

    // Connect to Web Socket.
    WebSocketService.connectToWS();
    
    $scope.sort123 = function(){
      var grid = new Muuri('.grid', {
        items: '*',
        dragEnabled: true,
      });
      grid.refreshItems().layout();
    };

    // Initialize grid when angular has fully loaded.

    angular.element(function () {
      $rootScope.grid = new Muuri('.grid', {
        items: '.item',
        dragEnabled: true,
        dragSortPredicate: {
          action: 'swap'
        },
        layout: {
          fillGaps: true,
          horizontal: false,
          alignRight: false,
          alignBottom: false,
          rounding: false
        },
      });
      $rootScope.grid.refreshItems().layout();
    });

});

//-------------------------------------------------------------------------------//
// Form Controller; Used for user Form logic.
//-------------------------------------------------------------------------------//

app.controller('formCtrl', ['$scope', function($scope) {

    /** Initialize scope variables. */
    $scope.registerUser = false;

    /** Function to show register button */
    $scope.showRegister = function() {
        $scope.registerUser = $scope.registerUser ? false : true;
    }
}])

//------------------------------------------------------------------------------//