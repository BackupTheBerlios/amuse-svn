
/** <Library name="CrossBrowser"> **/
/** Description: this module contains several functions which wrap typical javascript instructions
    allowing to avoid Browser Detection. It contains also general DOM repair and extension stuff. **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/

RequireOnce("Debug.js"); /* {Alert(...) needed} */


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.sAttachingMethodNotFound = "Attention: no attaching method has been found.";


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.IsIE = function() {
  return window.document.all?true:false;
}

scope.GetKeyCode = function(oEvent){
  Debug.Alert("GetKeyCode function called");

  if (oEvent){
    if (oEvent.keyCode || oEvent.which){
      return (oEvent.keyCode ||  /* IE */ oEvent.which);
    }
    Debug.Alert("No keyCode defined on event.");

    return null;
  }

  window.alert("No event received.");

  return null;
}

scope.GetTarget = function(oEvent){
  return (oEvent.target ||  /* IE */ oEvent.srcElement);
}

scope.AttachEventListener = function(oElement, sActionType, fListener) {

  /* W3C */
  if (oElement.addEventListener){
    oElement.addEventListener(sActionType, fListener, true);
  }

  /* IE */
  else if(oElement.attachEvent){
    var fListener_IE = function(){
      var oEvent = window.event;

      if (oEvent.returnValue != false){
        return fListener(oEvent);
      }
      return false;
    };

    oElement.attachEvent("on" + sActionType, fListener_IE);
  }

  else {
    window.alert(sAttachingMethodNotFound);
  }
}

scope.CancelEvent = function(oEvent){

  /* W3C */
  if (oEvent.preventDefault){
    oEvent.preventDefault();
  }

  /* IE */
  else {
    oEvent.returnValue = false;
  }

}

/* GetCurrentTarget, GetRelatedTarget & ElementContainsElement not used yet! 
   http://kusor.net/traducciones/brainjar.es/events6.es.html */
scope.GetCurrentTarget = function(oEvent, /* "this" must be passed */ oThisElement ) {
  return (oEvent.currentTarget ||  /* IE */ oThisElement);
}
scope.GetRelatedTarget = function(oEvent){
  return (oEvent.relatedTarget ||  /* IE */ oEvent.toElement);
}
scope.ElementContainsElement = function(oParentElement, oChildElement){
  /* return true if first node contains second node */

  while (oChildElement.parentNode){
    if ((oChildElement = oChildElement.parentNode) == oParentElement){
      return true;
    }
  }
  return false;
}

scope.FixIeStyleSheetsRulesName = function() {

  /* FIXME: perhaps a for loop is not needed and we can
     redefine the property in a prototype */
  for (var i = 0; i < window.document.styleSheets.length; i++){
    if (window.document.styleSheets[i].rules){
      window.document.styleSheets[i].cssRules =
        window.document.styleSheets[i].rules;
    }
  }

}

scope.AddOptionToSelectInput = function(oNewOption, oSelect){
  try {
    /* standards compliant; doesn't work in IE */
    oSelect.add(oNewOption, null);
  }
  catch(ex) {
    /* IE only */
    oSelect.add(oNewOption);
  }
}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/

if (scope.IsIE() && !window.document.getElementById) {
  scope.getElementById_IE = function(sId){
    return window.document.all[sId];
  }

  window.document.getElementById = getElementById_IE;
}

if (scope.IsIE()) {
  scope.getElementsByTagName_IE = function(sTag){
    if ((!sTag)||(sTag=='')||(sTag=='*')){
      return window.document.all;
    }

    return document.all.tags(sTag);
  }
  window.document.getElementsByTagName = scope.getElementsByTagName_IE;
}


/* creation of string.trim function, extracted from
   http://chrispederick.com/work/javascript/source/string/string.js */
if (!String.prototype.trim){
  String.prototype.trim = function(){
    return this.replace(new RegExp("^\\s+|\\s+$", "gi"), "");
  }
}

/* creation or repair of array.push function, extracted from
   http://www.technicalpursuit.com/documents_codingstds.html */
if ((!Array.prototype.push) || ([1,2,3].push(0) == 0)){
  Array.prototype.push = function(){
  /**
    @method     push
    @abstract   An emulation of the 'push' function on Array. The push
                method places one or more elements on then end of the
                array.

                NOTE: This version of push returns the length of the
                array for JavaScript 1.3 compliance.
    @returns    Number  The length of receiver after push()
    @since      1.0b1
    */

    var i;
    for (i=0; i < arguments.length; i++){
      this[this.length] = arguments[i]; /* FIXME: arguments is deprecated in ECMAScript */
    }
    return this.length;
  }
}

/* creation of string.entitify function, extracted from
   http://www.crockford.com/javascript/remedial.html */
if (!String.prototype.entitify){
  String.prototype.entitify = function(){
    return this.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;");
  }
}

scope.AttachEventListener(window, "load", scope.FixIeStyleSheetsRulesName);

/** </Library> **/
