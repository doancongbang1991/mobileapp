define('skytte.polygon', ['skytte.vector2'], function(Vector2) {
    /*
     * A *convex* clockwise polygon used in collision detection between objects.
     */
    function Polygon(points) {
        this.points = points;
        if (this.points)
            this.recalcNormals();
    };

    Polygon.fromCoords = function(coords) {
        points = [];
        for (var i = 0; i < coords.length; i++)
            points.push(new Vector2(coords[i][0], coords[i][1]));
        return new Polygon(points);
    };

    Polygon.fromString = function(coords) {
        var pointsStr = coords.split(' '), points = [], point;
        for (var i = 0; i < pointsStr.length; i++) {
            point = pointsStr[i].split(',');
            points.push(new Vector2(parseFloat(point[0]), parseFloat(point[1])));
        }
        return new Polygon(points);
    };

    Polygon.fromBox = function(box) {
        return (new Polygon()).fromBox(box);
    };

    Polygon.prototype.fromBox = function(box) {
        this.points = [
            new Vector2(box.x, box.y),
            new Vector2(box.x + box.width, box.y),
            new Vector2(box.x + box.width, box.y + box.height),
            new Vector2(box.x, box.y + box.height)
        ];
        return this.recalcNormals();
    };

    Polygon.prototype.toString = function(decPlaces) {
        return '<Polygon ' + this.points.join(' ') + '>';
    };

    Polygon.prototype.recalcNormals = function() {
        var i, p1, p2, edge = new Vector2(), normal = new Vector2();
        this.normals = [];
        for (i = 0; i < this.points.length; i++) {
            p1 = this.points[i];
            p2 = i < this.points.length - 1 ? this.points[i + 1] : this.points[0];
            edge.set(p2).sub(p1);
            normal.set(edge).perp().normalize();
            this.normals.push(normal.copy());
        }
        return this;
    };

    Polygon.prototype.draw = function(context, x, y, lineColor, normalsColor) {
        context.save();
        context.beginPath();
        for (var i = 0; i < this.points.length; i++)
            context.lineTo(x + this.points[i].x, y + this.points[i].y);
        context.closePath();
        context.lineWidth = 1.25;
        context.strokeStyle = lineColor || '#fff';
        context.stroke();

        context.beginPath();
        var current, next, midpoint = new Vector2();
        for (var i = 0; i < this.points.length; i++) {
            next = this.points[i < this.points.length - 1 ? i + 1 : 0];
            current = this.points[i];
            midpoint.x = (next.x + current.x) / 2;
            midpoint.y = (next.y + current.y) / 2;
            context.moveTo(x + midpoint.x, y + midpoint.y);
            context.lineTo(x + midpoint.x + this.normals[i].x*20,
                           y + midpoint.y + this.normals[i].y*20);
        }
        context.strokeStyle = normalsColor || '#f0f';
        context.stroke();
        context.restore();
    };

    return Polygon;
});
