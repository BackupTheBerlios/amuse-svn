/************************************************
 * this condition is used to disable javascript *
 * enhancement features when using Netscape 4,  *
 * because of the lack of good js support of N4 */
                                     if (!IsN4()){
/************************************************/

RequireOnce("PreContent.js");

RequireOnce("OnlyScriptElements.js");

RequireOnce("AccessiblePopups.js");

RequireOnce("IntroEnhancements.js");

RequireOnce("DisableAtSubmit.js");


/************************************************
 * this is the end of the block which condition *
 * was: if (!IsN4()){                           *
 * look at the top of this file to find it out  */
                                                 }
/************************************************/