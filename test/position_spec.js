describe('ElementPosition', function() {
  var $ = require('component-jquery');
  var ElementPosition = require('element/index').Position;
  var expect = chai.expect;

  var element;

  beforeEach(function() {
    $('body').prepend('<div id="outerContainer"><div id="container"><div id="element" style="width:100px; height:20px"></div></div></div>');
    $('#element').css({ background: 'blue' });
    element = $('#element');
  });

  afterEach(function() {
    $('#outerContainer').remove();
  });

  describe('.get', function() {
    describe('when the element is position:fixed, left:100, top:100, width: 100, height: 20', function() {
      var location;

      beforeEach(function() {
        $('#element').css({ position: 'fixed', left: '100px', top: '100px' });

        location = ElementPosition.get(element);
      });

      it('reports an ideal positioning of "absolute"', function() {
        expect(location.position).to.equal('fixed');
      });

      it('has a left of 100', function() {
        expect(location.left).to.equal(100);
      });

      it('has a top of 100', function() {
        expect(location.top).to.equal(100);
      });

      it('has a width of 100', function() {
        expect(location.width).to.equal(100);
      });

      it('has a height of 20', function() {
        expect(location.height).to.equal(20);
      });

      it('has a screenX of left + window.screenX', function() {
        expect(location.screenX).to.equal(location.left + window.screenX);
      });

      it('has a screenY of left + window.screenY', function() {
        expect(location.screenY).to.equal(location.left + window.screenY);
      });
    });

    describe('when the element is position:fixed, left: 100, top: auto', function() {
      var location;

      beforeEach(function() {
        $('#element').css({ position: 'fixed', left: '100px' });

        location = ElementPosition.get(element);
      });

      it('has a left of 100', function() {
        expect(location.left).to.equal(100);
      });

      it('has an inherited top', function() {
        expect(location.top).to.equal( $('#element').position().top );
      });
    });

    describe('when the parent is position:fixed, left: 100, top: 100', function() {
      var location;

      beforeEach(function() {
        $('#container').css({ position: 'fixed', left: '100px', top: '100px' });

        location = ElementPosition.get(element);
      });

      it('reports a positioning of fixed', function() {
        expect(location.position).to.equal('fixed');
      });

      it('has a left of 100', function() {
        expect(location.left).to.equal(100);
      });

      it('has a top of 100', function() {
        expect(location.top).to.equal(100);
      });

      describe('and the element has a 10px margin', function() {
        beforeEach(function() {
          $('#element').css({ margin: '10px' });

          location = ElementPosition.get(element);
        });

        it('adds 10px to the top and left', function() {
          expect(location.left).to.equal(110);
          expect(location.top).to.equal(110);
        });
      });

      describe('and the parent has a 10px margin', function() {
        beforeEach(function() {
          $('#container').css({ margin: '10px' });
          location = ElementPosition.get(element);
        });

        it('adds 10px to the top and left', function() {
          expect(location.left).to.equal(110);
          expect(location.top).to.equal(110);
        });
      });
    });

    describe('when the parent is position:fixed, left: auto, top: 100', function() {
      var location;

      beforeEach(function() {
        $('#container').css({ position: 'fixed', top: '100px' });

        location = ElementPosition.get(element);
      });

      it('has a top of 100', function() {
        expect(location.top).to.equal(100);
      });

      it('has an inherited left', function() {
        expect(location.left).to.equal( $('#container').position().left );
      });
    });

    describe('#outerContainer position:fixed -> #container position:relative -> #element', function() {
      var location;

      beforeEach(function() {
        $('#outerContainer').css({ position: 'fixed', left: '100px', top: '100px' });
        $('#container').css({ position: 'relative', padding: '5px', 'margin-left': '10px', top: '20px' });

        location = ElementPosition.get(element);
      });

      it('reports an ideal positioning of "fixed"', function() {
        expect(location.position).to.equal('fixed');
      });

      it('adds #outerContainer top: 100 + #container padding: 5, top: 20', function() {
        expect(location.top).to.equal(125);
      });

      it('adds #outerContainer left: 100 + #container padding: 5, margin-left: 10', function() {
        expect(location.left).to.equal(115);
      });
    });

    describe('when the element is static with all static parents', function() {
      var location;

      beforeEach(function() {
        $('#outerContainer').css({ padding: '50px' });
        $('#container').css({ margin: '10px', padding: '20px' });
        $('#element').css({ margin: '5px' });

        location = ElementPosition.get(element);
      });

      it('reports an ideal positioning of "absolute"', function() {
        expect(location.position).to.equal('absolute');
      });

      it('takes the offset of the element', function() {
        expect(location.left).to.equal($('#element').offset().left);
        expect(location.top).to.equal($('#element').offset().top);
      });
    });
  });

  describe('.track', function() {
    var location
      , tracker
      , clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();

      tracker = ElementPosition.track(element, function(loc) {
        location = loc;
      });
    });

    afterEach(function() {
      tracker.disconnect();

      clock.restore();
    });

    it('immediately returns the location the first time', function() {
      expect(location.position).to.equal('absolute');
      expect(location.top).to.equal($('#element').offset().top);
    });

    describe('when the element changes to fixed position', function() {
      beforeEach(function() {
        element.css({ position: 'fixed', top: '100px', left: '100px' });

        clock.tick(ElementPosition.tickInterval);
      });

      it('yields to the callback again', function() {
        expect(location.position).to.equal('fixed');
      });
    });

    describe('when a parent of the element changes', function() {
      beforeEach(function() {
        $('#container').css({ position: 'fixed', top: '100px', padding: '20px' });

        clock.tick(ElementPosition.tickInterval);
      });

      it('yields to the callback again', function() {
        expect(location.position).to.equal('fixed');
        expect(location.top).to.equal(120);
      });
    });

    describe('when calling "disconnect" on the returned tracker object', function() {
      beforeEach(function() {
        tracker.disconnect();

        element.css({ position: 'fixed' });

        clock.tick(ElementPosition.tickInterval);
      });

      it('no longer yields to the callback', function() {
        expect(location.position).to.equal('absolute');
      });
    });
  });
});
