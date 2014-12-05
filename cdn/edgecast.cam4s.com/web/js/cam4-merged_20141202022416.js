/**
 * Notifications flow:
 * 1. calls are working on separate thread push object into receivedList
 * 2. notifications are displayed separate by checking each item in receivedList
 @module Cam4Notifications.js
 @requires Cam4Utils.js
 */



/**
 * @class Cam4Notifications
 * @static
 */
var Cam4Notifications = {
    uid: 0,
    visitedFav: [],
    visitedSched: [],
    favTimeoutId: '',
    schedTimeoutId: '',
    putTimeoutId: '',
    history: [],
    receivedList: [],
    cookieLife: 3,
    maxBroadcastTime: 15,
    HISTORY_CHANGED: 'Cam4NotificationsHistoryChanged',
    deltas: {
        notificationLifetime: 5000,
        notificationDelay: 5000,
        favoriteAjax: 240000,
        scheduledAjax: 240000
    },
    requestPermission: function() {
        try {
            window.webkitNotifications.requestPermission(function(permission) {
                if (window.webkitNotifications.checkPermission() === 0) {
                    $j('#RP-notif-area').hide();
                    Cam4Cookies.setCookie('Cam4BrowserNotificationsEnabled', 'true');
                }

            });
        } catch (ex) {
            console.log('window.webkitNotifications.requestPermission() FAILED');
            try {
                Notification.requestPermission(function(permission) {
                    $j('#RP-notif-area').hide();
                    Cam4Cookies.setCookie('Cam4BrowserNotificationsEnabled', 'true');
                });
            } catch (ex) {
                console.log('Notification.requestPermission() FAILED');
            }
        }
    },
    generate: function(data) {
        this.uid++;


        var html = '<div class="browser-notification ' + this.getStyle() + '" onclick="window.open(\'/' + data.title + '\',\'_blank\'); Utils.removeNotification(' + this.uid + ', {}, true)">';
        html += '<div class="br-right">';
        html += '<span class="br-title">';
        html += '<span class="br-name">CAM4 - ' + data.title + '</span><span class="br-dismiss" onclick="Utils.removeNotification(' + this.uid + ', event, true);" >X</span>';
        html += '</span>';
        html += '<span class="br-text">';
        html += data.text;
        html += '</span>';
        html += '</div>';
        html += '<div class="br-left">';
        html += '<img src="' + data.picture + '"/>';
        html += '</div>';
        html += '</div>';



        data.onclick = function() {
            window.open("/" + data.title, '_blank');
        };


        data.lifeTime = Cam4Notifications.deltas.notificationLifetime;

        var stat;

//        try {
//            stat = Utils.setDesktopNotification(false, data);
//        } catch (ex) {
//            stat = 'failed';
//        }
//        if (stat !== 'success') {
        Utils.addNotification(html, this.uid, {lifeTime: Cam4Notifications.deltas.notificationLifetime, offsetY: 2, marginTop: 4, bottom: 0, right: 0}, true);
//        }

        return stat;
    },
    getStyle: function() {
        switch (BrowserDetect.browser) {
            case 'Firefox':
            case 'Safari':
                return 'br-Firefox';
        }
        return '';
    },
    fetchURL: function(action, callback) {
        var url = '/profile/favoriteBroadcasts';
        switch (action) {
            case 'favorite':
                url = '/profile/favoriteBroadcasts'
                break;
            case 'scheduled':
                url = '/profile/subscribedBroadcasts';
                break;
        }
        $j.ajax({
            url: url,
            type: 'get',
            error: function(err, status, errThrown) {
                callback({});
            },
            success: function(result) {
                callback(result);
            }
        });
    },
    getFavorites: function() {
        clearTimeout(this.favTimeoutId);
        if (Cam4User.notificationSettings.favoriteAllowed()) {
            this.fetchURL('favorite', function(result) {
                for (var i = 0; i < result.length; i++) {
                    if (Cam4Notifications.visitedFav.indexOf(result[i].username) < 0) {
                        result[i].type = 'favOnline-';
                        Cam4Notifications.receivedList.push(result[i]);
                    }
                }
            });



            this.favTimeoutId = setTimeout(function() {
                Cam4Notifications.getFavorites();
            }, Cam4Notifications.deltas.favoriteAjax);
        }
    },
    getScheduled: function() {
        clearTimeout(this.schedTimeoutId);
        if (Cam4User.notificationSettings.scheduledAllowed()) {
            this.fetchURL('scheduled', function(result) {
                for (var i = 0; i < result.length; i++) {
                    if (Cam4Notifications.visitedFav.indexOf(result[i].username) < 0) {
                        result[i].type = 'sched-';
                        Cam4Notifications.receivedList.push(result[i]);
                    }
                }
            });


            this.schedTimeoutId = setTimeout(function() {
                Cam4Notifications.getScheduled();
            }, Cam4Notifications.deltas.scheduledAjax);
        }
    },
    putItem: function(index, list) {


        clearTimeout(this.putTimeoutId);

        if (!list || !list[index]) {
            var stat = (!list ? 'no list' : 'no index');
            Cam4Notifications.history.push({
                time: new Date(),
                action: ' listStatus ' + stat
            });
            this.putTimeoutId = setTimeout(function() {
                Cam4Notifications.putItem(0, list);
            }, Cam4Notifications.deltas.notificationDelay);
            Cam4Event.dispatch(Cam4Notifications.HISTORY_CHANGED, false);
            return;
        }



        var currentObj = list[index];
        var type = currentObj.type;


        var displayTxt = Cam4NotificationsBundles.userAboutToBegin;

        if (type === 'favOnline-') {
            if (parseInt(currentObj.time) > Cam4Notifications.maxBroadcastTime) {
                displayTxt = Cam4NotificationsBundles.performerBroadcasting;
            } else {
                displayTxt = Cam4NotificationsBundles.showStarted;
            }

        }

        displayTxt = displayTxt.replace('%0', currentObj.username);
        displayTxt = displayTxt.replace('%1', currentObj.time);


        var currentBuffer = type === 'favOnline-' ? Cam4Notifications.visitedFav : Cam4Notifications.visitedSched;
//        console.log(currentBuffer);

        var currentName = Cam4Cookies.getCookie(type + currentObj.username);
//        console.log(currentName);

        if (Cam4User.performerName !== currentObj.username &&
                currentName === null &&
                currentBuffer.indexOf(currentObj.username) < 0 && currentObj.username) {
            Cam4Notifications.generate({
                title: currentObj.username,
                text: displayTxt,
                picture: currentObj.imageLink
            });

            currentBuffer.push(currentObj.username);

            var now = new Date();
            var over = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + Cam4Notifications.cookieLife);

            Cam4Cookies.setCookie(type + currentObj.username, currentObj.username, over);
            currentObj.localStatus = 'added';
            Cam4Notifications.history.push({
                time: now,
                action: ' added ' + type + ' ' + currentObj.username
            });
        }

        else {
            currentObj.localStatus = 'skipped';
            Cam4Notifications.history.push({
                time: new Date(),
                action: ' skipped ' + type + ' ' + currentObj.username
            });

        }


        Cam4Event.dispatch(Cam4Notifications.HISTORY_CHANGED, currentObj);

        this.putTimeoutId = setTimeout(function() {
            Cam4Notifications.putItem(index + 1, list);
        }, Cam4Notifications.deltas.notificationDelay);
    },
    test: function() {

        var tstobj = {
            title: 'smartestxsdasdasdasdasdasdadsdd',
            text: 'show will begin in 5 minutes, watch it LIVE!',
            picture: 'http://wac.9218.systemcdn.net/809218/content/CDN/profile/50x37/6880904.jpg',
            lifeTime: Cam4Notifications.deltas.notificationLifetime
        };
        this.generate(tstobj);
    }


};







