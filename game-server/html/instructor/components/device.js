//-------------------------------------------------------------------------------//
// Controller
//-------------------------------------------------------------------------------//

function Controller($scope, $rootScope){

  // Initialize scope variables.

  $scope.deviceData = {};


  /** Function to update the device data
  @param : device to update
  */
  function updateDeviceData(device) {
    var oldDevice = $scope.deviceData[device.ip];
    if (oldDevice) {
        for (var i in device)
            oldDevice[i] = device[i];
    } else {
        $scope.deviceData[device.ip] = device;
    }
    $scope.$applyAsync();
  }

  /** Triggering the updateDeviceData for Updating the devices*/
  updateDeviceData({ "id": "GameController", "ip": "10.1.1.5", "online": true, "isInfrastructure": true, "player": null });
  updateDeviceData({ "id": "2960Switch", "ip": "10.1.1.1", "online": true, "isInfrastructure": true, "player": null });

  $rootScope.$on('ws:device', function(event, msg) {
    updateDeviceData(msg);
    $rootScope.playSound();
  });

}

//------------------------------------------------------------------------------//
// Component
//------------------------------------------------------------------------------//

angular.module('gameApp').component('device', {
  templateUrl: 'instructor/components/device.html',
  controller:   Controller
});

//------------------------------------------------------------------------------//