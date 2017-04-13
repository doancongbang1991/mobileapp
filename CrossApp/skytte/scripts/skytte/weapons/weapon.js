define('skytte.weapons.weapon', ['skytte.numbers', 'skytte.easings', 'skytte.vector2', 'skytte.tween', 'skytte.entity'], function(numbers, easings, Vector2, Tween, Entity) {
    function Weapon(game, ownerOrTeam, x, y, kwargs) {
        Entity.apply(this, [game, 'WeaponEntity', x, y, kwargs]);
        if (kwargs.fireSound)
            this.fireSound = this.game.getResource(kwargs.fireSound);
        this.fireSoundVolume = typeof kwargs.fireSoundVolume !== 'undefined' ? kwargs.fireSoundVolume : 1;
        this.sprite = this.game.getResource(kwargs.sprite);
        this.hitSprite = this.game.getResource(kwargs.hitSprite);
        this.direction = kwargs.direction || 0;
        if (typeof ownerOrTeam === 'number')
            this.team = ownerOrTeam;
        else {
            this.owner = ownerOrTeam;
            this.team = this.owner.team;
        }
        this.rateOfFire = kwargs.rateOfFire;
        this.barrelOffset = new Vector2(kwargs.barrelOffset);
        this.damage = kwargs.damage;
        this.level = kwargs.level || 1;
        this.delay = 0;
        this.shooting = false;
        if (this.rateOfFire > 0) {
            this.recoil = new Tween(0, 3, numbers.clip(100, 1000 / this.rateOfFire / 2, 500), easings.quadraticIn);
            this.recoil.toEnd();
        }
    }

    Weapon.prototype = Object.create(Entity.prototype);

    Weapon.prototype.spawnProjectile = function() {
        if (this.fireSound)
            this.fireSound.play({'volume': this.fireSoundVolume});
    };

    Weapon.prototype.startShooting = function() {
        this.shooting = true;
        this.delay = 1000 / this.rateOfFire / 1000;
    };

    Weapon.prototype.stopShooting = function() {
        this.shooting = false;
    };

    Weapon.prototype.getBarrel = function() {
        return {'x': this.position.x + this.owner.position.x + this.barrelOffset.x,
                'y': this.position.y + this.owner.position.y + this.barrelOffset.y};
    };

    Weapon.prototype.logic = function(timeDelta) {
        if (this.shooting && (this.delay <= 0 || this.rateOfFire <= 0)) {
            this.spawnProjectile();
            if (this.recoil) {
                this.recoil.restart();
                this.delay = 1000 / this.rateOfFire / 1000;
            }
        }

        if (this.recoil)
            this.recoil.logic(timeDelta);

        this.delay = Math.max(0, this.delay - timeDelta);
    };

    Weapon.prototype.draw = function(context, scale, x, y) {
        var dx, dy;
        var recoilOffsetX = Math.cos(numbers.radians(this.direction));
        var recoilOffsetY = Math.sin(numbers.radians(this.direction));

        if (this.recoil)
            dx = Math.floor((x + this.position.x + this.recoil.value*recoilOffsetX) * scale);
        else
            dx = Math.floor((x + this.position.x + 3*recoilOffsetX) * scale);

        if (this.recoil)
            dy = Math.floor((y + this.position.y + this.recoil.value*recoilOffsetY) * scale);
        else
            dy = Math.floor((y + this.position.y + 3*recoilOffsetY) * scale);

        this.sprite.draw(context, dx, dy);

        if (this.owner.hit.value) {
            context.save();
            context.globalAlpha = this.owner.hit.value;
            this.hitSprite.draw(context, dx, dy);
            context.restore();
        }

        if (this.game.debug) {
            context.save();
            context.scale(scale, scale);
            context.fillStyle = '#ff0';
            context.fillRect(x + this.position.x + this.barrelOffset.x - 1,
                             y + this.position.y + this.barrelOffset.y - 1, 3, 3);
            context.restore();
        }
    };

    return Weapon;
});
