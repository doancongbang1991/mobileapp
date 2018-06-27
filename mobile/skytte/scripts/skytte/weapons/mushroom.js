define('skytte.particles.mushroom', ['skytte.utils', 'skytte.particles.emitter'], function(utils, Emitter) {

    function MushroomEmitter(game, kwargs) {
        kwargs = utils.merge(MushroomEmitter.DEFAULTS, kwargs);
        Emitter.apply(this, [game, 0, 0, kwargs]);
        this.sprites = [];
        for (var i = 0; i < kwargs.sprites.length; i++)
            this.sprites.push(this.game.getResource(kwargs.sprites[i]));
        this.reset(true);
    }

    MushroomEmitter.DEFAULTS = {
        'vx': -140,
        'spawnSpeed': 1,
        'particle': {
            'offsetX': 40,
            'offsetY': 47,
            'spreadX': 20,
            'direction': 270,
            'directionSpread': 90,
            'size': 1.5,
            'sizeSpread': .5,
            'vx': -140,
            'vy': 0,
            'speed': 30,
            'speedSpread': 10,
            'life': 3000,
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                if (typeof this._originalSize === 'undefined')
                    this._originalSize = this.size;
                this.size = this._originalSize * this.p;
            }
        }
    };

    MushroomEmitter.prototype = Object.create(Emitter.prototype);

    MushroomEmitter.prototype.reset = function(firstTime) {
        this.sprite = this.sprites[Math.floor(Math.random() * this.sprites.length)];
        this.position.x = this.game.WORLD.WIDTH * Math.random();
        if (!firstTime)
            this.position.x += this.game.WORLD.WIDTH;
        this.position.y = this.game.WORLD.FULL_HEIGHT - ((Math.random() * .3 + .7) * this.sprite.height) / this.game.SCREEN.SCALE;
    };

    MushroomEmitter.prototype.logic = function(timeDelta) {
        Emitter.prototype.logic.apply(this, arguments);
        if (this.position.x + this.sprite.width < 0)
            this.reset();
    };

    return MushroomEmitter;
});
