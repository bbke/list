(function(){var a=this;var c=function(b,e){var d=parseFloat(b);return isNaN(d)||1<d||0>d?e:d},f=function(b,e){var d=parseInt(b,10);return isNaN(d)?e:d},g=/^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/,h=function(b,e){if(!b)return e;var d=b.match(g);return d?d[0]:e};var k=c("0.02",0),l=c("0.0",0);var m=c("0.005",0),n=c("0",0),p=c("0.001",0),q=f("1500",1500),r=c("0.01",0),t=c("1.0",0),u=c("0.5",0),v=c("",.001),w=f("",200),x=c("0.01",
0),y=/^true$/.test("")?!0:!1,z=c("0.5",0),A=c("0.01",0),B=c("0.1",0),C=c("0.01",0),D=c("1",0),E=c("",.001),F=c("0.01",0),G=c("0.1",0),H=c("0.1",0),I=c("1.0",0),J=c("0.0",
0),K=c("0.0",0);var L=/^true$/.test("false")?!0:!1;var M=function(){return a.googletag||(a.googletag={})},N=function(b,e){var d=M();b in d||(d[b]=e)};var O={};O["#1#"]=h("","pagead2.googlesyndication.com");O["#2#"]=h("","pubads.g.doubleclick.net");O["#3#"]=h("","securepubads.g.doubleclick.net");O["#4#"]=h("","partner.googleadservices.com");O["#5#"]="http://pagead2.googlesyndication.com/pagead/show_ads.js";O["#6#"]=function(b){try{for(var e=null;e!=b;e=b,b=b.parent)switch(b.location.protocol){case "https:":return!0;case "http:":case "file:":return!1}}catch(d){}return!0}(window);
O["#7#"]=k;O["#10#"]=n;O["#11#"]=p;O["#12#"]=m;O["#13#"]=q;O["#16#"]=r;O["#17#"]=t;O["#18#"]=u;O["#20#"]=l;O["#23#"]=v;O["#24#"]=w;O["#27#"]=x;O["#28#"]=z;O["#29#"]=A;O["#31#"]=B;O["#33#"]=h("","pagead2.googlesyndication.com");O["#34#"]=D;O["#36#"]=y;O["#37#"]=C;O["#38#"]=E;O["#39#"]="108809060";O["#40#"]=F;O["#41#"]=G;O["#42#"]=H;O["#43#"]=I;O["#44#"]=J;O["#45#"]=K;O["#46#"]=L;O["#47#"]=0;O["#48#"]=(new Date).getTime();N("_vars_",O);N("getVersion",function(){return"60r2"});N("cmd",[]);
if("function"==function(){var b=googletag.evalScripts,e=typeof b;if("object"==e)if(b){if(b instanceof Array)return"array";if(b instanceof Object)return e;var d=Object.prototype.toString.call(b);if("[object Window]"==d)return"object";if("[object Array]"==d||"number"==typeof b.length&&"undefined"!=typeof b.splice&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("splice"))return"array";if("[object Function]"==d||"undefined"!=typeof b.call&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==e&&"undefined"==typeof b.call)return"object";return e}())googletag.evalScripts();else{var P=(M()._vars_["#6#"]?"https:":"http:")+"//partner.googleadservices.com/gpt/pubads_impl_60r2.js",Q=document.currentScript;if(!("complete"==document.readyState||"loaded"==document.readyState||Q&&Q.async)){var R="gpt-impl-"+Math.random();try{document.write('<script id="'+R+'" src="'+P+'">\x3c/script>')}catch(S){}document.getElementById(R)&&(M()._loadStarted_=!0)}if(!M()._loadStarted_){var T=
document.createElement("script");T.src=P;T.async=!0;(document.head||document.body||document.documentElement).appendChild(T);M()._loadStarted_=!0}};})()
