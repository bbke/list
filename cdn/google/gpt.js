(function(){var a=this;var c=function(b,e){var d=parseFloat(b);return isNaN(d)||1<d||0>d?e:d},f=function(b,e){var d=parseInt(b,10);return isNaN(d)?e:d},g=/^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/,h=function(b,e){if(!b)return e;var d=b.match(g);return d?d[0]:e};var k=c("0.02",0),l=c("0.0",0);var m=c("0.005",0),n=c("0",0),p=c("0.001",0),q=f("1500",1500),r=c("0.01",0),t=c("1.0",0),u=c("0.5",0),v=c("",.001),w=f("",200),x=c("0.01",
0),y=/^true$/.test("")?!0:!1,z=c("0.1",0),A=c("0.01",0),B=c("0.1",0),C=c("0.01",0),D=c("1",0),E=c("",.001),F=c("0.01",0),G=c("0.0",0),H=c("0.05",0),I=c("0.5",0),J=c("0.0",
0),K=c("0.5",0),L=c("0.001",0),M=c("0.0001",0),N=c("0.0001",0);var O=/^true$/.test("false")?!0:!1;var P=function(){return a.googletag||(a.googletag={})},Q=function(b,e){var d=P();d.hasOwnProperty(b)||(d[b]=e)};var R={};R["#1#"]=h("","pagead2.googlesyndication.com");R["#2#"]=h("","pubads.g.doubleclick.net");R["#3#"]=h("","securepubads.g.doubleclick.net");R["#4#"]=h("","partner.googleadservices.com");R["#6#"]=function(b){try{for(var e=null;e!=b;e=b,b=b.parent)switch(b.location.protocol){case "https:":return!0;case "http:":case "file:":return!1}}catch(d){}return!0}(window);R["#7#"]=k;R["#10#"]=n;R["#11#"]=p;
R["#12#"]=m;R["#13#"]=q;R["#16#"]=r;R["#17#"]=t;R["#18#"]=u;R["#20#"]=l;R["#23#"]=v;R["#24#"]=w;R["#27#"]=x;R["#28#"]=z;R["#29#"]=A;R["#31#"]=B;R["#33#"]=h("","pagead2.googlesyndication.com");R["#34#"]=D;R["#36#"]=y;R["#37#"]=C;R["#38#"]=E;R["#39#"]="33509809";R["#40#"]=F;R["#41#"]=G;R["#50#"]=H;R["#42#"]=I;R["#43#"]=J;R["#44#"]=K;R["#45#"]=L;R["#46#"]=O;R["#47#"]=M;R["#48#"]=N;R["#49#"]=(new Date).getTime();Q("_vars_",R);Q("getVersion",function(){return"69r"});var S={};var T=document;Q("cmd",[]);
if("function"==function(){var b=googletag.evalScripts,e=typeof b;if("object"==e)if(b){if(b instanceof Array)return"array";if(b instanceof Object)return e;var d=Object.prototype.toString.call(b);if("[object Window]"==d)return"object";if("[object Array]"==d||"number"==typeof b.length&&"undefined"!=typeof b.splice&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("splice"))return"array";if("[object Function]"==d||"undefined"!=typeof b.call&&"undefined"!=typeof b.propertyIsEnumerable&&
!b.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==e&&"undefined"==typeof b.call)return"object";return e}())googletag.evalScripts();else{var U=(S["#6#"]||P()._vars_["#6#"]?"https:":"http:")+"//partner.googleadservices.com/gpt/pubads_impl_69r.js",V=T.currentScript;if(!("complete"==T.readyState||"loaded"==T.readyState||V&&V.async)){var W="gpt-impl-"+Math.random();try{T.write('<script id="'+W+'" src="'+U+'">\x3c/script>')}catch(X){}T.getElementById(W)&&(P()._loadStarted_=
!0)}if(!P()._loadStarted_){var Y=T.createElement("script");Y.src=U;Y.async=!0;(T.head||T.body||T.documentElement).appendChild(Y);P()._loadStarted_=!0}};})()
