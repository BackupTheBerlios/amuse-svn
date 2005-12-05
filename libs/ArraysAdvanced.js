
/** <Library name="ArraysAdvanced"> **/

/*/////////////////////////////////////////////////
// Dependencies ///////////////////////////////////
/////////////////////////////////////////////////*/


/*/////////////////////////////////////////////////
// Variables //////////////////////////////////////
/////////////////////////////////////////////////*/


/*/////////////////////////////////////////////////
// Functions //////////////////////////////////////
/////////////////////////////////////////////////*/

scope.Equals = function(vArg1, vArg2){
  return (vArg1 == vArg2);
}

scope.BeginsWith = function(sArg1, sArg2){
  var sArgLong, sArgShort;

  if (sArg1.length > sArg2.length){
    sArgLong = sArg1;
    sArgShort = sArg2;
  }
  else {
    sArgLong = sArg2;
    sArgShort = sArg1;    
  }

  return (sArgLong.substr(0, sArgShort.length) == sArgShort);
}

scope.FindElementInArray = function(oElement, aElements, fCompare){
  var i = 0;
  var bNotFound = true;

  while ((i < aElements.length) && (bNotFound)){
    if (fCompare(aElements[i],oElement)){
      bNotFound = false;
    }
    i++;
  }

  return (!bNotFound);
}

scope.RemoveElementFromArray = function(oElement, aElements){
  var i,aNewArray = Array();

  for (i = 0; (i < aElements.length); i++){
    if (aElements[i] != oElement){
      aNewArray.push(aElements[i]);
    }
  }

  return aNewArray;
}


/*/////////////////////////////////////////////////
// Initializations ////////////////////////////////
/////////////////////////////////////////////////*/



/** </Library> **/
