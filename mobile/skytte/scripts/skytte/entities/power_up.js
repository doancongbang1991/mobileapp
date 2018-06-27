define('skytte.entities.power_up', ['skytte.utils', 'skytte.numbers', 'skytte.easings', 'skytte.tween', 'skytte.vector2', 'skytte.entity'], function(utils, numbers, easings, Tween, Vector2, Entity) {

    function PowerUpEntity(game, x, y, kwargs) {
        Entity.apply(this, [game, 'PowerUpEntity', x, y, kwargs]);
        utils._merge(this, kwargs);
        this.sprite = this.game.getResource(kwargs.sprite);
        if (kwargs.sound)
            this.sound = this.game.getResource(kwargs.sound);
        this.soundVolume = typeof kwargs.soundVolume !== 'undefined' ? kwargs.soundVolume : 1;
        this.angle = Math.random() * 360;
        this.collectAnim = null;
        this.collectible = true;
        this.speed = 0;
        this.maxSpeed = 350;
        this.accel = 100;
        this.distance = new Vector2();
        this._originalVelocity = new Vector2(this.velocity);
    }

    PowerUpEntity.prototype = Object.create(Entity.prototype);

    PowerUpEntity.prototype.collect = function() {
        /*
         * Called when player's ship collides with this power-up.
         */
        this.collectAnim = new Tween(1, -1, 750, easings.exponentialOut);
        this.velocity.x = 0;
        this.velocity.y = -100;
        if (this.collectFunc)
            this.collectFunc.apply(this, [this.game]);
        if (this.score)
            this.game.addScoreLabel(this, this.game.addCombo(this.score));
        if (this.sound)
            this.sound.play({'volume': this.soundVolume});
        delete this.score;
    };

    PowerUpEntity.prototype.active = function(timeDelta) {
        /*
         * Called each frame when the power-up is active (must be picked-up by the player and must have some duration
         * specified.
         */
        if (this.activeFunc)
            this.activeFunc.apply(this, [this.game, timeDelta]);
    };

    PowerUpEntity.prototype.expired = function() {
        /*
         * Called once when this power-up's time has ended or the player has collected an other power-up.
         */
        if (this.expiredFunc)
            this.expiredFunc.apply(this, [this.game]);
    };

    PowerUpEntity.prototype.collidesWith = function(other) {
        if (other === this.game.player && !this.collectAnim)
            this.game.collectPowerUp(this);
    };

    PowerUpEntity.prototype.logic = function(timeDelta) {
        if (this.collectAnim) {
            this.collectAnim.logic(timeDelta);
            if (this.collectAnim.hasEnded)
                this.dead = true;
        } else if (this.game.player) {
            this.distance.set(this.game.player.getCenter()).sub(this.getCenter());
                var length = this.distance.length();
            if (length <= 90)
                this.speed = this.maxSpeed;
            else
                this.speed = Math.max(this.speed - this.accel * timeDelta, 0);

            this.velocity.set(this._originalVelocity).add(this.distance.normalize().scale(this.speed));

            if (this.speed === 0) {
                this.angle += 90 * timeDelta;
                this.velocity.y = Math.cos(numbers.radians(this.angle)) * 10;
            }
        } else {
            this.angle += 90 * timeDelta;
            this.velocity.y = Math.cos(numbers.radians(this.angle)) * 10;
        }

        Entity.prototype.logic.apply(this, arguments);

        // Bounce from the top or bottom of the game world.
        if (this.position.y + this.box.y < 0 && this.velocity.y + this.force.y <= 0) {
            this.position.y = -this.box.y;
            this.velocity.y = Math.abs(this.velocity.y);
            this.force.y = Math.abs(this.force.y / 2);
        } else if (this.position.y + this.box.y + this.box.height > this.game.WORLD.HEIGHT && this.velocity.y + this.force.y >= 0) {
            this.position.y = this.game.WORLD.HEIGHT - this.box.y - this.box.height;
            this.velocity.y = -Math.abs(this.velocity.y);
            this.force.y = -Math.abs(this.force.y / 2);
        }
    };

    PowerUpEntity.prototype.draw = function(context, scale, x, y) {
        context.save();
        context.translate(Math.floor(x + scale * (this.position.x + this.sprite.width/2)),
                          Math.floor(y + scale * (this.position.y + this.sprite.height/2)));
        if (!this.collectAnim && this.angle)
            context.rotate(numbers.radians(this.velocity.y));
        if (this.collectAnim) {
            context.globalAlpha = easings.quarticOut(this.collectAnim.value);
            context.scale(2 - this.collectAnim.value, 2 - this.collectAnim.value);
        }
        this.sprite.draw(context, x + scale * -this.sprite.width/2, y + scale * -this.sprite.height/2);
        context.restore();
        Entity.prototype.draw.apply(this, arguments);
    };

    return PowerUpEntity;
});
