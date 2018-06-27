define('skytte.weapons.flak', ['skytte.numbers', 'skytte.bounding_box', 'skytte.polygon', 'skytte.weapons.weapon', 'skytte.weapons.projectile'],
       function(numbers, BoundingBox, Polygon, Weapon, Projectile) {

    function FlakProjectile(game, x, y, kwargs) {
        Projectile.apply(this, arguments);
        this.time = kwargs.time;
    }

    FlakProjectile.prototype = Object.create(Projectile.prototype);

    FlakProjectile.prototype.logic = function(timeDelta) {
        Projectile.prototype.logic.apply(this, arguments);
        this.time -= timeDelta * 1000;
        if (this.time <= 0)
            this.dead = true;
    };


    function FlakWeapon(game, ownerOrTeam, x, y, kwargs) {
        Weapon.apply(this, arguments);
        this.projectileSprite = this.game.getResource(kwargs.projectileSprite);
        this.radius = 300;
        this.spread = 20;
        this.bullets = [];
        this.bulletTime = 200;
        if (typeof kwargs.projectileSpeed !== 'undefined') {
            this.projectileSpeed = kwargs.projectileSpeed;
            this.projectileSpeedX = this.projectileSpeed;
            this.projectileSpeedY = this.projectileSpeed;
        } else {
            this.projectileSpeedX = kwargs.projectileSpeedX || 0;
            this.projectileSpeedY = kwargs.projectileSpeedY || 0;
        }

        var bulletPolygon = Polygon.fromString('-3,-3 3,-3 3,3 -3,3');
        var bulletBox = BoundingBox.fromPolygon(bulletPolygon);
        for (var i = 0; i < 100; i++)
            this.bullets.push(new FlakProjectile(this.game, 0, 0, {
                'sprite': this.projectileSprite, 'box': bulletBox, 'team': this.team,
                'polygon': bulletPolygon, 'weapon': this, 'dead': true}));
    };

    FlakWeapon.prototype = Object.create(Weapon.prototype);

    FlakWeapon.prototype.spawnProjectile = function() {
        var startX = this.position.x + this.owner.position.x + this.barrelOffset.x;
        var startY = this.position.y + this.owner.position.y + this.barrelOffset.y;
        var x, y, vx, vy, angle, distance, bullet;

        for (var i = 0; i < 50; i++) {
            bullet = this.bullets[i];
            if (bullet.dead) {
                angle = this.direction + Math.round(Math.random() * this.spread * 2) - this.spread;
                distance = Math.random();
                vx = Math.cos(numbers.radians(angle));
                vy = Math.sin(numbers.radians(angle));
                x = vx * distance * this.radius;
                y = vy * distance * this.radius;

                bullet.size = 2 - distance;
                bullet.position.x = startX + x;
                bullet.position.y = startY + y;
                bullet.velocity.x = this.projectileSpeedX + vx * 50 * Math.random();
                bullet.velocity.y = this.projectileSpeedY + vy * 50 * Math.random();
                bullet.time = 50 + this.bulletTime * Math.random() * 2;
                bullet.damage = this.damage * distance;
                bullet.dead = false;
                this.game.prependEntity(bullet);
            }
        }

        Weapon.prototype.spawnProjectile.apply(this, arguments);
    };

    return {'FlakWeapon': FlakWeapon, 'FlakProjectile': FlakProjectile};
});
