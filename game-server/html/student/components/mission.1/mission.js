//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope, $uibModal, $sce, $timeout){

  /** Clear the mission content */ 
  $scope.missionContent = '';

  /** Function to submit flag.
  @param flag is boolean  to update flag
  */ 
  $scope.submitFlag = function(flag) {

    console.log('SUBMMITTING', flag);

    if (flag) {
      $rootScope.ws.send(JSON.stringify({
            type: 'flag',
            flag: flag
        }));
    }
  }
  
  // Handle quiz submission.

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
    $rootScope.ws.send(JSON.stringify({
        type: 'quiz',
        answers: answers
    }));
  }

  // Show actual mission modal.

  $rootScope.$on('ws:mission', function(event, msg) {

    $scope.selectedMission = $rootScope.selectedMission;

    $scope.missionID = msg.missionId;

//    $scope.missionContent = $sce.trustAsHtml(msg.text);
    $scope.missionContent = msg.text;

    console.log($scope.missionContent);

    var modalInstance = $uibModal.open({
        animation: true,
        scope:    $scope,
        templateUrl: './missionModel.html',
        controller: function($uibModalInstance) {
            $ctrl = this;
            $ctrl.showContent = true;
            $ctrl.ok = function() {
                $uibModalInstance.dismiss('ok');
            };

            $ctrl.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            $ctrl.close = function() {
                $uibModalInstance.close('saved');
            }

        },
        controllerAs: 'ctrl',
        windowClass:  'mission-modal-window',
        size:         'lg',
        backdrop:      true
    });

    modalInstance.result.then(function(response) {}, function() {});
    $scope.$applyAsync();
    $timeout(function() {
        $('.disable-answers-true input').prop('disabled', true);
        $('.disable-answers-true textarea').prop('disabled', true);
        $('.disable-answers-true button').prop('disabled', true);
    }, 500);
  });

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('mission', {
  templateUrl: 'student/components/mission/mission.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//