var Encode = require('element/index').Encode;

describe('Encode', function() {

  var stub;
  beforeEach(function() {
    stub = sinon.stub();
    Encode.prototype.selector = function(el, options) {
      options = options || {};
      if (el == stub && options.ignoreIDs) {
        return ".doot";
      } else if (el == stub) {
        return "#doot";
      }
    };
  });

  it("generates the expected JSON", function() {
    var encoded = Encode(stub);
    expect(encoded).to.equal('{"paths":["#doot",".doot"]}');
  });
});

