///////////////////////////////////////////////////////////////////////////////
// file okijin.api.js
// Copyright (c) 2015 Frédéric J. Rézeau. All rights reserved.
///////////////////////////////////////////////////////////////////////////////

(function (namespace, undefined) {
    "use strict";

    var adTimerId;
    var showAd = false;
    var showAdCooldown = 30000;
    var interstitialId = "#interstitial";
    var adId = "#adUnit";

    namespace.resetAdTimer = function (first) {
        showAd = false;

        if (adTimerId) {
            clearTimeout(adTimerId);
        }
        adTimerId = setTimeout(function () { showAd = true; }, (first ? 2000 : showAdCooldown));
    };

    namespace.initialize = function () {
        $("#canvas").fadeIn();
        namespace.hideInterstitial(true);

        if (OkijinAPISettings && OkijinAPISettings.ads) {
            namespace.resetAdTimer(true);
        }
    };

    namespace.showInterstitial = function () {
        if (OkijinAPISettings && OkijinAPISettings.ads && showAd) {
            $(interstitialId).slideDown();
            $(adId).fadeIn();
            $("#close").show();

            OkijinGame.setPaused(true);

            if (OkijinAPISettings.button) {
                $("#more").fadeOut();
            }
        }
    };

    namespace.hideInterstitial = function () {
        if (OkijinAPISettings && OkijinAPISettings.ads && showAd) {
            $(interstitialId).slideUp();
            $(adId).fadeOut();
            $("#close").hide();

            OkijinGame.setPaused(false);
            namespace.resetAdTimer();
        }

        if (OkijinAPISettings && OkijinAPISettings.button) {
            $("#more").fadeIn();
        }
    };

    namespace.isDesktop = function () {
        return categorizr.isDesktop ? true : false;
    };

})(window.OkijinAPI = window.OkijinAPI || {});

$("#moreButton").click(function (e) {
    "use strict";
    window.open('http://www.okijin.com', '_blank');
    e.preventDefault();
});

$("#closeButton").click(function (e) {
    "use strict";
    OkijinAPI.hideInterstitial();
    e.preventDefault();
});
