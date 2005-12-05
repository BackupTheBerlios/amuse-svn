
/** <Module name="AccessiblePopups"> **/
/** Description: this module allows to create pages that will create popup
    windows and even they will be accessible because non-JavaScript browsers
    are supported. Also, it offers an ultra-fast method to attach the
    "popup-behaviour" to links: just add a new class called clsPopup or
    clsPopupModal and attach its dimensions as: clsPopup:640x480

    If you want to hide some webpage elements only if a popup has been used
    for displaying, you can attach the class "clsHideOnPopup" to those elements.

 **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/

RequireOnce("CssHandling.js");  /* {HasClassBeginningWith(...) needed} */
RequireOnce("CrossBrowser.js"); /* {AttachEventListener(...) needed} */
RequireOnce("Debug.js");        /* {Alert(...) needed} */


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.sClsPopup = "clsPopup";
scope.sClsPopupModal = "clsPopupModal";
scope.sClsHideOnPopup = "clsHideOnPopup";
scope.sPathToPopupCssFile = "./css/general/"
scope.sPopupCssFileName = "popup.css";
/* Note: add the following CSS code to the file above:

  .clsHideOnPopup {
    visibility: hidden;
    display: none;
  }

*/
scope.sErrorPopup = "Error: no URL received for Popup.";
scope.sErrorLink  = "Error: the link that contains the target element of the event was not found.";


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.CheckModalFocus = function(oEvent){
  if ((window.oModalPopup) && (!window.oModalPopup.closed)){
    window.oModalPopup.focus();
    CrossBrowser.CancelEvent(oEvent);
  }
  return true;
}

scope.OpenPopup = function(sURL,bModal,iWidth,iHeight){
  var oNewWindow = null;
  var oParentWindow = window;

  if (!sURL){
    window.alert(sErrorPopup);
    return oNewWindow;
  }

  /* default features for all popup windows */
  var aFeatures = ["resizable=1", /* a11y reasons! */
                   "dependent=yes", /* minimizes and closes when parent is minimized/closed (except IE) */
                   "status=yes", /* default for Mozilla, setting for IE */
                   "titlebar=yes", /* default for both */
                   "menubar=no" ];

  if (iWidth && iHeight){
    aFeatures.push("width=" + iWidth);
    aFeatures.push("height=" + iHeight);

    /* same features as above, as stated in http://www.mozilla.org/docs/dom/domref/dom_window_ref76.html */
    aFeatures.push("innerWidth=" + iWidth);
    aFeatures.push("innerHeight=" + iHeight);
  }

  /* code block to set the new window in the center of the screen
     NOTE: this is not very recommended because it will not work
     correctly in every case (i.e. when the user has two screens:
     https://bugzilla.mozilla.org/show_bug.cgi?id=291434 ) */
  if (iWidth && iHeight && window.screen.width && window.screen.height){

    /* FIXME: rename the variables to "vWidth" and so on, and
       check its type to check if parseint or not
       [if (typeof(iWidth) == "string")] */
    var iX = (window.screen.width-parseInt(iWidth))/2;
    var iY = (window.screen.height-parseInt(iHeight))/2;

    aFeatures.push("screenX=" + iX);
    aFeatures.push("left=" + iX);

    aFeatures.push("screenY=" + iY);
    aFeatures.push("top=" + iY);
  }


  if (aFeatures.length > 0){
    oNewWindow = window.open(sURL, "", aFeatures.join(","));
  }
  else {
    oNewWindow = window.open(sURL, "");
  }

  /* perhaps oNewWindow remains null because popup-blocking features */
  if (oNewWindow){

    /* we need this to hide elements with clsHideOnPopup class */
    oNewWindow.bHideOnPopup = true;

    /* opener support for ancient browsers
      (http://www.quirksmode.org/js/croswin.html) */
    if (!oNewWindow.opener){
      oNewWindow.opener = self;
    }

    if (bModal){
      oParentWindow.oModalPopup = oNewWindow;
    }

    /* if the focus window is not supported, don't call it.
      earlier, this was done by a try-catch */
    if ((!oNewWindow.closed)&&
        (oNewWindow.focus)){
      oNewWindow.focus();
    }

    if (bModal){
      /* NOTE: Be careful! Don't rely on the "modalness" of this window, above all when
        talking about IE, because the onfocus catch is buggy and sometimes the window
        is allowed to get it */
      CrossBrowser.AttachEventListener(oParentWindow, "focus", CheckModalFocus);
    }
  }

  return oNewWindow;
}

