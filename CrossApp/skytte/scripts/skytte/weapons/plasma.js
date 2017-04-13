define('skytte.weapons.plasma', ['settings', 'skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.entity', 'skytte.weapons.weapon', 'skytte.weapons.projectile'],
    function(settings, numbers, BoundingBox, Polygon, Entity, Weapon, Projectile) {

    function PlasmaProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);
        this.rotationSpeed = -360;  // Number of degrees this projectile rotates per second.
        this.explodeSound = kwargs.explodeSound;
    }

    PlasmaProjectile.prototype = Object.create(Projectile.prototype);

    PlasmaProjectile.prototype.explode = function() {
        Projectile.prototype.explode.apply(this, arguments);
        this.game.addExplosion(this.position.x, this.position.y, 50, this.damage, this.team);
        this.explodeSound.play({'volume': settings('PLASMA_EXPLODE_VOLUME', 1)});
    };

    PlasmaProjectile.prototype.logic = function(timeDelta) {
        Projectile.prototype.logic.apply(this, arguments);
        this.angle += this.rotationSpeed * numbers.sign(this.velocity.x) * timeDelta;
    };


    function PlasmaWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileExplodeSound = this.game.getResource(kwargs.projectileExplodeSound);
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.initialProjectileSpeed = 350;
        this.projectilePolygon = Polygon.fromString('-10,-10 10,-10 10,10 -10,10');
        this.projectileBox = BoundingBox.fromPolygon(this.projectilePolygon);
    };

    PlasmaWeapon.prototype = Object.create(Weapon.prototype);

    PlasmaWeapon.prototype.spawnProjectile = function() {
        var x = this.position.x + this.owner.position.x + this.barrelOffset.x;
        var y = this.position.y + this.owner.position.y + this.barrelOffset.y;
        var config = {
            'vx': Math.cos(numbers.radians(this.direction)) * this.initialProjectileSpeed,
            'explodeSound': this.projectileExplodeSound,
            'sprite': this.projectileSprite,
            'box': this.projectileBox,
            'polygon': this.projectilePolygon,
            'damage': this.damage,
            'team': this.team
        };
        var bullet = new PlasmaProjectile(this.game, x, y, config);
        this.game.prependEntity(bullet);

        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };

    return {'PlasmaWeapon': PlasmaWeapon, 'PlasmaProjectile': PlasmaProjectile};
});
