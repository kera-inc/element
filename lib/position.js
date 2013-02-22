var $ = require('jquery');
var _ = require('underscore');

function getFixedParent(element) {
  return $(element).parents().filter(function() {
    return isFixed(this);
  }).first();
}

function isFixed(element) {
  return ($(element).css('position') == 'fixed');
}

function getOffsetForOffsetParents(element, fixedParent) {
  var left = 0, top = 0, elementToMeasure = $(element);

  while (elementToMeasure[0] != fixedParent[0]) {
    left += elementToMeasure.position().left + parseInt(elementToMeasure.css('margin-left'));
    top += elementToMeasure.position().top + parseInt(elementToMeasure.css('margin-top'));

    elementToMeasure = elementToMeasure.offsetParent();
  }

  return { left: left, top: top };
}

var Position = {
  tickInterval: 100,

  get: function(element) {
    var fixedParent = getFixedParent(element);
    var elementLeft, elementTop, position;
    if (fixedParent.length > 0) {
      var offset = getOffsetForOffsetParents(element, fixedParent);

      var fixedParentLeftOffset = parseInt($(fixedParent).css('left')) || fixedParent.position().left;
      var fixedParentTopOffset = parseInt($(fixedParent).css('top')) || fixedParent.position().top;

      var fixedParentLeftMargin = parseInt($(fixedParent).css('margin-left'));
      var fixedParentTopMargin = parseInt($(fixedParent).css('margin-top'));

      elementLeft = fixedParentLeftOffset + fixedParentLeftMargin + offset.left;
      elementTop = fixedParentTopOffset + fixedParentTopMargin + offset.top;
      position = 'fixed';
    } else if(isFixed(element)) {
      elementLeft = parseInt($(element).css('left')) || $(element).position().left;
      elementTop = parseInt($(element).css('top')) || $(element).position().top;
      position = 'fixed';
    } else {
      elementLeft = $(element).offset().left;
      elementTop = $(element).offset().top;
      position = 'absolute';
    }

    var elementWidth = $(element).outerWidth();
    var elementHeight = $(element).outerHeight();

    return {
      screenY:elementTop + window.screenY,
      screenX: elementLeft + window.screenX,

      top: elementTop,
      left: elementLeft,

      width: elementWidth,
      height: elementHeight,
      position: position
    }
  },

  track: function(element, callback) {
    var stopped = false;

    var originalLocation = Position.get(element);

    callback(originalLocation);

    function checkLocation() {
      var currentLocation = Position.get(element);

      if (!_.isEqual(originalLocation, currentLocation)) {
        originalLocation = currentLocation;
        callback(originalLocation);
      }
    }

    var tracker = setInterval(checkLocation, this.tickInterval);

    return {
      disconnect: function() {
        clearInterval(tracker);
      }
    }
  }
}

module.exports = Position;
