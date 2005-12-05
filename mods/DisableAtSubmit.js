
/** <Module name="DisableAtSubmit"> **/
/** Description: if you use this module on your webpages, whenever
    a submit button in a form is pressed, all buttons in the page
    will be disabled, so as to avoid more unnecessary submissions
    which could affect badly to the server. **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/

RequireOnce("CrossBrowser.js"); /* {AttachEventListener(...) needed} */


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.DisableAllButtons = function(oEvent){
  /* the target element is the form */
  var oTarget = CrossBrowser.GetTarget(oEvent);

  /* workaround for Gecko bug: https://bugzilla.mozilla.org/show_bug.cgi?id=317155 */
  if (oTarget.tagName.toLowerCase() != "form"){
    oTarget = oTarget.form;
  }

  var sButtonClickedId = null;
  var oElement,aElements = window.document.getElementsByTagName('input');
  
  /* search of the hidden parameter inserted by UpdateHiddenFormField() */
  var i = 0;
  while ((!sButtonClickedId) && (i < aElements.length)){
    oElement = aElements[i];
    i++;
    if (oElement.name == oTarget.id){
      sButtonClickedId = oElement.value;
    }
  }

  aElements = window.document.getElementsByTagName('input');
  for (i = aElements.length; i--; ) {
    oElement = aElements[i];

    if ((oElement.type == "submit")||
        (oElement.type == "reset")||
        (oElement.type == "button")){
      if ((oElement.name) &&
          (oElement.name.length > 0) &&
          (oElement.id == sButtonClickedId)){
        var oNewInput = window.document.createElement('input');
        oNewInput.type = "hidden";
        oNewInput.name = oElement.name;
        oNewInput.value = oElement.value;
        oElement.form.appendChild(oNewInput);
      }
      oElement.disabled = true;
    }
  }

  aElements = window.document.getElementsByTagName('button');
  for (i = aElements.length; i--; ) {
    oElement = aElements[i];

    oElement.disabled = true;
  }
}

scope.UpdateHiddenFormField = function (oEvent){
  var oTarget = CrossBrowser.GetTarget(oEvent);

  var oNewInput = window.document.createElement('input');
  oNewInput.type = "hidden";
  oNewInput.name = oTarget.form.id;
  oNewInput.value = oTarget.id;
  oTarget.form.appendChild(oNewInput);
}

scope.ApplyDisablingToSubmission = function(){
  var i,oElement,aElements = window.document.getElementsByTagName('form');

  if (aElements.length < 1)
    return false;

  for (i = aElements.length; i--; ) {
    oElement = aElements[i];
    CrossBrowser.AttachEventListener(oElement, "submit", scope.DisableAllButtons);
  }

  aElements = window.document.getElementsByTagName('input');
  for (i = aElements.length; i--; ) {
    oElement = aElements[i];

    if ((oElement.type == "submit")||
        (oElement.type == "reset")||
        (oElement.type == "button")){
      CrossBrowser.AttachEventListener(oElement, "click", scope.UpdateHiddenFormField);
    }
  }

  return true;
}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/

CrossBrowser.AttachEventListener(window, "load", scope.ApplyDisablingToSubmission);


/** </Module> **/