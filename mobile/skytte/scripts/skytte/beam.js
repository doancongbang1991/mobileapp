define('skytte.beam', ['skytte.numbers', 'skytte.vector2'], function(numbers, Vector2) {

    function Beam(glowColor, maxOffset, rayCount, smoothness, start, end) {
        this.rays = [];
        for (var i = 0; i < rayCount; i++)
            this.rays.push([]);
        this.maxOffset = maxOffset;
        this.glowColor = glowColor;
        this.start = start || new Vector2();
        this.end = end || new Vector2();
        this.alpha = 0;
        this.smoothness = smoothness || 15;
    }

    Beam.prototype.update = function() {
        var i, middle = new Vector2(), offset = new Vector2(), current, next, maxOffset, segments, iterations, len = new Vector2();

        for (var r = 0; r < this.rays.length; r++) {
            this.rays[r] = segments = [this.start, this.end];
            maxOffset = this.maxOffset;
            iterations = Math.ceil(Math.sqrt(this.start.distanceTo(this.end) / this.smoothness));

            for (i = 0; i < iterations; i++) {
                for (s = 0; s < segments.length - 1; s += 2) {
                    current = segments[s];
                    next = segments[s + 1];
                    middle.x = (current.x + next.x) / 2;
                    middle.y = (current.y + next.y) / 2;
                    offset.x = current.x - next.x;
                    offset.y = current.y - next.y;
                    offset.normalize().perp().scale(Math.round(Math.random() * maxOffset * 2) - maxOffset);
                    middle.add(offset);
                    segments.splice(s + 1, 0, middle.copy());
                }
                maxOffset *= .8;
            }
        }

        this.alpha = .2 + Math.random() * .8;
    };

    Beam.prototype.draw = function(context, scale, x, y) {
        var r, i, j, segments;

        x = x || 0;
        y = y || 0;

        context.save();
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.globalAlpha = this.alpha;

        for (r = 0; r < this.rays.length; r++) {
            segments = this.rays[r];

            for (j = 0; j < 3; j++) {
                context.beginPath();
                for (i = 0; i < segments.length; i++)
                    context.lineTo(scale * (x + segments[i].x), scale * (y + segments[i].y));
                context.lineWidth = scale * (5 + j * 5);
                context.strokeStyle = this.glowColor;
                context.stroke();
            }

            context.beginPath();
            for (i = 0; i < segments.length; i++)
                context.lineTo(scale * (x + segments[i].x), scale * (y + segments[i].y));
            context.lineWidth = 3 * scale;
            context.strokeStyle = '#fff';
            context.stroke();
        }
        context.restore();
    }

    return Beam;
});
