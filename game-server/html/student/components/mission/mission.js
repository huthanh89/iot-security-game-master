//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope, $uibModal, $sce, $timeout){

  $scope.missionContentShown = false;
  
  /** Clear the mission content */ 
  $scope.missionContent = '';

  $rootScope.$on('ws:mission', function(event, msg) {

    $scope.missionContent = $sce.trustAsHtml(msg.text);

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