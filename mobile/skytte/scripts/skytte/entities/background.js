define('skytte.entities.background', ['skytte.entity'], function(Entity) {

    function BackgroundEntity(game, kwargs) {
        kwargs.vx = -kwargs.speed * game.SCREEN.SCALE;
        Entity.apply(this, [game, 'BackgroundEntity', 0, 0, kwargs]);
        this.align = kwargs.align;
        this.spriteList = this.game.getResource(kwargs.spriteList);
        this.segments = [];
        // Chance in range 0..1 to select non-empty sprite as new segment.
        this.chance = typeof kwargs.chance === 'undefined' ? 1 : kwargs.chance;
    }

    BackgroundEntity.ALIGN_TOP = 1;
    BackgroundEntity.ALIGN_MIDDLE = 2;
    BackgroundEntity.ALIGN_BOTTOM = 3;

    BackgroundEntity.prototype = Object.create(Entity.prototype);

    BackgroundEntity.prototype.addNewSegment = function(keepPosition) {
        var newSegment = 0, spriteCount = this.spriteList.sprites.length, other;

        if (Math.random() > this.chance)
            newSegment = null;
        else if (spriteCount > 1) {
            // Make sure that the same two segments are not next to each other.
            if (this.velocity.x < 0)
                other = this.segments[this.segments.length - 1];
            else
                other = this.segments[0];
            do
                newSegment = Math.floor(Math.random() * spriteCount);
            while (newSegment === other);
        }
        if (this.velocity.x <= 0)
            this.segments.push(newSegment);
        else {
            this.segments.unshift(newSegment);
            if (!keepPosition) {
                if (newSegment !== null)
                    this.position.x -= this.spriteList.sprites[newSegment].image.width;
                else
                    this.position.x -= this.game.WORLD.WIDTH;
            }
        }
        return newSegment;
    }

    BackgroundEntity.prototype.logic = function(timeDelta) {
        Entity.prototype.logic.apply(this, arguments);
        this.dead = false;
    };

    BackgroundEntity.prototype.draw = function(context, scale, x, y) {
        var segment, sprite, i = 0, dx = Math.floor(this.position.x + x), dy;

        if (this.velocity.x <= 0) {
            while (dx < this.game.WORLD.WIDTH) {
                if (typeof this.segments[i] === 'undefined')
                    this.addNewSegment();
                if (this.segments[i] === null)
                    dx += this.game.WORLD.WIDTH;
                else
                    dx += this.spriteList.sprites[this.segments[i]].image.width;
                if (dx < 0) {
                    this.segments.shift();
                    this.position.x = dx;
                } else
                    i++;
            }
        } else if (this.velocity.x > 0) {
            while (this.position.x + x > 0)
                this.addNewSegment();
            do {
                if (typeof this.segments[i] === 'undefined')
                    this.addNewSegment(true);
                segment = this.segments[i];
                if (dx > this.game.WORLD.WIDTH)
                    this.segments.pop();
                else {
                    i += 1;
                    dx += segment === null ? this.game.WORLD.WIDTH : this.spriteList.sprites[segment].image.width;
                }
            } while (dx < this.game.WORLD.WIDTH)
        }

        dx = Math.floor(this.position.x + x);
        for (i = 0; i < this.segments.length; i++) {
            segment = this.segments[i];
            if (segment === null)
                dx += this.game.WORLD.WIDTH;
            else {
                sprite = this.spriteList.sprites[segment];

                if (this.align === BackgroundEntity.ALIGN_TOP)
                    dy = y;
                else if (this.align === BackgroundEntity.ALIGN_MIDDLE)
                    dy = Math.floor((this.game.SCREEN.HEIGHT - sprite.image.height) / 2 + y);
                else if (this.align === BackgroundEntity.ALIGN_BOTTOM)
                    dy = this.game.SCREEN.HEIGHT - sprite.image.height + y + 8;

                sprite.draw(context, dx, dy);
                dx += sprite.image.width;
            }
        }
    };

    return BackgroundEntity;
});
