define('skytte.entities.swarm', ['skytte.numbers', 'skytte.entity', 'skytte.entities.ship'], function(numbers, Entity, ShipEntity) {

    function SwarmEntity(game, x, y, kwargs) {
        ShipEntity.apply(this, arguments);
    }

    SwarmEntity.prototype = Object.create(ShipEntity.prototype);

    return SwarmEntity;
});