scope.HideOnPopup = function(oEvent){

  if (window.bHideOnPopup){
    var oNewLink = window.document.createElement("link");
    oNewLink.id = "lnkHideOnPopup";
    oNewLink.type = "text/css";
    oNewLink.rel = "stylesheet";
    oNewLink.href = scope.sPathToPopupCssFile + scope.sPopupCssFileName;

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

    return true;
  }
  return false;
}

scope.PreparePopup = function (oEvent){
  var oTarget = CrossBrowser.GetTarget(oEvent);

  /* In case the user has clicked an element that is INSIDE the link
     element (i.e.: <a href="..."><img src="" /></a>, we have to search
     the link through the parentNode references */
  var oLink = oTarget;
  while ((oLink.tagName.toLowerCase() != "a") &&
         (oLink.tagName.toLowerCase() != "body")){
    oLink = oLink.parentNode;
  }
  if (oLink.tagName.toLowerCase() == "body"){
    window.alert(sErrorLink);
    return false;
  }

  var bModal = CssHandling.HasClassBeginningWith(oLink, scope.sClsPopupModal);

  /* we need a try-catch or else IE will show an error when
     a popup is launched and somebody closes it before it is loaded */
  try {
    var oPopup = scope.OpenPopup(oLink.href, bModal, oLink.iPopupWidth, oLink.iPopupHeight);
  }
  catch(oException){}

  CrossBrowser.CancelEvent(oEvent);

  return true;
}

scope.ApplyPopupBehaviourToSpecificLinks = function(){
  Debug.Alert("Searching for popups...");

  var aElements = window.document.getElementsByTagName('a');

  for (var i = 0; i < aElements.length; i++) {
    var oElement = aElements[i];

    if (CssHandling.HasClassBeginningWith(oElement, scope.sClsPopup)){

      /* To indicate the popup resolution, you must specify it in the className, this way:
         class="clsPopup:640x480"

         Something like clsPopup[640x480] or clsPopup(640x480) is not allowed because
         those characters cannot be used for classname attribute, as the XHTML spec says.

         Before, this was done by height and width CSS attributes. But it is no longer
         used this way because those properties can be used with display:block for 
         layout purposes. We cannot even use vendor-specific CSS atributes (like
         -amuse-popup-height) because the JS DOM of IE & Mozilla don't see them
         through the "stylesheet" object.

         When this technique was being used, we needed an "ultimate" stylesheet
         to tell IE not to acquire the height-width values for links:

          a {
            \* We must set these properties back again to auto
            or otherwise IE will render the link elements too big,
            and this elements where intended to be used as
            information for how the popup windows will appear.
            The "important" word is used so as IE thinks these
            rules are needed to restore a property which is less
            specific than the older ones: *\

            width: auto !important;
            height: auto !important;
          }
      */

      sPopupPattern = scope.sClsPopup;
      if (CssHandling.HasClassBeginningWith(oElement, scope.sClsPopupModal)){
        sPopupPattern = scope.sClsPopupModal;
      }

      var oRegExp = new RegExp("\\s*(\\S+\\s+)*" + sPopupPattern
                             + ":(\\d*)x(\\d*)(\\s+\\S+)*\\s*");
      var aMeasures = oRegExp.exec(oElement.className);
      if (aMeasures){
        oElement.iPopupWidth = aMeasures[2];
        oElement.iPopupHeight = aMeasures[3];
      }

      CrossBrowser.AttachEventListener(oElement, "click", scope.PreparePopup);
    }

  }

  return true;
}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/

scope.HideOnPopup();
CrossBrowser.AttachEventListener(window, "load", scope.ApplyPopupBehaviourToSpecificLinks);


/** </Module> **/
