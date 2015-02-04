angular.module("proBebe.services").factory('DeviceRegistration', function($resource, Constants) {
  return $resource(Constants.DEVICE_REGISTRATION_URL, {
    platform_code: '@platform_code'
  });
});
