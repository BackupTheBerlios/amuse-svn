
/** <Library name="CssHandling"> **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.sClsInvisible = "clsInvisible";
scope.sClsAbsent = "clsAbsent";


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

/* functions AddClass, HasClass, RemoveClass,... made by Dean Edwards:
   http://dean.edwards.name/IE7/caveats/ */

scope.HasClass = function(oElement, sClassName) {
  var oRegexp = new RegExp("(^|\\s)" + sClassName + "(\\s|$)");

  return oRegexp.test(oElement.className);
};

scope.AddClass = function(oElement, sClassName) {
  if (!scope.HasClass(oElement, sClassName)) {
    if (oElement.className){
      oElement.className += " " + sClassName;
    }
    else {
      oElement.className = sClassName;
    }
  }
};

scope.RemoveClass = function(oElement, sClassName) {
  var oRegexp = new RegExp("(^|\\s)" + sClassName + "(\\s|$)");
  oElement.className = oElement.className.replace(oRegexp, "$2");
};

scope.HasClassBeginningWith = function(oElement, sClassName){
  if (scope.HasClass(oElement,sClassName)){
    return true;
  }
  var oRegexp = new RegExp("(^|\\s)" + sClassName + "[^\\s]+(\\s|$)"); 
  return oRegexp.test(oElement.className);
};

scope.GetPropertyValueFromClass = function(sClassName, sPropertyName){
  /* FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=292083 */

  var vReturn = null;

  for (var i = 0; i < window.document.styleSheets.length; i++){
    var cssRules = null;

    /* Mozilla and others */
    if (document.styleSheets[i].cssRules){
      cssRules = window.document.styleSheets[i].cssRules;
    }
    /* IE */
    else if (document.styleSheets[i].rules){
      cssRules = window.document.styleSheets[i].rules;
    }

    if (cssRules){
      for (var j = 0; j < cssRules.length; j++){
        if ((cssRules[j].selectorText) &&
            (cssRules[j].selectorText == ("." + sClassName)) &&
            (cssRules[j].style[sPropertyName] != null)){
          vReturn = cssRules[j].style[sPropertyName];
        }
      }
    }
  }

  return vReturn;
};

scope.ToInvisible = function (oElement){
  scope.AddClass(oElement, scope.sClsInvisible);
};

scope.ToAbsent = function(oElement){
  scope.AddClass(oElement, scope.sClsAbsent);
};

scope.ToPresent = function(oElement){
  scope.RemoveClass(oElement, scope.sClsAbsent);
};

/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/


/** </Library> **/
