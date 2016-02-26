// add require dependencies
const cssHighlight = require('./controllers/cssHighlight.js');
const gui = require('./controllers/gui.js')

const $ = require('jquery');
const createGUI = require('./controllers/gui');
let selFunc;
let highlight;

const trgElem = '#api-window';


// make post request but don't reload page
$(document).ready(function() {

  $('#api-prevent').on('click', function(e) {
    e.preventDefault();
    $('#api-window').remove();

    $.ajax({
      url: 'apireqpost/post.stf',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        website: $('#api-location').val()
      }),
      success: function(data) {
        $('#window-container').append('<iframe id="api-window" class="container" width="100%" height="900px" src="/apireqget/get.stf" name="iframe_a"></iframe>')

        let mainArray = [];

        $('#api-window').load(function() {

          $('#api-window').contents().click(function(e) {
            e.preventDefault();

            let results = [];
            let tempTarget = e.target;
            console.log('temptarget====>',tempTarget);
            results[0] = tempTarget;
            var parents =$(e.target).parentsUntil('body');
            console.log(parents);

            while (tempTarget) {
              results.push(tempTarget.parentNode);
              tempTarget = tempTarget.parentNode;
            }
            console.log("results:", results);
            // console.log($(`${results[0]}`));
            // console.log(results[0].className);
            let ancestryChain = "";
            for (let i = (results.length - 4); i >= 0; i--) {
              // if (results[0].className){
              //   console.log(results[0].className);
              //   ancestryChain += results[i].nodeName +'.'+ results[i].className + ' ';
              // } else {
              ancestryChain += results[i].nodeName + ' ';
            // }
            }

            ancestryChain = ancestryChain.toLowerCase();
            console.log("ancestryChain:", ancestryChain);

            let attributes = [];
            for (let i = 0; i < e.target.attributes.length; i++) {
              attributes.push(e.target.attributes[i]);
            }
            // console.log("attributes:", attributes);
            attributes.unshift({name: "text"});
            cssHighlight(ancestryChain,mainArray);
            gui.buildGUI(attributes);

            var thisClass = e.target.className;
            // when you click the add element button
            $('#addObj').click((e) => {
              e.preventDefault();
              let indivObj = {};
              let indivAttr = $('#guiDropDown').val();
                indivObj.string = ancestryChain;
                indivObj.name = $('#propName').val();
                indivObj.attr = indivAttr;
                if (indivObj.attr === 'class') indivObj.class = thisClass;
                console.log($(results[0]).text());
              $('#gui-bottom').append("<p><strong>" + indivObj.name + ": </strong>"+  $(results[0]).text() + "</p>");
              // console.log("main array before: ", mainArray);
              mainArray.push(indivObj);

              mainArray[0].first = true;
              // console.log("mainArray after:", mainArray);

              indivObj = {};
              ancestryChain = "";



              console.log("mainArray before AJAX Post: ", mainArray);
            });

            $('#guiSelector').submit((e) => {
              e.preventDefault();
              $.ajax({
                type: 'POST',
                url: '/apisubmit',
                contentType: 'application/json',
                data: JSON.stringify(mainArray),

                success: function(data) {
                  console.log('data is', data);
                  $('#api-window').remove();
                  $('#window-container').append(
                    '<iframe id="api-window" class="container" width="100%" height="900px" src="goodbye.html" name="iframe_a"></iframe>'
                  );
                  setTimeout(function() {
                    $('#api-window').contents().find('#url').append(`<p><a href="http://localhost:4000/api/${data}" target="_blank">http://localhost:4000/api/${data}</a></p>`);
                  }, 500);
                }
              });
            });
          });
        });
      }
    });
  });
});
