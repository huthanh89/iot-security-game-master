//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){


  $rootScope.$on('ws:chatlist', function(event, msg) {
    $scope.scoreBoard = msg.scores;

  });

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('chat', {

  templateUrl:  'instructor/components/scoreboard.html',
  controller:    Controller,
  controllerAs: 'ctrl'

});

//------------------------------------------------------------------------------//