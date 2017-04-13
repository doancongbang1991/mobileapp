define('skytte.entity', ['skytte.numbers', 'skytte.vector2', 'skytte.bounding_box', 'skytte.polygon'], function(numbers, Vector2, BoundingBox, Polygon) {

    /*
     * Possible `kwargs` (Keyword Arguments) for Entity:
     * `box` - Bounding box for collision detection as string: 'X,Y W,H'
     * `polygon` - Polygon for collision detection as series of points: '0,0 12,15 30,15 ...'
     * `vx` - Horizontal velocity.
     * `vy` - Vertical velocity.
     */
    function Entity(game, name, x, y, kwargs) {
        // Reference to the whole world around this entity (usually `Game` instance).
        this.game = game;
        // Internal name, for debugging purposes.
        this.name = name;
        // Position in the game world.
        this.position = new Vector2(x, y);

        kwargs = kwargs || {};

        // Relatively positioned bounding box (optional, will be generated from polygon when not available).
        if (typeof kwargs.box === 'string')
            this.box = BoundingBox.fromString(kwargs.box);
        else if (kwargs.box)
            this.box = kwargs.box;

        // Relatively positioned polygon used for collision detection (optional).
        if (typeof kwargs.polygon === 'string') {
            this.polygon = Polygon.fromString(kwargs.polygon);
        } else if (kwargs.polygon)
            this.polygon = kwargs.polygon;

        if (this.polygon && !this.box)
            this.box = BoundingBox.fromPolygon(this.polygon);
        else if (!this.polygon && this.box)
            this.polygon = Polygon.fromBox(this.box);

        this.collectible = Boolean(kwargs.collectible);

        // Velocity in pixels per second.
        this.velocity = new Vector2(kwargs.vx || 0, kwargs.vy || 0);
        this.force = new Vector2(kwargs.fx || 0, kwargs.fy || 0);
        this.mass = kwargs.mass || 0;

        this.ai = kwargs.ai;
        // Number of team used to improve collision checking performance. Entities in the same team never collide.
        this.team = kwargs.team || 0;
        this.score = kwargs.score || 0;

        // Set this to true to remove entity from game world.
        this.killWhenOffScreen = typeof kwargs.killWhenOffScreen !== 'undefined' ? kwargs.killWhenOffScreen : true;
        this.dead = typeof kwargs.dead === 'undefined' ? false : kwargs.dead;
    }

    Entity.prototype.toString = function() {
        return '<' + this.name + '>';
    };

    Entity.prototype.getCenter = function() {
        if (this.box)
            return {'x': this.position.x + this.box.x + this.box.width/2,
                    'y': this.position.y + this.box.y + this.box.height/2};
        return {'x': this.position.x, 'y': this.position.y};
    };

    Entity.prototype.logic = function(timeDelta) {
        var worldW, worldH, center;
        if (this.ai)
            this.ai.logic(timeDelta);

        if (Math.abs(this.force.x) - this.mass * timeDelta <= 0)
            this.force.x = 0;
        else
            this.force.x -= numbers.sign(this.force.x) * this.mass * timeDelta;

        if (Math.abs(this.force.y) - this.mass * timeDelta <= 0)
            this.force.y = 0;
        else
            this.force.y -= numbers.sign(this.force.y) * this.mass * timeDelta;

        this.position.x += (this.velocity.x + this.force.x) * timeDelta;
        this.position.y += (this.velocity.y + this.force.y) * timeDelta;

        // Kill entities that are offscreen and aren't heading in screen's direction.
        if (this.killWhenOffScreen && this.game) {
            worldW = this.game.WORLD.WIDTH;
            worldH = this.game.WORLD.HEIGHT;
            center = this.getCenter();
            if ((center.x < -worldW/2 && this.velocity.x <= 0) ||
                (center.x > worldW*1.5 && this.velocity.x >= 0) ||
                (center.y < -worldH/2 && this.velocity.y <= 0) ||
                (center.y > worldH*1.5 && this.velocity.y >= 0)) {
                delete this.score;
                this.dead = true;
            }
        }
    };

    Entity.prototype.collidesWith = function(other) {};

    Entity.prototype.draw = function(context, scale, x, y) {
        if (this.game.debug) {
            context.save();
            context.scale(scale, scale);
            if (this.polygon)
                this.polygon.draw(context, this.position.x, this.position.y, this.hit && this.hit.value ? '#f00' : '#fff');
            if (this.box)
                this.box.draw(context, this.position.x, this.position.y, this.hit && this.hit.value ? '#f00' : '#fff');

            var center = this.getCenter();
            context.fillStyle = '#0ff';
            context.fillRect(center.x - 1, center.y - 1, 3, 3);
            context.restore();
        }
    };

    Entity.prototype.onRemove = function() {};

    return Entity;
});
