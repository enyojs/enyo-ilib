var ilib=require("./ilib.js");var JSUtils=require("./JSUtils.js");var CopticCal=require("./CopticCal.js");var EthiopicRataDie=require("./EthiopicRataDie.js");var CopticRataDie=function(i){this.cal=i&&i.cal||new CopticCal;this.rd=undefined;this.epoch=1825028.5;var t={};if(i){JSUtils.shallowCopy(i,t)}t.cal=this.cal;EthiopicRataDie.call(this,t)};CopticRataDie.prototype=new EthiopicRataDie;CopticRataDie.prototype.parent=EthiopicRataDie;CopticRataDie.prototype.constructor=CopticRataDie;module.exports=CopticRataDie;