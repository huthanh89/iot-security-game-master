//------------------------------------------------------------------------------//
// Acquire application module
//------------------------------------------------------------------------------//

var app = angular.module('gameApp');

//-------------------------------------------------------------------------------//
// Main Controller
//-------------------------------------------------------------------------------//

app.controller('studentCtrl', function($scope, $rootScope, $uibModal, $sce, $timeout, WebSocketService) {
    
    /** Intialize scope variables */
    $scope.waiting = true;
    $scope.missionContentShown = false;

    // TODO: Remove.
    $scope.waiting = false;
    
     /** Clear the mission content */ 
    $scope.missionContent = '';
    
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

     /** web socket logic start here */
    // ws://game-server.local:8080/player
    var url = 'ws://' + window.location.host + '/player'
    var ws = null;

    function connectToWS() {

      ws = new WebSocket(url);

        $scope.ws = ws;

        ws.onmessage = function(event) {
            try {

              var msg = JSON.parse(event.data);
                var type = msg['type'];

                if (type == 'stateData') {

                    console.log('stateData------');
  
                    $scope.missionContent = $sce.trustAsHtml(msg.text);

                    $scope.selectedMission = $scope.gameboard.missions[msg.missionId];
                    if (!$scope.missionContentShown) {
                        $scope.missionContentShown = true;
                        var modalInstance = $uibModal.open({
                            animation: true,
                            scope: $scope,
                            templateUrl: './missionModel.html',
                            controller: function($uibModalInstance) {
                                $ctrl = this;
                                $ctrl.showContent = true;
                                $ctrl.ok = function() {
                                    $uibModalInstance.dismiss('ok');
                                    $scope.missionContentShown = false;
                                };

                                $ctrl.cancel = function() {
                                    $uibModalInstance.dismiss('cancel');
                                    $scope.missionContentShown = false;
                                };

                                $ctrl.close = function() {
                                    $uibModalInstance.close('saved');
                                    $scope.missionContentShown = false;
                                }

                            },
                            controllerAs: 'ctrl',
                            windowClass: 'mission-modal-window',
                            size: 'sm',
                            backdrop: false
                        });

                        modalInstance.result.then(function(response) {}, function() {});
                    }
                    $scope.$applyAsync();
                    $timeout(function() {
                        $('.disable-answers-true input').prop('disabled', true);
                        $('.disable-answers-true textarea').prop('disabled', true);
                        $('.disable-answers-true button').prop('disabled', true);
                    }, 500);

                } 

            } 
            catch (e) {
            }
        };
    }
    
    // Connect to Web Socket.
    WebSocketService.connectToWS();
    
    connectToWS();
});

//-------------------------------------------------------------------------------//
