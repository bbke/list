// ==UserScript==
// @name            youkuantiads.uc.js
// @namespace       YoukuAntiADs@harv.c
// @description     视频网站去黑屏
// @include         chrome://browser/content/browser.xul
// @author          harv.c
// @homepage        http://haoutil.tk
// @version         14.11.20.16
// @downloadUrl     http://git.oschina.net/halflife/list/raw/master/YoukuAntiADs（本地版）.uc.js
// ==/UserScript==
(function() {
    // YoukuAntiADs, request observer
    function YoukuAntiADs() {};
    var refD = 'file:///' + Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile).path + '/chrome/swf/';
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
