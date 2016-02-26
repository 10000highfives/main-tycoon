const $ = require('jquery');

function cssHighlight(ancestors,mainArray) {
  // const history = [];
var highlightColor = ['yellow', '#ffb6c1','#add8e6','#49E20E'];
  console.log('in highlight:  ', ancestors);

// var thisColor = highlightColor[mainArray[mainArray.length-1]];
// console.log(highlightColor[mainArray[mainArray.length-1]]);
    $('#api-window').contents().find(ancestors).css('background-color', 'yellow' );

}

module.exports = cssHighlight;
