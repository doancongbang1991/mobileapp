define('skytte.entities.label', ['skytte.numbers', 'skytte.easings', 'skytte.entity'], function(numbers, easings, Entity) {

    function LabelEntity(game, x, y, kwargs) {
        Entity.apply(this, [game, 'LabelEntity', x, y, kwargs]);
        this.text = kwargs.text;
        this.font = this.game.getResource(kwargs.font);
        this.fontColor = kwargs.fontColor || 0;
        this.life = kwargs.life / 1000;
        this.time = 0;
    }

    LabelEntity.prototype = Object.create(Entity.prototype);

    LabelEntity.prototype.logic = function(timeDelta) {
        this.time += timeDelta;
        if (this.time >= this.life) {
            this.time = this.life;
            this.dead = true;
        }
    };

    LabelEntity.prototype.draw = function(context, scale, x, y) {
        context.save();
        var p = this.time / this.life;
        x = Math.floor(this.position.x * scale + x);
        y = Math.floor((this.position.y - p*50) * scale - this.font.height + y);
        context.globalAlpha = 1 - easings.exponentialIn(p);
        this.font.drawText(context, String(this.text), this.fontColor, x, y, 'center');
        context.restore();
    };

    return LabelEntity;
});
