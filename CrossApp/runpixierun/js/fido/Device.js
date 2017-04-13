var Fido = Fido || {};

Fido.Device = function()
{
    this.arora = false;
    this.chrome = false;
    this.epiphany = false;
    this.firefox = false;
    this.mobileSafari = false;
    this.ie = false;
    this.ieVersion = 0;
    this.midori = false;
    this.opera = false;
    this.safari = false;
    this.webApp = false;
    this.cocoonJS = false;
    this.android = false;
    this.chromeOS = false;
    this.iOS = false;
    this.linux = false;
    this.macOS = false;
    this.windows = false;
    this.desktop = false;
    this.pixelRatio = 0;
    this.iPhone = false;
    this.iPhone4 = false;
    this.iPad = false;
    this.blob = false;
    this.canvas = false;
    this.localStorage = false;
    this.file = false;
    this.fileSystem = false;
    this.webGL = false;
    this.worker = false;
    this.audioData = false;
    this.webAudio = false;
    this.ogg = false;
    this.opus = false;
    this.mp3 = false;
    this.wav = false;
    this.m4a = false;
    this.webm = false;
    
    var ua = navigator.userAgent;
    
    this._checkBrowser(ua);
    this._checkOS(ua);
    this._checkDevice(ua);
    this._checkAudio();
    this._checkFeatures();
};

Fido.Device.prototype._checkBrowser = function(ua)
{
    if (/Arora/.test(ua)) 
    {
        this.arora = true;
    } 
    else if (/Chrome/.test(ua)) 
    {
        this.chrome = true;
    } 
    else if (/Epiphany/.test(ua)) 
    {
        this.epiphany = true;
    } 
    else if (/Firefox/.test(ua)) 
    {
        this.firefox = true;
    } 
    else if (/Mobile Safari/.test(ua)) 
    {
        this.mobileSafari = true;
    } 
    else if (/MSIE (\d+\.\d+);/.test(ua)) 
    {
        this.ie = true;
        this.ieVersion = parseInt(RegExp.$1, 10);
    } 
    else if (/Midori/.test(ua)) 
    {
        this.midori = true;
    } 
    else if (/Opera/.test(ua)) 
    {
        this.opera = true;
    } 
    else if (/Safari/.test(ua)) 
    {
        this.safari = true;
    }

    // Native Application
    if (navigator['standalone']) 
    {
        this.webApp = true;
    }

    // CocoonJS Application
    if (navigator['isCocoonJS']) 
    {
        this.cocoonJS = true;
    }
}

Fido.Device.prototype._checkOS = function(ua) 
{
    if (/Android/.test(ua)) 
    {
        this.android = true;
    } 
    else if (/CrOS/.test(ua)) 
    {
        this.chromeOS = true;
    } 
    else if (/iP[ao]d|iPhone/i.test(ua)) 
    {
        this.iOS = true;
    } 
    else if (/Linux/.test(ua)) 
    {
        this.linux = true;
    } 
    else if (/Mac OS/.test(ua)) 
    {
        this.macOS = true;
    } 
    else if (/Windows/.test(ua)) 
    {
        this.windows = true;
    }

    if (this.windows || this.macOS || this.linux) 
    {
        this.desktop = true;
    }
}

Fido.Device.prototype._checkDevice = function()
{
    this.pixelRatio = window['devicePixelRatio'] || 1;
    this.iPhone = navigator.userAgent.toLowerCase().indexOf('iphone') !== -1;
    this.iPhone4 = (this.pixelRatio === 2 && this.iPhone);
    this.iPad = navigator.userAgent.toLowerCase().indexOf('ipad') !== -1;
}

