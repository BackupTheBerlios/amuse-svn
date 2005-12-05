
/** <AMUSE> **/
/** Description: Ajax-based Module Unobstrusive System for Ecmascript.
    (Functions for loading external libraries.) **/

/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/

/* this variable returns the global scope:
   [ http://groups.google.es/group/comp.lang.javascript/messages/e1f47303acb6dd3e,43476095ba7ce583,e95fd12220ea5cc2,3899e172f1c9d483,6f4b4257952d7c9a,97563d172bd94eef?hl=es&thread_id=2ae5bac38796f807&mode=thread&noheader=1&q=knocte+xmlhttprequest&_done=%2Fgroup%2Fcomp.lang.javascript%2Fbrowse_frm%2Fthread%2F2ae5bac38796f807%2Fe1f47303acb6dd3e%3Fq%3Dknocte+xmlhttprequest%26rnum%3D1%26hl%3Des%26#doc_97563d172bd94eef ]
*/
var global = (function(){ return this; })();
/* we cannot use 'const' instead of 'var'
   because it seems not to be supported by IE */

global.sFileNotFound = "Error: JS library/module file not found.";
global.sLibsDir = "./js/general/libs/";
global.sModsDir = "./js/general/mods/";
/* Hashtable: according to http://www.crockford.com/javascript/survey.html
   ("Objects" section), objects/arrays in JavaScript are also Hashtables */
global.hLoadedFiles = {};


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

/* Netscape 4 won't be allowed to execute javascript or call modules */
global.IsN4 = function(){
  return ((window.document.layers?true:false)&&
         !(window.document.all?true:false));
}

/************************************************
 * this condition is used to disable javascript *
 * enhancement features when using Netscape 4,  *
 * because of the lack of good js support of N4 */
                                     if (!IsN4()){
/************************************************/

global.RequestDocument = function(sURL, bAsync, fFunction) {
  var oXmlRequest = null;

  /* branch for native XMLHttpRequest object */
  if (window.XMLHttpRequest) {
    oXmlRequest = new XMLHttpRequest();
    if (fFunction){
      oXmlRequest.onreadystatechange = function(){
        return fFunction(oXmlRequest);
      }
    }
    oXmlRequest.open("GET", sURL, bAsync);
    oXmlRequest.send(null);
  }
  /* branch for IE/Windows ActiveX version */
  else if (window.ActiveXObject) {
    oXmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
    if (fFunction){
      oXmlRequest.onreadystatechange = function(){
        return fFunction(oXmlRequest);
      }
    }
    oXmlRequest.open("GET", sURL, bAsync);
    oXmlRequest.send();
  }

  return oXmlRequest;
}

global.EvalScriptFile = function(oDocument, sPackageName){
  if (oDocument){
    /* only if status shows "loaded" */
    if (oDocument.readyState == 4) {
      /* only if "OK" */
      if (oDocument.status == 200) {
        var scope = new Object();
        eval(oDocument.responseText);
        global[sPackageName] = scope;
        return true;
      }
      else if (oDocument.status == 404) {
        return false;
      }
      return false;
    }
  }
}

global.LoadScriptFile = function(sScriptFile){
  var oScriptFileRequest = RequestDocument(sLibsDir + sScriptFile, false, null);
  var sPackageName = sScriptFile.substr(0,sScriptFile.lastIndexOf(".js"));

  if (!EvalScriptFile(oScriptFileRequest, sPackageName)){
    oScriptFileRequest = RequestDocument(sModsDir + sScriptFile, false, null);

    if (!EvalScriptFile(oScriptFileRequest, sPackageName)){
      //window.alert(sFileNotFound + " [" + sScriptFile + "]");
      return false;
    }
  }
  return true;
}

global.Require = function(sScriptFile){
  if (LoadScriptFile(sScriptFile)){
    //window.alert("Script "+sScriptFile+" loaded.");
    global.hLoadedFiles[sScriptFile] = true;
    return true;
  }
  return false;
}

global.RequireOnce = function(sScriptFile){
  if (!global.hLoadedFiles[sScriptFile]){
    //window.alert("Trying to load module "+sScriptFile+" for the first time.");
    return Require(sScriptFile);
  }
  //window.alert("Script "+sScriptFile+" already loaded, aborting load.");
  return false;
}

/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/


/** </AMUSE> **/

/************************************************
 * this is the end of the block which condition *
 * was: if (!IsN4()){                           *
 * look at the top of this file to find it out  */
                                                 }
/************************************************/