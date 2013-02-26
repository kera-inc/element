var DetectSelector = require('element/index').DetectSelector;
var $ = require('component-jquery');
var expect = chai.expect;


describe('DetectSelector', function() {
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
    var selector = DetectSelector(el);
    expect(selector).to.equal('#beep');
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
    var selector = DetectSelector(el);
    expect(selector).to.equal('.beep.boop>div>input');
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

    var selector = DetectSelector(elements[0]);
    expect(selector).to.equal(".beep.boop:eq(0)>div");
  });

  it("locates an element with classes that have excessive whitespace", function() {
    var doc = $('<div class=" beep  boop  ">');

    $("body").append(doc);

    var elements = $("div.beep.boop");
    expect(elements.length).to.equal(1);

    var selector = DetectSelector(elements[0]);
    expect(selector).to.equal(".beep.boop");

    doc.remove();
  });

});

