var ilib=require("./ilib.js");var MathUtils=require("./MathUtils.js");var Calendar=require("./Calendar.js");var IslamicCal=function(){this.type="islamic"};IslamicCal.monthLengths=[30,29,30,29,30,29,30,29,30,29,30,29];IslamicCal.prototype.getNumMonths=function(year){return 12};IslamicCal.prototype.getMonLength=function(month,year){if(month!==12){return IslamicCal.monthLengths[month-1]}else{return this.isLeapYear(year)?30:29}};IslamicCal.prototype.isLeapYear=function(year){return MathUtils.mod(14+11*year,30)<11};IslamicCal.prototype.getType=function(){return this.type};IslamicCal.prototype.newDateInstance=function(options){var IslamicDate=require("./IslamicDate.js");return new IslamicDate(options)};Calendar._constructors["islamic"]=IslamicCal;module.exports=IslamicCal;