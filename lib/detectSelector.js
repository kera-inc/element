var $ = require('jquery');
var _ = require('underscore');

// borrowed from http://www.jessieamorris.com/random/selectorDetector.js

// El is assumed to have a class attribute
function classSelector(el) {
  var classes = $(el).attr('class').split(/ /);
  classes = _.filter(classes, function(s) { return s.length > 0; }); // remove empty strings due to excessive whitespace
  return "." + classes.join(".");
}

var DetectSelector = function(passedElement, options) {
  options = options || {};

  //Begin setup and such things
  var element = $(passedElement);
  if (element[0].tagName == undefined) {
    return 'body';
  }

  var tagName = $(element)[0].tagName.toLowerCase();

  //End setup and such things

  // If it has a name
  if($(element).attr('name')){
    return '[name='+$(element).attr('name')+']';
    // If it has an id
  } else if($(element).attr('id') && !options.ignoreIDs){
    return  '#'+$(element).attr('id');
    // If no siblings with the same tagName
  } else if($(element).parent().children(tagName).length == 1){
    var parentSelector = DetectSelector($(element).parent(), options);
    return parentSelector + '>' + tagName;
    // If it has a class
  } else if($(element).attr('class')){
    if($(classSelector(element)).length == 1){
      return classSelector(element);
    } else {
      var counter = 0;
      var tmpReturn = '';

      $(classSelector(element)).each(function(){
        var data = $(this);
        if($(element)[0] == $(data)[0]){
          tmpReturn =  classSelector(element) + ':eq(' + counter + ')';
          return false;
        }
        counter++;
      });
      if(tmpReturn){
        return tmpReturn;
      }
    }
    //Since it has at least one sibling with the same tagName, count which sibling this one is
  } else {
    var parentSelector = DetectSelector($(element).parent(), options);
    var counter = 0;
    var tmpReturn = '';

    $(parentSelector + '>' + tagName).each(function(){
      var data = $(this);
      if($(element)[0] == $(data)[0]){
        tmpReturn = parentSelector + '>' + tagName + ':eq(' + counter + ')';
        return false;
      }
      counter++;
    });
    if(tmpReturn){
      return tmpReturn;
    }
  }
};

module.exports = DetectSelector;