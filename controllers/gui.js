var $ = require('jquery');

function buildGUI(attrArr) {

  $('#guiSelector').remove();

  $('#gui').append(`<form id="guiSelector">
    <input id="propName" type='text' placeholder='Name of Property' name='propName'/><br/>
    <button id = "addObj"> Add Element </button>
    <input id="submitBtn" type="submit">
    </form>
    <div id="dropDownMenu"></div>
  `)

$('#guiDropDown').remove();

  // const jqueryString = "$('#api-window').contents().find('" + attrArr[0] + "')";
  var attObj = {};
  for (var i = 0; i < attrArr.length; i++) {
    attObj[attrArr[i].name] = attrArr[i].value;
  }
console.log(attObj);
  // var textQuery = jqueryString + '.text()';
  // attObj.text = eval(textQuery);

  var attNames = Object.keys(attObj);
  var dropDown = '<select id="guiDropDown" name="attr" form="guiSelector">';

  attNames.forEach(att => {
    dropDown += '<option value="' + att + '">' + att + '</option>'
  })

  dropDown += '</select>';

  $('#dropDownMenu').append(dropDown);

}
module.exports = {
  buildGUI:buildGUI,
  // buildDropDown: buildDropDown
}
