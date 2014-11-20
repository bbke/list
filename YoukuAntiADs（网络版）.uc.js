// ==UserScript==
// @name            youkuantiads.uc.js
// @namespace       YoukuAntiADs@harv.c
// @description     视频网站去黑屏
// @include         chrome://browser/content/browser.xul
// @author          harv.c
// @homepage        http://haoutil.tk
// @version         14.11.20.16
// @downloadUrl     http://git.oschina.net/halflife/list/raw/master/YoukuAntiADs.uc.js
// ==/UserScript==
(function() {
    // YoukuAntiADs, request observer
    function YoukuAntiADs() {};
    var refD = 'http://www.minggo.tk/swf/';
    YoukuAntiADs.prototype = {
    // register observer
    var y = new YoukuAntiADs();
    if(location == 'chrome://browser/content/browser.xul') {
        y.register();
    }

    // unregister observer
    window.addEventListener('unload', function() {
        if(location == 'chrome://browser/content/browser.xul') {
            y.unregister();
        }
    });
})();
