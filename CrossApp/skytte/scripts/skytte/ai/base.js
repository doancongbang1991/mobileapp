define('skytte.ai.base', function() {

    function BaseAI(game, entity, kwargs) {
        this.game = game;
        this.entity = entity;
    }

    BaseAI.prototype.logic = function(timeDelta) {};

    return BaseAI;
});
