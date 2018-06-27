define('skytte.level', ['skytte.utils'], function(utils) {

    /*
     * Triggers events through game (mostly spawns enemies).
     *
     * kwargs = {
     *     'events': [
     *         {
     *             'at': 3000,  // Milliseconds after level start to trigger this event.
     *             'signal': 'playerDied', 'receiver': myFunction,  // Triggered when given signal is sent.
     *             'every': 1000,  // Repeat this event every milliseconds.
     *             'type': 'PlayerShip' or 'PowerUp' or 'Mine' or any other 'event*' method implemented in the Layer
     *                      class or custom function,
     *             'x': N,
     *             'y': N,
     *             'config': {...},
     *             'args': [],
     *         },
     *         ...
     *     ]
     *     ...
     * };
     *
     * Events params 'at', 'on' and 'one' are mutually exclusive, can't be used together.
     *
     */
    function Level(game, kwargs) {
        this.game = game;
        this.events = utils.merge([], kwargs.events);
        // List of events that are trigerred repeatedly, every configured time steps.
        this.recurring = [];
        // Number of milliseconds since start of this level.
        this.time = 0;
        this.processTime = 0;
        // Process event queue every this milliseconds (to improve performance when queue is really long).
        this.PROCESS_EVERY = 50;
        this.duration = 0;
        this._signals = [];

        var i = this.events.length, event;
        while (--i >= 0) {
            event = this.events[i];
            if (event.at)
                this.duration = Math.max(event.at, this.duration);
            if (event.signal) {
                this.game[event.signal].connect(event.receiver);
                this._signals.push([event.signal, event.receiver]);
                this.events.splice(i, 1);
            }
        }

        this._processEventQueue();
    }

    Level.prototype.eventScenery = function(event) {
        this.game.makeScenery(event.config);
    };

    Level.prototype.eventHUD = function(event) {
        this.game.makeHUD();
    };

    Level.prototype.eventPlayerWeapons = function(event) {
        var args = [event.config].concat(event.args || []);
        this.game.makePlayerWeapons.apply(this.game, args);
    };

    Level.prototype.eventPlayerShip = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makePlayerShip.apply(this.game, args);
    };

    Level.prototype.eventChangeWeapon = function(event) {
        this.game.changeWeapon.apply(this.game, [event.weapon]);
    };

    Level.prototype.eventPowerUp = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makePowerUp.apply(this.game, args);
    };

    Level.prototype.eventHint = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeHint.apply(this.game, args);
    };

    Level.prototype.eventMine = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeMine.apply(this.game, args);
    };

    Level.prototype.eventAggressiveMine = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeAggressiveMine.apply(this.game, args);
    };

    Level.prototype.eventSwarm = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeSwarm.apply(this.game, args);
    };

    Level.prototype.eventSwarmUnit = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeSwarmUnit.apply(this.game, args);
    };

    Level.prototype.eventFighter = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeFighter.apply(this.game, args);
    };

    Level.prototype.eventTeleporter = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeTeleporter.apply(this.game, args);
    };

    Level.prototype.eventElectrician = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeElectrician.apply(this.game, args);
    };

    Level.prototype.eventTank = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeTank.apply(this.game, args);
    };

    Level.prototype.eventFrigate = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeFrigate.apply(this.game, args);
    };

    Level.prototype.eventLaserTurretUp = function(event) {
        var args = ([event.x, event.config]).concat(event.args || []);
        this.game.makeLaserTurretUp.apply(this.game, args);
    };

    Level.prototype.eventLaserTurretDown = function(event) {
        var args = ([event.x, event.config]).concat(event.args || []);
        this.game.makeLaserTurretDown.apply(this.game, args);
    };

    Level.prototype.eventFlakTurretUp = function(event) {
        var args = ([event.x, event.config]).concat(event.args || []);
        this.game.makeFlakTurretUp.apply(this.game, args);
    };

    Level.prototype.eventFlakTurretDown = function(event) {
        var args = ([event.x, event.config]).concat(event.args || []);
        this.game.makeFlakTurretDown.apply(this.game, args);
    };

    Level.prototype.eventCartTurret = function(event) {
        var args = ([event.x, event.y, event.config]).concat(event.args || []);
        this.game.makeCartTurret.apply(this.game, args);
    };

    Level.prototype.processEvent = function(event) {
        event = utils.merge({}, event);
        if (typeof event.x === 'undefined')
            event.x = this.game.WORLD.WIDTH;
        if (typeof event.y === 'undefined')
            event.y = this.game.WORLD.HEIGHT * Math.random();
        if (typeof event.type === 'string') {
            var method = 'event' + event.type;
            this[method](event);
        } else
            event.type.apply(event, [this.game, this]);
    };

    Level.prototype._processEventQueue = function() {
        var i = 0;
        while (i < this.events.length) {
            var event = this.events[i];
            if (this.time >= (event.at || 0)) {
                this.processEvent(event);
                this.events.splice(i, 1);
                if (typeof event.every !== 'undefined') {
                    event.time = 0;
                    this.recurring.push(event);
                }
            } else
                i += 1;
        }
    };

    Level.prototype.logic = function(timeDelta) {
        this.time += timeDelta * 1000;
        this.processTime += timeDelta * 1000;

        if (this.processTime >= this.PROCESS_EVERY && this.events.length) {
            for (var i = 0; i < this.recurring.length; i++) {
                var event = this.recurring[i];
                event.time += timeDelta * 1000;
                if (event.time >= event.every) {
                    this.processEvent(event);
                    event.time -= event.every;
                }
            }

            this._processEventQueue();
            this.processTime -= this.PROCESS_EVERY;
        }
    };

    Level.prototype.hasEnded = function() {
        for (var i = 0; i < this.events.length; i++)
            if (this.events[i].at)
                return false;
        return true;
    };

    Level.prototype.end = function() {
        for (var i = 0; i < this._signals.length; i++)
            this.game[this._signals[i][0]].disconnect(this._signals[i][1]);
        this._signals = [];
    };

    return Level;
});
