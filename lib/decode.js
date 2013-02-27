var $ = require('jquery');
var _ = require('underscore');

var firstFound = function(paths) {
  var foundElements = _.map(paths, Decode.prototype.fetchElement);
  return _.find(foundElements , _.identity) || null;
};

var Decode = function(encoded){
  var decoded = JSON.parse(encoded);
  return firstFound(decoded["paths"]);
};

Decode.prototype.fetchElement = function(selector) {
  return $(selector).not(':hidden')[0];
};

module.exports = Decode;