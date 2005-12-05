
/** <Module name="PrintLink"> **/
/** Description: do you want a link to display the print browser dialog?
    Just attach the class "clsPrint" to the link and load this module. **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/

RequireOnce("CssHandling.js");  /* {HasClassBeginningWith(...) needed} */
RequireOnce("CrossBrowser.js"); /* {AttachEventListener(...) needed} */


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.sClsPrint = "clsPrint";


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.PrintMe = function() {
  /* check if any print method exist, as recommended in: 
     http://www.quirksmode.org/js/print.html */
  if (window.print){
    window.print();
  }
	else if (VBS) {
    printIt();
  }
  else {
    return true;
  }
  return false;
}

scope.ApplyPrintBehaviourToSpecificLinks = function(){
  var aElements = window.document.getElementsByTagName('a');

  for (var i = 0; i < aElements.length; i++) {
    var oElement = aElements[i];

    if (CssHandling.HasClassBeginningWith(oElement, scope.sClsPrint)){
      CrossBrowser.AttachEventListener(oElement, "click", PrintMe);
    }
  }

}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/

CrossBrowser.AttachEventListener(window, "load", ApplyPrintBehaviourToSpecificLinks);


/** </Module> **/

