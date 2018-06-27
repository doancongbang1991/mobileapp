define('skytte.ai.follow', ['skytte.numbers', 'skytte.vector2', 'skytte.ai.base'], function(numbers, Vector2, BaseAI) {

    function FollowAI(game, entity, target) {
        BaseAI.apply(this, [game, entity]);
        this.target = target;
    }

    FollowAI.prototype = Object.create(BaseAI.prototype);

    FollowAI.prototype.logic = function(timeDelta) {
        if (this.target && !this.target.dead) {
            var heading = new Vector2(this.target.getCenter()).sub(this.entity.getCenter());
            var radius = new Vector2(heading).normalize().scale(200);
            var speed = numbers.clip(0, heading.length() - 200, this.entity.speed);
            this.entity.velocity.set(heading).sub(radius).normalize().scale(speed);
        } else
            this.entity.velocity.x = -this.entity.speed;

        for (var i = 0; i < this.entity.weapons.length; i++)
            if (!this.entity.weapons[i].shooting)
                this.entity.weapons[i].startShooting();
    };

    return FollowAI;
});
