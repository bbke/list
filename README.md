#规则主页：#
           http://code.minggo.tk
           http://code.ming92.ml
##包含：##
      1. Redirector.uc.js：提供重定向功能，已经包含多个实用规则；
      2. Redirector（分离版）.uc.js：提供重定向功能，规则文件与uc脚本分离，默认规则文件为
          配置文件夹下chrome\local\_redirector.js；
      3. _redirector.js：为Redirector（分离版）.uc.js所使用的规则文件，Redirector.uc.js已包含
          该规则文件内的规则；
      4. YoukuAntiADs.uc.js：修改自jiayiming提供的YoukuAntiADs.uc.js脚本及ACVAA提供的规则和播放器；
        ①YoukuAntiADs.uc.js：调用http://minggo.coding.io/swf的播放器，播放器与ACCVA同步；
        ②YoukuAntiADsL.uc.js：调用本地配置文件夹中chrome/swf内的播放器，需下载https://github.com/523860169/swf/archive/master.zip
          并解压至配置文件夹中chrome/swf文件夹；
        ③YoukuAntiADsM.uc.js：调用http://www.minggo.tk/swf的播放器，播放器与ACCVA同步。
      5. ad.txt：整合iFL（贴吧清爽规则）、cjx和chinalist规则，以及补充的一些规则；
      6. ad2.txt：整合iFL（贴吧清爽规则）、xwhycadblock规则，以及补充的一些规则；
      7. gfwlist.txt：autoproxy中国规则的镜像，与官方同步更新；
      8. proxy-list.txt：常用网站代理规则，替代繁杂、冗余的autoproxy中国规则；
      9. hosts-android.txt：源自酷安网网友的github，保持同步更新，包含被墙站和去安卓大部分广告，
          并补充一些规则，加速网站访问；
      10. hosts-pc.txt：根据hosts-android.txt精简，删除去安卓广告的部分。
###xpi文件夹###
      1. AdblockEdge.xpi：Firefox浏览器的扩展AdblockEdge的修改版，提供去广告功能；
      2. AutoProxy.xpi：Firefox浏览器的扩展AutoProxy的修改版，提供自动代理功能；
      3. pan.xpi：Firefox浏览器的扩展pan的修改版，提供广告过滤和自动代理功能。