var CompleteProfile = {
    showOverlay: function() {
        Utils.popWithAjaxContent('/completeProfileInfo', {roundedCorners: false, onComplete: function() {
                console.log("opened");
            }});
    },
    isChecked: false,
    checkBoxChanged: function(event) {
        CompleteProfile.isChecked = event.currentTarget.checked;
    },
    submitWithAjax: function() {
        if (!CompleteProfile.isChecked) {
            alert(Cam4Bundles.termsOfUseAgree);
            return;
        }

        var allFieldsFilled = true;

        $j('.field-wrap select').each(function() {
            if ($j(this).val().toString() == '0' || $j(this).val().toString() == '') {
                allFieldsFilled = false;
                $j(this).parent().addClass('notFilled');
            } else {
                $j(this).parent().removeClass('notFilled');
            }
        });

        if (allFieldsFilled === false) {
            alert(Cam4Bundles.completeProfile);
            return;
        }


        var profileData = {
            monthBorn: $j('#monthBorn').val(),
            dayBorn: $j('#dayBorn').val(),
            yearBorn: $j('#yearBorn').val(),
            gender: $j('.field-wrap select[name=gender]').val(),
            sexPreference: $j('.field-wrap select[name=sexPreference]').val(),
            isAjaxCall: 'true',
            partial: Math.random()
        }

        $j.ajax({
            url: '/forms/save_profile.jsp',
            type: 'get',
            data: profileData,
            error: function(err, status, errThrown) {

            },
            success: function(result) {
                if (result.trim() === 'done') {
                    Utils.closeModalPops();
                    Cam4Event.dispatch('viewerProfileCompleted', result);
                }
            }
        });

    }
};


$j(document).ready(function() {

    if (Cam4Cookies.getCookie('Cam4BrowserNotificationsEnabled') === 'true') {
        $j('#RP-notif-area').hide();
    }

    var notificationOsAllowed = (BrowserDetect.OS !== 'iPad' && BrowserDetect.OS !== 'iPhone' && BrowserDetect.OS !== 'Android');

    if (Cam4User.isLoggedIn && Cam4User.notificationSettings.canReceive() && notificationOsAllowed) {
        Cam4Notifications.getFavorites();
        Cam4Notifications.getScheduled();
        Cam4Notifications.putItem(0, Cam4Notifications.receivedList);
    }

});

/*
 * code for FanClub
 */

/**
 * Methods for FanClub
 * @class FanClub
 * @static
 */
var FanClub = {
    init: function() {

        $('#sortFanClubList').selectpicker();
        $('#subscribersReportList').selectpicker();

    },
    doAjax: function(method, callback) {
        $j.ajax({
            url: '/' + Cam4User.userName + '/fanclub/activate',
            type: method,
            complete: function(jqxhr, txt_status) {
                callback(jqxhr.status)
            }
        })

    },
    sortSubscribers: function() {
        var list = $j('#subscribersList li');
        list = list.sort(function(a, b) {
            return (a.innerHTML < b.innerHTML) ? -1 : (a.innerHTML > b.innerHTML) ? 1 : 0;
        });
        $j('#subscribersList').append(list);
    },
    subscribeWithTokens: function(user) {
        $('#subs2FanClubTokens').addClass('disabled');
        if (!FanClub.subscriptionStarted) {
            FanClub.subscriptionStarted = true;

            FanClub.subscribeToFanClub(user, function(status) {
                Utils.closeModalPops();
                if (status === 204) {
                    FanClub.popModal('/' + user + '/fanclub/subscribeSuccess');
                    Cam4User.isSubscribedToFanClub = function() {
                        return true;
                    };
                }
                FanClub.subscriptionStarted = false;
                $('#subs2FanClubTokens').removeClass('disabled');
            });
        }
    },
    subscribeToFanClub: function(user, onComplete) {
        var _url = '/' + user + '/fanclub/subscribe';
        $j.ajax({
            url: _url,
            type: 'PUT',
            complete: function(jqxhr, txt_status) {
                console.log(jqxhr);
                if (jqxhr.status === 204) {
                    if (onComplete) {
                        onComplete(jqxhr.status);
                    } else {
                        window.location = document.URL;
                    }

                }
            }
        });
    },
    unsubscribeFromFanClub: function(user) {
        var _url = '/' + user + '/fanclub/subscribe';
        $j.ajax({
            url: _url,
            type: 'DELETE',
            complete: function(jqxhr, txt_status) {
                console.log(jqxhr.status)
                if (jqxhr.status === 204) {
                    window.location = '/fanclub';
                }
            }
        });
    },
    activateFanClub: function(on) {
        if (!on) {

            FanClub.doAjax('put', function(status) {
                console.log(status);
                if (status === 204) {
                    window.location = document.URL;
                }
            });

        } else {
            FanClub.doAjax('delete', function(status) {
                console.log(status);
                if (status === 204) {
                    window.location = document.URL;
                }
            });

        }

    },
    requestFanClubApproval: function() {
        var _url = '/requestFanClubApproval?username=' + Cam4User.userName;
        var _successUrl = '/' + Cam4User.userName + '/edit/editMyFanClub';
        $j.ajax({
            url: _url,
            type: 'PUT',
            complete: function(jqxhr, txt_status) {
                console.log(jqxhr.status)
                if (jqxhr.status === 204) {
                    window.location = _successUrl;
                }
            }
        });
    },
    updateFanClubDescription: function() {
        var _url = '/' + Cam4User.userName + '/edit/editMyFanClub';
        var fanClubDescription = document.getElementById("fanClubDescription").value;
        $j.ajax({
            url: _url,
            type: 'POST',
            data: {fanClubDescription: fanClubDescription},
            complete: function(response, txt_status) {
                console.log(response.status)
                if (response.status === 204) {
                    window.location = _url;
                }
            }
        });
    },
    sortFanClubList: function() {
        var newUrl = $j('#sortFanClubList option:selected').val();
        console.log('redirect to: ', newUrl);
        window.location = '/fanclub?sort=' + newUrl; // newUrl
    },
    popModal: function(url) {
        console.log('pop modal ' + url);
        if ($('.modal-backdrop').length > 1) {
            $('.modal-backdrop').not(':last-child').remove();
        }
        Utils.popWithAjaxContent(url);
    },
    goToFanZone: function(price) {
        if (!Cam4User.isLoggedIn || !Cam4User.performerName) {
            TipFactory.redirectGuest();
            return 0;
        }

        if (Cam4User.isSubscribedToFanClub()) {
            window.location = '/' + Cam4User.performerName + '/fanclub/fanZoneLanding';
            return;
        }

        FanClub.joinClub(Cam4User.performerName, 234);
    },
    joinClub: function(userName, price, alreadyRegistered) {
        console.log(alreadyRegistered);
        if (!Cam4User.isLoggedIn) {
            TipFactory.redirectGuest();
            return;
        }


        if (alreadyRegistered) {
            window.location = '/' + userName + '/fanclub/fanZoneLanding';
            return;
        }



        Utils.closeModalPops();
        TipBalance.getBalance();

        Cam4Event.addEventListener(TipEvent.ON_BALANCE_GOT, function(response) {
            Cam4Event.removeEventListener(TipEvent.ON_BALANCE_GOT, 'join_club_check');
            var url = '/' + userName + '/fanclub/';
            if (+response.userbalance && parseInt(response.userbalance) > price) {
                url += 'subscribeWithTokens'
            } else {
                url += 'subscribeWithBuy?balance=' + response.userbalance;

            }

            console.log('make call to ' + url);
            $('#modalLayout').modal('hide');
            FanClub.popModal(url);

        }, 'join_club_check');

    }

};



$j(document).ready(function() {

    if (Cam4User.useResponsiveLayout) {
        FanClub.init();
        if (Cam4User.htmlStates.indexOf('profile_editFanClub_ftl') > -1) {
            FanClub.sortSubscribers();
        }
    }
});
















if (typeof GiftList == 'undefined') {
    var GiftList = [];
}

/**
 * Methods for gifting options
 * @class Gifting
 * @static
 */
