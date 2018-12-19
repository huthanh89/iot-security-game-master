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
  
  // Initialize popover.

  $scope.row = function(players){
    
    tableRows = [];

    players.forEach(function(player){
      tableRows.push(`<tr><td>${player.name}</td><td>${player.score}</td></tr>`);
    });

    $('[data-toggle="popover"]').popover({
      html: true,
      title: '',
      content: 
        `
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows.toString()}
            </tbody>
          </table>
        `
    });
  }

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('scoreboard', {
  templateUrl: 'instructor/components/scoreboard.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//