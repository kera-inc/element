var Decode = require('element/index').Decode;

describe('Decode', function() {

  var el;
  beforeEach(function() {
    el = $('<div id="doot"></div>')[0];
    $("body").append(el);
  });

  afterEach(function() {
    $("#doot").remove();
  })

  it("decodes the element", function() {
    var encoded = JSON.stringify({ paths: ["#doot"]});
    var decoded = Decode(encoded);
    expect(decoded).to.equal(el);
  });

  it("doesn't decode a hidden element", function() {
    $("#doot").hide();
    var encoded = JSON.stringify({ paths: ["#doot"]});

    var decoded = Decode(encoded);
    expect(decoded).to.equal(null);
  });

  it("searches through the paths until an element is found", function() {
    var encoded = JSON.stringify({ paths: ["#not_there", "#still_not_there", "#doot"]});
    var decoded = Decode(encoded);
    expect(decoded).to.equal(el);
  })

  it("returns null when element not found", function() {
    var encoded = JSON.stringify({ paths: ["#not_there"]});
    var decoded = Decode(encoded);
    expect(decoded).to.equal(null);
  });

  it("still returns null when multiple selectors used", function() {
    var encoded = JSON.stringify({ paths: ["#not_there", "#still_not_there"]});
    var decoded = Decode(encoded);
    expect(decoded).to.equal(null);
  });

});