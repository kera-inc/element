var $ = require('jquery');

var Decode = function(encoded){
  var decoded = JSON.parse(encoded);
  return Decode.prototype.fetchElement(decoded["paths"][0]);
}

Decode.prototype.fetchElement = function(selector) {
  return $(selector)[0];
}

module.exports = Decode;