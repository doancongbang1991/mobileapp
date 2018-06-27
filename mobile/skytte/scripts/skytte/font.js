define('skytte.font', ['skytte.sprite'], function(Sprite) {

    /*
     * Bitmap font rendering (currently numbers only and fixed width fonts).
     * `chars` is string with all characters available in the font file, example: '+0123456789x'.
     * `widths` is mapping between characters and character width in pixels.
     */
    function Font(url, kwargs) {
        Sprite.apply(this, [url]);
        this.chars = kwargs.chars;
        this.widths = kwargs.widths;
        this.colors = kwargs.colors || 1;
        this.spacing = kwargs.spacing || 0;
        this.positions = {};

        var i, c, x = 0;
        for (i = 0; i < this.chars.length; i++) {
            c = this.chars[i];
            this.positions[c] = x;
            x += this.widths[c];
        }
    }

    Font.prototype = Object.create(Sprite.prototype);

    Font.prototype._onLoad = function() {
        Sprite.prototype._onLoad.apply(this, arguments);
        this.height = this.image.height / this.colors;
    };

    Font.prototype.textWidth = function(text) {
        var c, width = 0;
        for (var i = 0; i < text.length; i++)
            width += this.widths[text[i]] + this.spacing;
        return width;
    };

    Font.prototype.drawText = function(context, text, color, x, y, align) {
        if (align === 'center')
            x -= this.textWidth(text) / 2;
        if (align === 'right')
            x -= this.textWidth(text);
        x = Math.floor(x);
        y = Math.floor(y);
        var c, srcY = this.height * color;
        for (var i = 0; i < text.length; i++) {
            c = text[i];
            context.drawImage(this.image, this.positions[c], srcY, this.widths[c], this.height, x, y,
                              this.widths[c], this.height);
            x += this.widths[c] + this.spacing;
        }
    };

    return Font;
});
