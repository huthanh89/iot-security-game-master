//------------------------------------------------------------------------------//
// Acquire application module
//------------------------------------------------------------------------------//

var app = angular.module('gameApp');

//-------------------------------------------------------------------------------//
// Main Controller
//-------------------------------------------------------------------------------//

app.controller('studentCtrl', function($scope, $rootScope, $window, $uibModal, $location, $sce, $timeout, WebSocketService) {
    
    /** Intialize scope variables */
    window.scope = $scope;
    $scope.waiting = true;
    $scope.missionContentShown = false;

    // TODO: Remove.
    $scope.waiting = false;
    
    /** Function to select mission */
    $scope.selectMission = function(missionId) {
        $scope.selectedMission = $scope.gameboard.missions[missionId];
        if (!$scope.selectedMission) {
            $scope.openModal("Warning", 'Mission not available.');
            return;
        }
        if (!$scope.selectedMission.unlocked) {
            $scope.openModal("Warning", 'Mission is locked.');
            return;
        }
        var showContent = false;
        if ($scope.selectedMission.playerId) {
            ws.send(JSON.stringify({
                type: 'selectMission',
                mission: missionId
            }));
            showContent = true;
        }else {

            $scope.missionContentShown = true;
            var modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                templateUrl: './missionModel.html',
                controller: function($uibModalInstance) {
                    $ctrl = this;
                    $ctrl.showContent = showContent;
                    $ctrl.ok = function() {
                        ws.send(JSON.stringify({
                            type: 'selectMission',
                            mission: missionId
                        }));
                        $ctrl.showContent = true;
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
                size: 'md',
                backdrop: false
            });

            modalInstance.result.then(function(response) {}, function() {});
        }
    };

    /** Function to open modal pop up.
     @param title is heading of the modal
     @param content is  content of modal
    */
    $scope.openModal = function(title, content) {
        var template = $('.modal-template').html();
        template = template.replace('[[name]]', title).replace('[[description]]', content);
        $scope.isSuccess = false;
        if (title === 'Success') {
            $scope.isSuccess = true;
        }
        var modalInstance = $uibModal.open({
            animation: true,
            template: template,
            scope: $scope,
            controller: function($uibModalInstance) {
                $ctrl = this;
                $ctrl.ok = function() {
                    $ctrl.close();
                };

                $ctrl.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };

                $ctrl.close = function() {
                    $uibModalInstance.close('saved');
                }

            },
            controllerAs: 'ctrl',
            windowClass: 'alert-modal-window',
            size: 'sm',
            backdrop: 'static'
        });

        modalInstance.result.then(function(response) {
        }, function() {
        });
    };

    /** Function to open  window.
     @param  url is  window location url
    */
    $scope.goToUrl = function(url) {
        if (url)
            $window.open(url, "_blank");
    };

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

    $rootScope.playSound = function() {
      var sound = document.getElementById('play');
      sound.play();
    }

     /** web socket logic start here */
    // ws://game-server.local:8080/player
    var url = 'ws://' + window.location.host + '/player'
    var ws = null;

    function connectToWS() {
        ws = new WebSocket(url);
        $scope.ws = ws;

        ws.onclose = function() {
            setTimeout(function() {
                connectToWS();
            }, 2000);
            $scope.$applyAsync();
        };
        ws.onmessage = function(event) {
            try {

              var msg = JSON.parse(event.data);
                var type = msg['type'];


                console.log('>>>>>>>>>>>>>>>>>>', msg.type);

                if (type == 'login') {
                  console.log('ws; LOGGGGIIINNN', msg.id);
                  $scope.playerId = msg.id;
                  $rootScope.teamName = null;
                } 
                
                else if (type == 'stateData') {
                  console.log('stateData');
                    $scope.missionContent = $sce.trustAsHtml(msg.text);

                    $scope.currentTools = [];
                    for (var i in msg.tools) {
                        var tool = msg.tools[i];
                        $scope.currentTools.push($scope.tools[tool]);
                    }

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
                
                else if (type == 'incorrectFlag') {
                    $scope.openModal("Error", 'Incorrect Flag');

                } 
                
                else if (type == 'error') {
                    $scope.openModal("Error", msg.msg);

                } 
                
                else if (type == 'levelsCompleted') {
                    $scope.openModal("Success", 'Congratulations! Your team has completed all levels.');

                } 
                
                else if (type == 'endgame') {
                    var winner = msg['winner'];
                    if ($scope.loggedInUser.username == winner) {
                        $scope.missionCompleted = true;
                        $scope.$applyAsync();
                    } else {
                        $scope.otherMissionCompleted = true;
                        $scope.$applyAsync();
                    }
                }
            } 
            catch (e) {
            }
        };
    }
    
    // Connect to Web Socket.
    
//    connectToWS();
    WebSocketService.connectToWS();

});

//-------------------------------------------------------------------------------//
