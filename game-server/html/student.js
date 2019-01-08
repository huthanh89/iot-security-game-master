//------------------------------------------------------------------------------//
// Acquire application module
//------------------------------------------------------------------------------//

var app = angular.module('gameApp', ['ui.bootstrap' , 'angular-bind-html-compile']);

//-------------------------------------------------------------------------------//
// Main Controller
//-------------------------------------------------------------------------------//

app.controller('studentCtrl', function($scope, $rootScope, WebSocketService) {
    
    // Initialize scope variables

    $rootScope.waiting = true;

    // Function to play beep sound

    $rootScope.playSound = function() {
      // document.getElementById('play').play();
    }

    // Connect to Web Socket.
    
    WebSocketService.connectToWS();

    // Refresh grid to recalculate grid item positions.

    $rootScope.refreshGrid = function(){
      if($rootScope.grid){
        $rootScope.grid.refreshItems().layout();
      }
    }

    $rootScope.delayedRefreshGrid = function(ms){
      setTimeout(function(){ 
        $rootScope.refreshGrid();
      }, ms);
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
      $rootScope.delayedRefreshGrid(2000);
    });   
    
    $rootScope.delayedRefreshGrid(2000);

  });

//-------------------------------------------------------------------------------//