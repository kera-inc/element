var Decode = require('element/index').Decode;

describe('Decode', function() {

  var stub;
  beforeEach(function() {
    stub = sinon.stub();
    Decode.prototype.fetchElement = function(selector) { if (selector == "doot") { return stub; }}
  });

  it("decodes the element", function() {
    var encoded = JSON.stringify({ paths: ["doot", "beep"]});
    var decoded = Decode(encoded);
    expect(decoded).to.equal(stub);
  });

});