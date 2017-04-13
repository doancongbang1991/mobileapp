define('skytte.entities.hud', ['skytte.numbers', 'skytte.easings', 'skytte.vector2', 'skytte.tween', 'skytte.entity'], function(numbers, easings, Vector2, Tween, Entity) {

    function displayWhenBlinking(time, total) {
        /*
         * Returns true if an element should be visible during blink animation with given progress and total
         * animation time.
         */
        return total - time > 1500 || Math.floor(time * 0.01333333333333333) % 2;
    }

    function Weapon(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDWeapon', x, y, kwargs]);
        this.background = this.game.getResource(kwargs.background);
        this.level = this.game.getResource(kwargs.level);
        this.icons = this.game.getResource(kwargs.icons);
    }

    Weapon.prototype = Object.create(Entity.prototype);

    Weapon.INDEX_TO_SPRITE = {'1': 0, '2': 1, '3': 2, '5': 3, '0': 4, '4': 5};

    Weapon.prototype.draw = function(context, scale, x, y) {
        context.save();
        var levelX = (this.position.x + 7) * scale + x;
        var levelY = (this.position.y + 80) * scale + y;
        this.level.drawSprite(context, 0, 0, levelX, levelY);

        if (this.game.currentWeapon >= 0) {
            var levelWidth = Math.floor(this.level.width * this.game.weapons[this.game.currentWeapon].level/3);
            if (levelWidth)
                context.drawImage(
                    this.level.image, 0, this.level.height,
                    levelWidth, this.level.height, Math.floor(levelX),
                    Math.floor(levelY), levelWidth, this.level.height);
        }

        this.background.draw(context, this.position.x * scale + x, this.position.y * scale + y);
        if (this.game.currentWeapon >= 0)
            this.icons.drawSprite(context, Weapon.INDEX_TO_SPRITE[this.game.currentWeapon], 0,
                                  (this.position.x + 4) * scale + x, this.position.y * scale + y);
        context.restore();
    };


    function HealthBar(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDHealthBar', x, y, kwargs]);
        this.bars = this.game.getResource(kwargs.bars);
        this.background = this.game.getResource(kwargs.background);
        this.heartIcon = kwargs.heartIcon;
        this.shieldIcon = kwargs.shieldIcon;
        this.font = this.game.getResource(kwargs.font);
        this.toggleTime = 0;
        this.TOGGLE_EVERY = 6000;
    }

    HealthBar.prototype = Object.create(Entity.prototype);

    HealthBar.prototype.logic = function(timeDelta) {
        Entity.prototype.logic.apply(this, arguments);
        this.toggleTime += timeDelta * 1000;
        if (this.toggleTime >= this.TOGGLE_EVERY)
            this.toggleTime -= this.TOGGLE_EVERY;
    };

    HealthBar.prototype.draw = function(context, scale, x, y) {
        context.save();

        // Health bar
        var healthX = (this.position.x + 56) * scale + x;
        var healthY = (this.position.y + 7) * scale + y;
        this.bars.drawSprite(context, 0, 0, healthX, healthY);

        var shieldX = (this.position.x + 62) * scale + x;
        var shieldY = (this.position.y + 37) * scale + y;
        this.bars.drawSprite(context, 0, 0, shieldX, shieldY);

        if (this.game.player) {
            var healthWidth = Math.floor(this.game.player.health / this.game.player.maxHealth * this.bars.width);
            if (healthWidth) {
                context.drawImage(
                    this.bars.image, 0, 1 * this.bars.height,
                    healthWidth, this.bars.height, Math.floor(healthX), Math.floor(healthY), healthWidth, this.bars.height);

                if (!this.game.player.shield) {
                    context.globalAlpha = this.game.player.hit.value;
                    context.fillStyle = '#fff';
                    context.fillRect(Math.floor(healthX), Math.floor(healthY), healthWidth, this.bars.height);
                    context.globalAlpha = 1;
                }
            }

            // Shield bar
            var shieldWidth = Math.floor(this.game.player.shield / this.game.player.maxShield * (this.bars.width * this.game.player.shieldLevel/3));
            if (shieldWidth) {
                context.drawImage(
                    this.bars.image, this.bars.width - shieldWidth, 2 * this.bars.height,
                    shieldWidth, this.bars.height, Math.floor(shieldX + this.bars.width - shieldWidth),
                    Math.floor(shieldY), shieldWidth, this.bars.height);
                context.globalAlpha = this.game.player.hit.value;
                context.fillStyle = '#fff';
                context.fillRect(Math.floor(shieldX + this.bars.width - shieldWidth),
                    Math.floor(shieldY), shieldWidth, this.bars.height);
                context.globalAlpha = 1;
            }
        }

        // Decoration
        this.background.draw(context, this.position.x * scale + x, this.position.y * scale + y);

        // Shield icon and level.
        if (this.game.player) {
            context.globalAlpha = easings.exponentialInOut(easings.toggleShifted(this.toggleTime / this.TOGGLE_EVERY));
            this.font.drawText(context, String(this.game.player.shieldLevel), 3, (this.position.x + 270 - 53 + 25) * scale + x,
                               (this.position.y + 13) * scale + y, 'center');
            context.globalAlpha = easings.exponentialInOut(easings.toggle(this.toggleTime / this.TOGGLE_EVERY));
        }
        this.shieldIcon.draw(context, (this.position.x + 270 - 53) * scale + x, this.position.y * scale + y);

        // Heart icon and number of lifes.
        if (this.game.player) {
            context.globalAlpha = easings.exponentialInOut(easings.toggleShifted(this.toggleTime / this.TOGGLE_EVERY));
            this.font.drawText(context, String(this.game.lifes), 2, (this.position.x + 25) * scale + x,
                               (this.position.y + 13) * scale + y, 'center');
            context.globalAlpha = easings.exponentialInOut(easings.toggle(this.toggleTime / this.TOGGLE_EVERY));
        }
        this.heartIcon.draw(context, this.position.x * scale + x, this.position.y * scale + y);

        context.restore();
    };


    function Score(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDScore', x, y, kwargs]);
        this.font = this.game.getResource(kwargs.font);
        this.icons = this.game.getResource(kwargs.icons);
        this.startScore = this.score = this.game.score;
        this.startCombo = this.combo = this.game.combo;
    }

    Score.prototype = Object.create(Entity.prototype);

    Score.prototype.logic = function(timeDelta) {
        if (this.game.combo < this.combo)
            this.combo = 0;

        if (this.combo === this.game.combo)
            this.startCombo = this.game.combo;
        if (this.score === this.game.score)
            this.startScore = this.game.score;

        this.score = Math.min(this.game.score, this.score + (this.game.score - this.startScore) * timeDelta);
        this.combo = Math.min(this.game.combo, this.combo + (this.game.combo - this.startCombo) * timeDelta);
    };

    Score.prototype.draw = function(context, scale, x, y) {
        x = Math.floor(this.position.x * scale + x);
        y = Math.floor(this.position.y * scale + y);
        var score = numbers.format(Math.round(this.score));
        var combo = numbers.format(Math.round(this.combo));
        var multiplier = numbers.format(this.game.multiplier);

        this.icons.drawSprite(context, 0, 0, x, y);
        x += this.icons.width + 5;
        this.font.drawText(context, score, 0, x, y + 13 * scale);
        x += this.font.textWidth(score) + 20 * scale;

        if (this.game.combo > 0 || this.game.multiplier > 1) {

            // Blink the combo and multiplier in the last two seconds.
            if (displayWhenBlinking(this.game.comboTime, this.game.COMBO_DELAY)) {
                this.icons.drawSprite(context, 2, 0, x, y);
                x += this.icons.width + 5;

                this.font.drawText(context, multiplier, 2, x, y + 13 * scale);
                x += this.font.textWidth(multiplier) + 20 * scale;

                this.icons.drawSprite(context, 1, 0, x, y);
                x += this.icons.width + 5;
                this.font.drawText(context, combo, 1, x, y + 13 * scale);
            }
        }
    };


    function PowerUp(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDPowerUp', x, y, kwargs]);
        this.background = this.game.getResource(kwargs.background);
        this.icons = this.game.getResource(kwargs.icons);
    }

    PowerUp.prototype = Object.create(Entity.prototype);

    PowerUp.prototype.draw = function(context, scale, x, y) {
        if (this.game.activePowerUp) {
            this.background.draw(context, this.position.x * scale + x, this.position.y * scale + y);
            // Blink the active power-up's icon in the last two seconds.
            if (displayWhenBlinking(this.game.activePowerUpTime, this.game.activePowerUp.duration))
                this.game.activePowerUp.sprite.draw(context, (this.position.x + 3) * scale + x,
                                                    (this.position.y + 1) * scale + y);
        }
    };


    function LevelProgress(game, x, y, kwargs) {
        Entity.apply(this, [game, 'HUDLevelProgress', x, y, kwargs]);
        this.sprite = this.game.getResource(kwargs.sprite);
        this.levelTime = 0;
    }

    LevelProgress.prototype = Object.create(Entity.prototype);

    LevelProgress.prototype.draw = function(context, scale, x, y) {
        if (this.game.level && this.game.level.duration) {
            context.save();
            if (this.game.player)
                this.levelTime = this.game.level.time;
            x = Math.floor(this.position.x * scale + x);
            y = Math.floor(this.position.y * scale + y);
            var iconWidth = 40;
            var sidePadding = 60;
            var progressWidth = this.sprite.width - sidePadding * 2 - iconWidth;
            var progress = Math.min(1, this.levelTime / (this.game.level.duration + 10000)) * progressWidth;
            context.drawImage(this.sprite.image, iconWidth, 0, this.sprite.width - iconWidth, this.sprite.height, x, y,
                              this.sprite.width - iconWidth, this.sprite.height);
            context.drawImage(this.sprite.image, 0, 0, iconWidth, this.sprite.height,
                              Math.floor(x - iconWidth/2 + sidePadding + progress), y,
                              iconWidth, this.sprite.height);
            context.restore();
        }
    };

    return {'Weapon': Weapon, 'HealthBar': HealthBar, 'Score': Score, 'PowerUp': PowerUp,
            'LevelProgress': LevelProgress};
});
