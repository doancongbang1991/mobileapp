function onLiveRailInitComplete() {}

function onLiveRailAdStart() {}

function onLiveRailAdEnd() {}

function onLiveRailClickThru() {}

function onLiveRailPrerollComplete(a) {
    if (a) c3po.close_ad("ByAdEventLiveRail");
    else {
        var b = document.getElementById("lr_interstitial_table").parentNode;
        b.parentNode.removeChild(b), c3po_mod_liverail.log("no video available. calling c3po backfill"), c3po.ad_error("no liverail-video available.")
    }
}

function sc_smartInpageNoad() {
    c3po_mod_smartclip.ad_error("no ad")
}

function sc_smartInpageEnd() {
    c3po_mod_smartclip.log("Ad ended"), c3po.close_ad("ByAdEventSmartclip")
}
var c3po = {
        debugMode: !1,
        asset_path: "./c3po.softgames.de/",
        state_ad: "state-ad",
        state_dfp_video_backfill: "state-dfp-video-backfill",
        state_backfill: "state-backfil",
        state_final_backfill: "state-final-backfill",
        default_settings: {
            ad_type: "adsense_games",
            custom_params: null,
            language: "en",
            ad_container_id: "",
            close_ad_callback: null,
            ad_error_callback: null,
            display_close_button: !1,
            close_button: null,
            close_button_delay: 2e3,
            state: "state-ad",
            final_backfill_ad_type: "dfp-final-backfill",
            final_backfill_ad_unit_code: "dfp_final_fallback",
            skipPlayButton: !1,
            description_url: "",
            adsense_pub_id: "ca-pub-3245421709461335",
            adsense_content_ad_unit_id: null,
            adsense_content_ad_size: {
                width: 300,
                height: 250
            },
            adsense_games_pub_id: "ca-games-pub-3245421709461335",
            adsense_games_custom_channel: null,
            adsense_games_video_ads: !0,
            adsense_games_image_ads: !0,
            adsense_games_flash_ads: !0,
            adsense_games_text_ads: !0,
            adsense_games_max_ad_duration: 3e4,
            adx_pub_id: "ca-pub-5846800249286047",
            adx_content_tag: null,
            adx_content_ad_size: {
                width: 300,
                height: 250
            },
            adx_games_pub_id: "ca-games-pub-5846800249286047",
            adx_games_tag: null,
            adx_games_video_ads: !0,
            adx_games_image_ads: !0,
            adx_games_flash_ads: !0,
            adx_games_max_ad_duration: 3e4,
            adx_games_max_skippable_ad_duration: 12e4,
            direct_vast_tag: "",
            direct_vast_is_video: !0,
            direct_vast_backfill: "adsense_games",
            dfp_network_code: "418149392",
            dfp_ad_unit_code: null,
            dfp_ad_size: {
                width: 300,
                height: 250
            },
            dfp_video_backfill: "adsense_games",
            dfp_video_ad_unit_code: null,
            liverail_pub_id: "41946",
            liverail_backfill: "adsense_games",
            smartclip_backfill: "adsense_games"
        },
        mods: {
            mod_ima: "c3po_mod_ima.js",
            mod_gca: "c3po_mod_gca.js",
            mod_dfp: "c3po_mod_dfp.js",
            mod_liverail: "c3po_mod_liverail.js",
            mod_smartclip: "c3po_mod_smartclip.js"
        },
        current_settings: {},
        loadedStyles: 0,
        setDebugMode: function() {
            "1" === c3po.url_param(location.search, "c3po_debug") && (c3po.debugMode = !0)
        },
        showAd: function(a) {
            c3po.current_settings = {}, c3po.setDebugMode(), c3po.log(a), c3po.extend_obj(c3po.current_settings, c3po.default_settings), c3po.log(c3po.current_settings), c3po.extend_obj(c3po.current_settings, a), c3po.log(c3po.current_settings), null !== document.getElementById(c3po.current_settings.ad_container_id) && c3po.invokeAdCall(c3po.current_settings.ad_type.toLowerCase())
        },
        invokeAdCall: function(a) {
            switch (c3po.log("requested ad type: " + a), a) {
                case "adsense_content":
                    c3po.show_Adsense_Content();
                    break;
                case "adsense_games":
                    c3po.show_Adsense_Games();
                    break;
                case "adx_content":
                    c3po.show_AdX_Content();
                    break;
                case "adx_games":
                    c3po.show_AdX_Games();
                    break;
                case "direct_vast":
                    c3po.show_Direct_VAST();
                    break;
                case "dfp_banner":
                    c3po.show_DFP_Banner();
                    break;
                case "dfp_video":
                    c3po.show_DFP_Video();
                    break;
                case "liverail":
                    c3po.show_Liverail();
                    break;
                case "smartclip":
                    c3po.show_Smartclip();
                    break;
                case "dfp-final-backfill":
                    c3po.show_DFP_Final();
                    break;
                case "skip-backfill":
                    c3po.close_ad("BySkipping");
                    break;
                default:
                    c3po.log('no match found for adType "' + a + '"'), c3po.close_ad("ByErrorAdTypeNotFound")
            }
        },
        show_Adsense_Games: function() {
            var a = c3po.current_settings,
                b = "";
            a.adsense_games_video_ads && (b = "video"), a.adsense_games_image_ads && (b = b ? b + "_image" : "image"), a.adsense_games_flash_ads && (b = b ? b + "_flash" : "flash"), a.adsense_games_text_ads && (b = b ? b + "_text" : "text");
            var c = "//googleads.g.doubleclick.net/pagead/ads?videoad_start_delay=0";
            c += "&client=" + a.adsense_games_pub_id, c += "&channel=" + a.adsense_games_custom_channel, c += "&ad_type=" + b, c += "&max_ad_duration=" + a.adsense_games_max_ad_duration, a.custom_params && a.custom_params.game && (c += "&description_url=" + encodeURIComponent("http://m.softgames.de/games/adtext/" + a.custom_params.game + "/?locale=" + a.language)), c += "&hl=" + a.language, c3po.log("requesting AdSense video. VAST: " + c), c3po_mod_ima.init({
                adContainer: document.getElementById(a.ad_container_id),
                vastTag: c,
                asset_path: c3po.asset_path,
                video_requested: a.adsense_games_video_ads,
                display_close_button: a.display_close_button,
                skipPlayButton: a.skipPlayButton
            })
        },
        show_AdX_Games: function() {
            var a = c3po.current_settings,
                b = "";
            a.adx_games_video_ads && (b = "video"), a.adx_games_image_ads && (b = b ? b + "_image" : "image"), a.adx_games_flash_ads && (b = b ? b + "_flash" : "flash");
            var c = "//googleads.g.doubleclick.net/pagead/ads?videoad_start_delay=0";
            c += "&client=" + a.adx_games_pub_id, c += "&slotname=" + a.adx_games_tag, c += "&ad_type=" + b, c += "&max_ad_duration=" + a.adx_games_max_ad_duration, c += "&sdmax=" + a.adx_games_max_skippable_ad_duration, c += "&description_url=" + encodeURIComponent("http://m.softgames.de/games/adtext/" + a.game + "/?locale=" + a.language), c += "&hl=" + a.language, c3po.log("requesting AdX video. VAST: " + c), c3po_mod_ima.init({
                adContainer: document.getElementById(a.ad_container_id),
                vastTag: c,
                asset_path: c3po.asset_path,
                video_requested: a.adx_games_video_ads,
                display_close_button: a.display_close_button,
                skipPlayButton: a.skipPlayButton
            })
        },
        show_Direct_VAST: function() {
            var a = c3po.current_settings;
            c3po_mod_ima.init({
                adContainer: document.getElementById(a.ad_container_id),
                vastTag: a.direct_vast_tag,
                asset_path: c3po.asset_path,
                video_requested: a.direct_vast_is_video,
                display_close_button: a.display_close_button,
                skipPlayButton: a.skipPlayButton
            })
        },
        show_Adsense_Content: function() {
            var a = c3po.current_settings,
                b = {
                    pub_id: a.adsense_pub_id,
                    ad_slot: a.adsense_content_ad_unit_id,
                    ad_size: {
                        width: a.adsense_content_ad_size.width,
                        height: a.adsense_content_ad_size.height
                    },
                    close_button: a.close_button,
                    close_button_delay: a.close_button_delay,
                    ad_container: document.getElementById(a.ad_container_id)
                };
            c3po_mod_gca.init(b)
        },
        show_AdX_Content: function() {
            var a = c3po.current_settings,
                b = {
                    pub_id: a.adx_pub_id,
                    ad_slot: a.adx_content_tag,
                    ad_size: {
                        width: a.adx_content_ad_size.width,
                        height: a.adx_content_ad_size.height
                    },
                    close_button: a.close_button,
                    close_button_delay: a.close_button_delay,
                    ad_container: document.getElementById(a.ad_container_id)
                };
            c3po_mod_gca.init(b)
        },
        show_DFP_Banner: function() {
            c3po_mod_dfp.init(c3po.current_settings)
        },
        show_DFP_Final: function() {
            c3po.current_settings.dfp_ad_unit_code = c3po.current_settings.final_backfill_ad_unit_code, ad_div_container = document.getElementById(c3po.current_settings.ad_container_id), ad_div_container.style.textAlign = "center", ad_div = document.getElementById("adDiv"), null !== ad_div && (ad_div.style.display = "none"), info_div = document.getElementById("infoDiv"), null !== info_div && (info_div.style.display = "none"), c3po_mod_dfp.init(c3po.current_settings)
        },
        show_DFP_Video: function() {
            var a = c3po.current_settings,
                b = [];
            if (c3po.log("custom targeting for dfp video: "), c3po.log(a.custom_params), "object" == typeof a.custom_params)
                for (var c in a.custom_params) b[b.length] = c + "=" + a.custom_params[c];
            var d = "//pubads.g.doubleclick.net/gampad/ads?sz=400x300";
            d += "&iu=/" + a.dfp_network_code + "/" + a.dfp_video_ad_unit_code, d += "&ciu_szs&impl=s&gdfp_req=1&env=vp&output=xml_vast2&unviewed_position_start=1", d += "&url=" + escape(document.location.href), d += "&correlator=" + Date.now(), d += "&cust_params=" + escape(b.join("&")), d += "" === a.description_url ? "&description_url=" + escape("http://m.softgames.de/games/adtext/" + a.game + "/?locale=" + a.language) : "&description_url=" + escape(a.description_url), c3po.log("requesting DFP video. VAST: " + d), c3po_mod_ima.init({
                adContainer: document.getElementById(a.ad_container_id),
                vastTag: d,
                asset_path: c3po.asset_path,
                video_requested: !0,
                display_close_button: a.display_close_button,
                skipPlayButton: a.skipPlayButton,
                debugMode: c3po.debugMode
            })
        },
        show_Liverail: function() {
            c3po_mod_liverail.init(c3po.current_settings)
        },
        show_Smartclip: function() {
            c3po_mod_smartclip.init(c3po.current_settings)
        },
        close_ad: function(a) {
            var b = c3po.current_settings;
            if ("function" == typeof b.close_ad_callback && b.close_ad_callback(a), null !== b.close_button) {
                var c = b.close_button;
                if (c && document.createEvent) {
                    var d = document.createEvent("MouseEvents");
                    d.initEvent("click", !0, !1), c.dispatchEvent(d)
                } else document.createEventObject ? c.fireEvent("onclick") : "function" == typeof node.onclick && c.onclick()
            }
        },
        set_refresh_count: function(a) {
            c3po.core_refs.refresh_count = a
        },
        ad_error: function(a) {
            var b = c3po.current_settings;
            "function" == typeof b.ad_error_callback && b.ad_error_callback(a) || (b = c3po.current_settings, b.state === c3po.state_ad ? "dfp_video" === b.ad_type ? (c3po.isSelectedAffiliate() ? (c3po.current_settings.state = c3po.state_dfp_video_backfill, c3po.log("dfp video repeat "), "undefined" != typeof softgames && softgames._trackEvent("c3po-dfp-video-repeat"), b.dfp_video_ad_unit_code = "2nd_Preroll_call", c3po.invokeAdCall(b.ad_type)) : ("no-backfill" === b.dfp_video_backfill && (b.dfp_video_backfill = b.final_backfill_ad_type), c3po.current_settings.state = b.dfp_video_backfill == c3po.current_settings.final_backfill_ad_type ? c3po.state_final_backfill : c3po.state_backfill, c3po.log("backfilling with " + b.dfp_video_backfill), "undefined" != typeof softgames && softgames._trackEvent("c3po-backfill", b.ad_type + "->" + b.dfp_video_backfill), c3po.invokeAdCall(b.dfp_video_backfill)), voyagerAdContent = document.getElementsByClassName("voyager-ad-content")[0], void 0 !== voyagerAdContent && voyagerAdContent.children.length > 2 && null !== voyagerAdContent.children.adDiv && null !== voyagerAdContent.children.InfoDiv && (ad_div = document.getElementById("adDiv"), null !== ad_div && "video" == ad_div.getAttribute("type") && (ad_div.style.display = "none"))) : "direct_vast" === b.ad_type || "liverail" === b.ad_type || "smartclip" === b.ad_type ? ("no-backfill" === b[b.ad_type + "_backfill"] && (b[b.ad_type + "_backfill"] = b.final_backfill_ad_type), c3po.current_settings.state = b[b.ad_type + "_backfill"] === c3po.current_settings.final_backfill_ad_type ? c3po.state_final_backfill : c3po.state_backfill, "undefined" != typeof softgames && softgames._trackEvent("c3po-backfill", b.ad_type + "->" + b[b.ad_type + "_backfill"]), c3po.log("backfilling with " + b[b.ad_type + "_backfill"]), c3po.invokeAdCall(b[b.ad_type + "_backfill"])) : c3po.close_ad("ByErrorLoadAd") : b.state === c3po.state_dfp_video_backfill ? ("no-backfill" === b.dfp_video_backfill && (b.dfp_video_backfill = b.final_backfill_ad_type), c3po.current_settings.state = b.dfp_video_backfill == c3po.current_settings.final_backfill_ad_type ? c3po.state_final_backfill : c3po.state_backfill, c3po.log("backfilling with " + b.dfp_video_backfill), "undefined" != typeof softgames && softgames._trackEvent("c3po-backfill", b.ad_type + "->" + b.dfp_video_backfill), c3po.invokeAdCall(b.dfp_video_backfill), voyagerAdContent = document.getElementsByClassName("voyager-ad-content")[0], void 0 !== voyagerAdContent && voyagerAdContent.children.length > 2 && null !== voyagerAdContent.children.adDiv && null !== voyagerAdContent.children.InfoDiv && (ad_div = document.getElementById("adDiv"), null !== ad_div && "video" == ad_div.getAttribute("type") && (ad_div.style.display = "none"))) : b.state === c3po.state_backfill ? (c3po.log("final backfilling with " + b.final_backfill_ad_type), c3po.current_settings.state = c3po.state_final_backfill, "undefined" != typeof softgames && softgames._trackEvent("c3po-backfill", b[b.ad_type + "_backfill"] + "->final_backfill"), c3po.invokeAdCall(b.final_backfill_ad_type)) : b.state === c3po.state_final_backfill ? ("undefined" != typeof softgames && softgames._trackEvent("c3po-no-ad"), c3po.close_ad("ByErrorLoadAd")) : c3po.close_ad("ByErrorLoadAd"))
        },
        is_android: function() {
            return /(Android)/g.test(navigator.userAgent)
        },
        is_IOS: function() {
            return /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
        },
        is_tablet: function() {
            return /ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase())
        },
        is_mobile: function() {
            var a = !1;
            return function(b) {
                (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 4))) && (a = !0)
            }(navigator.userAgent || navigator.vendor || window.opera), a
        },
        load_css: function(a, b) {
            if (c3po.css_exists(a)) return c3po.log(a + " already exists - loading skipped"), void b();
            c3po.loadedStyles = document.styleSheets.length;
            var c = document.createElement("link");
            c.type = "text/css", c.href = a, c.rel = "stylesheet", "function" == typeof b && c3po.load_css_callback(b), document.getElementsByTagName("head")[0].appendChild(c)
        },
        load_css_callback: function(a) {
            var b = setInterval(function() {
                document.styleSheets.length > c3po.loadedStyles && (clearInterval(b), a())
            }, 10)
        },
        load_js: function(a, b) {
            if (c3po.js_exists(a)) return c3po.log(a + " already exists - loading skipped"), void b();
            var c = document.createElement("script");
            c.src = a, c.async = !0, c.type = "text/javascript", "function" == typeof b && (c.onreadystatechange = c.onload = function() {
                this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (c.onreadystatechange = c.onload = null, b())
            }), document.getElementsByTagName("head")[0].appendChild(c)
        },
        js_exists: function(a) {
            for (var b = document.getElementsByTagName("script"), c = 0; c < b.length; c++)
                if (b[c].src === a) return !0;
            return !1
        },
        css_exists: function(a) {
            for (var b = document.getElementsByTagName("link"), c = 0; c < b.length; c++)
                if (b[c].href === a) return !0;
            return !1
        },
        url_param: function(a, b) {
            return decodeURIComponent((new RegExp("[?|&]" + b + "=([^&;]+?)(&|#|;|$)").exec(a) || [, ""])[1].replace(/\+/g, "%20")) || null
        },
        log: function(a) {
            switch (typeof a) {
                case "string":
                    c3po.debugMode && console.log("[C3PO] " + a);
                    break;
                case "object":
                    c3po.debugMode && console.log("[C3PO] ", a)
            }
        },
        isSelectedAffiliate: function() {
            return whitelist = ["affiliate__tapjoy", "affiliate__matomy", "affiliate__tokenads", "fog.com", "m.fog.com", "funnygames", "bartosz_test", "bartosz_test_video", "bartosz_test_novideo"], whitelist.indexOf(c3po.current_settings.partner) >= 0
        },
        extend_obj: function(a, b) {
            for (var c in b) a[c] = b[c]
        }
    },
    googletag, c3po_mod_dfp = {
        debugMode: !1,
        header_code_initialized: !1,
        dfp_ad_container: null,
        init: function(a) {
            var b = a,
                c = document;
            c3po_mod_dfp.debugMode = b.debugMode, c3po_mod_dfp.dispatch_close_button(b), c3po_mod_dfp.execute_header_code(), c3po_mod_dfp.dfp_ad_container = document.createElement("div"), c3po_mod_dfp.dfp_ad_container.id = "ad_" + Math.round(1e5 * Math.random()), c.getElementById(b.ad_container_id) && (c3po_mod_dfp.addInternalCloseButton(a, c.getElementById(b.ad_container_id), function() {
                a.close_button.click()
            }), c.getElementById(b.ad_container_id).appendChild(c3po_mod_dfp.dfp_ad_container)), googletag.cmd.push(function() {
                if (googletag.defineSlot("/" + b.dfp_network_code + "/" + b.dfp_ad_unit_code, [b.dfp_ad_size.width, b.dfp_ad_size.height], c3po_mod_dfp.dfp_ad_container.id).addService(googletag.pubads()), c3po_mod_dfp.log("calling ad unit: " + b.dfp_ad_unit_code), c3po_mod_dfp.log("custom params: "), c3po_mod_dfp.log(b.custom_params), "object" == typeof b.custom_params)
                    for (var c in b.custom_params) googletag.pubads().setTargeting(c, b.custom_params[c]);
                googletag.enableServices(), a.display_close_button && (a.internalCloseButtonContainer.style.display = "block")
            }), googletag.cmd.push(function() {
                googletag.display(c3po_mod_dfp.dfp_ad_container.id)
            })
        },
        addInternalCloseButton: function(a, b, c) {
            a.internalCloseButtonContainer = document.createElement("div"), a.internalCloseButtonContainer.id = "c3po-close-button-container", a.internalCloseButton = document.createElement("button"), a.internalCloseButton.id = "c3po-close-button", a.internalCloseButtonText = document.createTextNode("Close Ad"), a.internalCloseButton.appendChild(a.internalCloseButtonText), a.internalCloseButtonContainer.appendChild(a.internalCloseButton), b.appendChild(a.internalCloseButtonContainer), a.internalCloseButton.addEventListener("touchstart", c), a.internalCloseButton.addEventListener("click", c), a.internalCloseButtonContainer.style.width = "100%", a.internalCloseButtonContainer.style.textAlign = "center", a.internalCloseButtonContainer.style.display = "none"
        },
        execute_header_code: function() {
            c3po_mod_dfp.header_code_initialized || (c3po_mod_dfp.header_code_initialized = !0, googletag = googletag || {}, googletag.cmd = googletag.cmd || [], function() {
                var a = document.createElement("script");
                a.async = !0, a.type = "text/javascript";
                var b = "https:" == document.location.protocol;
                a.src = (b ? "https:" : "http:") + "//www.googletagservices.com/tag/js/gpt.js";
                var c = document.getElementsByTagName("script")[0];
                c.parentNode.insertBefore(a, c)
            }())
        },
        dispatch_close_button: function(a) {
            null !== a.close_button && setTimeout(function() {
                a.close_button.style.visibility = "visible"
            }, a.close_button_delay)
        },
        log: function(a) {
            switch (typeof a) {
                case "string":
                    c3po_mod_dfp.debugMode && console.log("[C3PO MOD DFP] " + a);
                    break;
                case "object":
                    c3po_mod_dfp.debugMode && console.log("[C3PO MOD DFP] ", a)
            }
        }
    },
    c3po_mod_gca = {
        debugMode: !1,
        init: function(a) {
            c3po_mod_gca.debugMode = a.debugMode, c3po_mod_gca.dispatch_close_button(a), c3po.load_js("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
            var b = document.createElement("ins");
            b.setAttribute("class", "adsbygoogle"), b.setAttribute("style", "display:inline-block; width:" + a.ad_size.width + "px; height:" + a.ad_size.height + "px;"), b.setAttribute("data-ad-client", a.pub_id), b.setAttribute("data-ad-slot", a.ad_slot), a.ad_container && a.ad_container.appendChild(b), c3po_mod_gca.log("applying settings: "), c3po_mod_gca.log(a), (adsbygoogle = window.adsbygoogle || []).push({})
        },
        dispatch_close_button: function(a) {
            null !== a.close_button && setTimeout(function() {
                a.close_button.style.visibility = "visible"
            }, a.close_button_delay)
        },
        log: function(a) {
            switch (typeof a) {
                case "string":
                    c3po_mod_gca.debugMode && console.log("[C3PO MOD GCA] " + a);
                    break;
                case "object":
                    c3po_mod_gca.debugMode && console.log("[C3PO MOD GCA] ", a)
            }
        }
    },
    c3po_mod_ima = {
        debugMode: !1,
        debugImaSdk: !1,
        defaultCountdown: 15,
        tickInterval: .3,
        adsManager: null,
        adsLoader: null,
        adDisplayContainer: null,
        intervalReference: null,
        countdown: null,
        settings: null,
        isVideo: !1,
        init: function(a) {
            c3po_mod_ima.isDebugImaMode(), c3po_mod_ima.cleanUp(), c3po_mod_ima.settings = a, c3po_mod_ima.debugMode = c3po.debugMode, c3po_mod_ima.prepareLooks();
            var b = 0,
                c = function() {
                    b++, 2 == b && c3po_mod_ima.dispatchClickToPlay()
                },
                d = c3po_mod_ima.debugImaSdk ? "//s0.2mdn.net/instream/html5/ima3_debug.js" : "//s0.2mdn.net/instream/html5/ima3.js";
            c3po.load_css(a.asset_path + "c3po_mod_ima.css", c), c3po_mod_ima.log("loading ima sdk: " + d), c3po.load_js(d, c)
        },
        isDebugImaMode: function() {
            ("1" === c3po.url_param(location.search, "sg_debug") || "1" === c3po.url_param(location.search, "ima_debug")) && (c3po_mod_ima.debugImaSdk = !0)
        },
        addInternalCloseButton: function(a, b, c) {
            a.internalCloseButtonContainer = document.createElement("div"), a.internalCloseButtonContainer.id = "c3po-close-button-container", a.internalCloseButton = document.createElement("button"), a.internalCloseButton.id = "c3po-close-button", a.internalCloseButtonText = document.createTextNode("Close Ad"), a.internalCloseButton.style.zIndex = 10100, a.internalCloseButton.appendChild(a.internalCloseButtonText), a.internalCloseButtonContainer.appendChild(a.internalCloseButton), b.appendChild(a.internalCloseButtonContainer), a.internalCloseButton.addEventListener("touchstart", c), a.internalCloseButton.addEventListener("click", c), a.internalCloseButtonContainer.style.width = "100%", a.internalCloseButtonContainer.style.textAlign = "center", a.internalCloseButtonContainer.style.display = "none", a.internalCloseButtonContainer.style.marginBottom = a.internalCloseButtonContainer.offsetHeight + 10 + "px"
        },
        prepareLooks: function() {
            s = c3po_mod_ima.settings, null === document.getElementById("adDiv") ? (s.infoDiv = document.createElement("div"), s.infoDiv.id = "infoDiv", s.adDiv = document.createElement("div"), s.adDiv.id = "adDiv", s.adContainer && (s.adContainer.appendChild(s.infoDiv), c3po_mod_ima.addInternalCloseButton(s, s.adContainer, function() {
                c3po_mod_ima.closeAd("ByUser")
            }), s.adContainer.appendChild(s.adDiv))) : (s.infoDiv = document.getElementById("infoDiv"), s.adDiv = document.getElementById("adDiv"), s.adDiv.innerHTML = ""), s.video_requested ? s.adDiv.setAttribute("type", "video") : s.adDiv.removeAttribute("type"), s.adContainerBackupStyles = {}, s.adContainerBackupStyles.width = s.adContainer.style.width, s.adContainerBackupStyles.maxWidth = s.adContainer.style.maxWidth, s.adContainer.style.width = "100%", s.adContainer.style.maxWidth = "530px"
        },
        cleanUp: function() {
            c3po_mod_ima.isVideo = !1, c3po_mod_ima.settings && c3po_mod_ima.settings.adContainer && (c3po_mod_ima.settings.adContainer.innerHTML = "", c3po_mod_ima.settings.adContainer.style.width = c3po_mod_ima.settings.adContainerBackupStyles.width, c3po_mod_ima.settings.adContainer.style.maxWidth = c3po_mod_ima.settings.adContainerBackupStyles.maxWidth, c3po_mod_ima.adsManager && c3po_mod_ima.adsManager.destroy(), c3po_mod_ima.settings = c3po_mod_ima.adsManager = c3po_mod_ima.adsLoader = c3po_mod_ima.adDisplayContainer = c3po_mod_ima.adContainer = null), clearInterval(c3po_mod_ima.intervalReference)
        },
        dispatchClickToPlay: function() {
            c3po_mod_ima.settings.infoDiv.innerHTML = c3po_mod_ima.settings.video_requested ? "Watch video to start game..." : "Loading...";
            var a = c3po_mod_ima.settings.video_requested && !c3po_mod_ima.settings.skipPlayButton && (c3po.is_tablet() || c3po.is_mobile());
            if (c3po_mod_ima.log("mode = " + (a ? "clickToPlay" : "autoPlay")), a) {
                var b = document.createElement("a");
                b.id = "ima-click-to-play-button", b.href = "javascript:void(0);";
                var c = function() {
                    c3po_mod_ima.settings.infoDiv.innerHTML = "Loading...", b.removeEventListener("touchstart", c), b.style.visibility = "hidden", c3po_mod_ima.requestAds()
                };
                b.addEventListener("touchstart", c);
                var d = document.createElement("div");
                d.id = "ima-click-to-play-arrow", b.appendChild(d), c3po_mod_ima.settings.adDiv.appendChild(b)
            } else c3po_mod_ima.requestAds();
            c3po_mod_ima.settings.adDiv.style.display = "block"
        },
        startCountdown: function(a) {
            c3po_mod_ima.log("init countdown to " + a), c3po_mod_ima.countdown = a, c3po_mod_ima.intervalReference = setInterval(c3po_mod_ima.tick, 1e3 * c3po_mod_ima.tickInterval)
        },
        tick: function() {
            var a = c3po_mod_ima.adsManager.getRemainingTime();
            c3po_mod_ima.log("remaining time: " + a), -1 === a && (c3po_mod_ima.countdown = a = c3po_mod_ima.countdown - c3po_mod_ima.tickInterval), a = Math.round(a), !c3po_mod_ima.isVideo && 1 > a ? c3po_mod_ima.closeAd("ByTimeout") : c3po_mod_ima.settings.infoDiv.innerHTML = "Advertisement - will close in " + a
        },
        detect_dimensions: function() {
            var a = {
                    w: 0,
                    h: 0
                },
                b = window.getComputedStyle(c3po_mod_ima.settings.adDiv, null);
            return a.w = parseInt(b.getPropertyValue("width").slice(0, -2)), a.h = parseInt(b.getPropertyValue("height").slice(0, -2)), c3po_mod_ima.log("detected dimensions: " + a.w + " x " + a.h), a
        },
        setAdSize: function(a, b) {
            c3po_mod_ima.log("set ad size to: " + a + " x " + b), c3po_mod_ima.settings.adDiv.style.height = b + "px"
        },
        requestAds: function() {
            c3po_mod_ima.log(c3po_mod_ima.settings.vastTag), c3po_mod_ima.adDisplayContainer = new google.ima.AdDisplayContainer(c3po_mod_ima.settings.adDiv), c3po_mod_ima.adDisplayContainer.initialize(), c3po_mod_ima.adsLoader = new google.ima.AdsLoader(c3po_mod_ima.adDisplayContainer), c3po_mod_ima.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, c3po_mod_ima.onAdsManagerLoaded, !1), c3po_mod_ima.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, c3po_mod_ima.onAdError, !1);
            var a = new google.ima.AdsRequest;
            a.adTagUrl = c3po_mod_ima.settings.vastTag;
            var b = c3po_mod_ima.detect_dimensions();
            a.linearAdSlotWidth = b.w, a.linearAdSlotHeight = b.h, a.nonLinearAdSlotWidth = b.w, a.nonLinearAdSlotHeight = b.h, a.disableCompanionAds = !0;
            try {
                c3po_mod_ima.adsLoader.requestAds(a)
            } catch (c) {
                "undefined" != typeof softgames && softgames._trackEvent("requestAds-error", c), c3po_mod_ima.log("adsLoader-Error: " + c), c3po_mod_ima.onAdError()
            }
        },
        onAdsManagerLoaded: function(a) {
            c3po_mod_ima.log("Ad Event: adsmanager loaded");
            var b = new google.ima.AdsRenderingSettings;
            b.autoAlign = !0, b.useStyledNonLinearAds = !0, c3po_mod_ima.adsManager = a.getAdsManager(c3po_mod_ima.settings.adDiv, b), c3po_mod_ima.adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, c3po_mod_ima.onAdError), c3po_mod_ima.adsManager.addEventListener(google.ima.AdEvent.Type.CLICK, c3po_mod_ima.onAdClicked);
            var c = [google.ima.AdEvent.Type.ALL_ADS_COMPLETED, google.ima.AdEvent.Type.AD_METADATA, google.ima.AdEvent.Type.COMPLETE, google.ima.AdEvent.Type.FIRST_QUARTILE, google.ima.AdEvent.Type.LOADED, google.ima.AdEvent.Type.MIDPOINT, google.ima.AdEvent.Type.PAUSED, google.ima.AdEvent.Type.EXPANDED_CHANGED, google.ima.AdEvent.Type.STARTED, google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, google.ima.AdEvent.Type.THIRD_QUARTILE, google.ima.AdEvent.Type.USER_CLOSE, google.ima.AdEvent.Type.SKIPPED, google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED];
            for (var d in c) c3po_mod_ima.adsManager.addEventListener(c[d], c3po_mod_ima.onAdEvent, !1, this);
            try {
                var e = c3po_mod_ima.detect_dimensions();
                c3po_mod_ima.adsManager.init(e.w, e.h, google.ima.ViewMode.NORMAL), c3po_mod_ima.adsManager.start()
            } catch (f) {
                "undefined" != typeof softgames && softgames._trackEvent("onAdsManagerLoaded-error", f.getMessage()), c3po_mod_ima.onAdError(f)
            }
        },
        onAdClicked: function(a) {
            c3po_mod_ima.log("Ad event:"), c3po_mod_ima.log(a), c3po_mod_ima.closeAd("ByUserAdClicked")
        },
        onAdEvent: function(a) {
            c3po_mod_ima.log("Ad event: " + a.type);
            var b = a.getAd();
            switch (a.type) {
                case google.ima.AdEvent.Type.LOADED:
                    c3po_mod_ima.isVideo = b.isLinear(), b.isLinear() || (c3po_mod_ima.settings.display_close_button && (c3po_mod_ima.settings.internalCloseButtonContainer.style.display = "block"), c3po_mod_ima.setAdSize(b.getWidth(), b.getHeight()), c3po_mod_ima.startCountdown(c3po_mod_ima.defaultCountdown));
                    break;
                case google.ima.AdEvent.Type.STARTED:
                    b.isLinear() && c3po_mod_ima.startCountdown(c3po_mod_ima.adsManager.getRemainingTime());
                    break;
                case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                    c3po_mod_ima.closeAd("ByTimeout");
                    break;
                case google.ima.AdEvent.Type.USER_CLOSE:
                    c3po_mod_ima.closeAd("ByUser")
            }
        },
        onAdError: function(a) {
            a && ("undefined" != typeof softgames && softgames._trackEvent("ima-error", a.getError().toString()), c3po_mod_ima.log("Ad Error: " + a.getError())), c3po_mod_ima.cleanUp(), c3po.ad_error(a)
        },
        closeAd: function(a) {
            c3po_mod_ima.log("c3po_mod_ima: close ad"), setTimeout(function() {
                c3po_mod_ima.cleanUp()
            }, 500), setTimeout(function() {
                c3po.close_ad(a)
            }, 500)
        },
        log: function(a) {
            switch (typeof a) {
                case "string":
                    c3po_mod_ima.debugMode && console.log("[C3PO MOD IMA] " + a);
                    break;
                case "object":
                    c3po_mod_ima.debugMode && console.log("[C3PO MOD IMA] ", a)
            }
        }
    },
    c3po_mod_liverail = {
        debugMode: !1,
        ad_container: null,
        settings: {},
        init: function(a) {
            var b = document;
            if (c3po_mod_liverail.debugMode = a.debugMode, c3po_mod_liverail.ad_container = b.getElementById(a.ad_container_id), null !== c3po_mod_liverail.ad_container) {
                var c = window.getComputedStyle(b.body, null),
                    d = parseInt(c.getPropertyValue("width").slice(0, -2));
                d = d > 530 ? 530 : d, c3po_mod_liverail.ad_container.style.width = d + "px";
                var e = c3po.is_tablet() || c3po.is_mobile() && !c3po.is_IOS(),
                    f = "http://cdn-static.liverail.com/js/LiveRail.Interstitial-1.0.js?LR_PUBLISHER_ID=" + a.liverail_pub_id + "&allowClickToPlay=1&LR_VIDEO_ID=interstitial&LR_TITLE=interstitial&LR_LAYOUT_SKIN_ID=2&hideCompanion=1&width=" + d + "&LR_LAYOUT_SKIN_MESSAGE=Game%20starts%20in%20%7BCOUNTDOWN%7D";
                f += "&LR_AUTOPLAY=" + (e ? "0" : "1");
                var g = b.createElement("script");
                g.type = "text/javascript", g.language = "Javascript", g.src = f, c3po_mod_liverail.log("requesting " + f), c3po_mod_liverail.ad_container.appendChild(g)
            }
        },
        log: function(a) {
            switch (typeof a) {
                case "string":
                    c3po_mod_liverail.debugMode && console.log("[C3PO MOD LIVERAIL] " + a);
                    break;
                case "object":
                    c3po_mod_liverail.debugMode && console.log("[C3PO MOD LIVERAIL] ", a)
            }
        }
    },
    c3po_mod_smartclip = {
        debugMode: !1,
        ad_container: null,
        init: function(a) {
            c3po_mod_smartclip.debugMode = a.debugMode;
            var b = document;
            if (b.write = function(a) {
                c3po_mod_smartclip.ad_container.innerHTML += a
            }, c3po_mod_smartclip.ad_container = b.getElementById(a.ad_container_id), null !== c3po_mod_smartclip.ad_container) {
                var c = c3po_mod_smartclip.detect_video_size(c3po_mod_smartclip.ad_container),
                    d = c3po_mod_smartclip.select_tag_by_lang(a.language, c);
                if (c3po_mod_smartclip.log("used tag:"), c3po_mod_smartclip.log(d), c3po_mod_smartclip.log(!d), !d) return void c3po_mod_smartclip.ad_error("smartclip - No proper tag for language " + a.language);
                c3po_mod_smartclip.style_ad();
                var e = b.createElement("script");
                e.src = d, e.type = "text/javascript", e.language = "Javascript", c3po_mod_smartclip.ad_container.appendChild(e)
            }
        },
        detect_video_size: function(a) {
            var b = window.getComputedStyle(a, null),
                c = parseInt(b.getPropertyValue("width").slice(0, -2)),
                d = .75 * c;
            return {
                w: c,
                h: d
            }
        },
        select_tag_by_lang: function(a, b) {
            var c;
            switch (a) {
                case "de":
                    c = "http://ae.amgdgt.com/ads?t=de&p=9372&pl=bac0886f&kvp=u%3Dpub%3Dsoftgames&adwidth=" + b.w + "&adheight=" + b.h + "&rnd=" + Math.round(1e8 * Math.random());
                    break;
                case "es":
                    c = "http://ae.amgdgt.com/ads?t=de&p=9372&pl=c814785a&kvp=u%3Dpub%3Dsoftgames&adwidth=" + b.w + "&adheight=" + b.h + "&rnd=" + Math.round(1e8 * Math.random());
                    break;
                case "it":
                    c = "http://ae.amgdgt.com/ads?t=de&p=9372&pl=cee58e41&kvp=u%3Dpub%3Dsoftgames&adwidth=" + b.w + "&adheight=" + b.h + "&rnd=" + Math.round(1e8 * Math.random())
            }
            return c
        },
        style_ad: function() {
            var a = window.getComputedStyle(document.body, null),
                b = parseInt(a.getPropertyValue("width").slice(0, -2));
            c3po_mod_smartclip.ad_container.style.width = (b > 530 ? 530 : b) + "px"
        },
        ad_error: function(a) {
            c3po_mod_smartclip.log("Ad Error: " + a), c3po.ad_error(a)
        },
        log: function(a) {
            switch (typeof a) {
                case "string":
                    c3po_mod_smartclip.debugMode && console.log("[C3PO MOD SMARTCLIP] " + a);
                    break;
                case "object":
                    c3po_mod_smartclip.debugMode && console.log("[C3PO MOD SMARTCLIP] ", a)
            }
        }
    };