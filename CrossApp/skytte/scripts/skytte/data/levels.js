define('skytte.data.levels', function() {
    var utils = require('skytte.utils');
    var LabelEntity = require('skytte.entities.label');
    var backgrounds = require('skytte.data.backgrounds');
    var weapons = require('skytte.data.weapons');
    var powerups = require('skytte.data.powerups');
    var ships = require('skytte.data.ships');

    var HINT_MOVING = {'sprite': 'hintMoving', 'vx': -80};
    var HINT_SHOOTING = {'sprite': 'hintShooting', 'vx': -80};
    var HINT_TOUCHSCREEN = {'sprite': 'hintTouchscreen', 'vx': -80};
    var HINT_WEAPONS = {'sprite': 'hintWeapons', 'vx': -80};

    var LEVEL_1_CHOICES = [
        {'type': 'Swarm', 'config': ships.SWARM, 'args': [640, 80, 10, 170], 'difficulty': 20},
        {'type': 'Fighter', 'config': ships.FIGHTER, 'difficulty': 30},
    ];
    var LEVEL_2_CHOICES = [
        {'type': 'Swarm', 'config': ships.SWARM, 'args': [640, 160, 10, 170], 'difficulty': 15},
        {'type': 'Fighter', 'config': ships.FIGHTER, 'difficulty': 30},
        {'type': 'LaserTurretUp', 'config': ships.LASER_TURRET_UP, 'difficulty': 30},
        {'type': 'LaserTurretDown', 'config': ships.LASER_TURRET_DOWN, 'difficulty': 30},
        {'type': 'Teleporter', 'config': ships.TELEPORTER, 'difficulty': 45}
    ];
    var LEVEL_3_CHOICES = [
        {'type': 'Swarm', 'config': ships.SWARM, 'args': [640, 320, 15, 170], 'difficulty': 15},
        {'type': 'Fighter', 'config': ships.FIGHTER, 'difficulty': 30},
        {'type': 'Teleporter', 'config': ships.TELEPORTER, 'difficulty': 45},
        {'type': 'Tank', 'config': ships.TANK, 'difficulty': 100},
        {'type': 'LaserTurretUp', 'config': ships.LASER_TURRET_UP, 'difficulty': 30},
        {'type': 'LaserTurretDown', 'config': ships.LASER_TURRET_DOWN, 'difficulty': 30}
    ];
    var LEVEL_4_CHOICES = [
        {'type': 'Swarm', 'config': ships.SWARM, 'args': [640, 320, 15, 170], 'difficulty': 15},
        {'type': 'Fighter', 'config': ships.FIGHTER, 'difficulty': 30},
        {'type': 'Teleporter', 'config': ships.TELEPORTER, 'difficulty': 45},
        {'type': 'Electrician', 'config': ships.ELECTRICIAN, 'difficulty': 60},
        {'type': 'Tank', 'config': ships.TANK, 'difficulty': 100},
        {'type': 'LaserTurretUp', 'config': ships.LASER_TURRET_UP, 'difficulty': 30},
        {'type': 'LaserTurretDown', 'config': ships.LASER_TURRET_DOWN, 'difficulty': 30}
    ];
    var LEVEL_5_CHOICES = [
        {'type': 'Swarm', 'y': 0, 'config': ships.SWARM, 'args': [640, 320, 15, 170], 'difficulty': 10},
        {'type': 'Fighter', 'config': ships.FIGHTER, 'difficulty': 10},
        {'type': 'Teleporter', 'config': ships.TELEPORTER, 'difficulty': 15},
        {'type': 'Electrician', 'config': ships.ELECTRICIAN, 'difficulty': 15},
        {'type': 'Tank', 'config': ships.TANK, 'difficulty': 35},
        {'type': 'Frigate', 'config': ships.FRIGATE, 'difficulty': 50},
        {'type': 'LaserTurretUp', 'config': ships.LASER_TURRET_UP, 'difficulty': 15},
        {'type': 'LaserTurretDown', 'config': ships.LASER_TURRET_DOWN, 'difficulty': 15},
        {'type': 'FlakTurretUp', 'config': ships.FLAK_TURRET_UP, 'difficulty': 25},
        {'type': 'FlakTurretDown', 'config': ships.FLAK_TURRET_DOWN, 'difficulty': 25},
        {'type': 'CartTurret', 'config': ships.CART_TURRET, 'difficulty': 40}
    ];
    var LEVEL_6_CHOICES = [
        {'type': 'Swarm', 'y': 0, 'config': ships.SWARM, 'args': [640, 320, 15, 170], 'difficulty': 10},
        {'type': 'Fighter', 'config': ships.FIGHTER, 'difficulty': 10},
        {'type': 'Teleporter', 'config': ships.TELEPORTER, 'difficulty': 15},
        {'type': 'Electrician', 'config': ships.ELECTRICIAN, 'difficulty': 15},
        {'type': 'Tank', 'config': ships.TANK, 'difficulty': 35},
        {'type': 'Frigate', 'config': ships.FRIGATE, 'difficulty': 50},
        {'type': 'LaserTurretUp', 'config': ships.LASER_TURRET_UP, 'difficulty': 15},
        {'type': 'LaserTurretDown', 'config': ships.LASER_TURRET_DOWN, 'difficulty': 15},
        {'type': 'FlakTurretUp', 'config': ships.FLAK_TURRET_UP, 'difficulty': 25},
        {'type': 'FlakTurretDown', 'config': ships.FLAK_TURRET_DOWN, 'difficulty': 25},
        {'type': 'CartTurret', 'config': ships.CART_TURRET, 'difficulty': 40}
    ];

    function respawnPlayer(game, level) {
        game.expireActivePowerUp();
        var center = game.player.getCenter();
        var label = new LabelEntity(game, center.x, center.y, {'font': 'fontBig', 'text': '-1',
                                                               'life': 3500, 'fontColor': 2});
        game.prependForeground(label);

        if (game.lifes > 0) {
            game.lifes -= 1;
            game.makePlayerShip(game.player.position.x, game.player.position.y, ships.PLAYER_SHIP);
            game.player.invincibleTime += 5000;
            if (game.currentWeapon >= 0) {
                game.changeWeapon(game.currentWeapon);
                if (game.autofire)
                    game.player.startShooting();
            }
        } else {
            game.resetCombo();
            game.player = null;
        }
    }

    function randomEnemies(time, difficulty, interval, choices) {
        var choice, events = [];

        while (difficulty > 0) {
            choice = choices[Math.floor(Math.random() * choices.length)];
            events.push(utils.merge({'at': time}, choice));
            time += interval;
            difficulty -= choice.difficulty;
        }

        return events;
    }

    function smartPowerUp(game) {
        if (!game.level.events.length || !game.player)
            return;

        var x = game.WORLD.WIDTH, y = Math.random() * game.WORLD.HEIGHT;
        var r = Math.random();

        if (game.player.health <= game.player.maxHealth/2 && game.player.shield <= game.player.maxShield) {
            if (game.lifes === 0)
                game.makePowerUp(x, y, powerups.POWERUP_LIFE);
            else
                game.makePowerUp(x, y, powerups.POWERUP_REPAIR);
        } else if (game._enemyCount > 35)
            game.makePowerUp(x, y, powerups.POWERUP_KILL_ALL);
        else {
            if (r < .025 && game.player.shieldLevel < 3 )
                game.makePowerUp(x, y, powerups.POWERUP_SHIELD_UPGRADE);
            else if (r < .6)
                game.makePowerUp(x, y, powerups.POWERUP_WEAPON_UPGRADE);
            else if (r < .7)
                game.makePowerUp(x, y, powerups.POWERUP_INVINCIBILITY);
            else if (r < .8)
                game.makePowerUp(x, y, powerups.POWERUP_RANDOM);
        }
    }

    function generateLevel(n, scenery, choices, difficulty, segmentCount) {
        var segments = [
            {'type': 'Scenery', 'config': scenery},
            {'type': 'HUD'},
            {'type': 'PlayerShip', 'x': 100, 'y': 100, 'config': ships.PLAYER_SHIP},
            {'signal': 'playerDied', 'receiver': respawnPlayer}];
        if (n === 1) {
            segments.push({'type': 'PlayerWeapons', 'config': weapons.PLAYER_WEAPONS});
            if ('createTouch' in document)
                segments.push({'at': 3000, 'type': 'Hint', 'y': 200, 'config': HINT_TOUCHSCREEN});
            else
                segments = segments.concat([
                    {'at': 1000, 'type': 'Hint', 'y': 280, 'config': HINT_MOVING},
                    {'at': 8000, 'type': 'Hint', 'y': 420, 'config': HINT_WEAPONS}]);
            segments = segments.concat([
                {'at': 90000, 'type': 'PowerUp', 'config': powerups.POWERUP_WEAPON_UPGRADE},
                {'at': 20000, 'every': 1500, 'type': 'Mine', 'config': ships.MINE}]);
        } else
            segments = segments.concat([
                {'at': 25000, 'every': 25000, 'type': smartPowerUp},
                {'at': 5000, 'every': Math.max(500, 1500 - (n-1)*100), 'type': 'Mine', 'config': ships.MINE},
                {'at': 5000, 'every': Math.max(1000, 4000 - (n-1)*100), 'type': 'AggressiveMine', 'config': ships.AGGRESSIVE_MINE},
            ]);

        if (choices && choices.length) {
            var time = n === 1 ? 40000 : 3000;
            for (var i = 1; i < segmentCount + 1; i++) {
                segments = segments.concat(randomEnemies(time, difficulty * 10 + difficulty * i * i,
                                                         2500 - Math.min(2000, i * i * 5), choices));
                time = segments[segments.length - 1].at + 2000;
            }
        }

        return {'events': segments};
    }

    function generateGame() {
        return [generateLevel(1, backgrounds.CRUST, LEVEL_1_CHOICES, 1, 12),
                generateLevel(2, backgrounds.CRUST, LEVEL_2_CHOICES, 3, 12),
                generateLevel(3, backgrounds.MANTLE, LEVEL_3_CHOICES, 4, 12),
                generateLevel(4, backgrounds.MANTLE, LEVEL_4_CHOICES, 5, 12),
                generateLevel(4, backgrounds.CORE, LEVEL_5_CHOICES, 6, 12),
                generateLevel(5, backgrounds.CORE, LEVEL_6_CHOICES, 7, 12)];
    }

    return {
        'generateGame': generateGame,
        'generateLevel': generateLevel,
        'respawnPlayer': respawnPlayer,
        'randomEnemies': randomEnemies
    };
});
