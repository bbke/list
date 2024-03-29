// ==UserScript==
// @name            redirector_ui.uc.js
// @namespace       redirector@haoutil.com
// @description     Redirect your requests.
// @include         chrome://browser/content/browser.xul
// @author          harv.c
// @homepage        http://haoutil.com
// @downloadURL     http://git.oschina.net/halflife/list/raw/master/Redirector.uc.js
// @startup         Redirector.init();
// @shutdown        Redirector.destroy(true);
// @version         15.08.14.18
// ==/UserScript==
(function() {
    Cu.import("resource://gre/modules/XPCOMUtils.jsm");
    Cu.import("resource://gre/modules/Services.jsm");
    Cu.import("resource://gre/modules/NetUtil.jsm");
    function Redirector() {
        this.rulesFile = "local\\_redirector.js";
        this.rules = [{
    name: "google搜索结果禁止跳转",
    from: /^https?:\/\/www\.google\.com\/url\?.*url=([^&]*).*/i,
    to: "$1",
    regex: true
},{
    name: "百度网盘lx.cdn重定向",
    from:/^http:\/\/lx\.cdn\.baidupcs\.com\/file\/(.*)$/,
    to: "http://qd.baidupcs.com/file/$1",
    regex: true
},{
    name: "google.com.hk >> google.com",
    from: /^https?:\/\/www\.google\.com\.hk\/search\?(.*)/,
    to: "https://www.google.com/ncr#hl=en-US&newwindow=1&$1",
    regex: true
},{
    name: "wiki繁 >> 简",
    from: /^(https?:\/\/zh\.wikipedia\.org)\/(wiki|zh|zh((?!\-cn)[^\/])+)\/(.*)/i,
    to: "$1/zh-cn/$4",
    regex: true,
},{
    name: "Google Ajax/Fonts http >> 360公共库",
    from: /^https?:\/\/(ajax|fonts)\.googleapis\.com\/(.*)$/i,
    from: /^https:\/\/(ajax|fonts)\.useso\.com\/(.*)$/i,
    to: "http://$1.useso.com/$2",
    regex: true
},{
    name: "Google Themes >> 科大博客",
    from: /^https?:\/\/themes\.googleusercontent\.com\/(.*)$/i,
    to: "http://google-themes.lug.ustc.edu.cn/$1",
    regex: true
},{
    name: "Google Fonts-Gstatic >> 科大博客",
    from: /\:\/\/fonts\.gstatic\.com\/(.*)$/,
    to: "://fonts-gstatic.lug.ustc.edu.cn/$1",
    regex: true
},{
    name: "Google统计和tag >> mingto.coding.io",
    from: /^https?:\/\/(.*?)(google-analytics|googletagmanager|googletagservices|googleadservices)\.com\/([\w]+\/)*([\w]+(\.[\w]+)?)/i,
    to: "http://minggo.coding.io/cdn/google/$4",
    regex: true
},{
    name: "sourceforge >> 镜像站点",
    from: /^https?:\/\/sourceforge\.net\/projects\/(\w)([a-z0-9A-Z_\-\.])([a-z0-9A-Z_\-\.]*)(\/files(\/.*))?/i,
    to: "http://www.mirrorservice.org/sites/download.sourceforge.net/pub/sourceforge/$1/$1$2/$1$2$3$5",
    regex: true
},{
    name: "Gravatar头像 >> 多说",
    from: /^https?:\/\/([0-9]?)\.gravatar\.com\/avatar\/(.*)$/i,
    to: "http://gravatar.duoshuo.com/avatar/$2",
    regex: true
},{
    name:"Greasyfork >> zh-CN",
    from:/^https:\/\/greasyfork\.org\/scripts\/(.*)/,
    exclude:/^https:\/\/greasyfork\.org\/scripts\/.*\.user\.js/i,
    to:"https://greasyfork.org/zh-CN/scripts/$1",
    regex:true
},{
    name: "高登论坛",
    from: /^http:\/\/forum[\d]{0,2}\.hkgolden\.com\/(.*)/i,
    exclude:/^http:\/\/forum14\.hkgolden\.com\/(.*)/i,
    to: "http://forum14.hkgolden.com/$1",
    regex: true
},{
    name: "百度随心听音质 >> 320p",
    from: /^http:\/\/music\.baidu\.com\/data\/music\/fmlink(.*[&\?])rate=[^3]\d+(.*)/i,
    to: "http://music.baidu.com/data/music/fmlink$1rate=320$2",
    regex: true
},{
    name: "uso >> uso-mirror",
    from: /^https?:\/\/userscripts\.org(:8080)?\/(.*)/i,
    to: "http://userscripts-mirror.org/$2",
    regex: true
},{
    name: "500px >> 原始大圖",
    from: /^https?:\/\/(.*)\.(edgecastcdn|500px)\.(net|org)\/(.*)\/[\d].jpg(.*)?/i,
    to: "https://$1.$2.$3/$4/2048.jpg",
    exclude: /^https?:\/\/(.*)\.(edgecastcdn|500px)\.(net|org)\/(.*)\/(1|2).jpg(.*)?/i,//排除頭像縮略圖
    regex: true
},{
    name: "优美图 >> 大图",
    from: /^https?:\/\/(.*)\.topit\.me\/(s|m)\/(.*)$/,
    to: "http://$1.topit.me/l/$3",
    regex: true
},{
    name: "百度贴吧|百科 >> 原始大图",
    from: /http:\/\/(imgsrc|[\w]?\.hiphotos)\.baidu\.com\/(forum|baike)\/[\w].+\/sign=[^\/]+(\/.*).jpg/i,
    to: "http://$1.baidu.com/$2/pic/item$3.jpg",
    regex: true,
    state: false
},{
    name: "优酷收费视频 >> id97免费看",
    from: /^http:\/\/v\.youku\.com\/v_show\/([\w]{16})(_ev_[\d]+)?\.html(\?.*)?$/i,
    to: "http://www.id97.com/videos/play/$1.html",
    regex: true,
    state: false
},{
    name: "AcFun >> 网页全屏",
    from: /^http:\/\/www\.acfun\.tv\/(a|v)\/a(b|c)([\w]+)(.*)?/i,
    exclude: /acfun\.tv\/(a|v)\/a(b|c).*#fullscreen=1$/i,
    to: "http://www.acfun.tv/$1/a$2$3#fullscreen=1", 
    regex: true
},{
    name: "BiliBili",
    from: /^http:\/\/www\.bilibili\.com\/video\/av([\d]+)\/([\w]+\.html)?(.*)?/i,
    exclude: /bilibili\.com\/video\/av([\d]+)\/([\w]+\.html)?#alist$/i,
    to: "http://www.bilibili.com/video/av$1/$2#alist",
    regex: true
},{
    name: "tumblr看视频",
    from: /^https?:\/\/.*\.tumblr\.com\/video_file\/(.*)/i,
    exclude:/^https?:\/\/www\.tumblr\.com\/video_file\/(.*)/i,
    to: "https://www.tumblr.com/video_file/$1",
    regex: true
},{
    name: "【https】常用网站（一）",
    from: /^http:\/\/(upload\.wikimedia\.org|t\.williamgates\.net|dyncdn\.me|www\.baidu\.com)(.*)/i,
    exclude:/^http:\/\/www\.baidu\.com\/p\//i,
    to: "https://$1$2",
    regex: true
},{
    name: "【https】常用网站（二）",
    from: /^http:\/\/(.*?)(m-team\.cc)(.*)/i,
    to: "https://$1$2$3",
    regex: true
},{
    name: "【https】常用com网站",
    from: /^http:\/\/(.*)?(evozi|tumblr|vimeo|livestreamcevozi|imgur|redditmedia|filesmonster|cam4s)\.com\/(.*)$/i,
    to: "https://$1$2.com/$3",
    regex: true
},{
    name: "【https】5isotoi5",
    from: /^https?:\/\/(.*)?(76\.164\.232\.(68|70)|5isotoi5\.org)\/(.*)$/i,
    exclude:/^https:\/\/5isotoi5\.org/i,
    to: "https://5isotoi5.org/$4",
    regex: true
}];
    }
    function RedirectorUI() {
        this.addIcon = true;                        // 是否添加按钮
        this.state = true;                          // 是否启用脚本
        this.enableIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA+ElEQVQ4jaWTIa7DMBBEDUMNixeGGgauFBAYUClsURRStqTE2DfoDXqCnsAX6AV6A99hippvN+5X1IIBlqznmdm1McbgRxnA+69UAB6nE6IILsOAwIxj26Ingm2a9TWyFueuQ1ItAUkVt2lCT7TLtjsckFTrEfZCLsNQB+SWo0hxzpU9ZGrFgKwFvEdgrgKObbsFRJFNznPXVQHXcdwCbtO0K//i3HaM/9nNbV/Hsb4H8B6Lc0VJ93leS7RNg8D8eZHeR9gTAd4XkFe5LxcF4N0+WbtuXA2S3f9zkFQRRRCYsTiHxTlEESRV9EQIzLjP8+cIX3+mX/QEXma7NDsegmEAAAAASUVORK5CYII=";
        this.disableIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4klEQVQ4jaWTQREDIQxFMYACFKyDGEBBFCAgAhDAHQE5c14BkRBPv6duly7t7LSHf2CGefz/E0IIAX8qwN1/0gTY9x2qilorRAQ5ZxARYozHaykllFJgZjPAzNB7BxHdsr1tG8xsHeEupNa6Bpwtq+p0Puv0UFgVg5QS3B0isgTknK8AVb3kLKUsAa21K6D3fis/M1/H+M3u2XZrbb0H7g5mnkoaYxwlxhghIp8X6X2ERAR3nyDPcp8uJsC7/ZTSsXEryOn+y4GZQVUhImBmMDNUFWYGIoKIYIzxOcLPn+kfPQAVduEGEMliqAAAAABJRU5ErkJggg==";
    }
    RedirectorUI.prototype = {
        hash: new Date().getTime(),
        _mm: null,
        _ppmm: null,
        get mm() {
            if (!this._mm) {
                this._mm = Cc["@mozilla.org/childprocessmessagemanager;1"].getService(Ci.nsISyncMessageSender);
            }
            return this._mm;
        },
        get ppmm() {
            if (!this._ppmm) {
                this._ppmm = Cc["@mozilla.org/parentprocessmessagemanager;1"].getService(Ci.nsIMessageBroadcaster);
            }
            return this._ppmm;
        },
        get redirector() {
            if (!Services.redirector) {
                XPCOMUtils.defineLazyGetter(Services, "redirector", function() {
                    return new Redirector();
                });
            }
            return Services.redirector;
        },
        init: function() {
            this.redirector.init(window);
            this.drawUI();
            // register self as a messagelistener
            this.mm.addMessageListener("redirector:toggle", this);
            this.mm.addMessageListener("redirector:toggle-item", this);
            this.mm.addMessageListener("redirector:reload", this);
        },
        destroy: function(shouldDestoryUI) {
            this.redirector.destroy(window);
            if (shouldDestoryUI) {
                this.destoryUI();
            }
            // this.mm.removeMessageListener("redirector:toggle", this);
            // this.mm.removeMessageListener("redirector:toggle-item", this);
            // this.mm.removeMessageListener("redirector:reload", this);
        },
        edit: function() {
            let aFile = FileUtils.getFile("UChrm", this.redirector.rulesFile.split('\\'), false);
            if (!aFile || !aFile.exists() || !aFile.isFile()) return;
            var editor;
            try {
                editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
            } catch (e) {
                alert("Please set editor path.\nview_source.editor.path");
                toOpenWindowByType('pref:pref', 'about:config?filter=view_source.editor.path');
                return;
            }
            var UI = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
            UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0 ? "gbk" : "UTF-8";
            var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
            try {
                var path = UI.ConvertFromUnicode(aFile.path);
                var args = [path];
                process.init(editor);
                process.run(false, args, args.length);
            } catch (e) {
                alert("editor error.")
            }
        },
        toggle: function(i, callfromMessage) {
            if (i) {
                // update checkbox state
                let item = document.getElementById("redirector-item-" + i);
                if (!callfromMessage) {
                    this.redirector.rules[i].state = !this.redirector.rules[i].state;
                }
                if (item) item.setAttribute("checked", this.redirector.rules[i].state);
                // clear cache
                this.redirector.clearCache();
                if (!callfromMessage) {
                    // notify other windows to update
                    this.ppmm.broadcastAsyncMessage("redirector:toggle-item", {hash: this.hash, item: i});
                }
            } else {
                let menuitems = document.querySelectorAll("menuitem[id^='redirector-item-']");
                this.state = !this.state;
                if (this.state) {
                    this.init();
                    Object.keys(menuitems).forEach(function(n) menuitems[n].setAttribute("disabled", false));
                } else {
                    this.destroy();
                    Object.keys(menuitems).forEach(function(n) menuitems[n].setAttribute("disabled", true));
                }
                // update checkbox state
                let toggle = document.getElementById("redirector-toggle");
                if (toggle) {
                    toggle.setAttribute("checked", this.state);
                }
                // update icon state
                let icon = document.getElementById("redirector-icon");
                if (icon) {
                    icon.style.listStyleImage = "url(" + (this.state ? this.enableIcon : this.disableIcon) + ")";
                }
                if (!callfromMessage) {
                    // notify other windows to update
                    this.ppmm.broadcastAsyncMessage("redirector:toggle", {hash: this.hash});
                }
            }
        },
        drawUI: function() {
            if (this.addIcon && !document.getElementById("redirector-icon")) {
                // add icon
                let icon = document.getElementById("urlbar-icons").appendChild(document.createElement("image"));
                icon.setAttribute("id", "redirector-icon");
                icon.setAttribute("context", "redirector-menupopup");
                icon.setAttribute("onclick", "Redirector.iconClick(event);");
                icon.setAttribute("tooltiptext", "重定向");
                icon.setAttribute("style", "padding: 0px 2px; list-style-image: url(" + (this.state ? this.enableIcon : this.disableIcon) + ")");
                // add menu
                let xml = '\
                    <menupopup id="redirector-menupopup">\
                        <menuitem label="启用" id="redirector-toggle" type="checkbox" autocheck="false" key="redirector-toggle-key" checked="' + this.state + '" oncommand="Redirector.toggle();" />\
                        <menuitem label="重载规则" id="redirector-reload" oncommand="Redirector.reload();"/>\
                        <menuitem label="编辑规则" id="redirector-edit" oncommand="Redirector.edit();"/>\
                        <menuseparator id="redirector-sepalator"/>\
                    </menupopup>\
                ';
                let range = document.createRange();
                range.selectNodeContents(document.getElementById("mainPopupSet"));
                range.collapse(false);
                range.insertNode(range.createContextualFragment(xml.replace(/\n|\t/g, "")));
                range.detach();
                // add rule items
                this.buildItems();
            }
            if (!document.getElementById("redirector-toggle-key")) {
                // add shortcuts
                let key = document.getElementById("mainKeyset").appendChild(document.createElement("key"));
                key.setAttribute("id", "redirector-toggle-key");
                key.setAttribute("oncommand", "Redirector.toggle();");
                key.setAttribute("key", "r");
                key.setAttribute("modifiers", "shift");
            }
        },
        destoryUI: function() {
            let icon = document.getElementById("redirector-icon");
            if (icon) {
                icon.parentNode.removeChild(icon);
                delete icon;
            }
            let menu = document.getElementById("redirector-menupopup");
            if (menu) {
                menu.parentNode.removeChild(menu);
                delete menu;
            }
        },
        iconClick: function(event) {
            switch(event.button) {
                case 1:
                    document.getElementById("redirector-toggle").doCommand();
                    break;
                default:
                    document.getElementById("redirector-menupopup").openPopup(null, null, event.clientX, event.clientY);
            }
            event.preventDefault();
        },
        buildItems: function() {
            let menu = document.getElementById("redirector-menupopup");
            if (!menu) return;
            for(let i = 0; i < this.redirector.rules.length; i++) {
                let menuitem = menu.appendChild(document.createElement("menuitem"));
                menuitem.setAttribute("label", this.redirector.rules[i].name);
                menuitem.setAttribute("id", "redirector-item-" + i);
                menuitem.setAttribute("class", "redirector-item");
                menuitem.setAttribute("type", "checkbox");
                menuitem.setAttribute("autocheck", "false");
                menuitem.setAttribute("checked", typeof this.redirector.rules[i].state == "undefined" ? true : this.redirector.rules[i].state);
                menuitem.setAttribute("oncommand", "Redirector.toggle('"+ i +"');");
                menuitem.setAttribute("disabled", !this.state);
            }
        },
        clearItems: function() {
            let menu = document.getElementById("redirector-menupopup");
            let menuitems = document.querySelectorAll("menuitem[id^='redirector-item-']");
            if (!menu || !menuitems) return;
            for (let i = 0; i < menuitems.length; i++) {
                menu.removeChild(menuitems[i]);
            }
        },
        reload: function(callfromMessage) {
            if (!callfromMessage) {
                this.redirector.reload();
            }
            this.clearItems();
            this.buildItems();
            if (!callfromMessage) {
                // notify other windows to update
                this.ppmm.broadcastAsyncMessage("redirector:reload", {hash: this.hash});
            }
        },
        // nsIMessageListener interface implementation
        receiveMessage: function(message) {
            if (this.hash == message.data.hash) {
                return;
            }
            switch (message.name) {
                case "redirector:toggle":
                    this.toggle(null, true);
                    break;
                case "redirector:toggle-item":
                    this.toggle(message.data.item, true);
                    break;
                case "redirector:reload":
                    this.reload(true);
                    break;
            }
        }
    };

    Redirector.prototype = {
        _cache: {
            redirectUrl: {},
            clickUrl: {}
        },
        classDescription: "Redirector content policy",
        classID: Components.ID("{1d5903f0-6b5b-4229-8673-76b4048c6675}"),
        contractID: "@haoutil.com/redirector/policy;1",
        xpcom_categories: ["content-policy", "net-channel-event-sinks"],
        init: function(window) {
            this.loadRule();
            window.addEventListener("click", this, false);
            let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
            if (!registrar.isCIDRegistered(this.classID)) {
                registrar.registerFactory(this.classID, this.classDescription, this.contractID, this);
                let catMan = XPCOMUtils.categoryManager;
                for each (let category in this.xpcom_categories)
                    catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);
                Services.obs.addObserver(this, "http-on-modify-request", false);
                Services.obs.addObserver(this, "http-on-examine-response", false);
            }
        },
        destroy: function(window) {
            window.removeEventListener("click", this, false);
            let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
            if (registrar.isCIDRegistered(this.classID)) {
                registrar.unregisterFactory(this.classID, this);
                let catMan = XPCOMUtils.categoryManager;
                for each (let category in this.xpcom_categories)
                    catMan.deleteCategoryEntry(category, this.contractID, false);
                Services.obs.removeObserver(this, "http-on-modify-request", false);
                Services.obs.removeObserver(this, "http-on-examine-response", false);
            }
        },
        clearCache: function() {
            // clear cache
            this._cache = {
                redirectUrl: {},
                clickUrl: {}
            };
        },
        reload: function() {
            this.clearCache();
            this.loadRule();
        },
        loadRule: function() {
            var aFile = FileUtils.getFile("UChrm", this.rulesFile.split('\\'), false);
            if (!aFile.exists() || !aFile.isFile()) return null;
            var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
            var sstream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);
            fstream.init(aFile, -1, 0, 0);
            sstream.init(fstream);
            var data = sstream.read(sstream.available());
            try {
                data = decodeURIComponent(escape(data));
            } catch (e) {}
            sstream.close();
            fstream.close();if (!data) return;
            var sandbox = new Cu.Sandbox(new XPCNativeWrapper(window));
            try {
                Cu.evalInSandbox(data, sandbox, "1.8");
            } catch (e) {
                return;
            }
            this.rules = sandbox.rules;
        },
        getRedirectUrl: function(originUrl) {
            let redirectUrl = this._cache.redirectUrl[originUrl];
            if(typeof redirectUrl != "undefined") {
                return redirectUrl;
            }
            redirectUrl = null;
            let url, redirect;
            let regex, from, to, exclude, decode;
            for each (let rule in this.rules) {
                if (typeof rule.state == "undefined") rule.state = true;
                if (!rule.state) continue;
                if (rule.computed) {
                    regex = rule.computed.regex; from = rule.computed.from; to = rule.computed.to; exclude = rule.computed.exclude; decode = rule.computed.decode;
                } else {
                    regex = rule.regex || rule.wildcard; from = rule.from; to = rule.to; exclude = rule.exclude; decode = rule.decode;
                    if (rule.wildcard) {
                        from = this.wildcardToRegex(rule.from);
                        exclude = this.wildcardToRegex(rule.exclude);
                    }
                    rule.computed = {regex: regex, from: from, to: to, exclude: exclude, decode: decode};
                }
                url = decode ? this.decodeUrl(originUrl) : originUrl;
                redirect = regex
                    ? from.test(url) ? !(exclude && exclude.test(url)) : false
                    : from == url ? !(exclude && exclude == url) : false;
                if (redirect) {
                    url = typeof to == "function"
                        ? regex ? to(url.match(from)) : to(from)
                        : regex ? url.replace(from, to) : to;
                    redirectUrl = {
                        url : decode ? url : this.decodeUrl(url),   // 避免二次解码
                        resp: rule.resp
                    };
                    break;
                }
            }
            this._cache.redirectUrl[originUrl] = redirectUrl;
            return redirectUrl;
        },
        decodeUrl: function(encodedUrl) {
            let decodedUrl;
            try {
                decodedUrl = decodeURIComponent(encodedUrl);
            } catch(e) {
                decodedUrl = encodedUrl;
            }
            return decodedUrl;
        },
        wildcardToRegex: function(wildcard) {
            if (!wildcard)
                return null;
            return new RegExp((wildcard + "").replace(new RegExp("[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]", "g"), "\\$&").replace(/\\\*/g, "(.*)").replace(/\\\?/g, "."), "i");
        },
        getTarget: function(redirectUrl, callback) {
            NetUtil.asyncFetch(redirectUrl.url, function(inputStream, status) {
                let binaryOutputStream = Cc['@mozilla.org/binaryoutputstream;1'].createInstance(Ci['nsIBinaryOutputStream']);
                let storageStream = Cc['@mozilla.org/storagestream;1'].createInstance(Ci['nsIStorageStream']);
                let count = inputStream.available();
                let data = NetUtil.readInputStreamToString(inputStream, count);
                storageStream.init(512, count, null);
                binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
                binaryOutputStream.writeBytes(data, count);
                redirectUrl.storageStream = storageStream;
                redirectUrl.count = count;
                if (typeof callback === 'function')
                    callback();
            });
        },
        // nsIDOMEventListener interface implementation
        handleEvent: function(event) {
            if (!event.ctrlKey && "click" === event.type && 1 === event.which) {
                let target = event.target;
                while(target) {
                    if (target.tagName && "BODY" === target.tagName.toUpperCase()) break;
                    if (target.tagName && "A" === target.tagName.toUpperCase()
                        && target.target && "_BLANK" === target.target.toUpperCase()
                        && target.href) {
                        this._cache.clickUrl[target.href] = true;
                        break;
                    }
                    target = target.parentNode;
                }
            }
        },
        // nsIContentPolicy interface implementation
        shouldLoad: function(contentType, contentLocation, requestOrigin, context, mimeTypeGuess, extra) {
            // don't redirect clicking links with "_blank" target attribute
            // cause links will be loaded in current tab/window
            if (this._cache.clickUrl[contentLocation.spec]) {
                this._cache.clickUrl[contentLocation.spec] = false;
                return Ci.nsIContentPolicy.ACCEPT;
            }
            // only redirect documents
            if (contentType != Ci.nsIContentPolicy.TYPE_DOCUMENT)
                return Ci.nsIContentPolicy.ACCEPT;
            if (!context || !context.loadURI)
                return Ci.nsIContentPolicy.ACCEPT;
            let redirectUrl = this.getRedirectUrl(contentLocation.spec);
            if (redirectUrl && !redirectUrl.resp) {
                context.loadURI(redirectUrl.url, requestOrigin, null);
                return Ci.nsIContentPolicy.REJECT_REQUEST;
            }
            return Ci.nsIContentPolicy.ACCEPT;
        },
        shouldProcess: function(contentType, contentLocation, requestOrigin, context, mimeTypeGuess, extra) {
            return Ci.nsIContentPolicy.ACCEPT;
        },
        // nsIChannelEventSink interface implementation
        asyncOnChannelRedirect: function(oldChannel, newChannel, flags, redirectCallback) {
            this.onChannelRedirect(oldChannel, newChannel, flags);
            redirectCallback.onRedirectVerifyCallback(Cr.NS_OK);
        },
        onChannelRedirect: function(oldChannel, newChannel, flags) {
            // only redirect documents
            if (!(newChannel.loadFlags & Ci.nsIChannel.LOAD_DOCUMENT_URI))
                return;
            let newLocation = newChannel.URI.spec;
            if (!newLocation)
                return;
            let callbacks = [];
            if (newChannel.notificationCallbacks)
                callbacks.push(newChannel.notificationCallbacks);
            if (newChannel.loadGroup && newChannel.loadGroup.notificationCallbacks)
                callbacks.push(newChannel.loadGroup.notificationCallbacks);
            let win, webNav;
            for each (let callback in callbacks) {
                try {
                    win = callback.getInterface(Ci.nsILoadContext).associatedWindow;
                    webNav = win.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
                    break;
                } catch(e) {}
            }
            if (!webNav)
                return;
            let redirectUrl = this.getRedirectUrl(newLocation);
            if (redirectUrl && !redirectUrl.resp) {
                webNav.loadURI(redirectUrl.url, null, null, null, null);
            }
        },
        // nsIObserver interface implementation
        observe: function(subject, topic, data, additional) {
            switch (topic) {
                case "http-on-modify-request": {
                    let http = subject.QueryInterface(Ci.nsIHttpChannel);
                    let redirectUrl = this.getRedirectUrl(http.URI.spec);
                    if (redirectUrl && !redirectUrl.resp)
                        if(http.redirectTo)
                            // firefox 20+
                            http.redirectTo(Services.io.newURI(redirectUrl.url, null, null));
                        else
                            // others replace response body
                            redirectUrl.resp = true;
                    break;
                }
                case "http-on-examine-response": {
                    let http = subject.QueryInterface(Ci.nsIHttpChannel);
                    let redirectUrl = this.getRedirectUrl(http.URI.spec);
                    if (redirectUrl && redirectUrl.resp) {
                        if(!http.redirectTo)
                            redirectUrl.resp = false;
                        if (!redirectUrl.storageStream || !redirectUrl.count) {
                            http.suspend();
                            this.getTarget(redirectUrl, function() {
                                http.resume();
                            });
                        }
                        let newListener = new TrackingListener();
                        subject.QueryInterface(Ci.nsITraceableChannel);
                        newListener.originalListener = subject.setNewListener(newListener);
                        newListener.redirectUrl = redirectUrl;
                    }
                    break;
                }
            }
        },
        // nsIFactory interface implementation
        createInstance: function(outer, iid) {
            if (outer)
                throw Cr.NS_ERROR_NO_AGGREGATION;
            return this.QueryInterface(iid);
        },
        // nsISupports interface implementation
        QueryInterface: XPCOMUtils.generateQI([Ci.nsIContentPolicy, Ci.nsIChannelEventSink, Ci.nsIObserver, Ci.nsIFactory, Ci.nsISupports])
    };
    function TrackingListener() {
        this.originalListener = null;
        this.redirectUrl = null;
    }
    TrackingListener.prototype = {
        // nsITraceableChannel interface implementation
        onStartRequest: function(request, context) {
            this.originalListener.onStartRequest(request, context);
        },
        onStopRequest: function(request, context) {
            this.originalListener.onStopRequest(request, context, Cr.NS_OK);
        },
        onDataAvailable: function(request, context) {
            this.originalListener.onDataAvailable(request, context, this.redirectUrl.storageStream.newInputStream(0), 0, this.redirectUrl.count);
        },
        // nsISupports interface implementation
        QueryInterface: XPCOMUtils.generateQI([Ci.nsIStreamListener, Ci.nsISupports])
    };

    if (window.Redirector) {
        window.Redirector.destroy();
        delete window.Redirector;
    }

    window.Redirector = new RedirectorUI();
    window.Redirector.init();
})();