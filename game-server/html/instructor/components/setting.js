//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $uibModal){

  $scope.showSettings = function() {
    var template = $('.settings-modal-template').html();
    var modalInstance = $uibModal.open({
        animation: true,
        template:  template,
        scope:    $scope,
        controller: function($uibModalInstance) {
            $ctrl = this;
            $ctrl.enableInternet = $scope.internetEnabled;
            $ctrl.ok = function() {

              console.log('click');

              $uibModalInstance.dismiss('ok');

              if ($scope.internetEnabled != $ctrl.enableInternet) {
                  ws.send(JSON.stringify({
                      type: 'internet',
                      enable: ($ctrl.enableInternet == true)
                  }));
              }
            };

            $ctrl.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            $ctrl.close = function() {
                $uibModalInstance.close('saved');
            }
        },
        controllerAs: 'ctrl',
        windowClass: 'mission-modal-window',
        size: 'md',
        backdrop: false
    });

    modalInstance.result.then(function(response) {}, function() {});
  }

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('setting', {
  templateUrl: 'instructor/components/setting.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//