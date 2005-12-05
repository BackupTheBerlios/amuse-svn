
/** <Library name="FunctionForEvent"> **/

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

scope.AddFunctionToAnyChangeEvent = function(fFunction,oInput){
  CrossBrowser.AttachEventListener(oInput, "change", fFunction);
  CrossBrowser.AttachEventListener(oInput, "keyup", fFunction);
  CrossBrowser.AttachEventListener(oInput, "keydown", fFunction);
  CrossBrowser.AttachEventListener(oInput, "keypress", fFunction);
}


scope.AddFunctionToOnKeyPressDownEvent = function(fFunction,oInput){

  if (CrossBrowser.IsIE()){
    CrossBrowser.AttachEventListener(oInput, "keydown", fFunction);
  }

  else {
    CrossBrowser.AttachEventListener(oInput, "keypress", fFunction);
  }
}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/


/** </Library> **/
