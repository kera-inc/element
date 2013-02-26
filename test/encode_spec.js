var Encode = require('element/index').Encode;

describe('Encode', function() {

  var stub;
  beforeEach(function() {
    stub = sinon.stub();
    Encode.prototype.selector = function(el) { if (el == stub) { return "doot"; } };
  });

  it("generates the expected JSON", function() {
    var encoded = Encode(stub);
    expect(encoded).to.equal('{"paths":["doot"]}');
  });
});

