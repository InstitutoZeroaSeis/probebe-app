describe('storage service', function() {
  var storage,
  deviceRegistration = sinon.spy();

  beforeEach(function() {
    module('proBebe.services');
    inject(function(_storage_) {
      storage = _storage_;
    });
  });

  it('it is expected to retrieve and parse a stored item', function() {
    storage.set('test_key', 'test_val');
    storage.set('obj_key', { obj_key: 'obj_value'});
    expect(storage.get('test_key')).to.equal('test_val');
    expect(storage.get('obj_key').obj_key).to.not.be.undefined();
    expect(storage.get('obj_key').obj_key).to.not.be.null();
    expect(storage.get('obj_key').obj_key).to.equal('obj_value');
  });

});
