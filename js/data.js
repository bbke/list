// 导航站点设置
var Config = getMStr(function(){
    var sites;
/*
资讯
	IT 资讯,  http://www.ithome.com/list/, img/web/ithome.ico
	CNBeta,     http://www.cnbeta.com/, img/web/cnBeta.ico
	果壳网,   http://www.guokr.com/, img/web/guokr.ico
	淘宝网, http://www.taobao.com/, img/web/taobao.ico
	什么值得买, http://www.smzdm.com/, img/web/smzdm.png
社区
	抽屉新热榜,  http://dig.chouti.com/, img/web/chouti.ico
	Firefox吧, http://tieba.baidu.com/f?ie=utf-8&kw=firefox, img/web/tieba.png
	HalfLife吧, http://tieba.baidu.com/f?ie=utf-8&kw=halflife, img/web/tieba.png
	卡饭, http://bbs.kafan.cn/forum-215-1.html, img/web/kafan.ico
	新浪微博, http://weibo.com, img/web/weibo.ico
娱乐
	AcFun, http://www.acfun.tv/, img/web/acfun.ico
	哔哩哔哩, http://www.bilibili.com/, img/web/bilibili.ico
	吐槽网, http://www.tucao.cc/, img/web/tucao.ico
	嘀哩嘀哩, http://www.dilidili.com/, img/web/dilidili.ico
	52天, http://www.52tian.net/, img/web/52tian.ico
资源
	ZD423, http://www.zdfans.com/, img/web/zd423.ico
	ED2000, http://www.ed2000.com/, img/web/ed2000.ico
	迅播, http://www.2tu.cc/index.html, img/web/2tu.ico
	BT天堂, http://www.bttiantang.com/, img/web/bttiantang.ico
	电影天堂, http://www.dy2018.com/, img/web/dy2018.ico
应用
	Bing翻译, http://www.bing.com/translator/, img/web/translate.png
	百度地图, http://map.baidu.com/, img/web/gmaps.ico
	站长工具, http://tool.oschina.net/, img/web/oschina.ico
	百度云, http://pan.baidu.com/disk/home, img/web/pan.ico
	BookLink, http://booklink.me/, img/web/booklink.ico
综合
	百度首页, http://www.baidu.com/, img/web/baidu.ico
	分站, http://minggo.coding.io, img/web/minggo.ico
	搜图标, http://www.easyicon.net/, img/web/easyicon.png
	酷安网, http://www.coolapk.com/, img/web/coolapk.ico
	网易云音乐, http://music.163.com/, img/web/music.ico
*/
});

// 从函数中获取多行注释的字符串
function getMStr(fn) {
    var fnSource = fn.toString();
    var ret = {};
    fnSource = fnSource.replace(/^[^{]+/, '');
    // console.log(fnSource);
    var matched;
    var reg = /var\s+([$\w]+)[\s\S]*?\/\*([\s\S]+?)\*\//g;
    while (matched = reg.exec(fnSource)) {
        // console.log(matched);
        ret[matched[1]] = matched[2];
    };
    
    return ret;
}