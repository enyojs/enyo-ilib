var ilib=require("./ilib.js");var Utils=require("./Utils.js");var JSUtils=require("./JSUtils.js");var Locale=require("./Locale.js");var LocaleInfo=require("./LocaleInfo.js");var IDate=require("./IDate.js");var DateFactory=require("./DateFactory.js");var Calendar=require("./Calendar.js");var CalendarFactory=require("./CalendarFactory.js");var IString=require("./IString.js");var ResBundle=require("./ResBundle.js");var TimeZone=require("./TimeZone.js");var GregorianCal=require("./GregorianCal.js");var DateFmt=function(e){var t,a,s,i=true,r=undefined;this.locale=new Locale;this.type="date";this.length="s";this.dateComponents="dmy";this.timeComponents="ahm";this.meridiems="default";if(e){if(e.locale){this.locale=typeof e.locale==="string"?new Locale(e.locale):e.locale}if(e.type){if(e.type==="date"||e.type==="time"||e.type==="datetime"){this.type=e.type}}if(e.calendar){this.calName=e.calendar}if(e.length){if(e.length==="short"||e.length==="medium"||e.length==="long"||e.length==="full"){this.length=e.length.charAt(0)}}if(e.date){t=e.date.split("");t.sort(function(e,t){return e<t?-1:t<e?1:0});s=false;for(a=0;a<t.length;a++){if(t[a]!=="d"&&t[a]!=="m"&&t[a]!=="y"&&t[a]!=="w"&&t[a]!=="n"){s=true;break}}if(!s){this.dateComponents=t.join("")}}if(e.time){t=e.time.split("");t.sort(function(e,t){return e<t?-1:t<e?1:0});this.badTime=false;for(a=0;a<t.length;a++){if(t[a]!=="h"&&t[a]!=="m"&&t[a]!=="s"&&t[a]!=="a"&&t[a]!=="z"){this.badTime=true;break}}if(!this.badTime){this.timeComponents=t.join("")}}if(e.clock&&(e.clock==="12"||e.clock==="24")){this.clock=e.clock}if(e.template){this.type="";this.length="";this.dateComponents="";this.timeComponents="";this.template=e.template}if(e.timezone){if(e.timezone instanceof TimeZone){this.tz=e.timezone}else{this.tz=new TimeZone({locale:this.locale,id:e.timezone})}}else if(e.locale){this.tz=new TimeZone({locale:this.locale})}if(typeof e.useNative==="boolean"){this.useNative=e.useNative}if(typeof e.meridiems!=="undefined"&&(e.meridiems==="chinese"||e.meridiems==="gregorian"||e.meridiems==="ethiopic")){this.meridiems=e.meridiems}if(typeof e.sync!=="undefined"){i=e.sync===true}r=e.loadParams}if(!DateFmt.cache){DateFmt.cache={}}new LocaleInfo(this.locale,{sync:i,loadParams:r,onLoad:ilib.bind(this,function(t){this.locinfo=t;this.calName=this.calName||this.locinfo.getCalendar()||"gregorian";if(ilib.isDynCode()){DateFactory._dynLoadDate(this.calName)}this.cal=CalendarFactory({type:this.calName});if(!this.cal){this.cal=new GregorianCal}if(this.meridiems==="default"){this.meridiems=t.getMeridiemsStyle()}new ResBundle({locale:this.locale,name:"sysres",sync:i,loadParams:r,onLoad:ilib.bind(this,function(t){this.sysres=t;if(!this.template){Utils.loadData({object:DateFmt,locale:this.locale,name:"dateformats.json",sync:i,loadParams:r,callback:ilib.bind(this,function(t){if(!t){t=ilib.data.dateformats||DateFmt.defaultFmt;var a=this.locale.getSpec().replace(/-/g,"_");DateFmt.cache[a]=t}if(typeof this.clock==="undefined"){this.clock=this.locinfo.getClock()}this._initTemplate(t);this._massageTemplate();if(e&&typeof e.onLoad==="function"){e.onLoad(this)}})})}else{this._massageTemplate();if(e&&typeof e.onLoad==="function"){e.onLoad(this)}}})})})})};DateFmt.lenmap={s:"short",m:"medium",l:"long",f:"full"};DateFmt.zeros="0000";DateFmt.defaultFmt={gregorian:{order:"{date} {time}",date:{dmwy:"EEE d/MM/yyyy",dmy:"d/MM/yyyy",dmw:"EEE d/MM",dm:"d/MM",my:"MM/yyyy",dw:"EEE d",d:"dd",m:"MM",y:"yyyy",n:"NN",w:"EEE"},time:{12:"h:mm:ssa",24:"H:mm:ss"},range:{c00:"{st} - {et}, {sd}/{sm}/{sy}",c01:"{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",c02:"{sd}/{sm} {st} - {ed}/{em} {et}, {sy}",c03:"{sd}/{sm}/{sy} {st} - {ed}/{em}/{ey} {et}",c10:"{sd}-{ed}/{sm}/{sy}",c11:"{sd}/{sm} - {ed}/{em} {sy}",c12:"{sd}/{sm}/{sy} - {ed}/{em}/{ey}",c20:"{sm}/{sy} - {em}/{ey}",c30:"{sy} - {ey}"}},islamic:"gregorian",hebrew:"gregorian",julian:"gregorian",buddhist:"gregorian",persian:"gregorian","persian-algo":"gregorian",han:"gregorian"};DateFmt.monthNameLenMap={"short":"N",medium:"NN","long":"MMM",full:"MMMM"};DateFmt.weekDayLenMap={"short":"E",medium:"EE","long":"EEE",full:"EEEE"};DateFmt.getMeridiemsRange=function(e){e=e||{};var t={};if(e.locale){t.locale=e.locale}if(e.meridiems){t.meridiems=e.meridiems}var a=new DateFmt(t);return a.getMeridiemsRange()};DateFmt.prototype={_initTemplate:function(e){if(e[this.calName]){this.formats=e[this.calName];if(typeof this.formats==="string"){this.formats=e[this.formats]}this.template="";switch(this.type){case"datetime":this.template=this.formats&&this._getLengthFormat(this.formats.order,this.length)||"{date} {time}";this.template=this.template.replace("{date}",this._getFormat(this.formats.date,this.dateComponents,this.length)||"");this.template=this.template.replace("{time}",this._getFormat(this.formats.time[this.clock],this.timeComponents,this.length)||"");break;case"date":this.template=this._getFormat(this.formats.date,this.dateComponents,this.length);break;case"time":this.template=this._getFormat(this.formats.time[this.clock],this.timeComponents,this.length);break}}else{throw"No formats available for calendar "+this.calName+" in locale "+this.locale.toString()}},_massageTemplate:function(){var e;if(this.clock&&this.template){var t="";switch(this.clock){case"24":for(e=0;e<this.template.length;e++){if(this.template.charAt(e)=="'"){t+=this.template.charAt(e++);while(e<this.template.length&&this.template.charAt(e)!=="'"){t+=this.template.charAt(e++)}if(e<this.template.length){t+=this.template.charAt(e)}}else if(this.template.charAt(e)=="K"){t+="k"}else if(this.template.charAt(e)=="h"){t+="H"}else{t+=this.template.charAt(e)}}this.template=t;break;case"12":for(e=0;e<this.template.length;e++){if(this.template.charAt(e)=="'"){t+=this.template.charAt(e++);while(e<this.template.length&&this.template.charAt(e)!=="'"){t+=this.template.charAt(e++)}if(e<this.template.length){t+=this.template.charAt(e)}}else if(this.template.charAt(e)=="k"){t+="K"}else if(this.template.charAt(e)=="H"){t+="h"}else{t+=this.template.charAt(e)}}this.template=t;break}}this.templateArr=this._tokenize(this.template);var a;if(typeof this.useNative==="boolean"){if(this.useNative){a=this.locinfo.getNativeDigits();if(a){this.digits=a}}}else if(this.locinfo.getDigitsStyle()==="native"){a=this.locinfo.getNativeDigits();if(a){this.useNative=true;this.digits=a}}},_tokenize:function(e){var t=0,a,s,i,r=[];if(e){while(t<e.length){s=e.charAt(t);a=t;if(s==="'"){t++;while(t<e.length&&e.charAt(t)!=="'"){t++}if(t<e.length){t++}}else if(s>="a"&&s<="z"||s>="A"&&s<="Z"){i=e.charAt(t);while(t<e.length&&s===i){s=e.charAt(++t)}}else{while(t<e.length&&s!=="'"&&(s<"a"||s>"z")&&(s<"A"||s>"Z")){s=e.charAt(++t)}}r.push(e.substring(a,t))}}return r},_getFormat:function e(t,a,s){if(typeof a!=="undefined"&&t&&t[a]){return this._getLengthFormat(t[a],s)}return undefined},_getLengthFormat:function t(e,a){if(typeof e==="string"){return e}else if(e[a]){return e[a]}return undefined},getLocale:function(){return this.locale},getTemplate:function(){return this.template},getType:function(){return this.type},getCalendar:function(){return this.cal.getType()},getLength:function(){return DateFmt.lenmap[this.length]||""},getDateComponents:function(){return this.dateComponents||""},getTimeComponents:function(){return this.timeComponents||""},getTimeZone:function(){if(!this.tz){this.tz=new TimeZone({id:ilib.getTimeZone()})}return this.tz},getClock:function(){return this.clock||this.locinfo.getClock()},getMeridiemsRange:function(){var e;var t=function(e){return(this.sysres.getString(undefined,e+"-"+this.calName)||this.sysres.getString(undefined,e)).toString()};switch(this.meridiems){case"chinese":e=[{name:t.call(this,"azh0"),start:"00:00",end:"05:59"},{name:t.call(this,"azh1"),start:"06:00",end:"08:59"},{name:t.call(this,"azh2"),start:"09:00",end:"11:59"},{name:t.call(this,"azh3"),start:"12:00",end:"12:59"},{name:t.call(this,"azh4"),start:"13:00",end:"17:59"},{name:t.call(this,"azh5"),start:"18:00",end:"20:59"},{name:t.call(this,"azh6"),start:"21:00",end:"23:59"}];break;case"ethiopic":e=[{name:t.call(this,"a0-ethiopic"),start:"00:00",end:"05:59"},{name:t.call(this,"a1-ethiopic"),start:"06:00",end:"06:00"},{name:t.call(this,"a2-ethiopic"),start:"06:01",end:"11:59"},{name:t.call(this,"a3-ethiopic"),start:"12:00",end:"17:59"},{name:t.call(this,"a4-ethiopic"),start:"18:00",end:"23:59"}];break;default:e=[{name:t.call(this,"a0"),start:"00:00",end:"11:59"},{name:t.call(this,"a1"),start:"12:00",end:"23:59"}];break}return e},_getTemplate:function(e,t){if(t!=="gregorian"){return e+"-"+t}return e},getMonthsOfYear:function(e){var t=e&&e.length||this.getLength(),a=DateFmt.monthNameLenMap[t],s=[undefined],i,r;if(e){if(e.date){i=DateFactory._dateToIlib(e.date)}if(e.year){i=DateFactory({year:e.year,month:1,day:1,type:this.cal.getType()})}}if(!i){i=this.cal.newDateInstance()}r=this.cal.getNumMonths(i.getYears());for(var n=1;n<=r;n++){s[n]=this.sysres.getString(this._getTemplate(a+n,this.cal.getType())).toString()}return s},getDaysOfWeek:function(e){var t=e&&e.length||this.getLength(),a=DateFmt.weekDayLenMap[t],s=[];for(var i=0;i<7;i++){s[i]=this.sysres.getString(this._getTemplate(a+i,this.cal.getType())).toString()}return s},toString:function(){return this.getTemplate()},_pad:function(e,t){if(typeof e!=="string"){e=""+e}var a=0;if(e.charAt(0)==="-"){a++}return e.length>=t+a?e:e.substring(0,a)+DateFmt.zeros.substring(0,t-e.length+a)+e.substring(a)},_formatTemplate:function(e,t){var a,s,i,r,n="";for(a=0;a<t.length;a++){switch(t[a]){case"d":n+=e.day||1;break;case"dd":n+=this._pad(e.day||"1",2);break;case"yy":i=""+(e.year||0)%100;n+=this._pad(i,2);break;case"yyyy":n+=this._pad(e.year||"0",4);break;case"M":n+=e.month||1;break;case"MM":n+=this._pad(e.month||"1",2);break;case"h":i=(e.hour||0)%12;if(i==0){i="12"}n+=i;break;case"hh":i=(e.hour||0)%12;if(i==0){i="12"}n+=this._pad(i,2);break;case"K":i=(e.hour||0)%12;n+=i;break;case"KK":i=(e.hour||0)%12;n+=this._pad(i,2);break;case"H":n+=e.hour||"0";break;case"HH":n+=this._pad(e.hour||"0",2);break;case"k":n+=e.hour==0?"24":e.hour;break;case"kk":i=e.hour==0?"24":e.hour;n+=this._pad(i,2);break;case"m":n+=e.minute||"0";break;case"mm":n+=this._pad(e.minute||"0",2);break;case"s":n+=e.minute||"0";break;case"ss":n+=this._pad(e.second||"0",2);break;case"S":n+=e.millisecond||"0";break;case"SSS":n+=this._pad(e.millisecond||"0",3);break;case"N":case"NN":case"MMM":case"MMMM":s=t[a]+(e.month||1);n+=this.sysres.getString(undefined,s+"-"+this.calName)||this.sysres.getString(undefined,s);break;case"E":case"EE":case"EEE":case"EEEE":s=t[a]+e.getDayOfWeek();n+=this.sysres.getString(undefined,s+"-"+this.calName)||this.sysres.getString(undefined,s);break;case"a":switch(this.meridiems){case"chinese":if(e.hour<6){s="azh0"}else if(e.hour<9){s="azh1"}else if(e.hour<12){s="azh2"}else if(e.hour<13){s="azh3"}else if(e.hour<18){s="azh4"}else if(e.hour<21){s="azh5"}else{s="azh6"}break;case"ethiopic":if(e.hour<6){s="a0-ethiopic"}else if(e.hour===6&&e.minute===0){s="a1-ethiopic"}else if(e.hour>=6&&e.hour<12){s="a2-ethiopic"}else if(e.hour>=12&&e.hour<18){s="a3-ethiopic"}else if(e.hour>=18){s="a4-ethiopic"}break;default:s=e.hour<12?"a0":"a1";break}n+=this.sysres.getString(undefined,s+"-"+this.calName)||this.sysres.getString(undefined,s);break;case"w":n+=e.getWeekOfYear();break;case"ww":n+=this._pad(e.getWeekOfYear(),2);break;case"D":n+=e.getDayOfYear();break;case"DD":n+=this._pad(e.getDayOfYear(),2);break;case"DDD":n+=this._pad(e.getDayOfYear(),3);break;case"W":n+=e.getWeekOfMonth(this.locale);break;case"G":s="G"+e.getEra();n+=this.sysres.getString(undefined,s+"-"+this.calName)||this.sysres.getString(undefined,s);break;case"O":i=this.sysres.getString("1#1st|2#2nd|3#3rd|21#21st|22#22nd|23#23rd|31#31st|#{num}th","ordinalChoice");n+=i.formatChoice(e.day,{num:e.day});break;case"z":r=this.getTimeZone();n+=r.getDisplayName(e,"standard");break;case"Z":r=this.getTimeZone();n+=r.getDisplayName(e,"rfc822");break;default:n+=t[a].replace(/'/g,"");break}}if(this.digits){n=JSUtils.mapString(n,this.digits)}return n},format:function(e){var t=this.tz&&this.tz.getId()||"local";var a=DateFactory._dateToIlib(e,t,this.locale);if(!a.getCalendar||!(a instanceof IDate)){throw"Wrong date type passed to DateFmt.format()"}var s=a.timezone||"local";if(s!==t||a.getCalendar()!==this.calName){var i=DateFactory({type:this.calName,timezone:t,julianday:a.getJulianDay()});a=i}return this._formatTemplate(a,this.templateArr)},formatRelative:function(e,t){e=DateFactory._dateToIlib(e);t=DateFactory._dateToIlib(t);var a,s,i,r,n,h;if(typeof e!=="object"||!e.getCalendar||e.getCalendar()!==this.calName||typeof t!=="object"||!t.getCalendar||t.getCalendar()!==this.calName){throw"Wrong calendar type"}a=e.getRataDie();s=t.getRataDie();if(s<a){n=a-s;i=this.sysres.getString("{duration} ago")}else{n=s-a;i=this.sysres.getString("in {duration}")}if(n<694444e-9){h=Math.round(n*86400);switch(this.length){case"s":r=this.sysres.getString("#{num}s");break;case"m":r=this.sysres.getString("1#1 se|#{num} sec");break;case"l":r=this.sysres.getString("1#1 sec|#{num} sec");break;default:case"f":r=this.sysres.getString("1#1 second|#{num} seconds");break}}else if(n<.041666667){h=Math.round(n*1440);switch(this.length){case"s":r=this.sysres.getString("#{num}m","durationShortMinutes");break;case"m":r=this.sysres.getString("1#1 mi|#{num} min");break;case"l":r=this.sysres.getString("1#1 min|#{num} min");break;default:case"f":r=this.sysres.getString("1#1 minute|#{num} minutes");break}}else if(n<1){h=Math.round(n*24);switch(this.length){case"s":r=this.sysres.getString("#{num}h");break;case"m":r=this.sysres.getString("1#1 hr|#{num} hrs","durationMediumHours");break;case"l":r=this.sysres.getString("1#1 hr|#{num} hrs");break;default:case"f":r=this.sysres.getString("1#1 hour|#{num} hours");break}}else if(n<14){h=Math.round(n);switch(this.length){case"s":r=this.sysres.getString("#{num}d");break;case"m":r=this.sysres.getString("1#1 dy|#{num} dys");break;case"l":r=this.sysres.getString("1#1 day|#{num} days","durationLongDays");break;default:case"f":r=this.sysres.getString("1#1 day|#{num} days");break}}else if(n<84){h=Math.round(n/7);switch(this.length){case"s":r=this.sysres.getString("#{num}w");break;case"m":r=this.sysres.getString("1#1 wk|#{num} wks","durationMediumWeeks");break;case"l":r=this.sysres.getString("1#1 wk|#{num} wks");break;default:case"f":r=this.sysres.getString("1#1 week|#{num} weeks");break}}else if(n<730){h=Math.round(n/30.4);switch(this.length){case"s":r=this.sysres.getString("#{num}m","durationShortMonths");break;case"m":r=this.sysres.getString("1#1 mo|#{num} mos");break;case"l":r=this.sysres.getString("1#1 mon|#{num} mons");break;default:case"f":r=this.sysres.getString("1#1 month|#{num} months");break}}else{h=Math.round(n/365);switch(this.length){case"s":r=this.sysres.getString("#{num}y");break;case"m":r=this.sysres.getString("1#1 yr|#{num} yrs","durationMediumYears");break;case"l":r=this.sysres.getString("1#1 yr|#{num} yrs");break;default:case"f":r=this.sysres.getString("1#1 year|#{num} years");break}}return i.format({duration:r.formatChoice(h,{num:h})})}};module.exports=DateFmt;