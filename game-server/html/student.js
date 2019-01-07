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

    // Refresh grid to recalculate grid item positions.

    $rootScope.refreshGrid = function(){
      if($rootScope.grid){
        $rootScope.grid.refreshItems().layout();
      }
    }

    // Initialize grid when angular has fully loaded.

    angular.element(function () {
      $rootScope.grid = new Muuri('.grid', {
        items:     '.item',
        dragEnabled: true,
        dragStartPredicate: {
          handle: '.card-header'
        },
        dragSortPredicate: {
          action: 'swap'
        },
        layout: {
          fillGaps:    true,
          horizontal:  false,
          alignRight:  false,
          alignBottom: false,
          rounding:    false
        }
      });
      $rootScope.grid.refreshItems().layout();
    });

    // When game starts, refresh grid system layout.
    // Since angular1 does not offer a callback for when all component are
    // fully loaded, we make due with window's delay function.

    $rootScope.$on('ws:start', function() {
      if($rootScope.grid){
        setTimeout(function(){ 
          $rootScope.refreshGrid();
        }, 2000);
      }
    });   

  });

//-------------------------------------------------------------------------------//
