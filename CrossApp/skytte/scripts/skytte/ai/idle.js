define('skytte.ai.idle', ['skytte.numbers', 'skytte.ai.base', 'skytte.entities.turret'], function(numbers, BaseAI, TurretEntity) {

    function IdleAI(game, entity, kwargs) {
        BaseAI.apply(this, arguments);
        this.angle = Math.random() * 360;
        this.shooting = kwargs && kwargs.shooting;
    }

    IdleAI.prototype = Object.create(BaseAI.prototype);

    IdleAI.prototype.logic = function(timeDelta) {
        if (!(this.entity instanceof TurretEntity)) {
            this.angle += 135 * timeDelta;
            this.entity.velocity.x = 0;
            this.entity.velocity.y = Math.cos(numbers.radians(this.angle)) * 16;
        }

        if (!this.shooting)
            for (var i = 0; i < this.entity.weapons.length; i++)
                if (!this.entity.weapons[i].shooting)
                    this.entity.weapons[i].startShooting();
    };

    return IdleAI;
});
