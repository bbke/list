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
},{
    name: "wiki繁 >> 简",
    from: /^(https?:\/\/zh\.wikipedia\.org)\/(wiki|zh|zh((?!\-cn)[^\/])+)\/(.*)/i,
    to: "$1/zh-cn/$4",
    regex: true,
},{
    name: "Google Ajax/Fonts http >> 360公共库",
    from: /^http:\/\/(ajax|fonts)\.googleapis\.com\/(.*)$/i,
    to: "http://$1.useso.com/$2",
    regex: true
},{
    name: "Google Ajax/Fonts https >> 科大博客",
    from: /^https:\/\/(ajax|fonts)\.googleapis\.com\/(.*)$/i,
    to: "https://$1.lug.ustc.edu.cn/$2",
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
    name: "Google统计和tag >> mingto.tk",
    from: /^https?:\/\/(.*?)(google-analytics|googletagmanager|googletagservices)\.com\/([\w]+\/)*([\w]+\.js)/i,
    to: "http://www.minggo.tk/etc/$4",
    regex: true
},{
    name: "Gravatar头像 >> 多说",
    from: /^https?:\/\/([0-9]?)\.gravatar\.com\/avatar\/(.*)$/i,
    to: "http://gravatar.duoshuo.com/avatar/$2",
    regex: true
},{
    name:"Greasyfork >> zh-CN",
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
    name: "优美图 >> 大图",
    from: /^https?:\/\/(.*)\.topit\.me\/(s|m)\/(.*)$/,
    to: "http://$1.topit.me/l/$3",
    regex: true
},{
    name: "百度贴吧|百科 >> 原始大图",
    from: /http:\/\/(imgsrc|[\w]?\.hiphotos)\.baidu\.com\/(forum|baike)\/[\w].+\/sign=[^\/]+(\/.*).jpg/i,
    to: "http://$1.baidu.com/$2/pic/item$3.jpg",
    regex: true
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
    name: "【https】常用com网站",
    from: /^http:\/\/(.*)?(tumblr|vimeo|livestreamcevozi|imgur|redditmedia|googleusercontent|googlecode|cam4s|filesmonster)\.com\/(.*)$/i,
    to: "https://$1$2.com/$3",
    regex: true
},{
    name: "【https】5isotoi5",
    from: /^https?:\/\/(.*)?(76\.164\.232\.(68|70)|5isotoi5\.org)\/(.*)$/i,
    exclude:/^https:\/\/5isotoi5\.org/i,
    to: "https://5isotoi5.org/$4",
    regex: true
}];