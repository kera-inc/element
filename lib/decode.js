var $ = require('jquery');

var Decode = function(encoded){
  var decoded = JSON.parse(encoded);
  return Decode.prototype.fetchElement(decoded["paths"][0]);
}

Decode.prototype.fetchElement = function(selector) {
  return $(selector).not(':hidden')[0] || null;
}

module.exports = Decode;