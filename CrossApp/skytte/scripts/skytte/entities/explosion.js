define('skytte.particles.explosion', ['skytte.utils', 'skytte.easings', 'skytte.bounding_box', 'skytte.polygon', 'skytte.weapons.projectile', 'skytte.particles.emitter'],
       function(utils, easings, BoundingBox, Polygon, Projectile, Emitter) {

    function SmokeEmitter() {
        Emitter.apply(this, arguments);
    }

    SmokeEmitter.prototype = Object.create(Emitter.prototype);

    SmokeEmitter.prototype.draw = function(context, scale, x, y) {
        Emitter.prototype.draw.apply(this, arguments);
        x = x || 0;
        y = y || 0;
        context.save();
        context.beginPath();
        context.arc(Math.floor(scale * (x + this.position.x)), Math.floor(scale * (y + this.position.y)),
                    Math.floor(scale * (1 + this.p * 5)), 0, 2 * Math.PI);
        context.fillStyle = '#fff';
        context.fill();
        context.restore();
    };

    var CLOUD = {
        'spawnCount': 20,
        'spawn': false,
        'particle': {
            'directionSpread': 360,
            'size': 30,
            'sizeSpread': 15,
            'speed': 100,
            'speedSpread': 50,
            'life': 650,
            'colors': ['#fff', '#fff', '#fff', '#eee', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666', '#555', '#444',
                       '#333'],
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                if (typeof this._originalSize === 'undefined')
                    this._originalSize = this.size;
                this.size = this._originalSize * easings.cubicInOut(this.p);
            },
            'draw': function(context, scale, x, y) {
                context.beginPath();
                context.arc(Math.floor(scale * (x + this.position.x)), Math.floor(scale * (y + this.position.y)),
                            Math.floor(scale * this.size), 0, 2 * Math.PI);
                context.fillStyle = this.emitter.particle.colors[Math.floor((1 - this.p) * 14)];
                context.fill();
            }
        }
    };

    var SMOKE = {
        'spawnSpeed': 5,
        'particle': {
            'direction': 270,
            'life': 250,
            'colors': ['#fff', '#eee', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666', '#555', '#444',
                       '#333','#222', '#111'],
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = 1 + this.p * this.emitter.p * 8;
            },
            'draw': function(context, scale, x, y) {
                context.beginPath();
                context.arc(Math.floor(scale * (x + this.position.x)), Math.floor(scale * (y + this.position.y)),
                            Math.floor(scale * this.size), 0, 2 * Math.PI);
                context.fillStyle = this.emitter.particle.colors[Math.floor((1 - this.p) * 14)];
                context.fill();
            }
        },
        'life': 1000
    };


    function Explosion(game, x, y, kwargs) {
        kwargs = kwargs || {};
        Projectile.apply(this, [game, x, y, kwargs]);
        this.maxDamage = this.damage = kwargs.damage;
        this.life = 1;
        this.radius = kwargs.radius;
        this.box = new BoundingBox(-this.radius, -this.radius, this.radius*2, this.radius*2);
        this.polygon = Polygon.fromBox(this.box);
    }

    Explosion.prototype = Object.create(Projectile.prototype);

    Explosion.prototype.collidesWith = function(other) {
        var ShipEntity = require('skytte.entities.ship');
        if (other instanceof ShipEntity && this.team !== other.team) {
            var otherCenter = other.getCenter();
            var recoil = this.position.copy().sub(otherCenter);
            var distance = recoil.length();
            other.force.add(recoil.normalize().scale(-Math.max(0, this.radius - distance)));
        }
    };

    Explosion.prototype.logic = function(timeDelta) {
        this.life--;
        if (this.life < 0) {
            for (var i = 0; i < 4; i++) {
                var smoke = new SmokeEmitter(this.game, this.position.x, this.position.y, SMOKE);
                smoke.force.x = Math.random() - .5;
                smoke.force.y = Math.random() - .5;
                smoke.force.scale(400);
                this.game.prependForeground(smoke);
            }

            var size = this.radius/3;
            var speed = size*4;
            var cloudConfig = utils.merge(CLOUD, {
                'spawnCount': this.radius/15,
                'particle': {
                    'speed': speed,
                    'speedSpread': speed/2,
                    'size': size,
                    'sizeSpread': size/2,
                }});

            this.game.prependForeground(new Emitter(this.game, this.position.x, this.position.y, cloudConfig));
            this.dead = true;
        } else
            Projectile.prototype.logic.apply(this, arguments);
    };

    return Explosion;
});
