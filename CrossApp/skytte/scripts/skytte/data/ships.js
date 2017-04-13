define('skytte.data.ships', function() {
    var BoundingBox = require('skytte.bounding_box');
    var Polygon = require('skytte.polygon');
    var weapons = require('skytte.data.weapons');
    var powerups = require('skytte.data.powerups');

    var PLAYER_TEAM = 1;
    var ENEMY_TEAM = 2;

    var PLAYER_FIRE_WHITE = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 180,
            'directionSpread': 5,
            'speed': 30,
            'life': 500,
            'sprite': 'fire 2,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * .5;
            }
        }
    };
    var PLAYER_FIRE_ORANGE = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 180,
            'directionSpread': 10,
            'speed': 30,
            'life': 1000,
            'sprite': 'fire 1,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 1.25;
            }
        }
    };
    var PLAYER_FIRE_RED = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 180,
            'directionSpread': 15,
            'speed': 30,
            'life': 1500,
            'sprite': 'fire 0,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 2.25;
            }
        }
    };

    var MEDIUM_ENEMY_FIRE_WHITE = {
        'spawnSpeed': 10,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 30,
            'life': 400,
            'sprite': 'fire 2,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * .75;
                this.velocity.y *= .7;
            }
        }
    };
    var MEDIUM_ENEMY_FIRE_ORANGE = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 30,
            'life': 800,
            'sprite': 'fire 1,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 1.5;
                this.velocity.y *= .8;
            }
        }
    };
    var MEDIUM_ENEMY_FIRE_RED = {
        'spawnSpeed': 20,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 35,
            'life': 1200,
            'sprite': 'fire 0,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 2;
                this.velocity.y *= .85;
            }
        }
    };

    var BIG_ENEMY_FIRE_WHITE = {
        'spawnSpeed': 10,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 40,
            'life': 500,
            'sprite': 'fire 2,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 1;
                this.velocity.y *= .8;
            }
        }
    };
    var BIG_ENEMY_FIRE_ORANGE = {
        'spawnSpeed': 15,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 40,
            'life': 1000,
            'sprite': 'fire 1,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 1.75;
                this.velocity.y *= .85;
            }
        }
    };
    var BIG_ENEMY_FIRE_RED = {
        'spawnSpeed': 20,
        'particle': {
            'direction': 0,
            'directionSpread': 90,
            'speed': 45,
            'life': 1500,
            'sprite': 'fire 0,0',
            'logic': function(timeDelta) {
                this.logic(timeDelta);
                this.size = this.p * 3;
                this.velocity.y *= .9;
            }
        }
    };

    var PLAYER_SHIP = {
        'shieldSprite': 'player 0,0',
        'sprite': 'player 0,1',
        'hitSprite': 'player 0,2',
        'invincibleShieldSprite': 'player 0,3',
        'team': PLAYER_TEAM,
        'speed': 300,
        'mass': 750,
        'health': 500,
        'shield': 250,
        'shieldPerSecond': 5,
        'healthPerSecond': 2,
        'explosionRadius': 250,
        'explosionDamage': 100,
        'explosionSound': 'soundPlayerExplosion',
        'polygon': Polygon.fromString('40,23 55,23 88,47 99,75 89,92 61,99 48,99 36,49'),
        'engines': [
            {'x': 32, 'y': 50, 'emitter': PLAYER_FIRE_RED},
            {'x': 33, 'y': 50, 'emitter': PLAYER_FIRE_ORANGE},
            {'x': 35, 'y': 50, 'emitter': PLAYER_FIRE_WHITE},
        ]
    };
    var MINE = {
        'distanceSound': 'soundMineAlarm',
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'mines 0,0',
        'sprite': 'mines 0,1',
        'hitSprite': 'mines 0,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'mass': 75,
        'health': 100,
        'shield': 0,
        'score': 5,
        'explosionDamage': 5,
        'explosionRadius': 100,
        'detonateDamage': 50,
        'detonateRadius': 100,
        'box': BoundingBox.fromString('38,36 52,54'),
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_1],
        }
    };
    var AGGRESSIVE_MINE = {
        'distanceSound': 'soundMineAlarm',
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'mines 0,0',
        'sprite': 'mines 1,1',
        'hitSprite': 'mines 0,2',
        'team': ENEMY_TEAM,
        'speed': 140,
        'mass': 75,
        'health': 100,
        'shield': 50,
        'score': 10,
        'explosionDamage': 5,
        'explosionRadius': 100,
        'detonateDamage': 50,
        'detonateRadius': 100,
        'box': BoundingBox.fromString('38,36 52,54'),
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_2],
        }
    };
    var SWARM = {
        'explosionSound': 'soundExplosionSmall',
        'shieldSprite': 'swarm 0,0',
        'sprite': 'swarm 0,1',
        'hitSprite': 'swarm 0,2',
        'team': ENEMY_TEAM,
        'speed': 150,
        'mass': 50,
        'health': 15,
        'shield': 0,
        'score': 2,
        'explosionDamage': .25,
        'explosionRadius': 100,
        'box': BoundingBox.fromString('22,27 43,43'),
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_1],
        }
    };
    var FIGHTER = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'fighter 0,0',
        'sprite': 'fighter 0,1',
        'hitSprite': 'fighter 0,2',
        'team': ENEMY_TEAM,
        'speed': 140,
        'mass': 200,
        'health': 100,
        'shield': 25,
        'score': 75,
        'explosionDamage': 50,
        'explosionRadius': 100,
        'polygon': Polygon.fromString('69,30 122,23 126,85 107,88 35,88 30,70 49,45'),
        'engines': [
            {'x': 132, 'y': 78, 'emitter': MEDIUM_ENEMY_FIRE_RED},
            {'x': 129, 'y': 78, 'emitter': MEDIUM_ENEMY_FIRE_ORANGE},
            {'x': 127, 'y': 78, 'emitter': MEDIUM_ENEMY_FIRE_WHITE}
        ],
        'weapons': [
            {'x': 51, 'y': 19, 'weapon': weapons.ENEMY_WEAPONS.LASER1}
        ],
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_1, powerups.POWERUP_SCORE_MULTIPLIER_X2],
        }
    };
    var TELEPORTER = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'teleporter 0,0',
        'sprite': 'teleporter 0,1',
        'hitSprite': 'teleporter 0,2',
        'team': ENEMY_TEAM,
        'speed': 140,
        'mass': 200,
        'health': 200,
        'shield': 50,
        'score': 100,
        'explosionDamage': 50,
        'explosionRadius': 100,
        'polygon': Polygon.fromString('80,26 92,27 100,52 102,70 93,80 56,81 18,74 25,46'),
        'engines': [
            {'x': 109, 'y': 60, 'emitter': MEDIUM_ENEMY_FIRE_RED},
            {'x': 106, 'y': 60, 'emitter': MEDIUM_ENEMY_FIRE_ORANGE},
            {'x': 104, 'y': 60, 'emitter': MEDIUM_ENEMY_FIRE_WHITE}
        ],
        'weapons': [
            {'x': 13, 'y': 57, 'weapon': weapons.ENEMY_WEAPONS.LASER2}
        ],
        'AI': {
            'delay': 2000,
            'teleportTime': 1000
        },
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_2, powerups.POWERUP_SCORE_MULTIPLIER_X3],
        }
    };
    var ELECTRICIAN = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'electrician 0,0',
        'sprite': 'electrician 0,1',
        'hitSprite': 'electrician 0,2',
        'team': ENEMY_TEAM,
        'speed': 250,
        'mass': 200,
        'health': 500,
        'shield': 250,
        'score': 100,
        'explosionDamage': 50,
        'explosionRadius': 100,
        'polygon': Polygon.fromString('72,27 111,49 130,73 131,90 85,109 41,94 28,57 47,35'),
        'engines': [
            {'x': 138, 'y': 83, 'emitter': MEDIUM_ENEMY_FIRE_RED},
            {'x': 135, 'y': 83, 'emitter': MEDIUM_ENEMY_FIRE_ORANGE},
            {'x': 133, 'y': 83, 'emitter': MEDIUM_ENEMY_FIRE_WHITE}
        ],
        'weapons': [
            {'x': 21, 'y': 73, 'weapon': weapons.ENEMY_WEAPONS.ELECTRO}
        ],
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_2, powerups.POWERUP_SCORE_MULTIPLIER_X3],
        }
    };
    var TANK = {
        'explosionSound': 'soundExplosionBig',
        'shieldSprite': 'tank 0,0',
        'sprite': 'tank 0,1',
        'hitSprite': 'tank 0,2',
        'team': ENEMY_TEAM,
        'speed': 90,
        'mass': 400,
        'health': 1000,
        'shield': 350,
        'score': 200,
        'explosionDamage': 150,
        'explosionRadius': 150,
        'polygon': Polygon.fromString('71,23 121,37 133,48 133,67 124,129 37,137 16,124 20,76 27,46 45,29'),
        'engines': [
            {'x': 131, 'y': 123, 'emitter': MEDIUM_ENEMY_FIRE_RED},
            {'x': 128, 'y': 123, 'emitter': MEDIUM_ENEMY_FIRE_ORANGE},
            {'x': 126, 'y': 123, 'emitter': MEDIUM_ENEMY_FIRE_WHITE}
        ],
        'weapons': [
            {'x': -4, 'y': 91, 'weapon': weapons.ENEMY_WEAPONS.PLASMA1}
        ],
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_3, powerups.POWERUP_SCORE_MULTIPLIER_X4, powerups.POWERUP_DAMAGE_MULTIPLIER_X3],
        }
    };
    var FRIGATE = {
        'explosionSound': 'soundExplosionBig',
        'shieldSprite': 'frigate 0,0',
        'sprite': 'frigate 0,1',
        'hitSprite': 'frigate 0,2',
        'team': ENEMY_TEAM,
        'speed': 90,
        'mass': 700,
        'health': 1500,
        'shield': 500,
        'score': 300,
        'explosionDamage': 200,
        'explosionRadius': 200,
        'polygon': Polygon.fromString('98,6 146,5 218,28 219,78 210,142 140,186 82,187 38,138 19,101 49,43'),
        'engines': [
            {'x': 221, 'y': 128, 'emitter': BIG_ENEMY_FIRE_RED},
            {'x': 218, 'y': 128, 'emitter': BIG_ENEMY_FIRE_ORANGE},
            {'x': 216, 'y': 128, 'emitter': BIG_ENEMY_FIRE_WHITE}
        ],
        'weapons': [
            {'x': 67, 'y': -10, 'weapon': weapons.ENEMY_WEAPONS.PLASMA2},
            {'x': 70, 'y': 154, 'weapon': weapons.ENEMY_WEAPONS.PLASMA2},
            {'x': 9, 'y': 87, 'weapon': weapons.ENEMY_WEAPONS.FLAK}
        ],
        'powerUps': {
            'chance': .5,
            'choices': [powerups.POWERUP_SCORE_MULTIPLIER_X4, powerups.POWERUP_DAMAGE_MULTIPLIER_X4, powerups.POWERUP_INVINCIBILITY],
        }
    };
    var LASER_TURRET_UP = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'turrets 3,0',
        'sprite': 'turrets 3,1',
        'hitSprite': 'turrets 3,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'health': 500,
        'shield': 0,
        'mass': 100000,
        'score': 40,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('58,50 42,140'),
        'weapons': [
            {'x': 63, 'y': 54, 'weapon': weapons.ENEMY_WEAPONS.TURRET_LASER_UP}
        ],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_2, powerups.POWERUP_SCORE_MULTIPLIER_X2, powerups.POWERUP_DAMAGE_MULTIPLIER_X2],
        }
    };
    var LASER_TURRET_DOWN = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'turrets 2,0',
        'sprite': 'turrets 2,1',
        'hitSprite': 'turrets 2,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'health': 500,
        'shield': 0,
        'mass': 100000,
        'score': 40,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('58,0 42,140'),
        'weapons': [
            {'x': 63, 'y': 88, 'weapon': weapons.ENEMY_WEAPONS.TURRET_LASER_DOWN}
        ],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_2, powerups.POWERUP_SCORE_MULTIPLIER_X2, powerups.POWERUP_DAMAGE_MULTIPLIER_X2],
        }
    };
    var FLAK_TURRET_UP = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'turrets 1,0',
        'sprite': 'turrets 1,1',
        'hitSprite': 'turrets 1,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'health': 700,
        'shield': 0,
        'mass': 100000,
        'score': 40,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('58,54 42,136'),
        'weapons': [
            {'x': 47, 'y': 55, 'weapon': weapons.ENEMY_WEAPONS.TURRET_FLAK_UP}
        ],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_3, powerups.POWERUP_SCORE_MULTIPLIER_X3, powerups.POWERUP_DAMAGE_MULTIPLIER_X2],
        }
    };
    var FLAK_TURRET_DOWN = {
        'explosionSound': 'soundExplosionMedium',
        'shieldSprite': 'turrets 0,0',
        'sprite': 'turrets 0,1',
        'hitSprite': 'turrets 0,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'health': 700,
        'shield': 0,
        'mass': 100000,
        'score': 40,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('58,0 42,136'),
        'weapons': [
            {'x': 47, 'y': 73, 'weapon': weapons.ENEMY_WEAPONS.TURRET_FLAK_DOWN}
        ],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_3, powerups.POWERUP_SCORE_MULTIPLIER_X3, powerups.POWERUP_DAMAGE_MULTIPLIER_X2],
        }
    };
    var CART_TURRET = {
        'explosionSound': 'soundExplosionBig',
        'shieldSprite': 'cartTurret 0,0',
        'sprite': 'cartTurret 0,1',
        'hitSprite': 'cartTurret 0,2',
        'team': ENEMY_TEAM,
        'speed': 80,
        'verticalSpeed': 100,
        'health': 1100,
        'shield': 0,
        'mass': 100000,
        'score': 100,
        'explosionDamage': 50,
        'explosionRadius': 150,
        'box': BoundingBox.fromString('32,70 124,60'),
        'weapons': [
            {'x': 24, 'y': 67, 'weapon': weapons.ENEMY_WEAPONS.TURRET_PLASMA}
        ],
        'powerUps': {
            'chance': .25,
            'choices': [powerups.POWERUP_SCORE_MULTIPLIER_X4, powerups.POWERUP_DAMAGE_MULTIPLIER_X4],
        }
    };

    return {
        'PLAYER_SHIP': PLAYER_SHIP,
        'MINE': MINE,
        'AGGRESSIVE_MINE': AGGRESSIVE_MINE,
        'SWARM': SWARM,
        'FIGHTER': FIGHTER,
        'TELEPORTER': TELEPORTER,
        'ELECTRICIAN': ELECTRICIAN,
        'TANK': TANK,
        'FRIGATE': FRIGATE,
        'LASER_TURRET_UP': LASER_TURRET_UP,
        'LASER_TURRET_DOWN': LASER_TURRET_DOWN,
        'FLAK_TURRET_UP': FLAK_TURRET_UP,
        'FLAK_TURRET_DOWN': FLAK_TURRET_DOWN,
        'CART_TURRET': CART_TURRET,
    };
});
