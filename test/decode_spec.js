var Decode = require('element/index').Decode;

describe('Decode', function() {

  var el;
  beforeEach(function() {
    el = $('<div id="doot"></div>')[0];
    $("body").append(el);
  });

  afterEach(function() {
    $("body").html("");
  })

  it("decodes the element", function() {
    var encoded = JSON.stringify({ paths: ["#doot"]});
    var decoded = Decode(encoded);
    expect(decoded).to.equal(el);
  });

  it("returns null when element not found", function() {
    var encoded = JSON.stringify({ paths: ["#beep"]});
    var decoded = Decode(encoded);
    expect(decoded).to.equal(null);
  })

});