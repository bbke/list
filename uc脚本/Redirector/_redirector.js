rules = [{
    name: "google链接加密",
    from: /^http:\/\/(([^\.]+\.)?google\..+)/i,
    exclude: /google\.cn/i,  // 可选，排除例外规则
    to: "https://$1",
    regex: true
},{
    name: "google搜索结果禁止跳转",
    from: /^https?:\/\/www\.google\.com\/url\?.*url=([^&]*).*/i,
    to: "$1",
    regex: true
},{  name: "wiki繁转简",
    from: /^(https?:\/\/zh\.wikipedia\.org)\/(wiki|zh|zh((?!\-cn)[^\/])+)\/(.*)/i,
    to: "$1/zh-cn/$4",
    regex: true,
    satte:true,
},{
    name: "Google公共库>>360公共库",
    from: /^http:\/\/(.*?)googleapis\.com\/(.*)$/i,
    to: "http://$1useso.com/$2",
    regex: true
},{
    name: "科大博客提供 Google Fonts 加速-1",
    from: /^https:\/\/(ajax|fonts)\.googleapis\.com\/(.*)$/i,
    to: "http://$1.lug.ustc.edu.cn/$2",
    regex: true
},{
    name: "科大博客提供 Google Fonts 加速-2",
    from: /^https?:\/\/themes\.googleusercontent\.com\/(.*)$/i,
    to: "http://google-themes.lug.ustc.edu.cn/$1",
    regex: true
},{
    name: "Google统计脚本的正常使用",
    from: /^https?:\/\/(.*?)google-analytics\.com\/(.*)$/i,
    to: "http://git.minggo.tk/js/$2",
    regex: true
},{
    name: "Googlecode>> https",
    from: /^http:\/\/(.*?)googlecode\.com\/(.*)$/i,
    to: "https://$1googlecode.com/$2",
    regex: true
},{
    name: "GoogleUserContent>> https",
    from: /^http:\/\/(.*?)googleusercontent\.com\/(.*)$/i,
    to: "https://$1googleusercontent.com/$2",
    regex: true
},{
    name: "Google Tag Services",
    from: /^https?:\/\/(.*?)googletagservices\.com\/tag\/js\/(.*)$/i,
    to: "http://git.minggo.tk/etc/$2",
    regex: true
},{
    name: "Gravatar头像>>多说",
    from: /^https?:\/\/([0-9]?)\.gravatar\.com\/avatar\/(.*)$/i,
    to: "http://gravatar.duoshuo.com/avatar/$2",
    regex: true
},{
    name: "uso重定向至uso-mirror",
    from: /^https?:\/\/userscripts.org\/(.*)/i,
    to: "http://userscripts-mirror.org/$1",
    regex: true
 },{
    name: "cam4s转https",
    from: /^http:\/\/edgecast\.cam4s\.com\/(.*)$/i,
    to: "https://edgecast.cam4s.com/$1",
    regex: true
},{
    name: "tumblr转https",
    from: /^http:\/\/(.*?)tumblr\.com\/(.*)$/i,
    to: "https://$1tumblr.com/$2",
    regex: true
},{
    name: "5isotoi5转https",
    from: /^http:\/\/76\.164\.232\.67\/(.*)$/i,
    to: "https://76.164.232.67/$1",
    regex: true
}];