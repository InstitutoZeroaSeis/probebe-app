describe('messages service', function() {
  var messages,
      httpBackend,
      Constants;

  beforeEach(function() {
    module('proBebe.services');
    inject(function(_messages_, _$httpBackend_, _Constants_) {
      messages = _messages_;
      httpBackend = _$httpBackend_;
      Constants = _Constants_;
    });
  });

  it('is expected to return messages', function(done) {
    httpBackend.whenGET(Constants.API_BASE_URL + "/timeline").respond({
      messages: [
        { id: 1, text: "Message 1"},
        { id: 2, text: "Message 2"}
      ]
    });
    expect(messages).to.exist(null);
    messages.getMessages().then(function(data) {
      expect(data.messages).to.exist(null);
      expect(data.messages.length).to.equal(2);
    }).then(done).catch(function() {
      done('Error');
    });
    httpBackend.flush();
  });
});
