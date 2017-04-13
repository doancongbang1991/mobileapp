define('skytte.particles.emitter', ['skytte.utils', 'skytte.numbers', 'skytte.entity', 'skytte.particles.particle'], function(utils, numbers, Entity, Particle) {

    var DEFAULTS = {
        'spawnCount': 0,
        'spawnSpeed': 0,
        'spawn': true,
        'particle': {
            'offsetX': 0,
            'offsetY': 0,
            'spreadX': 0,
            'spreadY': 0,
            'direction': 0,
            'directionSpread': 0,
            'size': 0,
            'sizeSpread': 0,
            'vx': 0,
            'vy': 0,
            'speed': 0,
            'speedSpread': 0,
            'mass': 0,
            'life': 0,
            'color': '#fff',
            'colors': null,
            'sprite': null,
            'logic': null
        }
    };

    function Emitter(game, x, y, kwargs) {
        Entity.apply(this, [game, 'EmitterEntity', x, y, kwargs]);
        kwargs = utils.merge(DEFAULTS, kwargs);
        if (kwargs.sprite)
            this.sprite = this.game.getResource(kwargs.sprite);
        this.spawnTime = 0;
        this.spawnCount = kwargs.spawnCount;
        this.spawnSpeed = kwargs.spawnSpeed;
        this.spawn = Boolean(kwargs.spawn);
        this.particle = kwargs.particle;
        this.particle.color = String(this.particle.color);
        this.stopped = false;
        if (kwargs.life)
            this.life = this.time = kwargs.life / 1000;

        this.particleTime = 1000 / this.spawnSpeed / 1000;
        this.particles = [];
    };

    Emitter.prototype = Object.create(Entity.prototype);

    Emitter.prototype.spawnParticle = function() {
        var direction = numbers.radians(this.particle.direction + (Math.random() - .5) * this.particle.directionSpread);
        var particleConfig = {
            'game': this.game,
            'emitter': this,
            'life': this.particle.life * (Math.random() + .5),
            'x': this.position.x + this.particle.offsetX + (Math.random() - .5) * this.particle.spreadX,
            'y': this.position.y + this.particle.offsetY + (Math.random() - .5) * this.particle.spreadY,
            'size': this.particle.size + (Math.random() - .5) * this.particle.sizeSpread,
            'vx': this.particle.vx + Math.cos(direction) * (this.particle.speed + (Math.random() - .5) * this.particle.speedSpread),
            'vy': this.particle.vy + Math.sin(direction) * (this.particle.speed + (Math.random() - .5) * this.particle.speedSpread),
            'color': this.particle.color,
            'mass': this.particle.mass,
            'sprite': this.particle.sprite
        };
        var particle = new Particle(particleConfig);
        this.particles.push(particle);
        return particle;
    };

    Emitter.prototype.stop = function() {
        this.stopped = true;
    };

    Emitter.prototype.logic = function(timeDelta) {
        Entity.prototype.logic.apply(this, arguments);

        if (!this.stopped) {
            if (this.spawn && !this.spawnCount) {
                this.spawnTime += timeDelta;
                var particlesToGenerate = Math.floor(this.spawnTime / this.particleTime);
                for (var i = 0; i < particlesToGenerate; i++)
                    this.spawnParticle();
                this.spawnTime -= particlesToGenerate * this.particleTime;
            }

            if (!this.spawn && this.spawnCount) {
                for (var i = 0; i < this.spawnCount; i++)
                    this.spawnParticle();
                this.stopped = true;
            }
        }

        var i = this.particles.length;
        while (--i >= 0)
            if (!this.particles[i].dead) {
                if (this.particle.logic)
                    this.particle.logic.apply(this.particles[i], arguments);
                else
                    this.particles[i].logic(timeDelta);
            } else
                this.particles.splice(i, 1);

        if (this.stopped && !this.particles.length)
            this.dead = true;

        this.time -= timeDelta;
        if (this.life) {
            this.p = Math.max(0, this.time / this.life);
            if (this.time <= 0)
                this.dead = true;
        }
    };

    Emitter.prototype.draw = function(context, scale, x, y) {
        context.save();
        x = x || 0;
        y = y || 0;

        for (var i = 0; i < this.particles.length; i++)
            if (this.particle.draw)
                this.particle.draw.apply(this.particles[i], [context, scale, x, y]);
            else
                this.particles[i].draw(context, scale, x, y);

        if (this.sprite)
            this.sprite.draw(context, scale * (x + this.position.x), scale * (y + this.position.y));

        if (this.game.debug) {
            context.fillStyle = '#f00';
            context.fillRect(scale * (x + this.position.x + this.particle.offsetX) - 1,
                             scale * (y + this.position.y + this.particle.offsetY) - 1, 3, 3);
        }
        context.restore();
    };

    return Emitter;
});
