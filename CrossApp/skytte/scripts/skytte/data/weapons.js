define('skytte.data.weapons', function() {
    var settings = require('settings');
    var Polygon = require('skytte.polygon');
    var plasma = require('skytte.weapons.plasma');
    var laser = require('skytte.weapons.laser');
    var flak = require('skytte.weapons.flak');
    var electro = require('skytte.weapons.electro');

    var PLAYER_WEAPONS = {
        'PLASMA_1': {
            'barrelOffset': [63, 24],
            'level': 1,
            'rateOfFire': 1,
            'damage': 50,
            'fireSound': 'soundPlayerPlasma',
            'fireSoundVolume': settings('PLAYER_PLASMA_VOLUME', 1),
            'projectileSprite': 'plasma 0,0',
            'projectileExplodeSound': 'soundExplosionSmall',
            'sprite': 'playerWeapons 2,0',
            'hitSprite': 'playerWeapons 2,1'
        },
        'PLASMA_2': {
            'barrelOffset': [63, 24],
            'level': 2,
            'rateOfFire': 1.5,
            'damage': 85,
            'fireSound': 'soundPlayerPlasma',
            'fireSoundVolume': settings('PLAYER_PLASMA_VOLUME', 1),
            'projectileSprite': 'plasma 1,0',
            'projectileExplodeSound': 'soundExplosionSmall',
            'sprite': 'playerWeapons 2,0',
            'hitSprite': 'playerWeapons 2,1'
        },
        'PLASMA_3': {
            'barrelOffset': [63, 24],
            'level': 3,
            'rateOfFire': 2,
            'damage': 120,
            'fireSound': 'soundPlayerPlasma',
            'fireSoundVolume': settings('PLAYER_PLASMA_VOLUME', 1),
            'projectileSprite': 'plasma 2,0',
            'projectileExplodeSound': 'soundExplosionSmall',
            'sprite': 'playerWeapons 2,0',
            'hitSprite': 'playerWeapons 2,1'
        },

        'STORM_1': {
            'barrelOffset': [69, 23],
            'level': 1,
            'rateOfFire': 3,
            'damage': 20,
            'projectileSpread': 80,
            'projectileCount': 3,
            'fireSound': 'soundPlayerStorm',
            'fireSoundVolume': settings('PLAYER_STORM_VOLUME', 1),
            'projectileSprite': 'laser 0,0',
            'sprite': 'playerWeapons 0,0',
            'hitSprite': 'playerWeapons 0,1'
        },
        'STORM_2': {
            'barrelOffset': [69, 23],
            'level': 2,
            'rateOfFire': 3,
            'damage': 20,
            'projectileSpread': 160,
            'projectileCount': 5,
            'fireSound': 'soundPlayerStorm',
            'fireSoundVolume': settings('PLAYER_STORM_VOLUME', 1),
            'projectileSprite': 'laser 1,0',
            'sprite': 'playerWeapons 0,0',
            'hitSprite': 'playerWeapons 0,1'
        },
        'STORM_3': {
            'barrelOffset': [69, 23],
            'level': 3,
            'rateOfFire': 3,
            'damage': 20,
            'projectileSpread': 240,
            'projectileCount': 7,
            'fireSound': 'soundPlayerStorm',
            'fireSoundVolume': settings('PLAYER_STORM_VOLUME', 1),
            'projectileSprite': 'laser 2,0',
            'sprite': 'playerWeapons 0,0',
            'hitSprite': 'playerWeapons 0,1'
        },

        'RAY_1': {
            'barrelOffset': [65, 24],
            'level': 1,
            'damage': 100,
            'fireSound': 'soundPlayerRay',
            'fireSoundVolume': settings('PLAYER_RAY_VOLUME', 1),
            'beamColor': 'rgba(138, 255, 62, .2)',
            'sprite': 'playerWeapons 3,0',
            'hitSprite': 'playerWeapons 3,1'
        },
        'RAY_2': {
            'barrelOffset': [65, 24],
            'level': 2,
            'damage': 150,
            'fireSound': 'soundPlayerRay',
            'fireSoundVolume': settings('PLAYER_RAY_VOLUME', 1),
            'beamColor': 'rgba(233, 179, 73, .2)',
            'sprite': 'playerWeapons 3,0',
            'hitSprite': 'playerWeapons 3,1'
        },
        'RAY_3': {
            'barrelOffset': [65, 24],
            'level': 3,
            'damage': 200,
            'fireSound': 'soundPlayerRay',
            'fireSoundVolume': settings('PLAYER_RAY_VOLUME', 1),
            'beamColor': 'rgba(206, 43, 44, .2)',
            'sprite': 'playerWeapons 3,0',
            'hitSprite': 'playerWeapons 3,1'
        },

        'ROCKETS_1': {
            'barrelOffset': [62, 24],
            'level': 1,
            'rateOfFire': .75,
            'damage': 80,
            'fireSound': 'soundPlayerRocket',
            'fireSoundVolume': settings('PLAYER_ROCKETS_VOLUME', 1),
            'rocketFlyingSound': 'soundRocketFlying',
            'rocketExplodeSound': 'soundExplosionMedium',
            'projectileSprite': 'rocket',
            'sprite': 'playerWeapons 4,0',
            'hitSprite': 'playerWeapons 4,1'
        },
        'ROCKETS_2': {
            'barrelOffset': [62, 24],
            'level': 2,
            'rateOfFire': 1,
            'damage': 80,
            'fireSound': 'soundPlayerRocket',
            'fireSoundVolume': settings('PLAYER_ROCKETS_VOLUME', 1),
            'rocketFlyingSound': 'soundRocketFlying',
            'rocketExplodeSound': 'soundExplosionMedium',
            'projectileSprite': 'rocket',
            'sprite': 'playerWeapons 4,0',
            'hitSprite': 'playerWeapons 4,1'
        },
        'ROCKETS_3': {
            'barrelOffset': [62, 24],
            'level': 3,
            'rateOfFire': 1.25,
            'damage': 80,
            'fireSound': 'soundPlayerRocket',
            'fireSoundVolume': settings('PLAYER_ROCKETS_VOLUME', 1),
            'rocketFlyingSound': 'soundRocketFlying',
            'rocketExplodeSound': 'soundExplosionMedium',
            'projectileSprite': 'rocket',
            'sprite': 'playerWeapons 4,0',
            'hitSprite': 'playerWeapons 4,1'
        },

        'FLAK_1': {
            'barrelOffset': [68, 24],
            'level': 1,
            'rateOfFire': 1,
            'damage': 30,
            'fireSound': 'soundPlayerFlak',
            'fireSoundVolume': settings('PLAYER_FLAK_VOLUME', 1),
            'projectileSprite': 'flak 0,0',
            'sprite': 'playerWeapons 1,0',
            'hitSprite': 'playerWeapons 1,1'
        },
        'FLAK_2': {
            'barrelOffset': [68, 24],
            'level': 2,
            'rateOfFire': 1.25,
            'damage': 40,
            'fireSound': 'soundPlayerFlak',
            'fireSoundVolume': settings('PLAYER_FLAK_VOLUME', 1),
            'projectileSprite': 'flak 1,0',
            'sprite': 'playerWeapons 1,0',
            'hitSprite': 'playerWeapons 1,1'
        },
        'FLAK_3': {
            'barrelOffset': [68, 24],
            'level': 3,
            'rateOfFire': 1.5,
            'damage': 50,
            'fireSound': 'soundPlayerFlak',
            'fireSoundVolume': settings('PLAYER_FLAK_VOLUME', 1),
            'projectileSprite': 'flak 2,0',
            'sprite': 'playerWeapons 1,0',
            'hitSprite': 'playerWeapons 1,1'
        },

        'ELECTRO_1': {
            'barrelOffset': [67, 24],
            'level': 1,
            'rayCount': 1,
            'radius': 240,
            'damage': 100,
            'fireSound': 'soundPlayerElectro',
            'fireSoundVolume': settings('PLAYER_ELECTRO_VOLUME', 1),
            'beamColor': 'rgba(138, 255, 62, .2)',
            'projectileHitSprite': 'electroHit',
            'sprite': 'playerWeapons 5,0',
            'hitSprite': 'playerWeapons 5,1'
        },
        'ELECTRO_2': {
            'barrelOffset': [67, 24],
            'level': 2,
            'rayCount': 2,
            'radius': 280,
            'damage': 120,
            'fireSound': 'soundPlayerElectro',
            'fireSoundVolume': settings('PLAYER_ELECTRO_VOLUME', 1),
            'beamColor': 'rgba(233, 179, 73, .2)',
            'projectileHitSprite': 'electroHit',
            'sprite': 'playerWeapons 5,0',
            'hitSprite': 'playerWeapons 5,1'
        },
        'ELECTRO_3': {
            'barrelOffset': [67, 24],
            'level': 3,
            'rayCount': 3,
            'radius': 320,
            'damage': 140,
            'fireSound': 'soundPlayerElectro',
            'fireSoundVolume': settings('PLAYER_ELECTRO_VOLUME', 1),
            'beamColor': 'rgba(206, 43, 44, .2)',
            'projectileHitSprite': 'electroHit',
            'sprite': 'playerWeapons 5,0',
            'hitSprite': 'playerWeapons 5,1'
        }
    };

    var ENEMY_WEAPONS = {
        'LASER1': {
            'cls': laser.LaserWeapon,
            'barrelOffset': [5, 15],
            'rateOfFire': 1,
            'damage': 50,
            'direction': 180,
            'fireSound': 'soundEnemyLaser',
            'fireSoundVolume': settings('ENEMY_LASER_VOLUME', 1),
            'projectilePolygon': Polygon.fromString('-15,-5 15,-5 15,5 -15,5'),
            'projectileSpeed': 300,
            'sprite': 'enemyWeapons2 0,0',
            'hitSprite': 'enemyWeapons2 0,1',
            'projectileSprite': 'laser 2,0'
        },
        'LASER2': {
            'cls': laser.LaserWeapon,
            'barrelOffset': [6, 15],
            'rateOfFire': 1,
            'damage': 50,
            'direction': 180,
            'fireSound': 'soundEnemyLaser',
            'fireSoundVolume': settings('ENEMY_LASER_VOLUME', 1),
            'projectilePolygon': Polygon.fromString('-15,-5 15,-5 15,5 -15,5'),
            'projectileSpeed': 300,
            'sprite': 'enemyWeapons2 1,0',
            'hitSprite': 'enemyWeapons2 1,1',
            'projectileSprite': 'laser 2,0'
        },
        'ELECTRO': {
            'cls': electro.ElectroWeapon,
            'barrelOffset': [23, 20],
            'rayCount': 1,
            'damage': 40,
            'radius': 250,
            'fireSound': 'soundEnemyElectro',
            'fireSoundVolume': settings('ENEMY_ELECTRO_VOLUME', 1),
            'beamColor': 'rgba(206, 43, 44, .2)',
            'sprite': 'enemyWeapons1 0,0',
            'hitSprite': 'enemyWeapons1 0,1',
            'projectileHitSprite': 'electroHit'
        },
        'PLASMA1': {
            'cls': plasma.PlasmaWeapon,
            'barrelOffset': [7, 21],
            'rateOfFire': .75,
            'damage': 25,
            'direction': 180,
            'fireSound': 'soundEnemyPlasma',
            'fireSoundVolume': settings('ENEMY_PLASMA_VOLUME', 1),
            'sprite': 'enemyWeapons1 2,0',
            'hitSprite': 'enemyWeapons1 2,1',
            'projectileExplodeSound': 'soundExplosionSmall',
            'projectileSprite': 'plasma 2,0'
        },
        'PLASMA2': {
            'cls': plasma.PlasmaWeapon,
            'barrelOffset': [6, 24],
            'rateOfFire': .25,
            'damage': 50,
            'direction': 180,
            'fireSound': 'soundEnemyPlasma',
            'fireSoundVolume': settings('ENEMY_PLASMA_VOLUME', 1),
            'sprite': 'enemyWeapons1 3,0',
            'hitSprite': 'enemyWeapons1 3,1',
            'projectileExplodeSound': 'soundExplosionSmall',
            'projectileSprite': 'plasma 2,0'
        },
        'FLAK': {
            'cls': flak.FlakWeapon,
            'barrelOffset': [0, 18],
            'rateOfFire': .75,
            'damage': 8,
            'direction': 180,
            'projectileSpeedX': -80,
            'fireSound': 'soundEnemyFlak',
            'fireSoundVolume': settings('ENEMY_FLAK_VOLUME', 1),
            'sprite': 'enemyWeapons1 1,0',
            'hitSprite': 'enemyWeapons1 1,1',
            'projectileSprite': 'flak 2,0)'
        },
        'TURRET_LASER_UP': {
            'cls': laser.LaserWeapon,
            'barrelOffset': [16, 0],
            'rateOfFire': 1,
            'damage': 20,
            'direction': 270,
            'fireSound': 'soundEnemyLaser',
            'fireSoundVolume': settings('ENEMY_LASER_VOLUME', 1),
            'projectilePolygon': Polygon.fromString('-5,-15 5,-15 5,15 -5,15'),
            'projectileSpeedX': -80,
            'projectileSpeedY': -300,
            'sprite': 'enemyWeapons4 1,0',
            'hitSprite': 'enemyWeapons4 1,1',
            'projectileSprite': 'laser 5,0'
        },
        'TURRET_LASER_DOWN': {
            'cls': laser.LaserWeapon,
            'barrelOffset': [16, 48],
            'rateOfFire': 1,
            'damage': 20,
            'direction': 90,
            'fireSound': 'soundEnemyLaser',
            'fireSoundVolume': settings('ENEMY_LASER_VOLUME', 1),
            'projectilePolygon': Polygon.fromString('-5,-15 5,-15 5,15 -5,15'),
            'projectileSpeedX': -80,
            'projectileSpeedY': 300,
            'sprite': 'enemyWeapons4 0,0',
            'hitSprite': 'enemyWeapons4 0,1',
            'projectileSprite': 'laser 5,0'
        },
        'TURRET_FLAK_UP': {
            'cls': flak.FlakWeapon,
            'barrelOffset': [32, 0],
            'rateOfFire': 1,
            'damage': 8,
            'direction': 270,
            'projectileSpeedX': -80,
            'fireSound': 'soundEnemyFlak',
            'fireSoundVolume': settings('ENEMY_FLAK_VOLUME', 1),
            'sprite': 'enemyWeapons3 1,0',
            'hitSprite': 'enemyWeapons3 1,1',
            'projectileSprite': 'flak 2,0'
        },
        'TURRET_FLAK_DOWN': {
            'cls': flak.FlakWeapon,
            'barrelOffset': [32, 64],
            'rateOfFire': 1,
            'damage': 8,
            'direction': 90,
            'projectileSpeedX': -80,
            'fireSound': 'soundEnemyFlak',
            'fireSoundVolume': settings('ENEMY_FLAK_VOLUME', 1),
            'sprite': 'enemyWeapons3 0,0',
            'hitSprite': 'enemyWeapons3 0,1',
            'projectileSprite': 'flak 2,0'
        },
        'TURRET_PLASMA': {
            'cls': plasma.PlasmaWeapon,
            'barrelOffset': [10, 32],
            'rateOfFire': .75,
            'damage': 75,
            'direction': 180,
            'fireSound': 'soundEnemyPlasma',
            'fireSoundVolume': settings('ENEMY_PLASMA_VOLUME', 1),
            'projectileExplodeSound': 'soundExplosionSmall',
            'sprite': 'turretCartPlasmaWeapon 0,0',
            'hitSprite': 'turretCartPlasmaWeapon 0,1',
            'projectileSprite': 'plasma 2,0'
        }
    };

    return {'PLAYER_WEAPONS': PLAYER_WEAPONS, 'ENEMY_WEAPONS': ENEMY_WEAPONS};
});