Fido.Device.prototype._checkFeatures = function()
{
    if (typeof window['Blob'] !== 'undefined') this.blob = true;

    this.canvas = !!window['CanvasRenderingContext2D'];

    try
    {
        this.localStorage = !!localStorage.getItem;
    }
    catch (error)
    {
        this.localStorage = false;
    }

    this.file = !!window['File'] && !!window['FileReader'] && !!window['FileList'] && !!window['Blob'];
    this.fileSystem = !!window['requestFileSystem'];
    this.webGL = !!window['WebGLRenderingContext'];
    this.worker = !!window['Worker'];

    if ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled)
    {
        this.touch = true;
    }
}

Fido.Device.prototype._checkAudio = function()
{
    this.audioData = !!(window['Audio']);
    this.webaudio = !!(window['webkitAudioContext'] || window['AudioContext']);

    var audioElement = document.createElement('audio');
    var result = false;
    try
    {
        if (result = !!audioElement.canPlayType)
        {
            if (audioElement.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''))
            {
                this.ogg = true;
            }

            if (audioElement.canPlayType('audio/mpeg;').replace(/^no$/, ''))
            {
                this.mp3 = true;
            }

            // Mimetypes accepted:
            //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
            //   bit.ly/iphoneoscodecs
            if (audioElement.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''))
            {
                this.wav = true;
            }

            if (audioElement.canPlayType('audio/x-m4a;') || audioElement.canPlayType('audio/aac;').replace(/^no$/, ''))
            {
                this.m4a = true;
            }
        }
    } 
    catch (e) { }
}

Fido.Device.prototype.getInfo = function()
{
    var output = "DEVICE OUTPUT\n\n";
    
    output += "---\n";
    output += "Browser Info :: \n";
    output += "Arora : " + this.arora + "\n";
    output += "Chrome : " + this.chrome + "\n";
    output += "Epiphany : " + this.epiphany + "\n";
    output += "Firefox : " + this.firefox + "\n";
    output += "Mobile Safari : " + this.mobileSafari + "\n";
    output += "IE : " + this.ie;
    
    if(this.ie)
    {
        output += " (Version " + this.ieVersion + ")\n";
    }
    else
    {
        output += "\n";
    }
    
    output += "Midori : " + this.midori + "\n";
    output += "Opera : " + this.opera + "\n";
    output += "Safari : " + this.safari + "\n";
    output += "Web App : " + this.webApp + "\n";
    output += "CocoonJS : " + this.cocoonJS + "\n";
    output += "Android : " + this.android + "\n";
    output += "---\n";
    output += "Operating System :: \n";
    output += "Chrome OS : " + this.chromeOS + "\n";
    output += "iOS : " + this.iOS + "\n";
    output += "Linux : " + this.linux + "\n";
    output += "Mac OS : " + this.macOS + "\n";
    output += "Windows : " + this.windows + "\n";
    output += "Desktop : " + this.desktop + "\n";
    output += "---\n";
    output += "Device Type : \n";
    output += "Pixel Ratio : " + this.pixelRatio + "\n";
    output += "iPhone : " + this.iPhone + "\n";
    output += "iPhone 4 : " + this.iPhone4 + "\n";
    output += "iPad : " + this.iPad + "\n";
    output += "---\n";
    output += "Features :: \n";
    output += "Blob : " + this.blob + "\n";
    output += "Canvas : " + this.canvas + "\n";
    output += "LocalStorage : " + this.localStorage + "\n";
    output += "File : " + this.file + "\n";
    output += "File System : " + this.fileSystem + "\n";
    output += "WebGL : " + this.webGL + "\n";
    output += "Workers : " + this.worker + "\n";
    output += "---\n";
    output += "Audio :: \n";
    output += "AudioData : " + this.audioData + "\n";
    output += "WebAudio : " + this.webAudio + "\n";
    output += "Supports .ogg : " + this.ogg + "\n";
    output += "Supports Opus : " + this.opus + "\n";
    output += "Supports .mp3 : " + this.mp3 + "\n";
    output += "Supports .wav : " + this.wav + "\n";
    output += "Supports .m4a : " + this.m4a + "\n";
    output += "Supports .webm : " + this.webm;
    
    return output;
}