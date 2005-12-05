
/** <Library name="FormValidation"> **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/

RequireOnce("ArraysAdvanced.js"); /* {FindElementInArray(...) needed} */


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.NODE_TYPE_COMMENT = 8;
scope.sClsFormValidationFailed = "clsFormValidationFailed";

/* used to focus when form validation fails */
scope.oFailedValidationInput = window.document;

/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.IsValidEmailAddress = function(sAddress){

  /* If a simple regular expression doesn't work */
  if (!new RegExp(/^test$/).test("test")){
    return true;
  }

  /* If the email address is empty */
  if(sAddress.trim() == ""){
    return false;
  }

  return new RegExp(/^[^@]+@[^@]+\.[^@]{2,}$/).test(sAddress.trim());
}

scope.CheckFilled = function(aRequiredInputs, sWarningMessage){
  var bFailed = false;

  for (var i = 0; i < aRequiredInputs.length; i++) {
    var oInput = aRequiredInputs[i];

    CssHandling.RemoveClass(oInput,scope.sClsFormValidationFailed);
    if (oInput.value.trim() == ""){
      bFailed = true;

      window.alert(sWarningMessage);
      oInput.focus();
      oInput.select();
      CssHandling.AddClass(oInput,scope.sClsFormValidationFailed);
    }
  }

  return (!bFailed);
}

scope.EvalForm = function(oXmlNode, oFirstInputNode){
  var aPossibleRuleTags = ["and","or","check","reject"];

  if ((oXmlNode.nodeType == scope.NODE_TYPE_COMMENT) ||
      (oXmlNode.nodeName == "xml")){
    return scope.EvalForm(oXmlNode.nextSibling, oFirstInputNode);
  }
  if (oXmlNode.nodeName == "formValidation"){
    if (oXmlNode.childNodes.length == 1){
      /* IE */
      return scope.EvalForm(oXmlNode.childNodes[0], oFirstInputNode);
    }
    else {
      /* Others */
      return scope.EvalForm(oXmlNode.childNodes[1], oFirstInputNode);
    }
  }
  if (oXmlNode.nodeName == "and"){
    for (var i = 0; (i < oXmlNode.childNodes.length); i++){
      var oChildNodeAND = oXmlNode.childNodes[i];
      if (ArraysAdvanced.FindElementInArray(oChildNodeAND.nodeName,aPossibleRuleTags,ArraysAdvanced.Equals)){
        if (!scope.EvalForm(oChildNodeAND, oFirstInputNode)){
          return false;
        }
      }
    }
    return true;
  }
  if (oXmlNode.nodeName == "or"){
    var oFirstChildNode = null;
    for (var j = 0; (j < oXmlNode.childNodes.length); j++){
      var oChildNodeOR = oXmlNode.childNodes[j];
      if (ArraysAdvanced.FindElementInArray(oChildNodeOR.nodeName,aPossibleRuleTags,ArraysAdvanced.Equals)){
        if (!oFirstChildNode){
          oFirstChildNode = oChildNodeOR;
        }
        if (scope.EvalForm(oChildNodeOR, oFirstChildNode)){
          return true;
        }
      }
    }
    return false;
  }
  if (oXmlNode.nodeName == "check"){
    var bValidation;
    var oInput = window.document.getElementById(oXmlNode.getAttribute("name"));
    var sValue = oInput.value;
    CssHandling.RemoveClass(oInput, scope.sClsFormValidationFailed);

    if (oFirstInputNode){
      oInput = window.document.getElementById(oFirstInputNode.getAttribute("name"));
    }
    
    bValidation = (sValue.trim().length > 0);
    if (!bValidation){
      oFailedValidationInput = oInput;
    }
    return bValidation;
  }

  return true;
}

scope.ValidateFormFromXML = function(oXmlRequest) {
  if (oXmlRequest){

    /* only if status shows "loaded" */
    if (oXmlRequest.readyState == 4) {

      /* only if "OK" */
      if (oXmlRequest.status == 200) {
        return scope.EvalForm(oXmlRequest.responseXML.firstChild,null);
      }
    }
  }

  /* in case of fail to retrieve, ignore client validation
     because server validation will take place */
  return true;
}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/


/** </Library> **/
