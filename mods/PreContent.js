
/** <Module name="PreContent"> **/
/** Description: this module gives a new feature to web pages so as to
    improve the UI behaviour consistency. It will make appear a "transitional"
    DIV, where you can put a label like "LOADING...", until the load event
    of the window fires, in which moment the module will hide this DIV and
    show the normal contents. You have to add the class "clsPostContentHidden"
    to the elements you want to hide until the load of the page. After that,
    make a transitional DIV (with id="divLoading") which contains the classes
    "clsLoading clsPreContent". 

    This module is useful, above all, when you are attaching JS behaviours to
    your UI using Unobstrusive Javascript (1). This way, we fix the issue of the 
    Unobstrusive Javascript method: "if the user has a slow connection, JS
    behaviours won't be catched until the end of the page loading has reached;
    which could lead to inconsistent UI behaviour".

    (1) http://www.onlinetools.org/articles/unobtrusivejavascript/index.html 

    NOTE: this module is not yet compatible with Dean Edwards' IE7.

  **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/

RequireOnce("CrossBrowser.js"); /* {AttachEventListener(...) needed} */
RequireOnce("CssHandling.js");  /* {ToAbsent(...),ToPresent(...) needed} */


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.sClsPostContent = "clsPostContent";
scope.sClsPostContentHidden = "clsPostContentHidden";
scope.sClsPreContent = "clsPreContent";
scope.sClsLoading = "clsLoading";
scope.sPathToPreContentCssFile = "./css/general/"
scope.sPreContentCssFileName = "precontent.css";
/* Note: add the following CSS code to the file above:

  .clsPostContentHidden {
    visibility: hidden;
    display: none;
  }

  .clsPreContent {
    display: block !important;
    visibility: visible !important;
  }

*/
scope.bTransitionWhenSubmit = true;
scope.bTransitionWhenLink = true;


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.CreatePreContentRules = function(){
  var oNewLink = window.document.createElement("link");
  oNewLink.id = "lnkPreContent";
  oNewLink.type = "text/css";
  oNewLink.rel = "stylesheet";
  oNewLink.href = scope.sPathToPreContentCssFile + scope.sPreContentCssFileName;

  var oHead = window.document.getElementsByTagName("head")[0];
  oHead.appendChild(oNewLink);

  /*

  FIXME: Perhaps it's better to use <style> instead of <link />, but:

  This method does not work on IE, even using innerText instead of createTextNode!:

  var oNewStyle = window.document.createElement("style");
  oNewStyle.type = "text/css";
  var sRules = "." + sClsWaitForOnload + " { display: none;  visibility: hidden; }";
  var oRules = window.document.createTextNode(sRules);
  if (IsIE()){
    oNewStyle.innerText = sRules;
  }
  else {
    oNewStyle.appendChild(oRules);
  }
  oHead.appendChild(oNewStyle);

  */
}

scope.ShowPreContent = function(){
  var oDivLoading = window.document.getElementById("divLoading");
  CssHandling.AddClass(oDivLoading, scope.sClsPreContent);

  var aElements = window.document.getElementsByTagName("*");
  for (var i = 0; i < aElements.length; i++) {
    var oElement = aElements[i];

    if ((oElement.className) &&
        (CssHandling.HasClass(oElement, scope.sClsPostContent))){
      CssHandling.RemoveClass(oElement, scope.sClsPostContent);
      CssHandling.AddClass(oElement, scope.sClsPostContentHidden);
    }
  }
  return true;
}

scope.HidePreContent = function(){
  var oDivLoading = window.document.getElementById("divLoading");
  CssHandling.RemoveClass(oDivLoading, scope.sClsPreContent);

  var aElements = window.document.getElementsByTagName("*");
  for (var i = 0; i < aElements.length; i++) {
    var oElement = aElements[i];

    if ((oElement.className) &&
        (CssHandling.HasClass(oElement, scope.sClsPostContentHidden))){
      CssHandling.RemoveClass(oElement, scope.sClsPostContentHidden);
      CssHandling.AddClass(oElement, scope.sClsPostContent);
    }
  }
}

scope.OnBeforeUnloadLinkIE = function(oEvent){
  var oTarget = CrossBrowser.GetTarget(oEvent);

  if ((!global.AccessiblePopups) ||
      (!CssHandling.HasClassBeginningWith(oTarget, AccessiblePopups.sClsPopup))){
    return scope.ShowPreContent();
  }
  return true;
}

/* IE does not implement onbeforeunload event */
scope.ApplyTransitionBehaviour = function() {
  if (CrossBrowser.IsIE()){

    var i,oElement,aElements;

  
    if (scope.bTransitionWhenSubmit){
      aElements = window.document.getElementsByTagName('form');

      if (aElements.length > 0){
        for (i = aElements.length; i--; ) {
          oElement = aElements[i];
          CrossBrowser.AttachEventListener(oElement, "submit", scope.ShowPreContent);
        }
      }
    }

    if (scope.bTransitionWhenLink){
      aElements = window.document.getElementsByTagName('a');

      if (aElements.length > 0){
        for (i = aElements.length; i--; ) {
          oElement = aElements[i];
          CrossBrowser.AttachEventListener(oElement, "click", scope.OnBeforeUnloadLinkIE);
        }
      }
    }
  }

  return true;
}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/

scope.CreatePreContentRules();
CrossBrowser.AttachEventListener(window, "load", scope.HidePreContent);
CrossBrowser.AttachEventListener(window, "load", scope.ApplyTransitionBehaviour);
CrossBrowser.AttachEventListener(window, "unload", scope.HidePreContent);
CrossBrowser.AttachEventListener(window, "beforeunload", scope.ShowPreContent);

/** </Module> **/
