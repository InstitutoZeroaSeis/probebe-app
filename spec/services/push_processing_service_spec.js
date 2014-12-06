describe('push processing service', function() {
  var pushProcessing,
      httpBackend,
      deviceRegistration = sinon.spy();

  beforeEach(function() {
    module('proBebe.services', function($provide) {
      $provide.value('$ionicPlatform', {
        ready: function() {
        }
      });
      $provide.value('authentication', {
        registerDeviceNotificationId: deviceRegistration
      });
    });
    inject(function(_pushProcessing_, _$httpBackend_, _Constants_, _$rootScope_) {
      pushProcessing = _pushProcessing_;
      httpBackend = _$httpBackend_;
      Constants = _Constants_;
      $rootScope = _$rootScope_;
    });
  });

  it('is expected to send the registration id to the backend when receives it from the device', function() {
    pushProcessing.initialize();
    $rootScope.$emit('pushNotificationReceived', { event: 'registered', regid: 'regid' });
    expect(deviceRegistration.calledWith('regid')).to.equal(true);
  });

  it('is expected to emit an event called "pushMessageReceived" when the device sends a notification', function(done) {
    pushProcessing.initialize();
    $rootScope.$on('pushMessageReceived', function (event, message) {
      expect(message).to.equal('message content');
      done();
    });
    $rootScope.$emit('pushNotificationReceived', { event: 'message', message: 'message content' });
  })
});
