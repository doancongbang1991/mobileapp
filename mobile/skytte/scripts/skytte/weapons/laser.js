define('skytte.weapons.laser', ['skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.weapons.weapon', 'skytte.weapons.projectile', 'skytte.weapons.storm'],
       function(numbers, BoundingBox, Polygon, Weapon, Projectile, storm) {

    function LaserWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.projectilePolygon = kwargs.projectilePolygon;
        this.projectileBox = BoundingBox.fromPolygon(this.projectilePolygon);
        if (typeof kwargs.projectileSpeed !== 'undefined')
            this.projectileSpeed = kwargs.projectileSpeed;
        else {
            this.projectileSpeedX = kwargs.projectileSpeedX;
            this.projectileSpeedY = kwargs.projectileSpeedY;
        }
    };

    LaserWeapon.prototype = Object.create(Weapon.prototype);

    LaserWeapon.prototype.spawnProjectile = function() {
        var dir = numbers.radians(this.direction);
        var x = this.position.x + this.owner.position.x + this.barrelOffset.x;
        var y = this.position.y + this.owner.position.y + this.barrelOffset.y;
        var vx, vy;
        if (typeof this.projectileSpeed !== 'undefined') {
            vx = this.projectileSpeed * Math.cos(dir);
            vy = this.projectileSpeed * Math.sin(dir);
        } else {
            vx = this.projectileSpeedX;
            vy = this.projectileSpeedY;
        }
        var config = {'sprite': this.projectileSprite, 'polygon': this.projectilePolygon, 'team': this.team,
                      'box': this.projectileBox, 'vx': vx, 'vy': vy, 'damage': this.damage};
        var bullet = new storm.StormProjectile(this.game, x, y, config);
        this.game.prependEntity(bullet);
        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };

    return {'LaserWeapon': LaserWeapon};
});