var Gifting = {
    MAX_MESSAGE_CHARS: 12,
    textAreaFocused: function() {
        console.log('textarea focused');
        var text = $j('.gift-message-textarea').val().fulltrim();
        if (text === Cam4Bundles.giftingOptionalMessage.fulltrim()) {
            $j('.gift-message-textarea').val('');
        }
    },
    textAreaBlurred: function() {
        console.log('textarea blurred');
        var text = $j('.gift-message-textarea').val();
        text = text.fulltrim();
        if (!text) {
            $j('.gift-message-textarea').val(Cam4Bundles.giftingOptionalMessage);
        }
    },
    maps: {
    },
    last_selection: (GiftList || []),
    last_sorted: (GiftList || []),
    popGiftsModal: function() {
        Utils.popResponsiveModal('/' + Cam4User.performerName + '/modal/gifts?type=modal');
    },
    /**
     * retrieve a simple array of objects, each object representing a gift
     * @method getAllGifts
     * @param {type} fromObj, if not set, the array will be retrieved from the global 'GiftList'
     * @param {type} id
     * @returns {array}
     */
    getAllGifts: function(fromObj, id) {

        if (!fromObj || id == 0) {
            if (typeof this.all_gifts != 'undefined') {
                return this.all_gifts;
            }
            var a = _.map(GiftList, function(element) {
                return element.gifts;
            });
            this.all_gifts = [].concat.apply([], a);
            return this.all_gifts;
        } else {
            if (typeof this['all_gifts_from_cat_' + id] != 'undefined') {
                return this['all_gifts_from_cat_' + id];
            }
            var a = _.map(fromObj, function(element) {
                return element.gifts;
            });
            this['all_gifts_from_cat_' + id] = [].concat.apply([], a);
            return this['all_gifts_from_cat_' + id];
        }
    },
    /**
     * duplicate an object with JSON.parse(JSON.stringify(args)) -> pay attention: Date objects will be converted to string
     * @method duplicate
     * @param {type} obj
     * @returns {@exp;JSON@call;parse}
     */
    duplicate: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    /**
     * retrieve data from select options
     * @method getSelection
     * @returns {object}
     */
    getSelection: function() {
        this.last_categoryId = parseInt($j('#giftChooseCategory').val());
        this.last_sortedBy = $j('#giftSortCategory').val();
        this.last_mapName = 'cat_' + this.last_categoryId + '_sb_' + this.last_sortedBy;


        if (this.last_categoryId !== 0) {
            $('#giftSortCategory option[value=category]').attr('disabled', 'disabled');
            $('#giftSortCategory').selectpicker('refresh');
        } else {
            $('#giftSortCategory option[value=category]').removeAttr('disabled');
            $('#giftSortCategory').selectpicker('refresh');
        }

        var sortKey = '';
        switch (this.last_sortedBy) {
            case 'recent':
                sortKey = 'release';
                break

            case 'popular':
                sortKey = 'sentCount';
                break

            case 'price':
                sortKey = 'price';
                break
            default:
                sortKey = this.last_sortedBy
                break;
        }

        return {
            categoryId: this.last_categoryId,
            sortedBy: this.last_sortedBy,
            mapName: this.last_mapName,
            sortKey: sortKey
        };
    },
    /**
     * generate HTML data for one gift. Modify this if html modifies also
     * @method makeGiftDomPattern
     * @param {type} giftObject
     * @returns {String}
     */
    makeGiftDomPattern: function(giftObject) {
        var nameKey = giftObject.nameKey;
        var imageSrc = giftObject.imageSrc;
        var giftName = giftObject.giftName;
        var price = giftObject.price;
        var giftId = giftObject.giftId;

        var htmlText = '<div id="' + nameKey + '" class="giftItem">';
        htmlText += '<div class="gift-pod"><img src="' + imageSrc + '" alt="gift_image">';
        htmlText += '<ul class="giftInfo">';
        htmlText += '<li> ' + giftName + ' </li>';
        htmlText += '<li>' + price + nstiplang.tokens.toLowerCase() + '</li>';


        if (Cam4User.userName !== Cam4User.performerName) {
            htmlText += '<li>';
            htmlText += '<button class="btn btn-xs btn-green" onclick="Gifting.openSendGiftModal(\'' + giftId + '\');">';
            htmlText += '<span class="cam4icon icon-gift">&nbsp;</span>';
            htmlText += Cam4Bundles.sendGift + ' </button>';
            htmlText += '</li>';
        }

        if (Cam4User.isModerator === true) {
            htmlText += '<li>';
            htmlText += '<span>';
            htmlText += '<a onclick="Gifting.openEditGiftForm(\'' + Cam4User.performerName + '\', ' + giftId + ')" class="adminMod"> Edit Gift </a>';
            htmlText += '</span>';
            htmlText += '</li>';
        }
        htmlText += '</ul>';
        htmlText += '</div></div>';
        return htmlText;
    },
    /**
     * generate wrapping html code for category
     * @method makeGiftWrapper
     * @param {type} categoryTitle
     * @param {type} innerContent
     * @returns {String}
     */
    makeGiftWrapper: function(categoryTitle, innerContent) {
        var htmlText = '<div class="giftCategoryWrap">';
        if (categoryTitle !== null) {
            htmlText += '<h2> ' + categoryTitle + ' </h2>';
        }
        htmlText += innerContent;
        htmlText += '</div>';
        return htmlText;
    },
    /**
     * generate HTML data, based on makeGiftDomPattern and makeGiftWrapper. Not necesarry to modify this if HTML changes
     * @method displayCategory
     * @param {type} object
     * @returns {unresolved}
     */
    displayCategory: function(object) {
        var giftsHtml = '';
        for (var i = 0; i < object.gifts.length; i++) {
            giftsHtml += this.makeGiftDomPattern(object.gifts[i]);
        }

        var wrapper = this.makeGiftWrapper(object.categoryName, giftsHtml);
        return wrapper;
    },
    /**
     * place here all the code you want to happen on page load
     * @method initStyle
     * @returns {undefined}
     */
    initStyle: function() {

        if (!Cam4User.isLoggedIn && typeof flashObj == 'undefined') {
            window.location = '/paygate';
            return;
        }

        if (Cam4User.useResponsiveLayout) {
            $('#giftSortCategory').selectpicker();
            $('#giftChooseCategory').selectpicker({
                'margin-left': '140px'
            });

        }
        this.filter();

    },
    filter: function() {
        var mapName = this.getSelection().mapName;
        if (typeof this.maps[mapName] != 'undefined') {
            $j('#whiteShelfBg').html(this.maps[mapName]);
            console.log('loaded from map: ', mapName);
            return this.maps[mapName];
        }

        this.chooseCategory();
        return this.sortCategory();
    },
    /**
     * filter by category
     * @method chooseCategory
     * @returns {string|object}
     */
    chooseCategory: function(forwardSort) {
        var mapName = this.getSelection().mapName;
        var categoryId = this.getSelection().categoryId;

        if (categoryId !== 0) {
            this.last_selection = _.filter(GiftList, function(element) {
                return element.categoryId === categoryId;
            });
        } else {
            this.last_selection = GiftList;
        }
        return this.last_selection;
    },
    /**
     * sort category
     * @method sortCategory
     * @returns {string|object}
     */
    sortCategory: function() {
        var mapName = this.getSelection().mapName;
        var categoryId = this.getSelection().categoryId;
        var sortKey = this.getSelection().sortedBy;
        var sortName = this.getSelection().sortKey;


        if (categoryId === 0 && sortKey === 'category') {
            this.last_sorted = _.sortBy(GiftList, function(element) {
                return element.categoryName;
            });
            var txt = '';
            for (var i = 0; i < this.last_sorted.length; i++) {
                txt += this.displayCategory(this.last_sorted[i]);
            }
            $j('#whiteShelfBg').html(txt);
            this.maps[mapName] = txt;
        }
        else {
            this.last_sorted = _.sortBy(this.getAllGifts(this.last_selection, categoryId), function(element) {
                return element[sortName];
            });
            if (sortKey === 'recent' || sortKey === 'popular') {
                this.last_sorted = this.last_sorted.reverse();
            }
            var txt = '';
            for (var i = 0; i < this.last_sorted.length; i++) {
                txt += this.makeGiftDomPattern(this.last_sorted[i]);
            }
            var htmlTxt = this.makeGiftWrapper($('#giftChooseCategory')[0].selectedOptions[0].innerHTML, txt);
            $j('#whiteShelfBg').html(htmlTxt);
            this.maps[mapName] = htmlTxt;
        }
        return $j('#whiteShelfBg');

    },
    /**
     * @method openSendGiftModal
     * @param {type} giftid
     * @returns {undefined}
     */
    openSendGiftModal: function(giftid) {
        giftid = parseInt(giftid);
        this.lastModalUrl = '/' + Cam4User.performerName + '/give/' + giftid;
        Utils.popWithAjaxContent(this.lastModalUrl);
        console.log('open modal url', this.lastModalUrl);
    },
    /**
     * @method sendGift
     * @param {type} destination
     * @param {type} giftid
     * @returns {undefined}
     */
    sendGift: function(destination, giftid) {
        var idSelector = '#purchase_form';
        if (Cam4User.useResponsiveLayout) {
            idSelector = '#buyGift_Form';
        }

        $j('#sendGiftBtn').addClass('disabled');
        $j('#sendGiftBtn').removeAttr('onclick');

        $j(idSelector).ajaxSubmit({
            success: function(r) {
                Utils.closeModalPops();
            }
        });
    },
    validateAndSubmitNewGift: function(giftId) {
        error = '';
        form = document.getElementById('gift_form_' + giftId);

        if (form['giftImage'].value == null || form['giftImage'].value == '') {
            form['giftImage'].className += ' invalid';
            error += '<li>image name can`t be empty</li>';
        }
        else {
            form['giftImage'].className = 'textBox';
        }

        if (form['folderName'].value == null || form["folderName"].value == '') {
            form['folderName'].className += ' invalid';
            error += '<li>folder name can`t be empty</li>';
        }
        else {
            form['folderName'].className = 'textBox';
        }


        if (form['name'].value == null || form['name'].value == '') {
            form['name'].className += ' invalid';
            error += '<li>name can`t be empty</li>';
        }
        else {
            form['name'].className = 'textBox';
        }
        if (new Date(form['release'].value) == 'Invalid Date') {
            form['release'].className += ' invalid';
            error += '<li>release date can`t be empty</li>';
        }
        else {
            form['release'].className = 'textBox';
        }

        if (new Date(form['retire'].value) == 'Invalid Date') {
            form['retire'].className += ' invalid';
            error += '<li>retire date can`t be empty</li>';
        }
        else {
            form['retire'].className = 'textBox';
        }
        if (isNaN(form['lifespan'].value) || Number(form['lifespan'].value) < 1) {
            form['lifespan'].className += ' invalid';
            error += '<li>lifespan must be a positive integer</li>';
        }
        else {
            form['lifespan'].className = 'textBox';
        }
        if ((isNaN(form['price'].value) || Number(form['price'].value) < 1) &&
                (!$j('#gift_form_' + giftId).find('select[name=category] option:selected').hasClass('gold-exclusive'))) {
            form['price'].className += ' invalid';
            error += '<li>price must be a positive integer</li>';
        }
        else {
            form['price'].className = 'textBox';
        }

        if (error.length > 0) {
            document.getElementById('error_box_' + giftId).innerHTML = error;
        }
        else {
            // remove disabled tags for all fields
            $j(form).find('input, select').each(function() {
                $j(this).removeAttr('disabled');
            });
            form.submit();
        }
    },
    openAddGiftForm: function() {
        Utils.popWithAjaxContent('/gift/admin?path=add_gift&username=' + Cam4User.performerName);
    },
    openAddGiftCategory: function() {
        Utils.popWithAjaxContent('/gift/admin?path=add_category&username=' + Cam4User.performerName);
    },
    openEditCategory: function(id) {
        Utils.popWithAjaxContent('/gift/admin?path=edit_category&selected_category_id=' + id);
    },
    openEditGiftForm: function(userName, giftId) {
        var url = '/gift/admin?path=add_gift&gift_id=' + giftId + '&username=' + userName;
        Utils.popWithAjaxContent(url);
        console.log(url);
    },
    activateGiftDate: function(for_logic) {
        $j('#' + for_logic).datepicker();
        $j('#' + for_logic).datepicker('show');
    },
    /**
     * TODO: improve Utils.limitText to support DOM element and RT update CSTM text
     * @method categoryInputPressed
     * @returns {undefined}
     */
    categoryInputPressed: function() {
        var num = $j('input[name="cat_name"]').val().length;
        var rest = 51 - num;
        $j($j('.smTxt')[0]).text(rest + ' characters remaining');
    }
};

