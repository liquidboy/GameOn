/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";define("vs/languages/typescript/participants/filenameSuggestions",["require","exports","vs/base/strings","vs/base/paths","vs/base/collections","vs/base/lib/winjs.base","vs/base/network","../lib/typescriptServices","vs/languages/typescript/project/typescriptProject"],function(e,t,n,r,i,o,s,a,l){var c=function(){function e(e,t,n){this._requestService=e,this._amd=t,this.basepath=n,"/"===this.basepath&&(this.basepath=null)}return e.prototype.makeModulePath=function(e,t,n){return e?this._toRequirePath(t,n):this._toReferencesPath(t,n)},e.prototype._toRequirePath=function(e,t){var i,o=r.dirname(t);if(this._amd&&this.basepath){var a=this._requestService.getPath("root",s.URL.fromValue(e));i=a.substr(this.basepath.length),i=n.ltrim(i,"/")}else i=r.join(r.relative(o,r.dirname(e)),r.basename(e)),n.startsWith(i,"..")||(i="./"+i);return i=n.rtrim(i,".ts"),i=n.rtrim(i,".js")},e.prototype._toReferencesPath=function(e,t){var n=r.dirname(t);return r.join(r.relative(n,r.dirname(e)),r.basename(e))},e}();t.PathMaker=c;var u=function(){function e(e){this._resourceServices=e.resourceService,this._requestService=e.requestService}return e.prototype.suggest=function(e,t,s){if(!(s&&s.syntaxTree instanceof a.SyntaxTree&&s.project instanceof l.TypeScriptProject))return o.TPromise.as(null);var u=this._findCurrentWord(e,t,s.syntaxTree);if(!u)return o.TPromise.as(null);var p=s.project,h=p.compileConfiguration(),d=new c(this._requestService,n.equalsIgnoreCase(h.module,"amd"),h.baseUrl),m=e.toExternal(),f=this._requestService.getRequestUrl("root",n.empty,!0),g=this._requestService.getRequestUrl("root",h.scope,!0),v=/^['"]/.test(u.wordUntilPosition)?u.wordUntilPosition[0]:'"',y={currentWord:u.wordUntilPosition,suggestions:[]},b=Object.create(null);return p.contentResolver().accept(function(t){if(u.external&&n.endsWith(t.path,".d.ts"))return!0;var i=r.join(f,t.path);if(i===e.toExternal()||!r.isEqualOrParent(i,g))return!0;if(b[i])return!0;var o=d.makeModulePath(u.external,i,m);return b[i]={label:n.format("{0}{1}{0}",v,o),codeSnippet:n.rtrim(n.format("{0}{1}{0}",v,o),u.wordAfterPosition),documentationLabel:"."!==r.dirname(t.path)?n.format("{0} - {1}",r.basename(t.path),r.dirname(t.path)):t.path,type:"reference"},!0}).then(function(){return y.suggestions=i.values(b),y})},e.prototype._findCurrentWord=function(t,n,r){var i=this._resourceServices.get(t),o=i.getOffsetFromPosition(n),s=r.sourceUnit().findToken(o,!0);if(o>=s.fullStart()&&o<s.start()){var a=i.getLineContent(n.lineNumber),l=i.getOffsetFromPosition({lineNumber:n.lineNumber,column:1}),c=e._TrippleSlashReference.exec(a);if(c)return{wordUntilPosition:c[2].substring(0,o-(l+c[1].length)),wordAfterPosition:c[2].substring(o-(l+c[1].length)),external:!1}}else{if(p.isTokenPath(s,14,245))return{wordUntilPosition:p.text(s.element()).substr(0,o-s.start()),wordAfterPosition:p.text(s.element()).substr(o-s.start()),external:!0};if(p.isTokenPath(s,14,2,226,213)){var u=p.parent(s,3).element();if("require"===p.text(u.expression))return{wordUntilPosition:p.text(s.element()).substr(0,o-s.start()),wordAfterPosition:p.text(s.element()).substr(o-s.start()),external:!0}}else if(p.isTokenPath(s,14,2,214,2,226,213)){var u=p.parent(s,5).element();if("define"===p.text(u.expression))return{wordUntilPosition:p.text(s.element()).substr(0,o-s.start()),wordAfterPosition:p.text(s.element()).substr(o-s.start()),external:!0}}}},e._TrippleSlashReference=/^(\/\/\/\s*<reference\s+path=)([^\s>]+)/i,e}();t.FilenameSuggestions=u;var p;!function(e){function t(e){return e.fullText().substr(e.leadingTriviaWidth(),e.width())}function n(e,t){for(;t-->0&&e;)e=e.parent();return e}function r(e){for(var t=[],n=0;n<arguments.length-1;n++)t[n]=arguments[n+1];for(;t.length>0&&e;){var r=t.shift();if(r!==e.kind())return!1;e=e.parent()}return!0}e.text=t,e.parent=n,e.isTokenPath=r}(p||(p={}))});