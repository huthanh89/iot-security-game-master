//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope, $uibModal, $sce, $timeout){

  // Initialize scope.

  $scope.missionContent = '';

  // Handle submit.

  $scope.submitFlag = function(flag) {

    console.log('SUBMMITTING', flag);

    if (flag) {
      $rootScope.ws.send(JSON.stringify({
            type: 'flag',
            flag: flag
        }));
    }
  }
  
  // Show modal

  $rootScope.$on('ws:mission', function(event, msg) {

    $scope.selectedMission = $rootScope.selectedMission;

    $scope.missionID = msg.missionId;

    $scope.missionContent = msg.text;

  //  console.log($scope.missionContent);

    $scope.customHtml = $sce.trustAsHtml($scope.missionContent);

    $scope.$digest();
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