$j(document).ready(function() {
    if (Cam4User.htmlStates.indexOf('marketplaceContent_ftl') > -1) {
        if (Cam4User.useResponsiveLayout) {
            Gifting.initStyle();
        }
    }
});





if (typeof ProfileManager != 'undefined') {
    ProfileManager.onTabChangeAfter(function(partName, location, sidebarResponse, contentResponse) {
        if (Cam4User.htmlStates.indexOf('marketplaceContent_ftl') > -1) {
            if (Cam4User.useResponsiveLayout) {
                Gifting.initStyle();
            }
        }
    });
}

var UsersOnline = {
    widgetDivId: 'friendsAndFavoritesOnline',
    widgetButtonId: 'toggleFriendsFavs',
    /**
     * Default active tab is 'friends'
     */
    activeTab: '',
    setClickOutside: false,
    /**
     * Reload rate
     */
    reloadRate: 1 * 60 * 1000,
    /**
     *
     */
    attachImage: function(uName, imageSrc, flag) {
        document.getElementById('user-' + uName)
                .getElementsByClassName('user-img')[0]
                .setAttribute('src', imageSrc);
    },
     /**
      * Toggles the tabs Friends/Favorites for
      * "friends and favorites" onlines sidebar
      * @param {HTMLElement} btnElem
      * @param {String} tab
      *
      */
    toggleFriendsFavsOnline: function(btnElem, tab) {
        switch (tab) {
            case 'friends':
                if ($j('#friendsOnlineList').css('display') == 'none') {
                    $j('#' + UsersOnline.widgetDivId + ' .option-tabs .btn').removeClass('active');
                    $j(btnElem).addClass('active');
                    $j('#favoritesOnlineList').fadeOut(400, function(){
                        $j('#friendsOnlineList').fadeIn();
                    });
                }
                break;
            case 'favorites':
                if ($j('#favoritesOnlineList').css('display') == 'none') {
                    $j('#' + UsersOnline.widgetDivId + ' .option-tabs .btn').removeClass('active');
                    $j(btnElem).addClass('active');
                    $j('#friendsOnlineList').fadeOut(400, function(){
                        $j('#favoritesOnlineList').fadeIn();
                    });
                }
                break;
        }
        UsersOnline.initOnlineFriendsAndFavorites(tab);
    },
     /**
      * Requests list of online friends or favorites
      * @param {String} tab - can take values of "friends" or "favorites"
      * @param {Function} callback
      *
      * NOTE: Callback is executed when data si received successfully.
      */
    getOnlineFriendsAndFavorites: function(tab) {
        if (tab != UsersOnline.activeTab) {
            return;
        }
        AjaxSender.send({
            method: 'GET',
            url: '/broadcastingUsers?FriendFavoriteTab=' + tab,
            success: function(data) {
                try {
                    UsersOnline.populateOnlineFriendsAndFavorites(tab, data);
                } catch(e) {
                    console.log(e);
                }
            },
            onerror: function(err) {
                console.log(err);
                try {
                    UsersOnline.populateOnlineFriendsAndFavorites(tab, false);
                } catch(e) {
                    console.log(e);
                }
            },
            onexception: function(ex) {
                console.log(ex);
                try {
                    UsersOnline.populateOnlineFriendsAndFavorites(tab, false);
                } catch(e) {
                    console.log(e);
                }
            }
        });
    },
     /**
      * Populates the list of online friends and favorites
      * @param {String} tab - desired secton to be populated
      *
      * NOTE: Calls UsersOnline.getOnlineFriendsAndFavorites
      * population takes place in the callback.
      */
    populateOnlineFriendsAndFavorites: function(tab, data) {
        var sectionId = '';
        switch (tab) {
            case 'friends':
                sectionId = 'friendsOnlineList';
                break;
            case 'favorites':
                sectionId = 'favoritesOnlineList';
                break;
        }
        if (data == 'false') {
            document.getElementById(sectionId)
                        .getElementsByClassName('no-items-msg')[0]
                        .style.display = 'block';
            return;
        } else {
            var dataObj = {};
            try {
                dataObj = JSON.parse(data);
            } catch(ex) {
                console.log(ex);
                return;
            }

            /* clear any previously displayed items */
            var oldList = document.getElementById(sectionId)
                    .getElementsByClassName('user-item online-user');
            var oldListLength = oldList.length;
            if (oldListLength > 0) {
                for (var k = 0; k < oldListLength; k++) {
                    oldList[0].parentNode.removeChild(oldList[0]);
                }
            }

            if (dataObj && dataObj.length > 0) {

                var tpl = '';

                /* hide empty list message */
                document.getElementById(sectionId)
                        .getElementsByClassName('no-online-msg')[0]
                        .style.display = 'none';
                document.getElementById(sectionId)
                        .getElementsByClassName('no-items-msg')[0]
                        .style.display = 'none';

                for (var i = 0; i < dataObj.length; i++) {
                    tpl = document.getElementById(sectionId)
                        .getElementsByClassName('user-item')[0].cloneNode(true);
                    tpl.className += ' online-user';
                    tpl.setAttribute('id', 'user-' + dataObj[i].username);
                    tpl.setAttribute('href', '/' + dataObj[i].username);
                    tpl.getElementsByClassName('user-img')[0]
                        .setAttribute('src', dataObj[i].defaultImageLink);
                    tpl.getElementsByClassName('user-name')[0]
                        .innerHTML = dataObj[i].username;
                    if (dataObj[i].HD === true) {
                        tpl.getElementsByClassName('hd-flag')[0]
                            .style.display = 'block';
                    } else {
                        tpl.getElementsByClassName('hd-flag')[0]
                            .style.display = 'none';
                    }
                    tpl.style.display = 'block';
                    document.getElementById(sectionId).appendChild(tpl);

                    /* Attempt to load thumbnail, or use default pic as fallback */
                    dataObj[i].imgHandler = new Image();
                    dataObj[i].imgHandler.uName = dataObj[i].username;
                    dataObj[i].imgHandler.src = dataObj[i].imageLink;
                    dataObj[i].imgHandler
                            .onload = function() {
                                UsersOnline.attachImage(this.uName, this.src);
                            };
                }
            } else {
                /* display empty list message */
                document.getElementById(sectionId)
                        .getElementsByClassName('no-online-msg')[0]
                        .style.display = 'block';
            }
            setTimeout(function() {
                UsersOnline.getOnlineFriendsAndFavorites(tab);
            }, UsersOnline.reloadRate);
        }
    },
    resetWidget: function() {
        document.getElementById(UsersOnline.widgetDivId).style.display = 'block';
        document.getElementById(UsersOnline.widgetButtonId).removeAttribute('class');
        document.getElementById(UsersOnline.widgetButtonId).setAttribute('class', 'active');
        var tabs = document.querySelectorAll('.widget-tab');
        var tabLists = document.querySelectorAll('.users-list');
        for(var i=0; i < tabs.length; i++) {
            tabs[i].setAttribute('class', tabs[i].getAttribute('class').replace('active', ''));
            tabLists[i].style.display = 'none';
        }
        var friendsTabElem = document.getElementById('friendsTab');
        friendsTabElem.setAttribute('class', friendsTabElem.getAttribute('class') + ' active');
        document.getElementById('friendsOnlineList').style.display = 'block';
        UsersOnline.activeTab = 'friends';
        UsersOnline.initOnlineFriendsAndFavorites('friends');
    },
    closeWidget: function() {
        document.getElementById(UsersOnline.widgetDivId).style.display = 'none';
        document.getElementById(UsersOnline.widgetButtonId).removeAttribute('class');
        UsersOnline.activeTab = '';
    },
    initOnlineFriendsAndFavorites: function(tab) {
        UsersOnline.activeTab = tab;
        UsersOnline.getOnlineFriendsAndFavorites(tab);
    },
    toggleWidget: function() {
        var widgetElem = document.getElementById(UsersOnline.widgetDivId);
        var widgetButton = document.getElementById(UsersOnline.widgetButtonId);
        if (widgetElem) {
            if (!UsersOnline.setClickOutside) {
                UsersOnline.setClickOutside = true;
                document.getElementsByTagName('html')[0].onclick = function(e) {
                    if (!(e.target === widgetElem)
                        && !Utils.isDescendant(widgetButton, e.target)
                        && !Utils.isDescendant(widgetElem, e.target)) {
                        UsersOnline.closeWidget();
                    }
                }
            }
            if (widgetElem.style.display == 'none') {
                UsersOnline.resetWidget();
            } else {
                UsersOnline.closeWidget();
            }
        } else {
            console.log('Could not find element #' + UsersOnline.widgetDivId);
        }
    }
}

