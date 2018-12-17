//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){

  // Initialize scope variables.

  $scope.scoreBoard = [];

  /** Function to get scores from score board */
  function getScores(scoreboard) {
    var scores = [];
    for (var i in scoreboard) {
        scores.push({
            name: scoreboard[i].name,
            score: scoreboard[i].score
        });
    }
    return scores;
  }

  $rootScope.$on('ws:scores', function(event, msg) {
    if (JSON.stringify(getScores($scope.scoreBoard)) != JSON.stringify(getScores(msg.scores))) {
      $rootScope.playSound();
    }
    $scope.scoreBoard = msg.scores;
  });

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('scoreboard', {
  templateUrl:  'instructor/components/scoreboard.html',
  controller:    Controller,
  controllerAs: 'ctrl'
});

//------------------------------------------------------------------------------//