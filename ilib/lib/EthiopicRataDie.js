var ilib=require("./ilib.js");var EthiopicCal=require("./EthiopicCal.js");var RataDie=require("./RataDie.js");var EthiopicRataDie=function(i){this.cal=i&&i.cal||new EthiopicCal;this.rd=undefined;RataDie.call(this,i)};EthiopicRataDie.prototype=new RataDie;EthiopicRataDie.prototype.parent=RataDie;EthiopicRataDie.prototype.constructor=EthiopicRataDie;EthiopicRataDie.prototype.epoch=1724219.75;EthiopicRataDie.prototype._setDateComponents=function(i){var t=i.year;var a=365*(t-1)+Math.floor(t/4);var e=(i.month-1)*30+i.day;var o=(i.hour*36e5+i.minute*6e4+i.second*1e3+i.millisecond)/864e5;this.rd=a+e+o};module.exports=EthiopicRataDie;