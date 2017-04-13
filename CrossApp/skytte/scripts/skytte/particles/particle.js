define('skytte.particles.particle', ['skytte.numbers', 'skytte.vector2', 'skytte.entity'], function(numbers, Vector2, Entity) {

    function Particle(kwargs) {
        this.emitter = kwargs.emitter;
        this.position = new Vector2(kwargs.x, kwargs.y);

        // Velocity in pixels per second.
        this.velocity = new Vector2(kwargs.vx || 0, kwargs.vy || 0);
        this.force = new Vector2(kwargs.fx || 0, kwargs.fy || 0);
        this.mass = kwargs.mass || 0;

        // Set this to true to remove entity from game world.
        this.dead = typeof kwargs.dead === 'undefined' ? false : kwargs.dead;

        this.life = this.time = kwargs.life / 1000;
        this.color = kwargs.color;
        if (kwargs.sprite) {
            this.game = kwargs.game;
            this.sprite = this.game.getResource(kwargs.sprite);
        }
        this.size = kwargs.size;
    };

    Particle.prototype = Object.create(Entity.prototype);

    Particle.prototype.logic = function(timeDelta) {
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

        this.time -= timeDelta;
        this.p = Math.max(0, this.time / this.life);
        if (this.time <= 0)
            this.dead = true;
    };

    Particle.prototype.draw = function(context, scale, x, y) {
        if (this.sprite) {
            context.save();
            context.translate(scale * (x + this.position.x), scale * (y + this.position.y));
            if (this.size !== 1)
                context.scale(this.size, this.size);
            this.sprite.draw(context, -this.sprite.width/2, -this.sprite.height/2);
            context.restore();
        } else {
            context.beginPath();
            context.arc(Math.floor(scale * (x + this.position.x)), Math.floor(scale * (y + this.position.y)),
                        Math.floor(scale * this.size), 0, 2 * Math.PI);
            context.fillStyle = this.color;
            context.fill();
        }
    };

    return Particle;
});
