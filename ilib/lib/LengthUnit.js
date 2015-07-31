var Measurement=require("./Measurement.js");var LengthUnit=function(options){this.unit="meter";this.amount=0;this.aliases=LengthUnit.aliases;if(options){if(typeof options.unit!=="undefined"){this.originalUnit=options.unit;this.unit=this.aliases[options.unit]||options.unit}if(typeof options.amount==="object"){if(options.amount.getMeasure()==="length"){this.amount=LengthUnit.convert(this.unit,options.amount.getUnit(),options.amount.getAmount())}else{throw"Cannot convert unit "+options.amount.unit+" to a length"}}else if(typeof options.amount!=="undefined"){this.amount=parseFloat(options.amount)}}if(typeof LengthUnit.ratios[this.unit]==="undefined"){throw"Unknown unit: "+options.unit}};LengthUnit.prototype=new Measurement();LengthUnit.prototype.parent=Measurement;LengthUnit.prototype.constructor=LengthUnit;LengthUnit.ratios={micrometer:[1,1,.001,1e-4,393701e-10,1e-5,328084e-11,109361e-11,1e-6,1e-7,1e-8,1e-9,6.21373e-10,5.39957e-10,1e-12,1e-15],millimeter:[2,1e3,1,.1,.0393701,.01,.00328084,.00109361,.001,1e-4,1e-5,1e-6,6.21373e-7,5.39957e-7,1e-9,1e-12],centimeter:[3,1e4,10,1,.393701,.1,.0328084,.0109361,.01,.001,1e-4,1e-5,621373e-11,539957e-11,1e-8,1e-9],inch:[4,25399.986,25.399986,2.5399986,1,.25399986,.083333333,.027777778,.025399986,.0025399986,.00025399986,25399986e-12,15783e-9,13715e-9,2.5399986e-8,2.5399986e-11],decimeter:[5,1e5,100,10,3.93701,1,.328084,.109361,.1,.01,.001,1e-4,621373e-10,539957e-10,1e-7,1e-8],foot:[6,304799.99,304.79999,30.479999,12,3.0479999,1,.33333333,.30479999,.030479999,.0030479999,.00030479999,189394e-9,164579e-9,3.0479999e-7,3.0479999e-10],yard:[7,914402.758,914.402758,91.4402758,36,9.14402758,3,1,.914402758,.0914402758,.00914402758,.000914402758,568182e-9,493737e-9,9.14402758e-7,9.14402758e-10],meter:[8,1e6,1e3,100,39.3701,10,3.28084,1.09361,1,.1,.01,.001,.0006213712,539957e-9,1e-6,1e-7],decameter:[9,1e7,1e4,1e3,393.701,100,32.8084,10.9361,10,1,.1,.01,.00621373,.00539957,1e-5,1e-6],hectometer:[10,1e8,1e5,1e4,3937.01,1e3,328.084,109.361,100,10,1,.1,.0621373,.0539957,1e-4,1e-5],kilometer:[11,1e9,1e6,1e5,39370.1,1e4,3280.84,1093.61,1e3,100,10,1,.621373,.539957,.001,1e-4],mile:[12,160934e4,1609340,160934,63360,16093.4,5280,1760,1609.34,160.934,16.0934,1.60934,1,.868976,.00160934,160934e-11],nauticalmile:[13,1852e6,1852e3,185200,72913.4,18520,6076.12,2025.37,1852,185.2,18.52,1.852,1.15078,1,.001852,1852e-9],megameter:[14,1e12,1e9,1e6,39370100,1e5,3280840,1093610,1e4,1e3,100,10,621.373,539.957,1,.001],gigameter:[15,1e15,1e12,1e9,393701e5,1e8,328084e4,109361e4,1e7,1e6,1e5,1e4,621373,539957,1e3,1]};LengthUnit.metricSystem={micrometer:1,millimeter:2,centimeter:3,decimeter:5,meter:8,decameter:9,hectometer:10,kilometer:11,megameter:14,gigameter:15};LengthUnit.imperialSystem={inch:4,foot:6,yard:7,mile:12,nauticalmile:13};LengthUnit.uscustomarySystem={inch:4,foot:6,yard:7,mile:12,nauticalmile:13};LengthUnit.metricToUScustomary={micrometer:"inch",millimeter:"inch",centimeter:"inch",decimeter:"inch",meter:"yard",decameter:"yard",hectometer:"mile",kilometer:"mile",megameter:"nauticalmile",gigameter:"nauticalmile"};LengthUnit.usCustomaryToMetric={inch:"centimeter",foot:"centimeter",yard:"meter",mile:"kilometer",nauticalmile:"kilometer"};LengthUnit.prototype.getMeasure=function(){return"length"};LengthUnit.prototype.localize=function(locale){var to;if(locale==="en-US"||locale==="en-GB"){to=LengthUnit.metricToUScustomary[this.unit]||this.unit}else{to=LengthUnit.usCustomaryToMetric[this.unit]||this.unit}return new LengthUnit({unit:to,amount:this})};LengthUnit.prototype.convert=function(to){if(!to||typeof LengthUnit.ratios[this.normalizeUnits(to)]==="undefined"){return undefined}return new LengthUnit({unit:to,amount:this})};LengthUnit.prototype.scale=function(measurementsystem){var mSystem;if(measurementsystem==="metric"||typeof measurementsystem==="undefined"&&typeof LengthUnit.metricSystem[this.unit]!=="undefined"){mSystem=LengthUnit.metricSystem}else if(measurementsystem==="imperial"||typeof measurementsystem==="undefined"&&typeof LengthUnit.imperialSystem[this.unit]!=="undefined"){mSystem=LengthUnit.imperialSystem}else if(measurementsystem==="uscustomary"||typeof measurementsystem==="undefined"&&typeof LengthUnit.uscustomarySystem[this.unit]!=="undefined"){mSystem=LengthUnit.uscustomarySystem}else{return new LengthUnit({unit:this.unit,amount:this.amount})}var length=this.amount;var munit=this.unit;var fromRow=LengthUnit.ratios[this.unit];length=0x10000000000000000;for(var m in mSystem){var tmp=this.amount*fromRow[mSystem[m]];if(tmp>=1&&tmp<length){length=tmp;munit=m}}return new LengthUnit({unit:munit,amount:length})};LengthUnit.aliases={miles:"mile",mile:"mile",nauticalmiles:"nauticalmile","nautical mile":"nauticalmile","nautical miles":"nauticalmile",nauticalmile:"nauticalmile",yards:"yard",yard:"yard",feet:"foot",foot:"foot",inches:"inch",inch:"inch",meters:"meter",metre:"meter",metres:"meter",m:"meter",meter:"meter",micrometers:"micrometer",micrometres:"micrometer",micrometre:"micrometer","µm":"micrometer",micrometer:"micrometer",millimeters:"millimeter",millimetres:"millimeter",millimetre:"millimeter",mm:"millimeter",millimeter:"millimeter",centimeters:"centimeter",centimetres:"centimeter",centimetre:"centimeter",cm:"centimeter",centimeter:"centimeter",decimeters:"decimeter",decimetres:"decimeter",decimetre:"decimeter",dm:"decimeter",decimeter:"decimeter",decameters:"decameter",decametres:"decameter",decametre:"decameter",dam:"decameter",decameter:"decameter",hectometers:"hectometer",hectometres:"hectometer",hectometre:"hectometer",hm:"hectometer",hectometer:"hectometer",kilometers:"kilometer",kilometres:"kilometer",kilometre:"kilometer",km:"kilometer",kilometer:"kilometer",megameters:"megameter",megametres:"megameter",megametre:"megameter",Mm:"megameter",megameter:"megameter",gigameters:"gigameter",gigametres:"gigameter",gigametre:"gigameter",Gm:"gigameter",gigameter:"gigameter"};LengthUnit.convert=function(to,from,length){from=LengthUnit.aliases[from]||from;to=LengthUnit.aliases[to]||to;var fromRow=LengthUnit.ratios[from];var toRow=LengthUnit.ratios[to];if(typeof from==="undefined"||typeof to==="undefined"){return undefined}return length*fromRow[toRow[0]]};LengthUnit.getMeasures=function(){var ret=[];for(var m in LengthUnit.ratios){ret.push(m)}return ret};Measurement._constructors["length"]=LengthUnit;module.exports=LengthUnit;