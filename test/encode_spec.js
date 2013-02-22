var Encode = require('element/index').Encode;
var Decode = require('element/index').Decode;
var $ = require('component-jquery');
var expect = chai.expect;

describe('Encode', function() {
  beforeEach(function() {
    $("body").append($("<div id='test'></div>"));
    expect($("#test").length).to.equal(1);
  });

  afterEach(function() {
    $("body").html("");
  })

  it('finds by id', function() {
    var el = $('<div id="beep"></div>')[0];
    $("body").append(el);
    var encoded = Encode(el);
    expect(encoded).to.equal('#beep');
    expect(Decode(encoded)).to.equal(el);
  });

  it('locate an element with siblings and more than one class', function() {
    var doc = $('<div class="beep boop">' +
      '  <div>' +
      '    <input class="inner">' +
      '  </div>' +
      '</div>' +
      '<div></div>'
    );
    $('#test').append(doc);
    var el = $('.inner', doc)[0];  // Get the beep boop element
    var encoded = Encode(el);
    expect(encoded).to.equal('.beep.boop>div>input');
    expect(Decode(encoded)).to.equal(el);
  });

  it("locates an element with siblings that have the same class names (and multiple classes)", function() {
    var el  = $("<div class='beep boop'>" +
                "  <div>select me</div>" +
                "</div>" +
                "<div class='beep boop'>" +
                "  <div>not me!</div>" +
                "</div>"
    );

    $("#test").append(el);

    var elements = $("#test>div>div:contains('select me')");
    expect(elements.length).to.equal(1);

    var encoded = Encode(elements[0]);
    expect(encoded).to.equal(".beep.boop:eq(0)>div");
    expect(Decode(encoded)).to.equal(elements[0]);
  });

  it("locates an element with classes that have excessive whitespace", function() {
    var doc = $('<div class=" beep  boop  ">');

    $("body").append(doc);

    var elements = $("div.beep.boop");
    expect(elements.length).to.equal(1);

    var encoded = Encode(elements[0]);
    expect(encoded).to.equal(".beep.boop");
    expect(Decode(encoded)).to.equal(elements[0]);

    doc.remove();
  });

});

