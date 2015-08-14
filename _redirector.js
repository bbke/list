rules = [{
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