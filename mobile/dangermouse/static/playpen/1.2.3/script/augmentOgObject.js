window.og.resizeFrame = function(width, height) {
    throw "Called the un-patched og.resizeFrame(). The setSize() function should have updated this.";
}

window.og.goFullScreen = function() {
   window.parent.postMessage('og.goFullScreen|'+window.og.gid, '*');
}

window.og.isFullScreen = (window.top === window.self);
