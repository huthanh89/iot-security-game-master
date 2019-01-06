//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){
  
  $rootScope.openLockedModal = function(title, content) {
    $('#modal-error').modal('show')
  }

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('error', {
  templateUrl: 'student/components/modals/error.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//