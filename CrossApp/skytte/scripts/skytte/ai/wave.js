define('skytte.ai.wave', ['skytte.numbers', 'skytte.vector2', 'skytte.ai.base'], function(numbers, Vector2, BaseAI) {

    function WaveAI(game, entity, x, y, width, height, offset, rotateSpeed) {
        BaseAI.apply(this, [game, entity]);
        this.height = height;
        this.moveAngle = 0;
        this.rotateSpeed = rotateSpeed;
        this.delay = offset * width/this.entity.speed * 1000;
        this.entity.position.x = x;
        this.entity.position.y = y - this.entity.box.height/2;
    }

    WaveAI.prototype = Object.create(BaseAI.prototype);

    WaveAI.prototype.logic = function(timeDelta) {
        if (this.delay > 0)
            this.delay -= timeDelta * 1000;
        else if (this.delay <= 0) {
            this.moveAngle += this.rotateSpeed * timeDelta;
            var dir = numbers.radians(this.moveAngle);
            this.entity.velocity.x = -this.entity.speed;
            this.entity.velocity.y = Math.cos(dir) * this.height / (180 / this.rotateSpeed) * Math.SQRT2;
            this.entity.angle = numbers.degrees(Math.atan2(this.entity.velocity.y, this.entity.velocity.x)) - 180;
        }
    };

    return WaveAI;
});
