
// Controls game div margins or containing iframe size
//
//                  ..............embedded.................................     full screen
//                  iframe sizes game   game sizes iframe   initial size
//
// fixed size                           w, h                Wc, Hc | default*   4 margins**
// scalable         w                   h                   Wf, Wf/aspect*      2 margins
// responsive       w                   h***                Wf, Wf/aspect*      0 margins
// adaptive         w                   h                   Wf, Wf/aspect*      0 margins
// error message    w                   h                   Wf, Wf/aspect*      0 margins

// * where Wc,Hc = configured size; aspect = Wc:Hc, defaulting to 18:11 Wf is frame width.
// ** Should show error message if doesn't fit in screen?
// *** Game may request height changes.

define(function() {
    "use strict";

    function setSize(gameContainerId, configuredWidth, configuredHeight, scale, adaptive) {

        var gameHolder = document.getElementById(gameContainerId);
        configuredWidth = parseInt(configuredWidth) || 720;
        configuredHeight = parseInt(configuredHeight) || 440;

        function ogResizeFrame(width, height) {
            if (width) configuredWidth = width;
            if (height) configuredHeight = height;
            var w = width || '';
            var h = height || '';
            window.parent.postMessage('og.resizeFrame|'+w+'|'+h, '*');
        }
        if (window.og) { // window.og doesn't exist on error pages.
            window.og.resizeFrame = ogResizeFrame;
        }

        function updateSize() {
            if (isFullScreen()) {
                setMargins(gameHolder, configuredWidth, configuredHeight, scale, adaptive);
            } else {
                fitIframe(gameHolder, configuredWidth, configuredHeight, scale, adaptive);
            }
        }

        function attachResizeListenerForNonAdaptiveGames(resizeCallback) {
            if (!adaptive) {
                monitorResize(resizeCallback);
            }
        }   

        updateSize();

        attachResizeListenerForNonAdaptiveGames(updateSize);
    }

    function setMargins(gameHolder, configuredWidth, configuredHeight, scale, adaptive) {
        // For full screen ONLY.
        if (adaptive) {
            // Game fills available space
            gameHolder.setAttribute("style", "width:100%; height:100%;");
        }
        else {
            var width = configuredWidth;
            var height = configuredHeight;
            var winWidth = window.innerWidth;
            var winHeight = window.innerHeight;
            if (scale) {
                var ratio = configuredWidth/configuredHeight;
                var isTallWindow = winWidth / winHeight < ratio;
                width = isTallWindow ? winWidth : winHeight*ratio;
                height = isTallWindow ? winWidth/ratio : winHeight;
            }
            var marginLeft = Math.max(0, Math.round(winWidth - width) / 2);
            var marginTop = Math.max(0, Math.round(winHeight - height) / 2);
            gameHolder.style.width = width + "px";
            gameHolder.style.height = height + "px";
            gameHolder.style.marginTop = marginTop + "px";
            gameHolder.style.marginLeft = marginLeft + "px";
        }
    }

    function fitIframe(gameHolder, configuredWidth, configuredHeight, scale, adaptive) {
        if (scale || adaptive) {
            uniformScaleToFitWidth(gameHolder, configuredWidth, configuredHeight);
        }
        else {
            setFixedSizeFrame(gameHolder, configuredWidth, configuredHeight);
        }
    }

    function uniformScaleToFitWidth(gameHolder, configuredWidth, configuredHeight) {
        var winWidth = windowInnerWidth();
        var height = Math.round(winWidth * configuredHeight / configuredWidth);
        setIframeSize(undefined, height);
        gameHolder.style.width = "100%";
        gameHolder.style.height = "100%";
    }

    function setFixedSizeFrame(gameHolder, width, height) {
        setIframeSize(width, height);
        gameHolder.style.width = width + "px";
        gameHolder.style.height = height + "px";
    }

    function monitorResize(onResizeFunc) {
        // If we're embedded, we only react to width changes.
        var lastWidth = -1;
        var resizeThrottleTimeout = null;

        addResizeListener(function() {
            var winWidth = windowInnerWidth();
            if (winWidth !== lastWidth || isFullScreen()) {
                lastWidth = winWidth;
                window.clearTimeout(resizeThrottleTimeout);
                resizeThrottleTimeout = window.setTimeout(onResizeFunc, 100);
            }
        });
    }

    function windowInnerWidth() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    function addResizeListener(callback) {
        if (window.addEventListener) {
            window.addEventListener('resize', callback);
        }
        else {
            window.attachEvent('onresize', callback); //IE8
        }
    }

    function setIframeSize(optionalWidth, height) {
        var width = optionalWidth || '';
        window.parent.postMessage('og.resizeFrame|'+width+'|'+height, '*');
    }

    function isFullScreen() {
        return window === window.top;
    }

    return setSize;
});