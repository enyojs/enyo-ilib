/* This is a generated file. DO NOT EDIT, as your changes will be lost. */
/* Instead, fix the code in mkstubs.js which generated this file.       */
var ilib=require("./ilibglobal.js");
if(!ilib.CType)ilib.CType={stub:true};if(!ilib._roundFnc)ilib._roundFnc={stub:true};
if(!ilib.shallowCopy){ilib.shallowCopy=function (source, target){require("./util/jsutils.js");return ilib.shallowCopy (source, target);};ilib.shallowCopy.stub=true;}
if(!ilib.deepCopy){ilib.deepCopy=function(from, to){require("./util/jsutils.js");return ilib.deepCopy(from, to);};ilib.deepCopy.stub=true;}
if(!ilib.mapString){ilib.mapString=function (str, map){require("./util/jsutils.js");return ilib.mapString (str, map);};ilib.mapString.stub=true;}
if(!ilib.indexOf){ilib.indexOf=function(array, obj){require("./util/jsutils.js");return ilib.indexOf(array, obj);};ilib.indexOf.stub=true;}
if(!ilib.toHexString){ilib.toHexString=function(string, limit){require("./util/jsutils.js");return ilib.toHexString(string, limit);};ilib.toHexString.stub=true;}
if(!ilib.isDate){ilib.isDate=function(object){require("./util/jsutils.js");return ilib.isDate(object);};ilib.isDate.stub=true;}
if(!ilib.Locale){ilib.Locale=function(language, region, variant, script){require("./locale.js");return new ilib.Locale(language, region, variant, script);};ilib.Locale.stub=true;}
if(!ilib.Locale._notLower){ilib.Locale._notLower=function(str){require("./locale.js");return ilib.Locale._notLower(str);};ilib.Locale._notLower.stub=true;}
if(!ilib.Locale._notUpper){ilib.Locale._notUpper=function(str){require("./locale.js");return ilib.Locale._notUpper(str);};ilib.Locale._notUpper.stub=true;}
if(!ilib.Locale._notDigit){ilib.Locale._notDigit=function(str){require("./locale.js");return ilib.Locale._notDigit(str);};ilib.Locale._notDigit.stub=true;}
if(!ilib.Locale._isLanguageCode){ilib.Locale._isLanguageCode=function(str){require("./locale.js");return ilib.Locale._isLanguageCode(str);};ilib.Locale._isLanguageCode.stub=true;}
if(!ilib.Locale._isRegionCode){ilib.Locale._isRegionCode=function (str){require("./locale.js");return ilib.Locale._isRegionCode (str);};ilib.Locale._isRegionCode.stub=true;}
if(!ilib.Locale._isScriptCode){ilib.Locale._isScriptCode=function(str){require("./locale.js");return ilib.Locale._isScriptCode(str);};ilib.Locale._isScriptCode.stub=true;}
if(!ilib.Locale.regionAlpha2ToAlpha3){ilib.Locale.regionAlpha2ToAlpha3=function(alpha2){require("./locale.js");return ilib.Locale.regionAlpha2ToAlpha3(alpha2);};ilib.Locale.regionAlpha2ToAlpha3.stub=true;}
if(!ilib.Locale.languageAlpha1ToAlpha3){ilib.Locale.languageAlpha1ToAlpha3=function(alpha1){require("./locale.js");return ilib.Locale.languageAlpha1ToAlpha3(alpha1);};ilib.Locale.languageAlpha1ToAlpha3.stub=true;}
if(!ilib.Locale.getAvailableLocales){ilib.Locale.getAvailableLocales=function (){require("./locale.js");return ilib.Locale.getAvailableLocales ();};ilib.Locale.getAvailableLocales.stub=true;}
if(!ilib.merge){ilib.merge=function (object1, object2, replace, name1, name2){require("./util/utils.js");return ilib.merge (object1, object2, replace, name1, name2);};ilib.merge.stub=true;}
if(!ilib.mergeLocData){ilib.mergeLocData=function (prefix, locale, replaceArrays, returnOne){require("./util/utils.js");return ilib.mergeLocData (prefix, locale, replaceArrays, returnOne);};ilib.mergeLocData.stub=true;}
if(!ilib.getLocFiles){ilib.getLocFiles=function(locale, name){require("./util/utils.js");return ilib.getLocFiles(locale, name);};ilib.getLocFiles.stub=true;}
if(!ilib.isEmpty){ilib.isEmpty=function (obj){require("./util/utils.js");return ilib.isEmpty (obj);};ilib.isEmpty.stub=true;}
if(!ilib.hashCode){ilib.hashCode=function(obj){require("./util/utils.js");return ilib.hashCode(obj);};ilib.hashCode.stub=true;}
if(!ilib._callLoadData){ilib._callLoadData=function (files, sync, params, callback){require("./util/utils.js");return ilib._callLoadData (files, sync, params, callback);};ilib._callLoadData.stub=true;}
if(!ilib.loadData){ilib.loadData=function(params){require("./util/utils.js");return ilib.loadData(params);};ilib.loadData.stub=true;}
if(!ilib.LocaleInfo){ilib.LocaleInfo=function(locale, options){require("./localeinfo.js");return new ilib.LocaleInfo(locale, options);};ilib.LocaleInfo.stub=true;}
if(!ilib.JulianDay){ilib.JulianDay=function(num){require("./julianday.js");return new ilib.JulianDay(num);};ilib.JulianDay.stub=true;}
if(!ilib.Cal){ilib.Cal=function(){require("./calendar.js");return ilib.Cal();};ilib.Cal.stub=true;}
if(!ilib.Cal._dynLoadCalendar){ilib.Cal._dynLoadCalendar=function (name){require("./calendar.js");return ilib.Cal._dynLoadCalendar (name);};ilib.Cal._dynLoadCalendar.stub=true;}
if(!ilib.Cal.newInstance){ilib.Cal.newInstance=function (options){require("./calendar.js");return ilib.Cal.newInstance (options);};ilib.Cal.newInstance.stub=true;}
if(!ilib.Cal.getCalendars){ilib.Cal.getCalendars=function (){require("./calendar.js");return ilib.Cal.getCalendars ();};ilib.Cal.getCalendars.stub=true;}
if(!ilib.Date){ilib.Date=function(options){require("./date.js");return new ilib.Date(options);};ilib.Date.stub=true;}
if(!ilib.Date._dynLoadCalendar){ilib.Date._dynLoadCalendar=function (name){require("./date.js");return ilib.Date._dynLoadCalendar (name);};ilib.Date._dynLoadCalendar.stub=true;}
if(!ilib.Date.newInstance){ilib.Date.newInstance=function(options){require("./date.js");return ilib.Date.newInstance(options);};ilib.Date.newInstance.stub=true;}
if(!ilib.Date._dateToIlib){ilib.Date._dateToIlib=function(inDate, timezone, locale){require("./date.js");return ilib.Date._dateToIlib(inDate, timezone, locale);};ilib.Date._dateToIlib.stub=true;}
if(!ilib.signum){ilib.signum=function (num){require("./util/math.js");return ilib.signum (num);};ilib.signum.stub=true;}
if(!ilib._roundFnc.floor){ilib._roundFnc.floor=function (num){require("./util/math.js");return ilib._roundFnc.floor (num);};ilib._roundFnc.floor.stub=true;}
if(!ilib._roundFnc.ceiling){ilib._roundFnc.ceiling=function (num){require("./util/math.js");return ilib._roundFnc.ceiling (num);};ilib._roundFnc.ceiling.stub=true;}
if(!ilib._roundFnc.down){ilib._roundFnc.down=function (num){require("./util/math.js");return ilib._roundFnc.down (num);};ilib._roundFnc.down.stub=true;}
if(!ilib._roundFnc.up){ilib._roundFnc.up=function (num){require("./util/math.js");return ilib._roundFnc.up (num);};ilib._roundFnc.up.stub=true;}
if(!ilib._roundFnc.halfup){ilib._roundFnc.halfup=function (num){require("./util/math.js");return ilib._roundFnc.halfup (num);};ilib._roundFnc.halfup.stub=true;}
if(!ilib._roundFnc.halfdown){ilib._roundFnc.halfdown=function (num){require("./util/math.js");return ilib._roundFnc.halfdown (num);};ilib._roundFnc.halfdown.stub=true;}
if(!ilib._roundFnc.halfeven){ilib._roundFnc.halfeven=function (num){require("./util/math.js");return ilib._roundFnc.halfeven (num);};ilib._roundFnc.halfeven.stub=true;}
if(!ilib._roundFnc.halfodd){ilib._roundFnc.halfodd=function (num){require("./util/math.js");return ilib._roundFnc.halfodd (num);};ilib._roundFnc.halfodd.stub=true;}
if(!ilib.mod){ilib.mod=function (dividend, modulus){require("./util/math.js");return ilib.mod (dividend, modulus);};ilib.mod.stub=true;}
if(!ilib.amod){ilib.amod=function (dividend, modulus){require("./util/math.js");return ilib.amod (dividend, modulus);};ilib.amod.stub=true;}
if(!ilib.String){ilib.String=function (string){require("./strings.js");return new ilib.String (string);};ilib.String.stub=true;}
if(!ilib.String._isSurrogate){ilib.String._isSurrogate=function (ch){require("./strings.js");return ilib.String._isSurrogate (ch);};ilib.String._isSurrogate.stub=true;}
if(!ilib.String.fromCodePoint){ilib.String.fromCodePoint=function (codepoint){require("./strings.js");return ilib.String.fromCodePoint (codepoint);};ilib.String.fromCodePoint.stub=true;}
if(!ilib.String.toCodePoint){ilib.String.toCodePoint=function(str, index){require("./strings.js");return ilib.String.toCodePoint(str, index);};ilib.String.toCodePoint.stub=true;}
if(!ilib.String.loadPlurals){ilib.String.loadPlurals=function (sync, locale, loadParams, onLoad){require("./strings.js");return ilib.String.loadPlurals (sync, locale, loadParams, onLoad);};ilib.String.loadPlurals.stub=true;}
if(!ilib.Cal.Gregorian){ilib.Cal.Gregorian=function(){require("./calendar/gregorian.js");return new ilib.Cal.Gregorian();};ilib.Cal.Gregorian.stub=true;}
if(!ilib.Date.RataDie){ilib.Date.RataDie=function(params){require("./calendar/ratadie.js");return new ilib.Date.RataDie(params);};ilib.Date.RataDie.stub=true;}
if(!ilib.Date.GregRataDie){ilib.Date.GregRataDie=function(params){require("./calendar/gregratadie.js");return new ilib.Date.GregRataDie(params);};ilib.Date.GregRataDie.stub=true;}
if(!ilib.TimeZone){ilib.TimeZone=function(options){require("./timezone.js");return new ilib.TimeZone(options);};ilib.TimeZone.stub=true;}
if(!ilib.TimeZone.getAvailableIds){ilib.TimeZone.getAvailableIds=function (country){require("./timezone.js");return ilib.TimeZone.getAvailableIds (country);};ilib.TimeZone.getAvailableIds.stub=true;}
if(!ilib.ResBundle){ilib.ResBundle=function (options){require("./resources.js");return new ilib.ResBundle (options);};ilib.ResBundle.stub=true;}
if(!ilib.DateFmt){ilib.DateFmt=function(options){require("./datefmt.js");return new ilib.DateFmt(options);};ilib.DateFmt.stub=true;}
if(!ilib.DateRngFmt){ilib.DateRngFmt=function(options){require("./daterangefmt.js");return new ilib.DateRngFmt(options);};ilib.DateRngFmt.stub=true;}
if(!ilib.Cal.Hebrew){ilib.Cal.Hebrew=function(){require("./calendar/hebrew.js");return new ilib.Cal.Hebrew();};ilib.Cal.Hebrew.stub=true;}
if(!ilib.Cal.Hebrew.elapsedDays){ilib.Cal.Hebrew.elapsedDays=function(year){require("./calendar/hebrew.js");return ilib.Cal.Hebrew.elapsedDays(year);};ilib.Cal.Hebrew.elapsedDays.stub=true;}
if(!ilib.Cal.Hebrew.newYearsCorrection){ilib.Cal.Hebrew.newYearsCorrection=function(year, elapsed){require("./calendar/hebrew.js");return ilib.Cal.Hebrew.newYearsCorrection(year, elapsed);};ilib.Cal.Hebrew.newYearsCorrection.stub=true;}
if(!ilib.Cal.Hebrew.newYear){ilib.Cal.Hebrew.newYear=function(year){require("./calendar/hebrew.js");return ilib.Cal.Hebrew.newYear(year);};ilib.Cal.Hebrew.newYear.stub=true;}
if(!ilib.Cal.Hebrew.daysInYear){ilib.Cal.Hebrew.daysInYear=function(year){require("./calendar/hebrew.js");return ilib.Cal.Hebrew.daysInYear(year);};ilib.Cal.Hebrew.daysInYear.stub=true;}
if(!ilib.Cal.Hebrew.longHeshvan){ilib.Cal.Hebrew.longHeshvan=function(year){require("./calendar/hebrew.js");return ilib.Cal.Hebrew.longHeshvan(year);};ilib.Cal.Hebrew.longHeshvan.stub=true;}
if(!ilib.Cal.Hebrew.longKislev){ilib.Cal.Hebrew.longKislev=function(year){require("./calendar/hebrew.js");return ilib.Cal.Hebrew.longKislev(year);};ilib.Cal.Hebrew.longKislev.stub=true;}
if(!ilib.Date.HebrewRataDie){ilib.Date.HebrewRataDie=function(params){require("./calendar/hebrewdate.js");return new ilib.Date.HebrewRataDie(params);};ilib.Date.HebrewRataDie.stub=true;}
if(!ilib.Date.HebrewDate){ilib.Date.HebrewDate=function(params){require("./calendar/hebrewdate.js");return new ilib.Date.HebrewDate(params);};ilib.Date.HebrewDate.stub=true;}
if(!ilib.Cal.Islamic){ilib.Cal.Islamic=function(){require("./calendar/islamic.js");return new ilib.Cal.Islamic();};ilib.Cal.Islamic.stub=true;}
if(!ilib.bsearch){ilib.bsearch=function(target, arr, comparator){require("./util/search.js");return ilib.bsearch(target, arr, comparator);};ilib.bsearch.stub=true;}
if(!ilib.bsearch.number){ilib.bsearch.number=function(element, target){require("./util/search.js");return ilib.bsearch.number(element, target);};ilib.bsearch.number.stub=true;}
if(!ilib.bisectionSearch){ilib.bisectionSearch=function(target, low, high, precision, func){require("./util/search.js");return ilib.bisectionSearch(target, low, high, precision, func);};ilib.bisectionSearch.stub=true;}
if(!ilib.Date.IslamicRataDie){ilib.Date.IslamicRataDie=function(params){require("./calendar/islamicdate.js");return new ilib.Date.IslamicRataDie(params);};ilib.Date.IslamicRataDie.stub=true;}
if(!ilib.Date.IslamicDate){ilib.Date.IslamicDate=function(params){require("./calendar/islamicdate.js");return new ilib.Date.IslamicDate(params);};ilib.Date.IslamicDate.stub=true;}
if(!ilib.Cal.Julian){ilib.Cal.Julian=function(){require("./calendar/julian.js");return new ilib.Cal.Julian();};ilib.Cal.Julian.stub=true;}
if(!ilib.Date.JulianRataDie){ilib.Date.JulianRataDie=function(params){require("./calendar/juliandate.js");return new ilib.Date.JulianRataDie(params);};ilib.Date.JulianRataDie.stub=true;}
if(!ilib.Date.JulDate){ilib.Date.JulDate=function(params){require("./calendar/juliandate.js");return new ilib.Date.JulDate(params);};ilib.Date.JulDate.stub=true;}
if(!ilib.Date.GregDate){ilib.Date.GregDate=function(params){require("./calendar/gregoriandate.js");return new ilib.Date.GregDate(params);};ilib.Date.GregDate.stub=true;}
if(!ilib.Date.GregDate._calcYear){ilib.Date.GregDate._calcYear=function(rd){require("./calendar/gregoriandate.js");return ilib.Date.GregDate._calcYear(rd);};ilib.Date.GregDate._calcYear.stub=true;}
if(!ilib.Cal.ThaiSolar){ilib.Cal.ThaiSolar=function(){require("./calendar/thaisolar.js");return new ilib.Cal.ThaiSolar();};ilib.Cal.ThaiSolar.stub=true;}
if(!ilib.Date.ThaiSolarDate){ilib.Date.ThaiSolarDate=function(params){require("./calendar/thaisolardate.js");return new ilib.Date.ThaiSolarDate(params);};ilib.Date.ThaiSolarDate.stub=true;}
if(!ilib.Cal.PersianAlgo){ilib.Cal.PersianAlgo=function(){require("./calendar/persian.js");return new ilib.Cal.PersianAlgo();};ilib.Cal.PersianAlgo.stub=true;}
if(!ilib.Date.PersAlgoRataDie){ilib.Date.PersAlgoRataDie=function(params){require("./calendar/persiandate.js");return new ilib.Date.PersAlgoRataDie(params);};ilib.Date.PersAlgoRataDie.stub=true;}
if(!ilib.Date.PersAlgoDate){ilib.Date.PersAlgoDate=function(params){require("./calendar/persiandate.js");return new ilib.Date.PersAlgoDate(params);};ilib.Date.PersAlgoDate.stub=true;}
if(!ilib.Date.initAstro){ilib.Date.initAstro=function(sync, loadParams, callback){require("./calendar/astro.js");return ilib.Date.initAstro(sync, loadParams, callback);};ilib.Date.initAstro.stub=true;}
if(!ilib.Date._dtr){ilib.Date._dtr=function(d){require("./calendar/astro.js");return ilib.Date._dtr(d);};ilib.Date._dtr.stub=true;}
if(!ilib.Date._rtd){ilib.Date._rtd=function(r){require("./calendar/astro.js");return ilib.Date._rtd(r);};ilib.Date._rtd.stub=true;}
if(!ilib.Date._dcos){ilib.Date._dcos=function(d){require("./calendar/astro.js");return ilib.Date._dcos(d);};ilib.Date._dcos.stub=true;}
if(!ilib.Date._dsin){ilib.Date._dsin=function(d){require("./calendar/astro.js");return ilib.Date._dsin(d);};ilib.Date._dsin.stub=true;}
if(!ilib.Date._dtan){ilib.Date._dtan=function(d){require("./calendar/astro.js");return ilib.Date._dtan(d);};ilib.Date._dtan.stub=true;}
if(!ilib.Date._fixangle){ilib.Date._fixangle=function(a){require("./calendar/astro.js");return ilib.Date._fixangle(a);};ilib.Date._fixangle.stub=true;}
if(!ilib.Date._fixangr){ilib.Date._fixangr=function(a){require("./calendar/astro.js");return ilib.Date._fixangr(a);};ilib.Date._fixangr.stub=true;}
if(!ilib.Date._equinox){ilib.Date._equinox=function(year, which){require("./calendar/astro.js");return ilib.Date._equinox(year, which);};ilib.Date._equinox.stub=true;}
if(!ilib.Date._deltat){ilib.Date._deltat=function (year){require("./calendar/astro.js");return ilib.Date._deltat (year);};ilib.Date._deltat.stub=true;}
if(!ilib.Date._obliqeq){ilib.Date._obliqeq=function (jd){require("./calendar/astro.js");return ilib.Date._obliqeq (jd);};ilib.Date._obliqeq.stub=true;}
if(!ilib.Date._sunpos){ilib.Date._sunpos=function(jd){require("./calendar/astro.js");return ilib.Date._sunpos(jd);};ilib.Date._sunpos.stub=true;}
if(!ilib.Date._nutation){ilib.Date._nutation=function(jd){require("./calendar/astro.js");return ilib.Date._nutation(jd);};ilib.Date._nutation.stub=true;}
if(!ilib.Date._equationOfTime){ilib.Date._equationOfTime=function(jd){require("./calendar/astro.js");return ilib.Date._equationOfTime(jd);};ilib.Date._equationOfTime.stub=true;}
if(!ilib.Date._poly){ilib.Date._poly=function(x, coefficients){require("./calendar/astro.js");return ilib.Date._poly(x, coefficients);};ilib.Date._poly.stub=true;}
if(!ilib.Date._universalFromLocal){ilib.Date._universalFromLocal=function(local, zone){require("./calendar/astro.js");return ilib.Date._universalFromLocal(local, zone);};ilib.Date._universalFromLocal.stub=true;}
if(!ilib.Date._localFromUniversal){ilib.Date._localFromUniversal=function(local, zone){require("./calendar/astro.js");return ilib.Date._localFromUniversal(local, zone);};ilib.Date._localFromUniversal.stub=true;}
if(!ilib.Date._aberration){ilib.Date._aberration=function(c){require("./calendar/astro.js");return ilib.Date._aberration(c);};ilib.Date._aberration.stub=true;}
if(!ilib.Date._nutation2){ilib.Date._nutation2=function(c){require("./calendar/astro.js");return ilib.Date._nutation2(c);};ilib.Date._nutation2.stub=true;}
if(!ilib.Date._ephemerisCorrection){ilib.Date._ephemerisCorrection=function(jd){require("./calendar/astro.js");return ilib.Date._ephemerisCorrection(jd);};ilib.Date._ephemerisCorrection.stub=true;}
if(!ilib.Date._ephemerisFromUniversal){ilib.Date._ephemerisFromUniversal=function(jd){require("./calendar/astro.js");return ilib.Date._ephemerisFromUniversal(jd);};ilib.Date._ephemerisFromUniversal.stub=true;}
if(!ilib.Date._universalFromEphemeris){ilib.Date._universalFromEphemeris=function(jd){require("./calendar/astro.js");return ilib.Date._universalFromEphemeris(jd);};ilib.Date._universalFromEphemeris.stub=true;}
if(!ilib.Date._julianCenturies){ilib.Date._julianCenturies=function(jd){require("./calendar/astro.js");return ilib.Date._julianCenturies(jd);};ilib.Date._julianCenturies.stub=true;}
if(!ilib.Date._solarLongitude){ilib.Date._solarLongitude=function(jd){require("./calendar/astro.js");return ilib.Date._solarLongitude(jd);};ilib.Date._solarLongitude.stub=true;}
if(!ilib.Date._lunarLongitude){ilib.Date._lunarLongitude=function (jd){require("./calendar/astro.js");return ilib.Date._lunarLongitude (jd);};ilib.Date._lunarLongitude.stub=true;}
if(!ilib.Date._newMoonTime){ilib.Date._newMoonTime=function(n){require("./calendar/astro.js");return ilib.Date._newMoonTime(n);};ilib.Date._newMoonTime.stub=true;}
if(!ilib.Date._lunarSolarAngle){ilib.Date._lunarSolarAngle=function(jd){require("./calendar/astro.js");return ilib.Date._lunarSolarAngle(jd);};ilib.Date._lunarSolarAngle.stub=true;}
if(!ilib.Date._newMoonBefore){ilib.Date._newMoonBefore=function (jd){require("./calendar/astro.js");return ilib.Date._newMoonBefore (jd);};ilib.Date._newMoonBefore.stub=true;}
if(!ilib.Date._newMoonAtOrAfter){ilib.Date._newMoonAtOrAfter=function (jd){require("./calendar/astro.js");return ilib.Date._newMoonAtOrAfter (jd);};ilib.Date._newMoonAtOrAfter.stub=true;}
if(!ilib.Date._nextSolarLongitude){ilib.Date._nextSolarLongitude=function(jd, longitude){require("./calendar/astro.js");return ilib.Date._nextSolarLongitude(jd, longitude);};ilib.Date._nextSolarLongitude.stub=true;}
if(!ilib.Date._floorToJD){ilib.Date._floorToJD=function(jd){require("./calendar/astro.js");return ilib.Date._floorToJD(jd);};ilib.Date._floorToJD.stub=true;}
if(!ilib.Date._ceilToJD){ilib.Date._ceilToJD=function(jd){require("./calendar/astro.js");return ilib.Date._ceilToJD(jd);};ilib.Date._ceilToJD.stub=true;}
if(!ilib.Date.PersAstroRataDie){ilib.Date.PersAstroRataDie=function(params){require("./calendar/persratadie.js");return new ilib.Date.PersAstroRataDie(params);};ilib.Date.PersAstroRataDie.stub=true;}
if(!ilib.Cal.Persian){ilib.Cal.Persian=function(){require("./calendar/persianastro.js");return new ilib.Cal.Persian();};ilib.Cal.Persian.stub=true;}
if(!ilib.Date.PersDate){ilib.Date.PersDate=function(params){require("./calendar/persianastrodate.js");return new ilib.Date.PersDate(params);};ilib.Date.PersDate.stub=true;}
if(!ilib.Cal.Han){ilib.Cal.Han=function(params){require("./calendar/han.js");return new ilib.Cal.Han(params);};ilib.Cal.Han.stub=true;}
if(!ilib.Cal.Han._getElapsedYear){ilib.Cal.Han._getElapsedYear=function(year, cycle){require("./calendar/han.js");return ilib.Cal.Han._getElapsedYear(year, cycle);};ilib.Cal.Han._getElapsedYear.stub=true;}
if(!ilib.Cal.Han._hanNextSolarLongitude){ilib.Cal.Han._hanNextSolarLongitude=function(jd, longitude){require("./calendar/han.js");return ilib.Cal.Han._hanNextSolarLongitude(jd, longitude);};ilib.Cal.Han._hanNextSolarLongitude.stub=true;}
if(!ilib.Cal.Han._majorSTOnOrAfter){ilib.Cal.Han._majorSTOnOrAfter=function(jd){require("./calendar/han.js");return ilib.Cal.Han._majorSTOnOrAfter(jd);};ilib.Cal.Han._majorSTOnOrAfter.stub=true;}
if(!ilib.Cal.Han._solsticeBefore){ilib.Cal.Han._solsticeBefore=function (year, cycle){require("./calendar/han.js");return ilib.Cal.Han._solsticeBefore (year, cycle);};ilib.Cal.Han._solsticeBefore.stub=true;}
if(!ilib.Cal.Han._chineseTZ){ilib.Cal.Han._chineseTZ=function(jd){require("./calendar/han.js");return ilib.Cal.Han._chineseTZ(jd);};ilib.Cal.Han._chineseTZ.stub=true;}
if(!ilib.Cal.Han._newMoonOnOrAfter){ilib.Cal.Han._newMoonOnOrAfter=function(jd){require("./calendar/han.js");return ilib.Cal.Han._newMoonOnOrAfter(jd);};ilib.Cal.Han._newMoonOnOrAfter.stub=true;}
if(!ilib.Cal.Han._newMoonBefore){ilib.Cal.Han._newMoonBefore=function(jd){require("./calendar/han.js");return ilib.Cal.Han._newMoonBefore(jd);};ilib.Cal.Han._newMoonBefore.stub=true;}
if(!ilib.Cal.Han._leapYearCalc){ilib.Cal.Han._leapYearCalc=function(year, cycle){require("./calendar/han.js");return ilib.Cal.Han._leapYearCalc(year, cycle);};ilib.Cal.Han._leapYearCalc.stub=true;}
if(!ilib.Cal.Han._currentMajorST){ilib.Cal.Han._currentMajorST=function(jd){require("./calendar/han.js");return ilib.Cal.Han._currentMajorST(jd);};ilib.Cal.Han._currentMajorST.stub=true;}
if(!ilib.Cal.Han._noMajorST){ilib.Cal.Han._noMajorST=function(jd){require("./calendar/han.js");return ilib.Cal.Han._noMajorST(jd);};ilib.Cal.Han._noMajorST.stub=true;}
if(!ilib.Date.HanRataDie){ilib.Date.HanRataDie=function(params){require("./calendar/handate.js");return new ilib.Date.HanRataDie(params);};ilib.Date.HanRataDie.stub=true;}
if(!ilib.Date.HanDate){ilib.Date.HanDate=function(params){require("./calendar/handate.js");return new ilib.Date.HanDate(params);};ilib.Date.HanDate.stub=true;}
if(!ilib.Date.HanDate._priorLeapMonth){ilib.Date.HanDate._priorLeapMonth=function(jd1, jd2){require("./calendar/handate.js");return ilib.Date.HanDate._priorLeapMonth(jd1, jd2);};ilib.Date.HanDate._priorLeapMonth.stub=true;}
if(!ilib.Cal.Ethiopic){ilib.Cal.Ethiopic=function(){require("./calendar/ethiopic.js");return new ilib.Cal.Ethiopic();};ilib.Cal.Ethiopic.stub=true;}
if(!ilib.Date.EthiopicRataDie){ilib.Date.EthiopicRataDie=function(params){require("./calendar/ethiopicdate.js");return new ilib.Date.EthiopicRataDie(params);};ilib.Date.EthiopicRataDie.stub=true;}
if(!ilib.Date.EthiopicDate){ilib.Date.EthiopicDate=function(params){require("./calendar/ethiopicdate.js");return new ilib.Date.EthiopicDate(params);};ilib.Date.EthiopicDate.stub=true;}
if(!ilib.Cal.Coptic){ilib.Cal.Coptic=function(){require("./calendar/coptic.js");return new ilib.Cal.Coptic();};ilib.Cal.Coptic.stub=true;}
if(!ilib.Date.CopticRataDie){ilib.Date.CopticRataDie=function(params){require("./calendar/copticdate.js");return new ilib.Date.CopticRataDie(params);};ilib.Date.CopticRataDie.stub=true;}
if(!ilib.Date.CopticDate){ilib.Date.CopticDate=function(params){require("./calendar/copticdate.js");return new ilib.Date.CopticDate(params);};ilib.Date.CopticDate.stub=true;}
if(!ilib.CType._inRange){ilib.CType._inRange=function(num, rangeName, obj){require("./ctype.js");return ilib.CType._inRange(num, rangeName, obj);};ilib.CType._inRange.stub=true;}
if(!ilib.CType.withinRange){ilib.CType.withinRange=function(ch, rangeName){require("./ctype.js");return ilib.CType.withinRange(ch, rangeName);};ilib.CType.withinRange.stub=true;}
if(!ilib.CType._init){ilib.CType._init=function(sync, loadParams, onLoad){require("./ctype.js");return ilib.CType._init(sync, loadParams, onLoad);};ilib.CType._init.stub=true;}
if(!ilib.CType._load){ilib.CType._load=function (name, sync, loadParams, onLoad){require("./ctype.js");return ilib.CType._load (name, sync, loadParams, onLoad);};ilib.CType._load.stub=true;}
if(!ilib.CType.isDigit){ilib.CType.isDigit=function (ch){require("./ctype.isdigit.js");return ilib.CType.isDigit (ch);};ilib.CType.isDigit.stub=true;}
if(!ilib.CType.isDigit._init){ilib.CType.isDigit._init=function (sync, loadParams, onLoad){require("./ctype.isdigit.js");return ilib.CType.isDigit._init (sync, loadParams, onLoad);};ilib.CType.isDigit._init.stub=true;}
if(!ilib.CType.isSpace){ilib.CType.isSpace=function (ch){require("./ctype.isspace.js");return ilib.CType.isSpace (ch);};ilib.CType.isSpace.stub=true;}
if(!ilib.CType.isSpace._init){ilib.CType.isSpace._init=function (sync, loadParams, onLoad){require("./ctype.isspace.js");return ilib.CType.isSpace._init (sync, loadParams, onLoad);};ilib.CType.isSpace._init.stub=true;}
if(!ilib.Currency){ilib.Currency=function (options){require("./currency.js");return new ilib.Currency (options);};ilib.Currency.stub=true;}
if(!ilib.Currency.getAvailableCurrencies){ilib.Currency.getAvailableCurrencies=function(){require("./currency.js");return ilib.Currency.getAvailableCurrencies();};ilib.Currency.getAvailableCurrencies.stub=true;}
if(!ilib.Number){ilib.Number=function (str, options){require("./numprs.js");return new ilib.Number (str, options);};ilib.Number.stub=true;}
if(!ilib.NumFmt){ilib.NumFmt=function (options){require("./numfmt.js");return new ilib.NumFmt (options);};ilib.NumFmt.stub=true;}
if(!ilib.NumFmt.getAvailableLocales){ilib.NumFmt.getAvailableLocales=function (){require("./numfmt.js");return ilib.NumFmt.getAvailableLocales ();};ilib.NumFmt.getAvailableLocales.stub=true;}
if(!ilib.DurFmt){ilib.DurFmt=function(options){require("./durfmt.js");return new ilib.DurFmt(options);};ilib.DurFmt.stub=true;}
if(!ilib.CType.isAlpha){ilib.CType.isAlpha=function (ch){require("./ctype.isalpha.js");return ilib.CType.isAlpha (ch);};ilib.CType.isAlpha.stub=true;}
if(!ilib.CType.isAlpha._init){ilib.CType.isAlpha._init=function (sync, loadParams, onLoad){require("./ctype.isalpha.js");return ilib.CType.isAlpha._init (sync, loadParams, onLoad);};ilib.CType.isAlpha._init.stub=true;}
if(!ilib.CType.isAlnum){ilib.CType.isAlnum=function (ch){require("./ctype.isalnum.js");return ilib.CType.isAlnum (ch);};ilib.CType.isAlnum.stub=true;}
if(!ilib.CType.isAlnum._init){ilib.CType.isAlnum._init=function (sync, loadParams, onLoad){require("./ctype.isalnum.js");return ilib.CType.isAlnum._init (sync, loadParams, onLoad);};ilib.CType.isAlnum._init.stub=true;}
if(!ilib.CType.isAscii){ilib.CType.isAscii=function (ch){require("./ctype.isascii.js");return ilib.CType.isAscii (ch);};ilib.CType.isAscii.stub=true;}
if(!ilib.CType.isAscii._init){ilib.CType.isAscii._init=function (sync, loadParams, onLoad){require("./ctype.isascii.js");return ilib.CType.isAscii._init (sync, loadParams, onLoad);};ilib.CType.isAscii._init.stub=true;}
if(!ilib.CType.isBlank){ilib.CType.isBlank=function (ch){require("./ctype.isblank.js");return ilib.CType.isBlank (ch);};ilib.CType.isBlank.stub=true;}
if(!ilib.CType.isBlank._init){ilib.CType.isBlank._init=function (sync, loadParams, onLoad){require("./ctype.isblank.js");return ilib.CType.isBlank._init (sync, loadParams, onLoad);};ilib.CType.isBlank._init.stub=true;}
if(!ilib.CType.isCntrl){ilib.CType.isCntrl=function (ch){require("./ctype.iscntrl.js");return ilib.CType.isCntrl (ch);};ilib.CType.isCntrl.stub=true;}
if(!ilib.CType.isCntrl._init){ilib.CType.isCntrl._init=function (sync, loadParams, onLoad){require("./ctype.iscntrl.js");return ilib.CType.isCntrl._init (sync, loadParams, onLoad);};ilib.CType.isCntrl._init.stub=true;}
if(!ilib.CType.isGraph){ilib.CType.isGraph=function (ch){require("./ctype.isgraph.js");return ilib.CType.isGraph (ch);};ilib.CType.isGraph.stub=true;}
if(!ilib.CType.isGraph._init){ilib.CType.isGraph._init=function (sync, loadParams, onLoad){require("./ctype.isgraph.js");return ilib.CType.isGraph._init (sync, loadParams, onLoad);};ilib.CType.isGraph._init.stub=true;}
if(!ilib.CType.isIdeo){ilib.CType.isIdeo=function (ch){require("./ctype.isideo.js");return ilib.CType.isIdeo (ch);};ilib.CType.isIdeo.stub=true;}
if(!ilib.CType.isIdeo._init){ilib.CType.isIdeo._init=function (sync, loadParams, onLoad){require("./ctype.isideo.js");return ilib.CType.isIdeo._init (sync, loadParams, onLoad);};ilib.CType.isIdeo._init.stub=true;}
if(!ilib.CType.isLower){ilib.CType.isLower=function (ch){require("./ctype.islower.js");return ilib.CType.isLower (ch);};ilib.CType.isLower.stub=true;}
if(!ilib.CType.isLower._init){ilib.CType.isLower._init=function (sync, loadParams, onLoad){require("./ctype.islower.js");return ilib.CType.isLower._init (sync, loadParams, onLoad);};ilib.CType.isLower._init.stub=true;}
if(!ilib.CType.isPrint){ilib.CType.isPrint=function (ch){require("./ctype.isprint.js");return ilib.CType.isPrint (ch);};ilib.CType.isPrint.stub=true;}
if(!ilib.CType.isPrint._init){ilib.CType.isPrint._init=function (sync, loadParams, onLoad){require("./ctype.isprint.js");return ilib.CType.isPrint._init (sync, loadParams, onLoad);};ilib.CType.isPrint._init.stub=true;}
if(!ilib.CType.isPunct){ilib.CType.isPunct=function (ch){require("./ctype.ispunct.js");return ilib.CType.isPunct (ch);};ilib.CType.isPunct.stub=true;}
if(!ilib.CType.isPunct._init){ilib.CType.isPunct._init=function (sync, loadParams, onLoad){require("./ctype.ispunct.js");return ilib.CType.isPunct._init (sync, loadParams, onLoad);};ilib.CType.isPunct._init.stub=true;}
if(!ilib.CType.isUpper){ilib.CType.isUpper=function (ch){require("./ctype.isupper.js");return ilib.CType.isUpper (ch);};ilib.CType.isUpper.stub=true;}
if(!ilib.CType.isUpper._init){ilib.CType.isUpper._init=function (sync, loadParams, onLoad){require("./ctype.isupper.js");return ilib.CType.isUpper._init (sync, loadParams, onLoad);};ilib.CType.isUpper._init.stub=true;}
if(!ilib.CType.isXdigit){ilib.CType.isXdigit=function (ch){require("./ctype.isxdigit.js");return ilib.CType.isXdigit (ch);};ilib.CType.isXdigit.stub=true;}
if(!ilib.CType.isXdigit._init){ilib.CType.isXdigit._init=function (sync, loadParams, onLoad){require("./ctype.isxdigit.js");return ilib.CType.isXdigit._init (sync, loadParams, onLoad);};ilib.CType.isXdigit._init.stub=true;}
if(!ilib.CType.isScript){ilib.CType.isScript=function (ch, script){require("./ctype.isscript.js");return ilib.CType.isScript (ch, script);};ilib.CType.isScript.stub=true;}
if(!ilib.CType.isScript._init){ilib.CType.isScript._init=function (sync, loadParams, onLoad){require("./ctype.isscript.js");return ilib.CType.isScript._init (sync, loadParams, onLoad);};ilib.CType.isScript._init.stub=true;}
if(!ilib.ScriptInfo){ilib.ScriptInfo=function(script, options){require("./scriptinfo.js");return new ilib.ScriptInfo(script, options);};ilib.ScriptInfo.stub=true;}
if(!ilib.ScriptInfo.getAllScripts){ilib.ScriptInfo.getAllScripts=function(){require("./scriptinfo.js");return ilib.ScriptInfo.getAllScripts();};ilib.ScriptInfo.getAllScripts.stub=true;}
if(!ilib.Name){ilib.Name=function (name, options){require("./nameprs.js");return new ilib.Name (name, options);};ilib.Name.stub=true;}
if(!ilib.Name._isAsianChar){ilib.Name._isAsianChar=function(c){require("./nameprs.js");return ilib.Name._isAsianChar(c);};ilib.Name._isAsianChar.stub=true;}
if(!ilib.Name._isAsianName){ilib.Name._isAsianName=function (name, language){require("./nameprs.js");return ilib.Name._isAsianName (name, language);};ilib.Name._isAsianName.stub=true;}
if(!ilib.Name._isEuroName){ilib.Name._isEuroName=function (name, language){require("./nameprs.js");return ilib.Name._isEuroName (name, language);};ilib.Name._isEuroName.stub=true;}
if(!ilib.NameFmt){ilib.NameFmt=function(options){require("./namefmt.js");return new ilib.NameFmt(options);};ilib.NameFmt.stub=true;}
if(!ilib.Address){ilib.Address=function (freeformAddress, options){require("./addressprs.js");return new ilib.Address (freeformAddress, options);};ilib.Address.stub=true;}
if(!ilib.AddressFmt){ilib.AddressFmt=function(options){require("./addressfmt.js");return new ilib.AddressFmt(options);};ilib.AddressFmt.stub=true;}
if(!ilib.GlyphString){ilib.GlyphString=function (str, options){require("./glyphstring.js");return new ilib.GlyphString (str, options);};ilib.GlyphString.stub=true;}
if(!ilib.GlyphString._isJamoL){ilib.GlyphString._isJamoL=function (n){require("./glyphstring.js");return ilib.GlyphString._isJamoL (n);};ilib.GlyphString._isJamoL.stub=true;}
if(!ilib.GlyphString._isJamoV){ilib.GlyphString._isJamoV=function (n){require("./glyphstring.js");return ilib.GlyphString._isJamoV (n);};ilib.GlyphString._isJamoV.stub=true;}
if(!ilib.GlyphString._isJamoT){ilib.GlyphString._isJamoT=function (n){require("./glyphstring.js");return ilib.GlyphString._isJamoT (n);};ilib.GlyphString._isJamoT.stub=true;}
if(!ilib.GlyphString._isHangul){ilib.GlyphString._isHangul=function (n){require("./glyphstring.js");return ilib.GlyphString._isHangul (n);};ilib.GlyphString._isHangul.stub=true;}
if(!ilib.GlyphString._composeJamoLV){ilib.GlyphString._composeJamoLV=function (lead, trail){require("./glyphstring.js");return ilib.GlyphString._composeJamoLV (lead, trail);};ilib.GlyphString._composeJamoLV.stub=true;}
if(!ilib.GlyphString._composeJamoLVT){ilib.GlyphString._composeJamoLVT=function (lead, trail){require("./glyphstring.js");return ilib.GlyphString._composeJamoLVT (lead, trail);};ilib.GlyphString._composeJamoLVT.stub=true;}
if(!ilib.GlyphString._compose){ilib.GlyphString._compose=function (lead, trail){require("./glyphstring.js");return ilib.GlyphString._compose (lead, trail);};ilib.GlyphString._compose.stub=true;}
if(!ilib.NormString){ilib.NormString=function (str){require("./normstring.js");return new ilib.NormString (str);};ilib.NormString.stub=true;}
if(!ilib.NormString.init){ilib.NormString.init=function(options){require("./normstring.js");return ilib.NormString.init(options);};ilib.NormString.init.stub=true;}
if(!ilib.NormString._decomposeHangul){ilib.NormString._decomposeHangul=function (cp){require("./normstring.js");return ilib.NormString._decomposeHangul (cp);};ilib.NormString._decomposeHangul.stub=true;}
if(!ilib.NormString._expand){ilib.NormString._expand=function (ch, canon, compat){require("./normstring.js");return ilib.NormString._expand (ch, canon, compat);};ilib.NormString._expand.stub=true;}
if(!ilib.CodePointSource){ilib.CodePointSource=function(str, ignorePunctuation){require("./collate.js");return new ilib.CodePointSource(str, ignorePunctuation);};ilib.CodePointSource.stub=true;}
if(!ilib.ElementIterator){ilib.ElementIterator=function (source, map, keysize){require("./collate.js");return new ilib.ElementIterator (source, map, keysize);};ilib.ElementIterator.stub=true;}
if(!ilib.Collator){ilib.Collator=function(options){require("./collate.js");return new ilib.Collator(options);};ilib.Collator.stub=true;}
if(!ilib.Collator.getAvailableStyles){ilib.Collator.getAvailableStyles=function (locale){require("./collate.js");return ilib.Collator.getAvailableStyles (locale);};ilib.Collator.getAvailableStyles.stub=true;}
if(!ilib.Collator.getAvailableScripts){ilib.Collator.getAvailableScripts=function (){require("./collate.js");return ilib.Collator.getAvailableScripts ();};ilib.Collator.getAvailableScripts.stub=true;}
if(!ilib.LocaleMatcher){ilib.LocaleMatcher=function(options){require("./localematch.js");return new ilib.LocaleMatcher(options);};ilib.LocaleMatcher.stub=true;}
if(!ilib.CaseMapper){ilib.CaseMapper=function (options){require("./maps/casemapper.js");return new ilib.CaseMapper (options);};ilib.CaseMapper.stub=true;}
if(!ilib.NumPlan){ilib.NumPlan=function (options){require("./phone/numplan.js");return new ilib.NumPlan (options);};ilib.NumPlan.stub=true;}
if(!ilib.PhoneLoc){ilib.PhoneLoc=function(options){require("./phone/phoneloc.js");return new ilib.PhoneLoc(options);};ilib.PhoneLoc.stub=true;}
if(!ilib.StateHandler){ilib.StateHandler=function (){require("./phone/handler.js");return new ilib.StateHandler ();};ilib.StateHandler.stub=true;}
if(!ilib.CSStateHandler){ilib.CSStateHandler=function (){require("./phone/handler.js");return new ilib.CSStateHandler ();};ilib.CSStateHandler.stub=true;}
if(!ilib.USStateHandler){ilib.USStateHandler=function (){require("./phone/handler.js");return new ilib.USStateHandler ();};ilib.USStateHandler.stub=true;}
if(!ilib._handlerFactory){ilib._handlerFactory=function (locale, plan){require("./phone/handler.js");return ilib._handlerFactory (locale, plan);};ilib._handlerFactory.stub=true;}
if(!ilib.PhoneNumber){ilib.PhoneNumber=function(number, options){require("./phone/phonenum.js");return new ilib.PhoneNumber(number, options);};ilib.PhoneNumber.stub=true;}
if(!ilib.PhoneNumber.parseImsi){ilib.PhoneNumber.parseImsi=function(imsi, options){require("./phone/phonenum.js");return ilib.PhoneNumber.parseImsi(imsi, options);};ilib.PhoneNumber.parseImsi.stub=true;}
if(!ilib.PhoneNumber._parseImsi){ilib.PhoneNumber._parseImsi=function(data, imsi){require("./phone/phonenum.js");return ilib.PhoneNumber._parseImsi(data, imsi);};ilib.PhoneNumber._parseImsi.stub=true;}
if(!ilib.PhoneNumber._stripFormatting){ilib.PhoneNumber._stripFormatting=function(str){require("./phone/phonenum.js");return ilib.PhoneNumber._stripFormatting(str);};ilib.PhoneNumber._stripFormatting.stub=true;}
if(!ilib.PhoneNumber._getCharacterCode){ilib.PhoneNumber._getCharacterCode=function(ch){require("./phone/phonenum.js");return ilib.PhoneNumber._getCharacterCode(ch);};ilib.PhoneNumber._getCharacterCode.stub=true;}
if(!ilib.PhoneFmt){ilib.PhoneFmt=function(options){require("./phone/phonefmt.js");return new ilib.PhoneFmt(options);};ilib.PhoneFmt.stub=true;}
if(!ilib.GeoLocator){ilib.GeoLocator=function(options){require("./phone/phonegeo.js");return new ilib.GeoLocator(options);};ilib.GeoLocator.stub=true;}
if(!ilib.Measurement){ilib.Measurement=function(options){require("./unit.js");return new ilib.Measurement(options);};ilib.Measurement.stub=true;}
if(!ilib.Measurement.getAvailableUnits){ilib.Measurement.getAvailableUnits=function (){require("./unit.js");return ilib.Measurement.getAvailableUnits ();};ilib.Measurement.getAvailableUnits.stub=true;}
if(!ilib.UnitFmt){ilib.UnitFmt=function(options){require("./unitfmt.js");return new ilib.UnitFmt(options);};ilib.UnitFmt.stub=true;}
if(!ilib.Measurement.Length){ilib.Measurement.Length=function (options){require("./units/length.js");return new ilib.Measurement.Length (options);};ilib.Measurement.Length.stub=true;}
if(!ilib.Measurement.Length.convert){ilib.Measurement.Length.convert=function(to, from, length){require("./units/length.js");return ilib.Measurement.Length.convert(to, from, length);};ilib.Measurement.Length.convert.stub=true;}
if(!ilib.Measurement.Length.getMeasures){ilib.Measurement.Length.getMeasures=function (){require("./units/length.js");return ilib.Measurement.Length.getMeasures ();};ilib.Measurement.Length.getMeasures.stub=true;}
if(!ilib.Measurement.Speed){ilib.Measurement.Speed=function (options){require("./units/speed.js");return new ilib.Measurement.Speed (options);};ilib.Measurement.Speed.stub=true;}
if(!ilib.Measurement.Speed.convert){ilib.Measurement.Speed.convert=function(to, from, speed){require("./units/speed.js");return ilib.Measurement.Speed.convert(to, from, speed);};ilib.Measurement.Speed.convert.stub=true;}
if(!ilib.Measurement.Speed.getMeasures){ilib.Measurement.Speed.getMeasures=function (){require("./units/speed.js");return ilib.Measurement.Speed.getMeasures ();};ilib.Measurement.Speed.getMeasures.stub=true;}
if(!ilib.Measurement.DigitalStorage){ilib.Measurement.DigitalStorage=function (options){require("./units/digitalStorage.js");return new ilib.Measurement.DigitalStorage (options);};ilib.Measurement.DigitalStorage.stub=true;}
if(!ilib.Measurement.DigitalStorage.convert){ilib.Measurement.DigitalStorage.convert=function(to, from, digitalStorage){require("./units/digitalStorage.js");return ilib.Measurement.DigitalStorage.convert(to, from, digitalStorage);};ilib.Measurement.DigitalStorage.convert.stub=true;}
if(!ilib.Measurement.DigitalStorage.getMeasures){ilib.Measurement.DigitalStorage.getMeasures=function (){require("./units/digitalStorage.js");return ilib.Measurement.DigitalStorage.getMeasures ();};ilib.Measurement.DigitalStorage.getMeasures.stub=true;}
if(!ilib.Measurement.Temperature){ilib.Measurement.Temperature=function (options){require("./units/temperature.js");return new ilib.Measurement.Temperature (options);};ilib.Measurement.Temperature.stub=true;}
if(!ilib.Measurement.Temperature.convert){ilib.Measurement.Temperature.convert=function(to, from, temperature){require("./units/temperature.js");return ilib.Measurement.Temperature.convert(to, from, temperature);};ilib.Measurement.Temperature.convert.stub=true;}
if(!ilib.Measurement.Temperature.getMeasures){ilib.Measurement.Temperature.getMeasures=function (){require("./units/temperature.js");return ilib.Measurement.Temperature.getMeasures ();};ilib.Measurement.Temperature.getMeasures.stub=true;}
if(!ilib.Measurement.Unknown){ilib.Measurement.Unknown=function (options){require("./units/unknown.js");return new ilib.Measurement.Unknown (options);};ilib.Measurement.Unknown.stub=true;}
if(!ilib.Measurement.Unknown.convert){ilib.Measurement.Unknown.convert=function(to, from, unknown){require("./units/unknown.js");return ilib.Measurement.Unknown.convert(to, from, unknown);};ilib.Measurement.Unknown.convert.stub=true;}
if(!ilib.Measurement.Unknown.getMeasures){ilib.Measurement.Unknown.getMeasures=function (){require("./units/unknown.js");return ilib.Measurement.Unknown.getMeasures ();};ilib.Measurement.Unknown.getMeasures.stub=true;}
if(!ilib.Measurement.Time){ilib.Measurement.Time=function (options){require("./units/time.js");return new ilib.Measurement.Time (options);};ilib.Measurement.Time.stub=true;}
if(!ilib.Measurement.Time.convert){ilib.Measurement.Time.convert=function(to, from, time){require("./units/time.js");return ilib.Measurement.Time.convert(to, from, time);};ilib.Measurement.Time.convert.stub=true;}
if(!ilib.Measurement.Time.getMeasures){ilib.Measurement.Time.getMeasures=function (){require("./units/time.js");return ilib.Measurement.Time.getMeasures ();};ilib.Measurement.Time.getMeasures.stub=true;}
if(!ilib.Measurement.Mass){ilib.Measurement.Mass=function (options){require("./units/mass.js");return new ilib.Measurement.Mass (options);};ilib.Measurement.Mass.stub=true;}
if(!ilib.Measurement.Mass.convert){ilib.Measurement.Mass.convert=function(to, from, mass){require("./units/mass.js");return ilib.Measurement.Mass.convert(to, from, mass);};ilib.Measurement.Mass.convert.stub=true;}
if(!ilib.Measurement.Mass.getMeasures){ilib.Measurement.Mass.getMeasures=function (){require("./units/mass.js");return ilib.Measurement.Mass.getMeasures ();};ilib.Measurement.Mass.getMeasures.stub=true;}
if(!ilib.Measurement.Area){ilib.Measurement.Area=function (options){require("./units/area.js");return new ilib.Measurement.Area (options);};ilib.Measurement.Area.stub=true;}
if(!ilib.Measurement.Area.convert){ilib.Measurement.Area.convert=function(to, from, area){require("./units/area.js");return ilib.Measurement.Area.convert(to, from, area);};ilib.Measurement.Area.convert.stub=true;}
if(!ilib.Measurement.Area.getMeasures){ilib.Measurement.Area.getMeasures=function (){require("./units/area.js");return ilib.Measurement.Area.getMeasures ();};ilib.Measurement.Area.getMeasures.stub=true;}
if(!ilib.Measurement.FuelConsumption){ilib.Measurement.FuelConsumption=function(options){require("./units/fuelConsumption.js");return new ilib.Measurement.FuelConsumption(options);};ilib.Measurement.FuelConsumption.stub=true;}
if(!ilib.Measurement.FuelConsumption.convert){ilib.Measurement.FuelConsumption.convert=function(to, from, fuelConsumption){require("./units/fuelConsumption.js");return ilib.Measurement.FuelConsumption.convert(to, from, fuelConsumption);};ilib.Measurement.FuelConsumption.convert.stub=true;}
if(!ilib.Measurement.FuelConsumption.getMeasures){ilib.Measurement.FuelConsumption.getMeasures=function(){require("./units/fuelConsumption.js");return ilib.Measurement.FuelConsumption.getMeasures();};ilib.Measurement.FuelConsumption.getMeasures.stub=true;}
if(!ilib.Measurement.Volume){ilib.Measurement.Volume=function (options){require("./units/volume.js");return new ilib.Measurement.Volume (options);};ilib.Measurement.Volume.stub=true;}
if(!ilib.Measurement.Volume.convert){ilib.Measurement.Volume.convert=function(to, from, volume){require("./units/volume.js");return ilib.Measurement.Volume.convert(to, from, volume);};ilib.Measurement.Volume.convert.stub=true;}
if(!ilib.Measurement.Volume.getMeasures){ilib.Measurement.Volume.getMeasures=function (){require("./units/volume.js");return ilib.Measurement.Volume.getMeasures ();};ilib.Measurement.Volume.getMeasures.stub=true;}
if(!ilib.Measurement.Energy){ilib.Measurement.Energy=function (options){require("./units/energy.js");return new ilib.Measurement.Energy (options);};ilib.Measurement.Energy.stub=true;}
if(!ilib.Measurement.Energy.convert){ilib.Measurement.Energy.convert=function(to, from, energy){require("./units/energy.js");return ilib.Measurement.Energy.convert(to, from, energy);};ilib.Measurement.Energy.convert.stub=true;}
if(!ilib.Measurement.Energy.getMeasures){ilib.Measurement.Energy.getMeasures=function (){require("./units/energy.js");return ilib.Measurement.Energy.getMeasures ();};ilib.Measurement.Energy.getMeasures.stub=true;}
module.exports = ilib;
