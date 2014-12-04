describe('authentication service', function() {
  var authentication,
      httpBackend,
      Constants;

  beforeEach(function() {
    module('proBebe.services');
    inject(function(_authentication_, _$httpBackend_, _Constants_) {
      authentication = _authentication_;
      httpBackend = _$httpBackend_;
      Constants = _Constants_;
    });
  });

  it('is expected to return true when the credentials are valid', function(done) {
    httpBackend.whenPOST(Constants.API_BASE_URL + '/credentials').respond({
      valid: true
    });
    authentication.authenticate('user@example.com', '12345678').then(function(valid) {
      expect(valid).to.equal(true);
    }).then(done);
    httpBackend.flush();
  });

  it('is expected to return false when the credentials are invalid', function(done) {
    httpBackend.whenPOST(Constants.API_BASE_URL + '/credentials').respond({
      valid: false
    });
    authentication.authenticate('user@example.com', '12345678').then(function(valid) {
      expect(valid).to.equal(false);
    }).then(done);
    httpBackend.flush();
  });

  it('is expected to set authenticated to true when the credentials are valid', function(done) {
    httpBackend.whenPOST(Constants.API_BASE_URL + '/credentials').respond({
      valid: true
    });
    expect(authentication.isAuthenticated()).to.equal(false);
    authentication.authenticate('user@example.com', '12345678').then(function(valid) {
      expect(authentication.isAuthenticated()).to.equal(true);
    }).then(done);
    httpBackend.flush();
  });

});
