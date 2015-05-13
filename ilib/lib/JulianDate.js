var ilib=require("./ilib.js");var SearchUtils=require("./SearchUtils.js");var MathUtils=require("./MathUtils.js");var Locale=require("./Locale.js");var LocaleInfo=require("./LocaleInfo.js");var TimeZone=require("./TimeZone.js");var IDate=require("./IDate.js");var Calendar=require("./Calendar.js");var JulianRataDie=require("./JulianRataDie.js");var JulianCal=require("./JulianCal.js");var JulianDate=function(t){this.cal=new JulianCal;if(t){if(t.locale){this.locale=typeof t.locale==="string"?new Locale(t.locale):t.locale;var e=new LocaleInfo(this.locale);this.timezone=e.getTimeZone()}if(t.timezone){this.timezone=t.timezone}if(t.year||t.month||t.day||t.hour||t.minute||t.second||t.millisecond){this.year=parseInt(t.year,10)||0;this.month=parseInt(t.month,10)||1;this.day=parseInt(t.day,10)||1;this.hour=parseInt(t.hour,10)||0;this.minute=parseInt(t.minute,10)||0;this.second=parseInt(t.second,10)||0;this.millisecond=parseInt(t.millisecond,10)||0;this.dayOfYear=parseInt(t.dayOfYear,10);if(typeof t.dst==="boolean"){this.dst=t.dst}this.rd=this.newRd(this);if(!this.tz){this.tz=new TimeZone({id:this.timezone})}this.offset=this.tz._getOffsetMillisWallTime(this)/864e5;if(this.offset!==0){this.rd=this.newRd({rd:this.rd.getRataDie()-this.offset})}}}if(!this.rd){this.rd=this.newRd(t);this._calcDateComponents()}};JulianDate.prototype=new IDate({noinstance:true});JulianDate.prototype.parent=IDate;JulianDate.prototype.constructor=JulianDate;JulianDate.prototype.newRd=function(t){return new JulianRataDie(t)};JulianDate.prototype._calcYear=function(t){var e=Math.floor((4*(Math.floor(t)-1)+1464)/1461);return e<=0?e-1:e};JulianDate.prototype._calcDateComponents=function(){var t,e,i=this.rd.getRataDie();this.year=this._calcYear(i);if(typeof this.offset==="undefined"){this.year=this._calcYear(i);if(!this.tz){this.tz=new TimeZone({id:this.timezone})}this.offset=this.tz.getOffsetMillis(this)/864e5}if(this.offset!==0){i+=this.offset;this.year=this._calcYear(i)}var a=this.newRd({year:this.year,month:1,day:1,hour:0,minute:0,second:0,millisecond:0});t=i+1-a.getRataDie();e=this.cal.isLeapYear(this.year)?JulianCal.cumMonthLengthsLeap:JulianCal.cumMonthLengths;this.month=SearchUtils.bsearch(Math.floor(t),e);t=t-e[this.month-1];this.day=Math.floor(t);t-=this.day;t=Math.round(t*864e5);this.hour=Math.floor(t/36e5);t-=this.hour*36e5;this.minute=Math.floor(t/6e4);t-=this.minute*6e4;this.second=Math.floor(t/1e3);t-=this.second*1e3;this.millisecond=t};JulianDate.prototype.getDayOfWeek=function(){var t=Math.floor(this.rd.getRataDie()+(this.offset||0));return MathUtils.mod(t-2,7)};JulianDate.prototype.getCalendar=function(){return"julian"};IDate._constructors["julian"]=JulianDate;module.exports=JulianDate;