/**
 code related to complaints/abuse forms
 @module Complaints.js
 @requires Cam4Utils.js, jQuery
 */

/**
 * code related to complaints/abuse forms
 * @class Complaints
 * @static
 */
var Complaints = {
    /**
     * init required style on DOM ready
     * @method init
     * @returns {undefined}
     */
    init: function() {
        if (Cam4User.htmlStates.indexOf('abuseForm_ftl') > -1) {
            $j("#abuse-form input:radio[value^='chatter']").click(function() {
                $j('#chatter, #chatter label, #chatter input').show();
            });
            $j("#abuse-form input:radio:not([value^='chatter'])").click(function() {
                $j('#chatter, #chatter label, #chatter input').hide();
            });
            $j('.abuse-popup.ui-dialog').css({position: 'fixed'});
        } else {
            $j('#openAbuseBtn').hide();
            $j('#MobileMenuNavigator option[value=open_abuse_form]').remove();
        }

    },
    submitData: function(event) {
        if ($j('input[name="abuseType"]:checked').val() === undefined) {
            return false;
        } else {
            var postData = $j('#abuse-form form').serializeArray();
            var formURL = $j('#abuse-form form').attr('action');
            $j.ajax({
                url: formURL,
                type: 'POST',
                data: postData,
                dataType: 'html',
                success: function(data, textStatus, jqXHR) {
                    console.log('Abuse-Form: data sent successfully');
                    $j('#output1').html(data);
                    setTimeout(function() {
                        Complaints.closeAbuseForm();
                    }, 3000);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('Abuse-Form: data submit FAILED - ' + textStatus + ' ' + errorThrown);
                }
            });
        }

        var evt = event ? event : window.event;
        if (evt.preventDefault)
            evt.preventDefault();
        evt.returnValue = false;

    },
    closeAbuseForm: function() {
        Utils.closeModalPops();
        try {
            $j('#abuse-form').dialog('close');
        } catch (ex) {
        }
        return false;
    },
    unresponsive_openAbuseForm: function(reportedUserId, status, extraData) {
        $j('#abuse-form input[name="abuseType"]').attr('checked', false);
        parent.document.getElementById('inappropriateContentSubtypes').style.display = 'none';
        $j('.ui-dialog-buttonpane').css('margin-top', '650px');
        if (reportedUserId) {
            $j('#abuse-form input[name="reportedUserId"]').val(reportedUserId);
        }
        $j('#output1').text('');

        $j('#abuseChatId').remove();
        $j('#abuseOriginServerId').remove();

        $j('#abuseComment').val('');

        //extraData = chatId
        if (status === 'viewer' && extraData) {
            $j('form[name=reporAbuse]').append('<input id="abuseChatId" type="hidden" name="chatId" value="' + extraData + '"/> ');
        }
        //extraData = originServerId
        if (status === 'broadcaster' && extraData) {
            $j('form[name=reporAbuse]').append('<input id="abuseOriginServerId" type="hidden" name="originServerId" value="' + extraData + '"/> ');
        }

        switch (status) {
            case 'viewer':
                for (var i = 1; i < 5; i++) {
                    $j('#ui-lind' + i).hide();
                }
                for (var i = 5; i < 8; i++) {
                    $j('#ui-lind' + i).show();
                }
                $j('#ui-lind' + 8).hide();
                break;

            case 'broadcaster':
                for (var i = 1; i < 5; i++) {
                    $j('#ui-lind' + i).show();
                }

                for (var i = 5; i < 8; i++) {
                    $j('#ui-lind' + i).hide();
                }

                $j('#ui-lind' + 8).show();
                break;

            default:
                for (var i = 1; i < 9; i++) {
                    $j('#ui-lind' + i).show();
                }
                break;
        }

        Complaints.abuseDialog = $j('#abuse-form').dialog({
            autoOpen: true,
            width: 520,
            modal: true,
            disabled: false,
            resizable: false,
            open: function() {
                $j('.ui-dialog').css('opacity', '1');
                $j('.ui-dialog').css('background', 'transparent');
                $j('.ui-dialog').css('position', 'fixed');
                $j('.ui-dialog').css('top', '10%');
                $j('.ui-dialog-buttonpane').css('z-index', '10000');
                $j('.ui-resizable').resizable({disabled: true});
                $j('.ui-dialog .ui-dialog-buttonpane').css({position: 'relative'});
                $j('.ui-dialog .ui-dialog-buttonpane').css({bottom: '75px'});
                $j('.ui-dialog .ui-dialog-buttonpane').css({marginLeft: '53px'});
                $j('.ui-dialog .ui-dialog-titlebar').css({display: 'none'});
                $j('.ui-dialog .ui-dialog-buttonpane button').css({float: 'left'});
            },
            close: function() {
            }
        });
        return 0;
    },
    responsive_openAbuseForm: function(reportedUserId, status, extraData) {
        if (!this.modalHtml) {
            if (document.getElementById('abuse-form')) {
                this.modalHtml = document.getElementById('abuse-form').outerHTML;
                $('#abuse-form').remove();
            }
        }

        if (document.getElementById('abuse-form') || Complaints.modalHtml) {
            $('.modal-content').empty().append(Complaints.modalHtml);
            $('#abuse-form').show();
            $('#modalLayout').modal();

        }
    },
    openAbuseForm: function(reportedUserId, status, extraData) {
        Utils.closeModalPops();
        if (Cam4User.useResponsiveLayout) {
            Complaints.responsive_openAbuseForm(reportedUserId, status, extraData);
        } else {
            Complaints.unresponsive_openAbuseForm(reportedUserId, status, extraData);
        }
    },
    makeChoiceAbuse: function() {
        var val = 0;
        var nrItems = document.reporAbuse.abuseType.length;
        for (var i = 0; i < nrItems; i++) {

            if (document.reporAbuse.abuseType[i].checked == true) {
                val = document.reporAbuse.abuseType[i].value;
                document.getElementById('BroadcasterAmount').style.display = 'none';
                document.getElementById('inappropriateContentSubtypes').style.display = 'none';
                document.getElementById('commentBoxTitle').style.display = 'block';

                if (!Cam4User.useResponsiveLayout) {
                    document.getElementById('abuseComment').style.marginTop = '5px';
                    document.getElementById('abuseComment').style.marginLeft = '10px';
                }

                if (val == 'broadcasterTippingFraud') {
                    document.getElementById('BroadcasterAmount').style.display = 'block';
                    document.getElementById('commentBoxTitle').style.display = 'none';

                    if (!Cam4User.useResponsiveLayout) {
                        document.getElementById('abuseComment').style.marginTop = '-5px';
                        document.getElementById('abuseComment').style.marginLeft = '40px';
                    }
                }

                if (val == 'inappropriateContent') {
                    document.getElementById('inappropriateContentSubtypes').style.display = 'block';
                    $('#abuseSubtypes').selectpicker();
                }
            }

        }
    }
    ,
    statusMessageCensoredWord: function(id, string) {

        $j.ajax({
            url: '/profiles/reportAbuse',
            data: {abuseType: 'inappropriateContent', abuseSubtype: 'other', abuseComment: 'status ' + string, broadcasterId: id, reportedUserId: id},
            type: 'post',
            success: function(result) {
                console.log(result);
            }
        });
    }
};


