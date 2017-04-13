define('skytte.weapons.storm', ['skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.weapons.weapon', 'skytte.weapons.projectile'],
       function(numbers, BoundingBox, Polygon, Weapon, Projectile) {

    function StormProjectile() {
        Projectile.apply(this, arguments);
    }

    StormProjectile.prototype = Object.create(Projectile.prototype);


    function StormWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileSpread = kwargs.projectileSpread || 100;
        this.projectileCount = kwargs.projectileCount || 3;
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.projectilePolygon = Polygon.fromString('-15,-5 15,-5 15,5 -15,5');
        this.projectileBox = BoundingBox.fromPolygon(this.projectilePolygon);
        this.initialProjectileSpeed = 700;
    };

    StormWeapon.prototype = Object.create(Weapon.prototype);

    StormWeapon.prototype.spawnProjectile = function() {
        var x = this.position.x + this.owner.position.x + this.barrelOffset.x;
        var y = this.position.y + this.owner.position.y + this.barrelOffset.y;
        var vx = this.initialProjectileSpeed * .75;
        var vy = -this.projectileSpread / 2;
        var vyi = this.projectileSpread / (this.projectileCount - 1);
        var config;

        for (var i = 0; i < this.projectileCount; i++) {
            config = {'sprite': this.projectileSprite, 'polygon': this.projectilePolygon, 'box': this.projectileBox,
                      'vx': vx + Math.random() * this.initialProjectileSpeed / 2, 'vy': vy + i*vyi, 'damage': this.damage, 'team': this.team};
            this.game.prependEntity(new StormProjectile(this.game, x, y, config));
        }

        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };

    return {'StormWeapon': StormWeapon, 'StormProjectile': StormProjectile};
});
