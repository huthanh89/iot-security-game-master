//------------------------------------------------------------------------------//
// Acquire application module
//------------------------------------------------------------------------------//

var app = angular.module('gameApp');

//-------------------------------------------------------------------------------//
// Main Controller
//-------------------------------------------------------------------------------//

app.controller('studentCtrl', function($scope, $rootScope, WebSocketService) {
    
    /** Intialize scope variables */
    $scope.waiting = true;

    // TODO: Remove.
    $scope.waiting = false;
    
     /** Function to submit flag.
    @param flag is boolean  to update flag
     */ 
    $scope.submitFlag = function(flag) {
        if (flag) {
            ws.send(JSON.stringify({
                type: 'flag',
                flag: flag
            }));
        }
    }
    
    /** Function to submit quiz.
    @param answers  for submitting  quiz
    */ 
    $scope.submitQuiz = function(answers) {
        for (var i in answers) {
            var answer = answers[i];
            if (answer && (typeof(answer) == 'object')) {
                var newAnswer = [];
                for (var j in answer) {
                    if (answer[j])
                        newAnswer.push(j);
                }
                answers[i] = newAnswer.sort();
            }
        }
        ws.send(JSON.stringify({
            type: 'quiz',
            answers: answers
        }));
    }

    /** Function to play beep sound */ 
    //TODO: enable sound for production build.

    $rootScope.playSound = function() {
      //var sound = document.getElementById('play');
      //sound.play();
    }

    // Connect to Web Socket.
    WebSocketService.connectToWS();
    
});

//-------------------------------------------------------------------------------//
