define('skytte.ai.move_left', ['skytte.ai.idle'], function(IdleAI) {

    function MoveLeftAI() {
        IdleAI.apply(this, arguments);
    }

    MoveLeftAI.prototype = Object.create(IdleAI.prototype);

    MoveLeftAI.prototype.logic = function(timeDelta) {
        IdleAI.prototype.logic.apply(this, arguments);

        this.entity.velocity.x = -this.entity.speed;

        if (this.entity.position.x + this.entity.sprite.width*2 < 0)
            this.entity.dead = true;
    };

    return MoveLeftAI;
});