if (typeof JsReceiver != 'undefined') {
    JsReceiver.statusMessageCensoredWord = Complaints.statusMessageCensoredWord;
    JsReceiver.openAbuseForm = Complaints.openAbuseForm;
}



$j(function() {
    Complaints.init();
});

$j('#report-abuse').click(function(event) {
    Complaints.openAbuseForm('', 'broadcaster');
});


$j(function() {
    $j('.restoreButton').click(function() {
        $j('.checkChoice input').attr('checked', 'checked');
        $j('.tabsDisplayButtons .saveButton').trigger('click');
    });
});/**
 Included in WEB-INF/jsp/profile/profile_ratingstars.jsp, this module contains methods for profile rating stars (basic user and private show receipt)
 @module RatingSystem.js
 */



var RatingSystem = {
    rateNames: [],
    /**
     * the rate value. This is defiend by server in WEB-INF/jsp/profile/profile_ratingstars.jsp
     * @type Number
     */
    rateValue: 0,
    lastVotedUsername: '',
    lastVoteValue: -1,
    /**
     * method to extract index from class names
     * @param {String} itemClassName the class name to be parsed, at least one name must have value aX
     * @returns {Number} the X from class = 'aX limit'
     */
    getIndexFromClass: function(itemClassName) {

        var arr = itemClassName.split(' ');

        for (var i = 0; i < arr.length; i++) {
            if (arr[i][0] === 'a') {
                return parseInt(arr[i][1]);
            }
        }
        return -1;
    },
    init: function(rateValue, containerId, ratingStatusOn) {
        if (typeof RatingData !== undefined) {
            this.rateNames = RatingData.names;
        }

        $j('#' + containerId + ' .limit').removeClass('limit');
        $j('#' + containerId + ' span').removeClass('limit');
        $j('#' + containerId + ' span').removeAttr('style');

        if (rateValue <= 0) {
            rateValue = 0;
        } else if (rateValue > 5) {
            rateValue = 5;
        }
        var thnd = (rateValue + '').split('.')[0];
        thnd = parseInt(thnd) - 1;

        if ($j('#' + containerId + ' .a' + thnd)) {
            $j('#' + containerId + ' .a' + thnd).addClass('limit');
        }

        if (thnd < 0) {
            thnd = 0;
        }


        var num = (rateValue - Math.floor(rateValue)).toFixed(2);
        var rateValuePrecision = (num > 0.25) && (num < 0.75) ? 5 : (num <= 0.25) ? 0 : false;

        rateValuePrecision = rateValuePrecision === false ? Math.floor(rateValue) + 1 : (rateValue + '').split('.')[0] + '.' + rateValuePrecision;



        var backWidth = (100 * parseFloat(rateValuePrecision)) / 5;
        $j('#' + containerId + ' .ratingStarsItemBack').width(backWidth + 'px');


        $j('#' + containerId + ' span').mouseover(function(event) {
            if (event.currentTarget.className.indexOf('limit') > -1 || RatingSystem.getIndexFromClass(event.currentTarget.className) > thnd) {
                $j('#' + containerId + ' .limit').css('background', 'url(' + WEB_CDN + '/images/RatingStars/starContrast.png)');
            } else {
                $j('#' + containerId + ' .limit').css('background', 'url(' + WEB_CDN + '/images/RatingStars/starOn.png)');
            }
            if (ratingStatusOn) {
                $j('#rating_status').html(RatingSystem.rateNames[event.currentTarget.id[1]]);
            }

        });


        $j('#' + containerId + ' span').mouseout(function() {
            $j('#' + containerId + ' .limit').css('background', 'url(' + WEB_CDN + '/images/RatingStars/starOn.png)');
        });

    },
    sendUserBasicRating: function(url, amount, broadcast_id, votedusername, votingusername) {
        if (RatingSystem.lastVotedUsername === votedusername && RatingSystem.lastVoteValue === amount) {
            if (!Cam4User.useResponsiveLayout) {
                $j('#rating_status').html(Cam4Bundles.duplicatedRate);
            }
            return;
        } else {
            RatingSystem.lastVotedUsername = votedusername;
            RatingSystem.lastVoteValue = amount;
        }

        var data = {'action': 'vote', 'value': amount, 'votedusername': votedusername, 'votingusername': votingusername, 'broadcastid': broadcast_id};

        $j.get(url, data, function(response, status, xhr) {
            if (status == 'success') {
                $j('#rating_status').html(response);
            } else {
                $j('#rating_status').text(Cam4Bundles.failedToRate);
            }
        });
    },
    sendArticleRating: function(url, ratingValue, articleSlug) {
        AjaxSender.send({method: 'POST', url: url,
            data: 'ratingValue=' + ratingValue + '&articleSlug=' + articleSlug,
            success: function(res) {
                var data = jQuery.parseJSON(res.toString());
                console.log(data);
                if ((typeof data['userAlreadyVoted'] != 'undefined') && (data['userAlreadyVoted'] == 'true')) {
                    alert(Cam4Bundles.alreadyVotedArticle);
                    return;
                } else {
                    document.getElementById('voteCount').innerHTML = data['voteCount'];
                    document.getElementById('voteAverage').innerHTML = (data['voteAverage'] * 1).toFixed(1);
                    RatingSystem.init(document.getElementById('voteAverage').innerHTML, 'rateArticleDiv');
                }
            },
            onerror: function(err) {
                console.log(err);
            },
            onexception: function(ex) {
                console.log(ex);
            }
        });
    },
    rateNewShow: function(event, url, amount, broadcast_id, votedusername, votingusername) {

        var data = {'action': 'vote', 'value': amount, 'votedusername': votedusername, 'votingusername': votingusername, 'broadcastid': broadcast_id};
        $j.get(url, data, function(response, status, xhr) {
            if ('success' == status) {
                RatingSystem.init(amount + 1, 'rateNSDiv');
            } else {

            }
        });

        event.preventDefault();
        event.stopPropagation();
    }

};


