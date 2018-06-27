define('skytte.bounding_box', function() {
    function BoundingBox(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 0;
        this.height = h || 0;
    }

    BoundingBox.fromString = function(str) {
        var points = str.split(' ');
        var pos = points[0].split(',');
        var size = points[1].split(',');
        return new BoundingBox(parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(size[0]), parseFloat(size[1]));
    };

    BoundingBox.fromPolygon = function(polygon) {
        return (new BoundingBox()).fromPolygon(polygon);
    };

    BoundingBox.prototype.toString = function() {
        return '<Rectangle ' + this.x + ',' + this.y + ' ' + this.width + ',' + this.height + '>';
    };

    BoundingBox.prototype.fromPolygon = function(polygon) {
        var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE, i, p;

        for (i = 0; i < polygon.points.length; i++) {
            p = polygon.points[i];
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        }

        this.x = minX;
        this.y = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
        return this;
    };

    BoundingBox.prototype.copy = function() {
        return new BoundingBox(this.x, this.y, this.width, this.height);
    };

    BoundingBox.prototype.draw = function(context, x, y, lineColor) {
        context.save();
        context.strokeStyle = lineColor || '#fff';
        context.lineWidth = 1.25;
        context.strokeRect(x + this.x, y + this.y, this.width, this.height);
        context.restore();
    };

    return BoundingBox;
});
