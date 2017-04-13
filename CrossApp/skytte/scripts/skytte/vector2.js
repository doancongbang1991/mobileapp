define('skytte.vector2', function() {

    function Vector2() {
        this.set.apply(this, arguments);
    }

    Vector2.prototype.toString = function(decPlaces) {
        return '<Vector2 ' + this.x + ',' + this.y + '>';
    };

    Vector2.prototype.copy = function() {
        return new Vector2(this);
    };

    Vector2.prototype.set = function() {
        var pair = [0, 0];
        if (arguments.length === 1 && arguments[0].length && arguments[0].length === 2)
            // set([x, y])
            pair = arguments[0];
        else if (arguments.length === 1 && typeof arguments[0].x !== 'undefined' && typeof arguments[0].y !== 'undefined')
            // set({'x': x, 'y': y})
            pair = [arguments[0].x, arguments[0].y];
        else if (arguments.length === 2)
            // set(x, y)
            pair = arguments;
        this.x = pair[0];
        this.y = pair[1];
        return this;
    };

    Vector2.prototype.lengthSquared = function() {
        return this.x*this.x + this.y*this.y;
    };

    Vector2.prototype.length = function() {
        return Math.sqrt(this.lengthSquared());
    };

    Vector2.prototype.normalize = function() {
        var l = this.length();
        if (l > 0) {
            this.x /= l;
            this.y /= l;
        }
        return this;
    };

    Vector2.prototype.add = function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };

    Vector2.prototype.sub = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };

    Vector2.prototype.scale = function(x, y) {
        this.x *= x;
        this.y *= typeof y !== 'undefined' ? y : x;
        return this;
    };

    Vector2.prototype.div = function(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    };

    Vector2.prototype.dot = function(v) {
        return this.x*v.x + this.y*v.y;
    };

    Vector2.prototype.angle = function() {
        return Math.atan2(this.y, this.x);
    };

    Vector2.prototype.distanceTo = function(o) {
        var distance = new Vector2(o.x, o.y);
        return distance.sub(this).length();
    };

    /*
     * Rotate this vector by 90 degrees.
     */
    Vector2.prototype.perp = function() {
        var x = this.x;
        this.x = this.y;
        this.y = -x;
        return this;
    };

    Vector2.prototype.rotate = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var tempX = this.x;
        var tempY = this.y;
        this.x = tempX*cos - tempY*sin;
        this.y = tempX*sin + tempY*cos;
        return this;
    };

    Vector2.prototype.equals = function(o) {
        return (this.x == o.x && this.y == o.x);
    };

    Vector2.prototype.isCloseTo = function(v, tolerance) {
        if (this.equals(v))
            return true;
        return (new Vector2(this).sub(v)).lengthSquared() < tolerance * tolerance;
    };

    return Vector2;
});
