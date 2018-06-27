define('skytte.entities.ship', ['settings', 'skytte.numbers', 'skytte.easings', 'skytte.tween', 'skytte.entity', 'skytte.weapons.projectile', 'skytte.particles.emitter', 'skytte.particles.explosion'],
       function(settings, numbers, easings, Tween, Entity, Projectile, Emitter, Explosion) {

    /*
     * Possible `kwargs` (Keyword Arguments) for ShipEntity:
     * `health` - Amount of hit points.
     * `shield` - Hit points of the ship's shield.
     * `engines` - List of ship's particle emitters.
     * `weapons` - List of ship's weapons. Can be empty.
     * `speed` - Speed of the ship
     */
    function ShipEntity(game, x, y, kwargs) {
        Entity.apply(this, [game, 'ShipEntity', x, y, kwargs]);
        if (kwargs.explosionSound)
            this.explosionSound = this.game.getResource(kwargs.explosionSound);
        this.sprite = this.game.getResource(kwargs.sprite);
        this.hitSprite = this.game.getResource(kwargs.hitSprite);
        this.shieldSprite = this.game.getResource(kwargs.shieldSprite);
        if (kwargs.invincibleShieldSprite)
            this.invincibleShieldSprite = this.game.getResource(kwargs.invincibleShieldSprite);
        this.health = this.maxHealth = kwargs.health;
        // Speed of health regeneration in health points per second.
        this.healthPerSecond = kwargs.healthPerSecond || 0;
        this.shield = this.maxShield = kwargs.shield;
        this.shieldLevel = 1;
        // Speed of shield regeneration in health points per second.
        this.shieldPerSecond = kwargs.shieldPerSecond || 0;
        this.regenerationDelay = 1500;

        this.engines = [];
        if (kwargs.engines)
            for (var i = 0; i < kwargs.engines.length; i++)
                this.engines.push(new Emitter(this.game, kwargs.engines[i].x, kwargs.engines[i].y,
                                              kwargs.engines[i].emitter));

        this.weapons = [];
        if (kwargs.weapons)
            for (var i = 0; i < kwargs.weapons.length; i++)
                this.weapons.push(new kwargs.weapons[i].weapon.cls(this.game, this, kwargs.weapons[i].x,
                                                                   kwargs.weapons[i].y, kwargs.weapons[i].weapon));

        this.speed = kwargs.speed || 0;
        this.explosionRadius = kwargs.explosionRadius || 0;
        this.explosionDamage = kwargs.explosionDamage || 0;
        this.score = kwargs.score || 0;
        this.invincibleTime = kwargs.invincibleTime || 0;
        this.hit = new Tween(0, 0, 250, easings.quadraticOut);  // Opacity of the white hit image.
        this.hit.toEnd();
        this.powerUps = kwargs.powerUps;
        this._invincibilitySound = this.game.getResource('soundPlayerInvincibility');
        this.angle = 0;
    }

    ShipEntity.prototype = Object.create(Entity.prototype);

    ShipEntity.prototype.hasWeapon = function() {
        return this.weapons && this.weapons.length > 0;
    };

    ShipEntity.prototype.startShooting = function() {
        for (var i = 0; i < this.weapons.length; i++)
            this.weapons[i].startShooting();
    };

    ShipEntity.prototype.stopShooting = function() {
        for (var i = 0; i < this.weapons.length; i++)
            this.weapons[i].stopShooting();
    };

    ShipEntity.prototype.moveUp = function(scale) {
        if (typeof scale === 'undefined')
            scale = 1;
        this.velocity.y = Math.max(this.velocity.y - this.speed*scale, -this.speed);
    };

    ShipEntity.prototype.moveDown = function(scale) {
        if (typeof scale === 'undefined')
            scale = 1;
        this.velocity.y = Math.min(this.velocity.y + this.speed*scale, this.speed);
    };

    ShipEntity.prototype.moveLeft = function(scale) {
        if (typeof scale === 'undefined')
            scale = 1;
        this.velocity.x = Math.max(this.velocity.x - this.speed*scale, -this.speed);
    };

    ShipEntity.prototype.moveRight = function(scale) {
        if (typeof scale === 'undefined')
            scale = 1;
        this.velocity.x = Math.min(this.velocity.x + this.speed*scale, this.speed);
    };

    ShipEntity.prototype.logic = function(timeDelta) {
        var particle, i;

        this.regenerationDelay -= timeDelta * 1000;

        if (this.regenerationDelay<= 0 && this.shieldPerSecond && this.maxShield)
            this.shield = Math.min(this.maxShield, this.shield + this.shieldPerSecond * timeDelta);
        if (this.regenerationDelay<= 0 && this.healthPerSecond && this.maxShield)
            this.health = Math.min(this.maxHealth, this.health + this.healthPerSecond * timeDelta);

        Entity.prototype.logic.apply(this, arguments);

        this.hit.logic(timeDelta);
        if (this.hit.hasEnded && this.health > 0) {
            this.hit.begin = this.hit.change = 0;
            this.hit.toEnd();
        }

        if (this === this.game.player) {
            for (i = 0; i < this.engines.length; i++) {
                this.engines[i].particle.direction = 180 + (this.velocity.y / this.speed) * 45;
                this.engines[i].particle.speed = 40 + 40 * (this.velocity.x / this.speed);
            }

            // Don't allow moving outside viewable area.
            this.position.x = numbers.clip(0 - this.box.x - this.box.width/2, this.position.x,
                                           this.game.WORLD.WIDTH - this.box.x - this.box.width);
            this.position.y = numbers.clip(0 - this.box.y, this.position.y,
                                           this.game.WORLD.HEIGHT - this.box.y - this.box.height);
            // Decrease speed over time.
            this.velocity.scale(1 - timeDelta * 4);
        } else if (this.box) {
            if (this.position.y + this.box.y < 0 && this.velocity.y + this.force.y <= 0) {
                this.position.y = -this.box.y;
                this.velocity.y = Math.abs(this.velocity.y);
                this.force.y = Math.abs(this.force.y / 2);
            } else if (this.position.y + this.box.y + this.box.height > this.game.WORLD.HEIGHT && this.velocity.y + this.force.y >= 0) {
                this.position.y = this.game.WORLD.HEIGHT - this.box.y - this.box.height;
                this.velocity.y = -Math.abs(this.velocity.y);
                this.force.y = -Math.abs(this.force.y / 2);
            }
        }

        this.angle = this.velocity.y / this.speed * 15;
        if (this !== this.game.player)
            this.angle *= -1;

        for (i = 0; i < this.engines.length; i++)
            this.engines[i].logic(timeDelta);

        for (i = 0; i < this.weapons.length; i++)
            this.weapons[i].logic(timeDelta);

        this.invincibleTime = Math.max(0, this.invincibleTime - timeDelta * 1000);
        if (this === this.game.player) {
            if (this.invincibleTime > 0) {
                if (!this._invincibilitySoundInstance)
                    this._invincibilitySoundInstance = this._invincibilitySound.playLoop({'volume': settings('SHIP_INVINCIBILITY_VOLUME', 1)});
            } else if (this._invincibilitySoundInstance) {
                this._invincibilitySoundInstance.stop();
                this._invincibilitySoundInstance = null;
            }
        }
    };

    ShipEntity.prototype.explode = function() {
        // Damage other enemy ships, but not the player.
        if (!this.dead) {
            this.dead = true;
            var center = this.getCenter();
            if (this.explosionRadius) {
                this.game.addExplosion(center.x, center.y, this.explosionRadius, this.explosionDamage,
                                       this.game.PLAYER_TEAM);
                if (this.explosionSound)
                    this.explosionSound.play({'volume': settings('SHIP_EXPLODE_VOLUME', 1)});
            }

            if (this.powerUps && Math.random() <= this.powerUps.chance) {
                var powerUp = this.powerUps.choices[Math.floor(Math.random() * this.powerUps.choices.length)];
                powerUp.fx = (this.force.x + this.velocity.x) / 2;
                powerUp.fy = (this.force.y + this.velocity.y) / 2;
                this.game.makePowerUp(center.x, center.y, powerUp);
            }
        }
    };

    ShipEntity.prototype.onRemove = function() {
        this.stopShooting();
        if (this._invincibilitySoundInstance)
            this._invincibilitySoundInstance.stop();
    };

    ShipEntity.prototype.detonate = function() {
        // Damage player but not any other enemy ships.
        if (!this.dead) {
            this.dead = true;
            if (this.explosionRadius) {
                var center = this.getCenter();
                this.game.addExplosion(center.x, center.y, this.explosionRadius, this.explosionDamage,
                                       this.game.ENEMY_TEAM);
                if (this.explosionSound)
                    this.explosionSound.play({'volume': settings('SHIP_EXPLODE_VOLUME', 1)});
            }
        }
    };

    ShipEntity.prototype.collidesWith = function(other) {
        if (!this.invincibleTime && other instanceof Projectile && other.team !== this.team) {
            this.regenerationDelay = 1500;
            this.health = numbers.clip(0, this.health + Math.min(0, this.shield - other.damage), this.maxHealth);
            this.shield = numbers.clip(0, this.shield - other.damage, this.maxShield);

            if (this.health > 0) {
                if (!this.hit.value) {
                    this.hit.begin = .9;
                    //this.hit.begin = numbers.clip(0, this.hit.begin + .2, 1);
                    this.hit.change = -this.hit.begin;
                    this.hit.restart();
                }
            } else {
                this.hit.hasEnded = true;
                this.hit.value = .9;
                this.explode();
            }
        } else if (other === this.game.player)
            this.detonate();
    };

    ShipEntity.prototype.drawShield = function(context, x, y) {
        if (this.invincibleTime > 0)
            this.invincibleShieldSprite.draw(context, x, y);
        else if (this.shield >= 1 && this.maxShield >= 1) {
            var oldAlpha = context.globalAlpha;
            context.globalAlpha = this.shield / this.maxShield * context.globalAlpha;
            this.shieldSprite.draw(context, x, y);
            context.globalAlpha = oldAlpha;
        }
    };

    ShipEntity.prototype.drawEngines = function(context, scale, x, y) {
        for (var i = 0; i < this.engines.length; i++)
            this.engines[i].draw(context, scale, x, y);
    };

    ShipEntity.prototype.drawWeapons = function(context, scale, x, y) {
        for (var i = 0; i < this.weapons.length; i++)
            this.weapons[i].draw(context, scale, x, y);
    };

    ShipEntity.prototype.drawShip = function(context, x, y) {
        this.sprite.draw(context, x, y);
    };

    ShipEntity.prototype.drawHit = function(context, x, y) {
        if (this.hit.value) {
            var oldAlpha = context.globalAlpha;
            context.globalAlpha = this.hit.value * context.globalAlpha;
            this.hitSprite.draw(context, x, y);
            context.globalAlpha = oldAlpha;
        }
    };

    ShipEntity.prototype.draw = function(context, scale, x, y) {
        var dx = Math.floor(this.position.x * scale + x);
        var dy = Math.floor(this.position.y * scale + y);
        var px = -this.sprite.width/2;
        var py = -this.sprite.height/2;
        context.save();
        if (this.invincibleTime > 0)
            context.globalAlpha = (Math.floor(this.invincibleTime * .015) % 2) ? .4 : .8;
        context.translate(dx - px, dy - py);
        if (this.angle)
            context.rotate(numbers.radians(this.angle));
        this.drawShield(context, px, py);
        this.drawEngines(context, scale, px, py);
        this.drawShip(context, px, py);
        this.drawHit(context, px, py);
        context.restore();
        this.drawWeapons(context, scale, this.position.x + x, this.position.y + y);
        Entity.prototype.draw.apply(this, arguments);
    };

    return ShipEntity;
});
