(this.webpackJsonpziptotaiwanzip=this.webpackJsonpziptotaiwanzip||[]).push([[0],{116:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),s=a(55),c=a.n(s),i=(a(64),a(8)),o=a.n(i),l=a(26),p=a(12),u=a(4),h=a.n(u),f=a(56),m=a(27),d=a(57),b=a.n(d),g=(a(76),a(28)),v=a.n(g),j=["applescript","as","atom","bas","bash","boot","_coffee","c++","c","cake","cc","cl2","clj","cljc","cljs","cljs.hl","cljscm","cljx","cjsx","cson","coffee","cpp","cs","csharp","css","d","dart","dfm","di","delphi","diff","django","docker","dockerfile","dpr","erl","fortran","freepascal","fs","fsharp","gcode","gemspec","go","groovy","gyp","h++","h","handlebars","hbs","hic","hpp","html","html.handlebars","html.hbs","hs","hx","iced","irb","java","jinja","jl","js","json","jsp","jsx","kt","ktm","kts","lazarus","less","lfm","lisp","lpr","lua","m","mak","makefile","matlab","md","mk","mkd","mkdown","ml","mm","nc","ncx","objc","obj-c","opf","osascript","pas","pascal","perl","php","php3","php4","php5","php6","pl","plist","podspec","ps","ps1","pp","py","r","rb","rs","rss","ruby","scala","scm","scpt","scss","sh","sld","st","styl","sql","swift","tex","txt","thor","v","vb","vbnet","vbs","veo","xhtml","xml","xsl","yaml","yml","zsh"],w=a(58);function x(e){var t=[];e.forEach((function(e,a){t.push([e,a])}));for(var a=0,n=t;a<n.length;a++){var r=n[a],s=Object(p.a)(r,2),c=s[0];s[1].dir&&function(){var t=e.folder(c),a=0;t.forEach((function(){return a++})),0===a&&(e=e.remove(c))}()}return e}function k(e){return y.apply(this,arguments)}function y(){return(y=Object(l.a)(o.a.mark((function e(t){var a,n,r,s,c,i,l=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=!(l.length>1&&void 0!==l[1])||l[1],n=l.length>2&&void 0!==l[2]?l[2]:console.log,r=[],t.forEach((function(e,t){r.push([e,t])})),s=o.a.mark((function e(){var r,s,l,u,f,m;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=i[c],s=Object(p.a)(r,2),l=s[0],s[1].dir){e.next=19;break}if(n(l),u=a?h.a.simplifiedToTaiwanWithPhrases:h.a.taiwanToSimplifiedWithPhrases,f=u(l),!j.find((function(e){return l.length>=e.length&&l.substr(l.length-e.length)===e}))){e.next=14;break}return e.next=10,t.file(l).async("string");case 10:m=e.sent,m=u(m),e.next=17;break;case 14:return e.next=16,t.file(l).async("uint8array");case 16:m=e.sent;case 17:l!==f&&(t=t.remove(l),l=f),t=t.file(f,m);case 19:case"end":return e.stop()}}),e)})),c=0,i=r;case 6:if(!(c<i.length)){e.next=11;break}return e.delegateYield(s(),"t0",8);case 8:c++,e.next=6;break;case 11:return e.abrupt("return",t);case 12:case"end":return e.stop()}}),e)})))).apply(this,arguments)}console.log(h.a),console.log(v.a);var E=function(){var e=Object(n.useState)("\u6a94\u6848\u6216ZIP\u6587\u5b57\u5167\u5bb9\u8f49\u63db\u7c21\u7e41\u9ad4\u5de5\u5177"),t=Object(p.a)(e,2),a=t[0],s=t[1],c=Object(n.useState)(!0),i=Object(p.a)(c,2),u=i[0],d=i[1],g=function(e){return"\n  <p>\u9451\u65bc".concat(e?"\u7c21\u9ad4\u5b57":"\u7e41\u9ad4\u5b57","\u548c\u7528\u8a9e\u4e0d\u5408\u4f7f\u7528\u7fd2\u6163\uff0c\u505a\u4e86\u4e00\u500b\u5c07\u76ee\u9304\u5167\u5bb9\u5168\u8f49\u63db\u70ba").concat(e?"\u81fa\u7063\u7e41\u9ad4":"\u7c21\u9ad4\u4e2d\u6587","\u5de5\u5177</p>\n  <p>\u5148\u5c07\u76ee\u9304ZIP\u6253\u5305\u5f8c\uff0c\u9ede\u64ca\u7db2\u9801\u5167\u9078\u64c7\u6a94\u6848\uff0c\u8655\u7406\u5b8c\u6210\u5f8c\u81ea\u52d5\u4e0b\u8f09\uff0c\u6a94\u540d\u70ba ").concat(e?"tw_":"cn_",'\u539f\u540d\u7a31.zip <a href="./test.zip">\u7bc4\u4f8b.zip</a></p>\n  <p>\u7528\u9014\u8209\u4f8b\uff1a\u4e0d\u5e78\u7684\u4ea4\u63a5\u5230').concat(e?"\u7c21\u9ad4":"\u7e41\u9ad4","\u5c08\u6848\u3001\u6216clone\u5230").concat(e?"\u7c21\u9ad4":"\u7e41\u9ad4","\u5b57\u505a\u7684\u7a0b\u5f0f\u5c08\u6848").concat(e?"(GitHub\u4e0a\u4e00\u5806)":"","</p>\n  <p>\u4f7f\u7528 React , node-opencc \u6587\u5b57\u8f49\u63db\uff0cjszip \u5b58\u53d6zip\uff0cfile-saver \u6a94\u6848\u4e0b\u8f09</p>\n  <p>\u73fe\u5728\u55ae\u4e00\u6a94\u6848\u4ea6\u652f\u63f4</p>\n  \n")},y=Object(n.useState)(h.a.simplifiedToTaiwanWithPhrases(g(!0))),E=Object(p.a)(y,2),z=E[0],O=E[1];function T(e){var t="1"===e.target.value,n=t?h.a.simplifiedToTaiwanWithPhrases:h.a.taiwanToSimplifiedWithPhrases;d(t),O(n(g(t))),s(n(a))}return r.a.createElement("div",{className:"App"},r.a.createElement(f.Helmet,null,r.a.createElement("title",null,a),r.a.createElement("meta",{name:"description",content:z}),r.a.createElement("link",{rel:"icon",href:"".concat(w.homepage).concat(u?"favicon.ico":"favicon2.ico")})),r.a.createElement("header",{className:"App-header"},r.a.createElement("img",{src:b.a,className:"App-logo",alt:"logo"}),r.a.createElement("label",null,"\u81fa\u7063\u7e41\u9ad4\u5316",r.a.createElement("input",{type:"radio",value:"1",name:"flag",checked:u,onChange:T})),r.a.createElement("label",null,"\u7b80\u4f53\u4e2d\u6587\u5316",r.a.createElement("input",{type:"radio",value:"0",name:"flag",checked:!u,onChange:T})),r.a.createElement("input",{type:"file",onChange:function(){var e=Object(l.a)(o.a.mark((function e(t){var a,n,r,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=t.target.files[0]){e.next=3;break}return e.abrupt("return");case 3:if(n=a.name,!/zip|epub/.test(n)){e.next=17;break}return r=new v.a,e.next=8,r.loadAsync(a);case 8:return r=e.sent,e.next=11,k(r,u,s);case 11:r=e.sent,s("Waitting ...."),(r=x(r)).generateAsync({type:"blob"}).then((function(e){s("Finish"),Object(m.saveAs)(e,(u?"tw_":"cn_")+a.name)})),e.next=20;break;case 17:(c=new FileReader).onload=function(e){if(j.find((function(e){return n.length>=e.length&&n.substr(n.length-e.length)===e}))){var t=(u?h.a.simplifiedToTaiwanWithPhrases:h.a.taiwanToSimplifiedWithPhrases)(e.target.result),a=new Blob([t],{type:"text/plain;charset=utf-8"});Object(m.saveAs)(a,(u?"tw_":"cn_")+n)}},c.readAsText(a);case 20:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}),a),r.a.createElement("span",{dangerouslySetInnerHTML:{__html:z}}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},57:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},58:function(e){e.exports=JSON.parse('{"name":"ziptotaiwanzip","version":"0.1.0","private":false,"homepage":"https://lursun.github.io/ziptotaiwanzip/","dependencies":{"@testing-library/jest-dom":"^4.2.4","@testing-library/react":"^9.4.0","@testing-library/user-event":"^7.2.1","file-saver":"^2.0.2","jszip":"^3.2.2","node-opencc":"^2.0.1","react":"^16.12.0","react-dom":"^16.12.0","react-helmet":"^5.2.1","react-scripts":"3.3.1"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}')},59:function(e,t,a){e.exports=a(116)},64:function(e,t,a){},76:function(e,t,a){},81:function(e,t){},83:function(e,t){}},[[59,1,2]]]);
//# sourceMappingURL=main.e36c77dc.chunk.js.map