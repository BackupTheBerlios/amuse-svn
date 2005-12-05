
/** <Module name="OnlyScriptElements"> **/
/** Description: this module will convert to invisible all the elements with
    the class "clsOnlyScript" found. It's a way to have an inverse of the
    <noscript> element. **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/

RequireOnce("CssHandling.js");  /* {RemoveClass(...) needed} */
RequireOnce("CrossBrowser.js"); /* {AttachEventListener(...) needed} */


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.sClsOnlyScript = "clsOnlyScript";


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.ApplyVisibilityToOnlyScriptElements = function(){
  var aElements = window.document.getElementsByTagName('*');

  for (var i = 0; i < aElements.length; i++) {
    var oElement = aElements[i];

    if (oElement.className){
      CssHandling.RemoveClass(oElement, scope.sClsOnlyScript);
    }
  }
}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/

CrossBrowser.AttachEventListener(window, "load", scope.ApplyVisibilityToOnlyScriptElements);

/** </Module> **/
