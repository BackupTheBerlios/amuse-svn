
/** <Module name="IntroEnhancements"> **/
/** Description: You can use this module to disable the behaviour of some 
    browsers of submitting a form when the user hits Enter. Just attach
    the class "clsDisableIntro" to the input elements you want to fix.
    Browsers supported: Firefox & IE. **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/

RequireOnce("CssHandling.js");      /* {HasClass(...) needed} */
RequireOnce("ArraysAdvanced.js");   /* {FindElementInArray(...) needed} */
RequireOnce("CrossBrowser.js");     /* {AttachEventListener(...) needed} */
RequireOnce("FunctionForEvent.js"); /* {AddFunctionToOnKeyPressDownEvent(...) needed} */


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.sClsDisableIntro = "clsDisableIntro";
scope.sClsAutoNextTabIndex = "clsAutoNextTabIndex";
/* FIXME: clsAutoNextTabIndex only works on Firefox 1.0x */

/* the following is a list of ASCII codes
   which correspond to keyboard keys */
scope.CHARCODE_KEY_TAB        =   9;
scope.CHARCODE_KEY_INTRO      =  13;
scope.CHARCODE_KEY_SHIFT      =  16;
scope.CHARCODE_KEY_CTRL       =  17;
scope.CHARCODE_KEY_ALT        =  18;
scope.CHARCODE_KEY_BLOQCAP    =  20;
scope.CHARCODE_KEY_REPAG      =  33;
scope.CHARCODE_KEY_AVPAG      =  34;
scope.CHARCODE_KEY_END        =  35;
scope.CHARCODE_KEY_START      =  36;
scope.CHARCODE_KEY_ARROWLEFT  =  37;
scope.CHARCODE_KEY_ARROWUP    =  38;
scope.CHARCODE_KEY_ARROWRIGHT =  39;
scope.CHARCODE_KEY_ARROWDOWN  =  40;
scope.CHARCODE_KEY_BLOQNUM    = 144;

scope.aNotChangeableKeys =
  [scope.CHARCODE_KEY_SHIFT,
   scope.CHARCODE_KEY_TAB,
/* scope.CHARCODE_KEY_INTRO, */
   scope.CHARCODE_KEY_CTRL,
   scope.CHARCODE_KEY_ALT,
   scope.CHARCODE_KEY_BLOQCAP,
   scope.CHARCODE_KEY_REPAG,
   scope.CHARCODE_KEY_AVPAG,
   scope.CHARCODE_KEY_END,
   scope.CHARCODE_KEY_START,
   scope.CHARCODE_KEY_ARROWLEFT,
   scope.CHARCODE_KEY_ARROWUP,
   scope.CHARCODE_KEY_ARROWRIGHT,
   scope.CHARCODE_KEY_ARROWDOWN,
   scope.CHARCODE_KEY_BLOQNUM];


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.NotChangeableKey = function(iCharCode){
  return (ArraysAdvanced.FindElementInArray(iCharCode,aNotChangeableKeys,ArraysAdvanced.Equals));
}

scope.DisableIntroEventOnly = function(oEvent) {
  var iCode = CrossBrowser.GetKeyCode(oEvent);
  return (iCode != scope.CHARCODE_KEY_INTRO);
}

scope.AutoNextTabIndex = function(oEvent){
  var iCode = CrossBrowser.GetKeyCode(oEvent);
  var oTarget = CrossBrowser.GetTarget(oEvent);

  var iNextTabIndex = oTarget.tabIndex + 1;
  if (iCode == scope.CHARCODE_KEY_INTRO){
    var aElts = window.document.getElementsByTagName('*');
    var oNextElement = null;
    var bNotFound = true;
    var i = 0;

    while(bNotFound && (i < aElts.length)){
      var oElt = aElts[i];

      if (oElt.tabIndex){
        if (oElt.tabIndex == iNextTabIndex){
          oNextElement = oElt;
          bNotFound = false;
        }
      }
      i++;
    }

    if (!bNotFound){
      /* FIXME: JS exception is thrown here in Mozilla, why?? */
      oNextElement.focus();
    }
    return false;
  }
  return true;
}

scope.ApplyGeneralOnChangeEventsToSpecificInputs = function(){
  var aElements = window.document.getElementsByTagName('*');
  var iTabIndex = 1;

  for (var i = 0; i < aElements.length; i++) {
    var oElement = aElements[i];

    if (oElement.className){
      if (CssHandling.HasClass(oElement,scope.sClsDisableIntro)) {
        FunctionForEvent.AddFunctionToOnKeyPressDownEvent(scope.DisableIntroEventOnly,oElement);
      }
      if (CssHandling.HasClass(oElement,scope.sClsAutoNextTabIndex)){
        if (oElement.tabIndex < 0){
          oElement.tabIndex = iTabIndex;
          iTabIndex++;
        }

        FunctionForEvent.AddFunctionToOnKeyPressDownEvent(scope.AutoNextTabIndex,oElement);
      }
    }
  }

}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/

CrossBrowser.AttachEventListener(window,
                                 "load",
                                 scope.ApplyGeneralOnChangeEventsToSpecificInputs);


/** </Module> **/
