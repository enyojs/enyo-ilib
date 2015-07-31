var ilib=require("./ilib.js");var path=require("./Path.js");var Loader=require("./Loader.js");var ZoneInfoFile=require("./ZoneInfo.js");var QMLLoader=function(fr){this.fr=fr;this.parent.call(this,ilib);this.root=module.filename?path.dirname(path.join(module.filename,"..")):Qt.resolvedUrl("..").toString();this.root=this.root.replace("file://","");if(this.root[this.root.length-1]==="/"){this.root=this.root.substring(0,this.root.length-1)}this.includePath.push(path.join(this.root,"resources"));this._exists(path.join(this.root,"locale"),"localeinfo.json");this._exists("/usr/share/javascript/ilib/locale","localeinfo.json");if(this.fr.exists("/usr/share/zoneinfo")){this.useSystemZoneInfo=false}else{}};QMLLoader.prototype=new Loader();QMLLoader.prototype.parent=Loader;QMLLoader.prototype.constructor=QMLLoader;QMLLoader.prototype._loadFile=function(pathname,sync,cb){var text;if(this.useSystemZoneInfo&&pathname.indexOf("zoneinfo")!==-1){text=this._createZoneFile(pathname);cb&&typeof cb==="function"&&cb(text)}else if(this.fr.exists(pathname)){text=this.fr.read(pathname);cb&&typeof cb==="function"&&cb(text)}else{cb&&typeof cb==="function"&&cb();text=undefined}return text};QMLLoader.prototype._createZoneFile=function(path){var zone=path.substring(path.indexOf("zoneinfo"));zone=zone.substring(0,zone.length-5);try{var zif=new ZoneInfoFile("/usr/share/"+zone);var ret=zif.getIlibZoneInfo(new Date);return JSON.stringify(ret)}catch(e){return undefined}};QMLLoader.prototype._exists=function(dir,file){var fullpath=path.normalize(path.join(dir,file));if(this.fr.exists(fullpath)){this.includePath.push(dir)}};module.exports=QMLLoader;