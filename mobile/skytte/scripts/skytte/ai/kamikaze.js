define('skytte.ai.kamikaze', ['skytte.vector2', 'skytte.ai.base'], function(Vector2, BaseAI) {

    function KamikazeAI(game, entity, target) {
        BaseAI.apply(this, [game, entity]);
        this.target = target;
    }

    KamikazeAI.prototype = Object.create(BaseAI.prototype);

    KamikazeAI.prototype.logic = function(timeDelta) {
        if (this.target && !this.target.dead)
            // Head directly at the target with maximum speed possible.
            this.entity.velocity.set(this.target.getCenter()).sub(this.entity.getCenter()).normalize().scale(
                this.entity.speed);
        else {
            this.entity.velocity.x = -this.entity.speed;
            this.entity.velocity.y = 0;
            this.target = null;
        }
    };

    return KamikazeAI;
});
