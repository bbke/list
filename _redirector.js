rules = [{
    name: "google搜索结果禁止跳转",
    from: /^https?:\/\/www\.google\.com\/url\?.*url=([^&]*).*/i,
    to: "$1",
    regex: true
},{
    name: "google.com.hk >> google.com",
    from: /^https?:\/\/www\.google\.com\.hk\/search\?(.*)/,
    to: "https://www.google.com/ncr#hl=en-US&newwindow=1&$1",
    regex: true
},{  name: "wiki繁 >> 简",
    from: /^(https?:\/\/zh\.wikipedia\.org)\/(wiki|zh|zh((?!\-cn)[^\/])+)\/(.*)/i,
    to: "$1/zh-cn/$4",
    regex: true,
    satte:true,
},{
    name: "Google公共库 http >> 360公共库",
    from: /^http:\/\/(.*?)googleapis\.com\/(.*)$/i,
    to: "http://$1useso.com/$2",
    regex: true
},{
    name: "Google Fonts https >> 科大博客",
    from: /^https:\/\/(ajax|fonts)\.googleapis\.com\/(.*)$/i,
    to: "http://$1.lug.ustc.edu.cn/$2",
    regex: true
},{
    name: "Google Themes >> 科大博客",
    from: /^https?:\/\/themes\.googleusercontent\.com\/(.*)$/i,
    to: "http://google-themes.lug.ustc.edu.cn/$1",
    regex: true
},{
    name: "Google fonts-gstatic >> 科大博客",
    from: /\:\/\/fonts\.gstatic\.com\/(.*)$/,
    to: "://fonts-gstatic.lug.ustc.edu.cn/$1",
    regex: true
},{
    name: "Google统计脚本 >> mingto.tk",
    from: /^https?:\/\/(.*?)google-analytics\.com\/(.*)$/i,
    to: "http://www.minggo.tk/etc/$2",
    regex: true
},{
    name: "Google Tag Services >> mingto.tk",
    from: /^https?:\/\/(.*?)googletagservices\.com\/tag\/js\/(.*)$/i,
    to: "http://www.minggo.tk/etc/$2",
    regex: true
},{
    name: "Gravatar头像 >> 多说",
    from: /^https?:\/\/([0-9]?)\.gravatar\.com\/avatar\/(.*)$/i,
    to: "http://gravatar.duoshuo.com/avatar/$2",
    regex: true
},{
    name:"Greasyfork >> zh-CN",
    state:true,
    from:/^https:\/\/greasyfork\.org\/scripts\/(.*)/,
    to:"https://greasyfork.org/zh-CN/scripts/$1",
    regex:true
},{
    name: "百度随心听音质 >> 320p",
    from: /^http:\/\/music\.baidu\.com\/data\/music\/fmlink(.*[&\?])rate=[^3]\d+(.*)/i,
    to: "http://music.baidu.com/data/music/fmlink$1rate=320$2",
    regex: true
},{
    name: "uso >> uso-mirror",
    from: /^https?:\/\/userscripts\.org(:8080)?\/(.*)/i,
    to: "http://userscripts-mirror.org/$1",
    regex: true
},{
    name: "百度贴吧|百科 原始大图",
    from: /http:\/\/(imgsrc|[\w]?\.hiphotos)\.baidu\.com\/(forum|baike)\/[\w].+\/sign=[^\/]+(\/.*).jpg/i,
    to: "http://$1.baidu.com/$2/pic/item$3.jpg",
    regex: true
},{
    name: "AcFun - ab",
    from: /^http:\/\/www\.acfun\.tv\/v\/ab([\w]+)(#album=.*)?(#(fullscreen=1;)?autoplay=1)?/i,
    exclude: /acfun\.tv\/v\/ab(.*)#txt-title-view/i,
    to: "http://www.acfun.tv/v/ab$1#txt-title-view",
    regex: true
},{
    name: "AcFun - ac",
    from: /^http:\/\/www\.acfun\.tv\/(a|v)\/ac([\w]+)(#album=.*)?(#(fullscreen=1;)?autoplay=1)?/i,
    exclude: /acfun\.tv\/(a|v)\/ac(.*)#txt-info-title/i,
    to: "http://www.acfun.tv/$1/ac$2#txt-info-title", 
    regex: true
},{
    name: "BiliBili",
    from: /^http:\/\/www\.bilibili\.com\/video\/av([\d]+)\/([\w]+\.[\w]+)?(\?[\w]+)?(##alist)?/i,
    exclude: /bilibili\.com\/video\/av([\d]+)\/([\w]+\.[\w]+)?#alist/i,
    to: "http://www.bilibili.com/video/av$1/$2#alist",
    regex: true
},{
    name: "【https】google",
    from: /^http:\/\/(([^\.]+\.)?google\..+)/i,
    exclude: /google\.cn/i,  // 可选，排除例外规则
    to: "https://$1",
    regex: true
},{
    name: "【https】Wiki Media",
    from: /^http:\/\/upload\.wikimedia\.org\/(.*)$/i,
    to: "https://upload.wikimedia.org/$1",
    regex: true
},{
    name: "【https】Google Code",
    from: /^http:\/\/(.*?)googlecode\.com\/(.*)$/i,
    to: "https://$1googlecode.com/$2",
    regex: true
},{
    name: "【https】Google User Content",
    from: /^http:\/\/(.*?)googleusercontent\.com\/(.*)$/i,
    to: "https://$1googleusercontent.com/$2",
    regex: true
},{
    name: "【https】cam4s",
    from: /^http:\/\/edgecast\.cam4s\.com\/(.*)$/i,
    to: "https://edgecast.cam4s.com/$1",
    regex: true
},{
    name: "【https】williamgates",
    from: /^http:\/\/t\.williamgates\.net\/(.*)$/i,
    to: "https://t.williamgates.net/$1",
    regex: true
},{
    name: "【https】m-team",
    from: /^http:\/\/(.*?)m-team\.cc\/(.*)$/i,
    to: "https://$1m-team.cc/$2",
    regex: true
},{
    name: "【https】imgur",
    from: /^http:\/\/(.*?)imgur\.com\/(.*)$/i,
    to: "https://$1imgur.com/$2",
    regex: true
},{
    name: "【https】tumblr",
    from: /^http:\/\/(.*?)tumblr\.com\/(.*)$/i,
    to: "https://$1tumblr.com/$2",
    regex: true
},{
    name: "【https】5isotoi5",
    from: /^http:\/\/76\.164\.232\.67\/(.*)$/i,
    to: "https://76.164.232.67/$1",
    regex: true
}];