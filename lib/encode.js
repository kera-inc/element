var DetectSelector = require('./detectSelector');



var Encode = function(element) {
  var encodedObj = { "paths": [
    Encode.prototype.selector(element),
    Encode.prototype.selector(element, { ignoreIDs: true})
  ] };

  return JSON.stringify(encodedObj);
}

Encode.prototype.selector = function(element) {
  return DetectSelector(element);
}

module.exports = Encode;