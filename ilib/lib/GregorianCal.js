var ilib=require("./ilib.js");var Utils=require("./Utils.js");var MathUtils=require("./MathUtils.js");var Calendar=require("./Calendar.js");var GregorianCal=function(r){if(!r||!r.noinstance){this.type="gregorian"}};GregorianCal.monthLengths=[31,28,31,30,31,30,31,31,30,31,30,31];GregorianCal.prototype.getNumMonths=function(r){return 12};GregorianCal.prototype.getMonLength=function(r,e){if(r!==2||!this.isLeapYear(e)){return GregorianCal.monthLengths[r-1]}else{return 29}};GregorianCal.prototype.isLeapYear=function(r){var e=typeof r==="number"?r:r.getYears();var t=MathUtils.mod(e,400);return MathUtils.mod(e,4)===0&&t!==100&&t!==200&&t!==300};GregorianCal.prototype.getType=function(){return this.type};GregorianCal.prototype.newDateInstance=function(r){var e=module.require("./GregorianDate.js");return new e(r)};Calendar._constructors["gregorian"]=GregorianCal;module.exports=GregorianCal;