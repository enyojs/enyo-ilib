var ilib=require("./ilib.js");var CType=require("./CType.js");var IString=require("./IString.js");var isBlank=function(ch){var num;switch(typeof ch){case"number":num=ch;break;case"string":num=IString.toCodePoint(ch,0);break;case"undefined":return false;default:num=ch._toCodePoint(0);break}return CType._inRange(num,"blank",ilib.data.ctype)};isBlank._init=function(sync,loadParams,onLoad){CType._init(sync,loadParams,onLoad)};module.exports=isBlank;