define('skytte.weapons.rockets', ['settings', 'skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.particles.particle', 'skytte.particles.emitter', 'skytte.weapons.weapon', 'skytte.weapons.projectile'],
       function(settings, numbers, BoundingBox, Polygon, Particle, Emitter, Weapon, Projectile) {

    var SMOKE = {
        'spawnSpeed': 50,
        'particle': {
            'direction': 270,
            'spreadY': 8,
            'spreadX': 8,
            'speed': 0,
            'life': 500,
            'color': '#fff',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 5;
            }
        }
    };

    function RocketProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);
        this.turningSpeed = 135;  // How fast rocket can turn in degrees per second.
        this.minSpeed = kwargs.minSpeed;
        this.speed = kwargs.speed;
        this.maxSpeed = kwargs.maxSpeed;
        this.acceleration = kwargs.acceleration;
        this.explosionRadius = kwargs.explosionRadius;
        this.smoke = new Emitter(this.game, this.position.x, this.position.y, SMOKE);
        this.game.prependEntity(this.smoke);
        this.target = null;
        this.searchAfter = 50;  // Number of pixels rocket must to travel before first target will be searched for.
        this.distance = 0;  // Number of pixels rocket has travelled.
        this.maxDistance = game.WORLD.WIDTH * 2;  // Max distance rocket can travel.
        this.explodeSound = kwargs.explodeSound;
        this.flyingSound = kwargs.flyingSound;
        this._flyingSoundInstance = this.flyingSound.playLoop({'volume': settings('ROCKET_FLYING_VOLUME', 1)});
    }

    RocketProjectile.prototype = Object.create(Projectile.prototype);

    RocketProjectile.prototype.searchForTarget = function() {
        /*
         * Find closest enemy ship.
         */
        var ShipEntity = require('skytte.entities.ship');
        var x = this.position.x, y = this.position.y, projectile = this;
        var result = this.game.findClosest(this.position.x, this.position.y, ShipEntity, 0, function(target) {
            return target.team && projectile.team !== target.team && target.position.x > projectile.position.x;
        });
        this.target = result.target;
    };

    RocketProjectile.prototype.explode = function() {
        if (!this.dead) {
            this.smoke.dead = this.dead = true;
            this.smoke.stop();
            this.smoke = null;
            this.game.addExplosion(this.position.x, this.position.y, this.explosionRadius, this.damage, this.team);
            this.explodeSound.play({'volume': settings('ROCKET_EXPLODE_VOLUME', 1)});
        }
    };

    RocketProjectile.prototype.onRemove = function() {
        this._flyingSoundInstance.stop();
    };

    RocketProjectile.prototype.logic = function(timeDelta) {
        if (this.distance >= this.searchAfter && (!this.target || (this.target && this.target.dead)))
            this.searchForTarget();

        if (this.target) {
            var targetCenter = this.target.getCenter();
            var targetAngle = numbers.degrees(Math.atan2(targetCenter.y - this.position.y, targetCenter.x - this.position.x));
            var diff = targetAngle - this.angle;
            var dist = Math.abs(diff);
            if (diff > 180)
                diff -= 360;
            else if (diff < -180)
                diff += 360;
            var change = numbers.sign(diff) * this.turningSpeed * timeDelta;
            if (Math.abs(change) > dist)
                change = dist * numbers.sign(change);
            this.angle += change;
        }

        var dir = numbers.radians(this.angle);

        this.speed = numbers.clip(this.minSpeed, this.speed + this.acceleration*timeDelta, this.maxSpeed);
        this.velocity.x = Math.cos(dir) * this.speed;
        this.velocity.y = Math.sin(dir) * this.speed;
        this.distance += (Math.abs(this.velocity.x) + Math.abs(this.velocity.y)) * timeDelta;
        Projectile.prototype.logic.apply(this, arguments);
        this.smoke.position.x = this.position.x + Math.cos(dir) * -20;
        this.smoke.position.y = this.position.y + Math.sin(dir) * -20;
        if (this.dead)
            this.smoke.dead = true;

        if (this.game.player) {
            var pan = this.game.getPanForPosition(this.position, this.game.player.getCenter().x);
            this._flyingSoundInstance.setPan(pan);
        }
        this._flyingSoundInstance.setVolume((1 - this.distance / this.maxDistance) * .1);

        if (this.distance >= this.maxDistance || this.position.y <= 0 || this.position.y >= this.game.WORLD.HEIGHT - 1)
            this.explode();
    };


    function RocketsWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.rocketFlyingSound = this.game.getResource(kwargs.rocketFlyingSound);
        this.rocketExplodeSound = this.game.getResource(kwargs.rocketExplodeSound);
        this.minProjectileSpeed = 200;
        this.initialProjectileSpeed = 200;
        this.maxProjectileSpeed = 700;
        this.projectileAccel = 200;
        this.explosionRadius = 75;
        this.projectilePolygon = Polygon.fromString('-7,-7 7,-7 7,7 -7,7');
        this.projectileBox = BoundingBox.fromPolygon(this.projectilePolygon);
    };

    RocketsWeapon.prototype = Object.create(Weapon.prototype);

    RocketsWeapon.prototype.spawnProjectile = function() {
        var barrel = this.getBarrel();
        var config = {
            'team': this.team,
            'sprite': this.projectileSprite,
            'flyingSound': this.rocketFlyingSound,
            'explodeSound': this.rocketExplodeSound,
            'damage': this.damage,
            'minSpeed': this.minProjectileSpeed,
            'speed': this.initialProjectileSpeed,
            'maxSpeed': this.maxProjectileSpeed,
            'acceleration': this.projectileAccel,
            'explosionRadius': this.explosionRadius,
            'box': this.projectileBox,
            'polygon': this.projectilePolygon
        };
        this.game.prependEntity(new RocketProjectile(this.game, barrel.x, barrel.y, config));

        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };

    return {'RocketsWeapon': RocketsWeapon, 'RocketProjectile': RocketProjectile};
});