$j(document).ready(function() {
    /* If on an article page */
    if (document.getElementById('rateArticleDiv') && document.getElementById('voteAverage')) {
        RatingSystem.init(document.getElementById('voteAverage').innerHTML, 'rateArticleDiv');
    }

    if (Cam4User.htmlStates.indexOf('privateShowReceipt_jsp') > -1) {
        RatingSystem.init(0, 'rateNSDiv');
    }

    if (Cam4User.htmlStates.indexOf('profile_ratingstars_jsp') > -1) {
        if (Cam4User.isLoggedIn) {
            RatingSystem.init(RatingData.actualRating, 'rateUserDiv', true);
        } else {
            RatingSystem.init(RatingData.actualRating, 'rateUserDiv');
        }
    }

});




var Modals = {
    openAllUnbundledFeaturesModal: function() {
        try {
            var modalLayout = $('#modalLayout');
            modalLayout.html($j('#goldfeats').html());
            modalLayout.modal('show');
            Cam4Event.dispatch(Cam4Event.MODAL_OPENED);
            return true;
        } catch (ex) {
            return false;
        }
    },

    sendViewedNewGoldOverlay: function() {
        /* mark that user has viewed the overlay */
        AjaxSender.send({
            method: 'POST',
            url: '/goldIntroductionOverlay',
            data: '',
            success: function() {
                console.log('newGoldOverlay has been viewed!');
            },
            onerror: function(err) {
                console.log(err);
            },
            onexception: function(ex) {
                console.log(ex);
            }
        });
    },

    openGoldGotBetterModal: function() {
        try {
            Utils.popWithAjaxContent('/goldIntroductionOverlay', {}, false, function() {
                $j('#goldGotBetterContent').parents('.modal-dialog')
                                           .addClass('wide-modal');
            });
            Modals.sendViewedNewGoldOverlay();
            return true;
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}

$j(document).ready(function(){
    if (Cam4User.showGoldIntroductionOverlay === 'true') {
       Modals.openGoldGotBetterModal();
    }
});var ProfileModalMessage = (function() {
    var allowSendMail = true;
    this.responsiveHTML = false;
    var self = this;

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    function showItem(num) {
        $j("#openMailBoxButton").hide();
        $j("#messageStatus").show();
        $j("#messageStatus .mailStatus").hide();
        $j($j("#messageStatus .mailStatus")[num]).show();
    }

    function hideItems() {
        $j("#openMailBoxButton").show();
        $j("#messageStatus").hide();
        $j("#send_message").hide();
        Utils.closeModalPops();
    }

    function open(username) {
        if (Cam4User.useResponsiveLayout) {
            if (!self.responsiveHTML) {
                self.responsiveHTML = $('#send_message').html();
                $('#send_message').remove();
            }
            $('.modal-content').empty().append(self.responsiveHTML);
            $('#modalLayout').modal();
            return;
        }

        if (typeof username != 'undefined' && username != '') {
            document.getElementById('send_message').setAttribute('style', 'display: block');
            document.composeForm.elements['username'].value = username;
            document.getElementById('composeForm').getElementsByClassName('privateMessageTitle')[0].getElementsByTagName('span')[0].innerHTML = username;
            $j('#send_message').css('position', 'fixed');
            $j('#send_message #overlayWrap').css('margin-top', '12%');
            $j('#send_message #overlayWrap #contentWrap').css('width', '406px');
            $j('#send_message #overlayWrap').css('width', '411px');
        } else {
            console.error('Error - Parameter \'username\' in openSendInboxMessagePopup is of incorrect type');
        }
    }

    function send() {
        allowSendMail = false;
        var data = new Object();
        var idSelector = Cam4User.useResponsiveLayout ? 'sendPrivateMsgForm' : 'composeForm';

        data.username = $j('#' + idSelector + ' input[name=username]').val();
        data.subject = $j('#' + idSelector + ' input[name=subject]').val()
        data.redirect = $j('#' + idSelector + ' input[name=redirect]').val()
        data.message = $j('#' + idSelector + ' textarea').val();

        console.log('get data with idSelector = ', idSelector, data);
        if (!isBlank(data.message) && !allowSendMail) {
            showItem(1);
            console.log('start ajax');
            $j('#' + idSelector + ' button').attr('disabled');
            $j('#' + idSelector + ' button').addClass('disabled');
            $j.ajax({
                type: 'POST',
                url: "/mail",
                data: data,
                error: function(err, status, errThrown) {
                    showItem(2);
                    allowSendMail = true;
                    console.log('ajax err ', err);
                    $j('#' + idSelector + ' button').removeAttr('disabled');
                    $j('#' + idSelector + ' button').removeClass('disabled');
                },
                success: function(result) {
                    allowSendMail = true;
                    showItem(0);
                    hideItems();
                    $j('#' + idSelector + ' button').removeAttr('disabled');
                    $j('#' + idSelector + ' button').removeClass('disabled');
                }
            });
        } else {
            $j('#sendPrivateMsgForm textarea').val('');
            allowSendMail = true;
        }
    }
    return {
        send: send,
        open: open
    };
})();


if (typeof JsReceiver != 'undefined') {
    JsReceiver.openSendInboxMessagePopup = ProfileModalMessage.open;
}var FeatureReporting = {
    /**
     * Sends tracking information to SMS api for feature usage and purchase attempts
     * @param {String} featureId - same ids used in the admin section
     * @param {String} attemptType - can be "USE" or "BUY"
     */
    sendUsageAttempt: function(featureId, attemptType) {



        if (typeof attemptType === 'undefined') {
            attemptType = 'USE';
        }
        /**
         * Cam4User.useUnbundling is false when user is not logged in
         */
        if (Cam4User.useUnbundling) {

            /* Check specific conditions when usage attempt shouldn't be reported */
            switch (featureId) {

                case 'UNLIMITED_SAVED_SEARCHES':
                    /* Check if limit of saved searches has been surpassed */
                    var savedSearches = document.getElementById('savedSearches')
                            .getElementsByTagName('li')
                            .length;

                    if (savedSearches < Directory.loggedInUserSearchLimit) {
                        return;
                    }
                    break;

            }

            var smsUrl = SMS_SERVER + '/sms/webcontent/index/FeatureTrackingAPI.php';

            var data = 'feature_id=' + featureId +
                    '&locked=' + '1' +
                    '&event=' + attemptType +
                    '&user_name=' + Cam4User.userName;

            AjaxSender.send({
                method: 'POST',
                url: smsUrl,
                data: data,
                onerror: function(err) {
                    console.log(err);
                },
                onexception: function(ex) {
                    console.log(ex);
                }
            });

        } else {
            if (featureId === 'C4BND_UNLIMITED_SAVED_SEARCHES' && !Cam4User.isLoggedIn) {
                activateOverlayItself('/gold?overlay=1&pageVersion=initSignup');
            }
        }

    }
};
var FeatureOrder = {
    userTierType: '',
    cartList: {},
    markItemAsAdded: function(featureCode) {
        var itemElementId    = 'featureItem-' + featureCode;
        document.querySelectorAll('#' + itemElementId + ' .feat-actions .btn-green')[0]
                .style.display = 'none';
        document.querySelectorAll('#' + itemElementId + ' .feat-actions .active')[0]
                .style.display = 'inline-block';

        var itemElem = document.getElementById(itemElementId);
        Utils.removeClassNative(itemElem, 'buy');
        Utils.addClassNative(itemElem, 'in-cart');
    },
    resetFeatureItem: function(featureCode) {
        var itemElementId    = 'featureItem-' + featureCode;
        document.querySelectorAll('#' + itemElementId + ' .feat-actions .btn-green')[0]
                .style.display = 'inline-block';
        document.querySelectorAll('#' + itemElementId + ' .feat-actions .active')[0]
                .style.display = 'none';

        var itemElem = document.getElementById(itemElementId);
        Utils.removeClassNative(itemElem, 'in-cart');
        Utils.addClassNative(itemElem, 'buy');
    },
    getInitialTierType: function() {
        return document.getElementsByName('initialUserTierType')[0].value;
    },
    updateCurrentTierType: function() {
        var initialTier = FeatureOrder.getInitialTierType();
        if (initialTier != '') {
            FeatureOrder.userTierType = initialTier;
        } else {
            if (Utils.sizeOfObject(FeatureOrder.cartList) > 0) {
                for (var k in FeatureOrder.cartList) {
                    if (FeatureOrder.cartList[k].tierType === 'BOTTOM') {
                        FeatureOrder.userTierType = 'BOTTOM';
                    }
                    if (FeatureOrder.cartList[k].tierType === 'TOP') {
                        FeatureOrder.userTierType = 'TOP';
                        break;
                    }
                }
            } else {
                FeatureOrder.userTierType = initialTier;
            }
        }
        FeatureOrder.updateFeaturesDiscount();
    },
    getCurrentTierType: function() {
        var tierType = '';
        if (FeatureOrder.userTierType != '') {
            tierType = FeatureOrder.userTierType;
        } else {
            tierType = FeatureOrder.getInitialTierType();
        }
        return tierType;
    },
    updateFeaturesDiscount: function() {
        var currentTier = FeatureOrder.getCurrentTierType();
        var featureItems = document.getElementsByClassName('feat-item');
        switch (currentTier) {
            case '':
                for (var i=0; i < featureItems.length; i++) {
                    featureItems[i].getElementsByClassName('discount-top')[0]
                        .style.display = 'none';
                    featureItems[i].getElementsByClassName('discount-bottom')[0]
                        .style.display = 'none';
                }
                break;
            case 'BOTTOM':
                for (var i=0; i < featureItems.length; i++) {
                    featureItems[i].getElementsByClassName('discount-top')[0]
                        .style.display = 'none';
                    featureItems[i].getElementsByClassName('discount-bottom')[0]
                        .style.display = 'inline-block';
                }
                break;
            case 'TOP':
                for (var i=0; i < featureItems.length; i++) {
                    featureItems[i].getElementsByClassName('discount-top')[0]
                        .style.display = 'inline-block';
                    featureItems[i].getElementsByClassName('discount-bottom')[0]
                        .style.display = 'none';
                }
                break;
        }
    },
    getMaxPrice: function() {
        return (document.getElementsByName('maxAllowedBundlePrice')[0].value*1).toFixed(2)*1;
    },
    updateTotalOrder: function() {
        var totalPrice = 0;
        var totalDiscount = 0;
        var totalCurrency = '';
        var priceType = '';
        var firstTierItemSkipped = false;

        // Update current tier type
        //
        FeatureOrder.updateCurrentTierType();
        var currentTier = FeatureOrder.getCurrentTierType();
        var initialTier = FeatureOrder.getInitialTierType();

        if (Utils.sizeOfObject(FeatureOrder.cartList) > 0) {

            for(var k in FeatureOrder.cartList) {
                if (totalCurrency == '') {
                    totalCurrency = FeatureOrder.cartList[k].currency;
                }
                totalPrice += FeatureOrder.cartList[k].priceObj['default']*1;
                if (initialTier == '') {
                    // Skip discount for first element of current tier type
                    if (currentTier == FeatureOrder.cartList[k].tierType &&
                        !firstTierItemSkipped) {
                        firstTierItemSkipped = true;
                        continue;
                    }
                    totalDiscount += FeatureOrder.cartList[k].priceObj['default']*1 -
                                 FeatureOrder.cartList[k].priceObj[currentTier.toLowerCase()]*1;
                } else {
                    totalDiscount += FeatureOrder.cartList[k].priceObj['default']*1 -
                                 FeatureOrder.cartList[k].priceObj[initialTier.toLowerCase()]*1;
                }

            }
        }

        totalPrice = totalPrice.toFixed(2);
        totalDiscount = totalDiscount.toFixed(2);
        var totalOrder = (totalPrice - totalDiscount).toFixed(2);

        // Cost total
        //
        document.querySelectorAll('#totalCost .cart-item-price')[0]
                .innerHTML = totalPrice;
        document.querySelectorAll('#totalCost .cart-item-currency')[0]
                .innerHTML = totalCurrency;

        // Discount total
        //
        document.querySelectorAll('#totalDiscount .cart-item-price')[0]
                .innerHTML = totalDiscount;
        document.querySelectorAll('#totalDiscount .cart-item-currency')[0]
                .innerHTML = totalCurrency;

        // Bottom line order total
        //
        document.querySelectorAll('#orderTotalBottom .total-price')[0]
                .innerHTML = totalOrder;
        document.querySelectorAll('#orderTotalBottom .total-currency')[0]
                .innerHTML = totalCurrency;

        // If max price is reached, add remaining items as free,
        // otherwise remove any existing free items
        //
        if (totalOrder >= FeatureOrder.getMaxPrice()) {
            FeatureOrder.addRemainingItemsAsPromotion();
        } else {
            FeatureOrder.removeFreeItems();
        }

    },
    addItemToCart: function (featureCode, addAsFree) {
        if (FeatureOrder.cartList.hasOwnProperty(featureCode) === true) {
            console.log('item ' + featureCode + ' already added to shopping cart!');
            return false;
        } else {
            var itemElementId    = 'featureItem-' + featureCode;
            var itemDisplayName  = document.querySelectorAll('#' +
                                            itemElementId +
                                            ' .title')[0].innerHTML;
            var itemCurrency     = document.querySelectorAll('#' +
                                        itemElementId +
                                        ' input[name=currency]')[0].value;

            var itemPrice = {};
            if (addAsFree === true) {
                itemPrice = {
                    'default': 0,
                    'top': 0,
                    'bottom': 0
                };
            } else {
                itemPrice = {
                    'default': document.querySelectorAll('#' +
                                            itemElementId +
                                            ' input[name=price_default]')[0].value,
                    'top': document.querySelectorAll('#' +
                                            itemElementId +
                                            ' input[name=price_top]')[0].value,
                    'bottom': document.querySelectorAll('#' +
                                            itemElementId +
                                            ' input[name=price_bottom]')[0].value
                };
            }

            var itemTierType = document.querySelectorAll('#' +
                                        itemElementId +
                                        ' input[name=tierType]')[0].value;

            // Add item to cart list object
            //
            FeatureOrder.cartList[featureCode] = {
                domElementId: itemElementId,
                displayName: itemDisplayName,
                currency: itemCurrency,
                priceObj: itemPrice,
                tierType: itemTierType,
                addedAsFree: addAsFree?true:false
            };

            // Populate order summary
            //
            var tpl = document.getElementById('tpl_cartItem')
                              .cloneNode(true);
            tpl.setAttribute('id', 'cartItem-' + featureCode);
            tpl.getElementsByClassName('cart-item-name')[0]
               .innerHTML = itemDisplayName;
            if (addAsFree === true) {
                tpl.getElementsByClassName('delete')[0]
                   .style.display = 'none';
            } else {
                tpl.getElementsByClassName('delete')[0]
                   .setAttribute('onclick', 'FeatureOrder.removeItemFromCart(\'' + featureCode + '\')');
            }
            tpl.getElementsByClassName('cart-item-currency')[0]
               .innerHTML = itemCurrency;
            tpl.getElementsByClassName('cart-item-price')[0]
               .innerHTML = itemPrice['default'];
            tpl.style.display = 'block';
            document.getElementById('cartList').appendChild(tpl);
            // Mark DOM feature item element as added
            //
            FeatureOrder.markItemAsAdded(featureCode);

            if (!addAsFree) {
                // Update total order and discount
                //
                FeatureOrder.updateTotalOrder();
            }

        }
    },
    removeItemFromCart: function(featureCode) {
        if (FeatureOrder.cartList.hasOwnProperty(featureCode) === false) {
            console.log('item ' + featureCode + ' not in cart list..');
            return false;
        } else {
            // Remove item from cart list object
            //
            delete FeatureOrder.cartList[featureCode];
            // Remove DOM element from order summary
            //
            var itemElem = document.getElementById('cartItem-' + featureCode);
            itemElem.parentNode.removeChild(itemElem);
            // Reset DOM feature item element
            //
            FeatureOrder.resetFeatureItem(featureCode);

            // Update total order and discount
            //
            FeatureOrder.updateTotalOrder();
        }
    },
    addRemainingItemsAsPromotion: function() {
        var remainingItems = document.querySelectorAll('.feat-item.buy');
        for (var i=0; i < remainingItems.length; i++) {
            FeatureOrder.addItemToCart(remainingItems[i].getAttribute('id').split('-')[1], true);
        }
        document.querySelectorAll('#blueInfoBox .default')[0]
                .style.display = 'none';
        document.querySelectorAll('#blueInfoBox .get-it-all')[0]
                .style.display = 'block';
    },
    removeFreeItems: function() {
        for (var k in FeatureOrder.cartList) {
            if (FeatureOrder.cartList[k].addedAsFree) {
                FeatureOrder.removeItemFromCart(k);
            }
        }
        document.querySelectorAll('#blueInfoBox .default')[0]
                .style.display = 'block';
        document.querySelectorAll('#blueInfoBox .get-it-all')[0]
                .style.display = 'none';
    }
}





