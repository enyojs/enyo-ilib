var ilib=require("./ilib.js");var MathUtils=require("./MathUtils.js");var Calendar=require("./Calendar.js");var GregorianCal=require("./GregorianCal.js");var ThaiSolarCal=function(){this.type="thaisolar"};ThaiSolarCal.prototype=new GregorianCal({noinstance:true});ThaiSolarCal.prototype.parent=GregorianCal;ThaiSolarCal.prototype.constructor=ThaiSolarCal;ThaiSolarCal.prototype.isLeapYear=function(a){var r=typeof a==="number"?a:a.getYears();r-=543;var e=MathUtils.mod(r,400);return MathUtils.mod(r,4)===0&&e!==100&&e!==200&&e!==300};ThaiSolarCal.prototype.newDateInstance=function(a){var r=module.require("./ThaiSolarDate.js");return new r(a)};Calendar._constructors["thaisolar"]=ThaiSolarCal;module.exports=ThaiSolarCal;