var CType=require("./CType.js");var isCntrl=require("./isCntrl.js");var isPrint=function(i){return typeof i!=="undefined"&&i.length>0&&!isCntrl(i)};isPrint._init=function(i,n,r){isCntrl._init(i,n,r)};module.exports=isPrint;