var $ = require('jquery');

var Decode = function(encoded){
  return $(encoded)[0];
}

module.exports = Decode;