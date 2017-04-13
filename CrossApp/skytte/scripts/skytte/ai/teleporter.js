define('skytte.ai.teleporter', ['skytte.vector2', 'skytte.easings', 'skytte.tween', 'skytte.ai.base'], function(Vector2, easings, Tween, BaseAI) {

    function TeleporterAI(game, entity, kwargs) {
        BaseAI.apply(this, arguments);
        this.entity.alpha = 1;
        this.delay = kwargs.delay / 1000;
        this.teleportTime = kwargs.teleportTime;
        this.teleportLimit = 10;
        this.time = 0;
        this.show = null;
        this.hide = null;
    }

    TeleporterAI.prototype = Object.create(BaseAI.prototype);

    TeleporterAI.prototype.teleport = function() {
        this.hide = null;
        var worldW = this.game.WORLD.WIDTH;
        var worldH = this.game.WORLD.HEIGHT;
        var x = (worldW * .25) + Math.random() * (worldW * .7);
        var y = Math.random() * (worldH*.9 - this.entity.sprite.height);
        this.entity.position.x = x;
        this.entity.position.y = y;
        this.show = new Tween(0, 1, this.teleportTime, easings.linear);
        this.teleportLimit--;
    };

    TeleporterAI.prototype.logic = function(timeDelta) {
        if (this.hide) {
            this.hide.logic(timeDelta);
            this.entity.alpha = this.hide.value;
            if (this.hide.hasEnded)
                this.teleport();
        } else if (this.show) {
            this.show.logic(timeDelta);
            this.entity.alpha = this.show.value;
            if (this.show.hasEnded)
                this.show = null;
        } else if (this.teleportLimit > 0) {
            this.time += timeDelta;

            if (this.time >= this.delay) {
                this.time = 0;
                this.hide = new Tween(1, -1, this.teleportTime, easings.linear);
            }
        }

        this.entity.velocity.x = -this.entity.speed;

        for (var i = 0; i < this.entity.weapons.length; i++)
            if (!this.entity.weapons[i].shooting)
                this.entity.weapons[i].startShooting();
    };

    return TeleporterAI;
});
