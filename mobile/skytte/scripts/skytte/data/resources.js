define('skytte.data.resources', function() {
    var jQuery = require('jquery');
    var Sprite = require('skytte.sprite');
    var spritesheet = require('skytte.spritesheet');
    var Spritesheet = spritesheet.Spritesheet;
    var SpriteList = require('skytte.sprite_list');
    var Sound = require('skytte.sound');
    var Font = require('skytte.font');
    var STATIC_URL = window.STATIC_URL || '';

    function sh(names) {
        /* Sound path helper to shorten notation to sound files */
        var formats = ['wav', 'ogg', 'mp4'];
        var paths, variants = [];
        names = names.split(' ');
        for (var n = 0; n < names.length; n++) {
            paths = [];
            for (var f = 0; f < formats.length; f++)
                paths.push(STATIC_URL + 'sounds/' + names[n] + '.' + formats[f]);
            variants.push(paths.join('|'));
        }
        return variants.join(' ');
    }

    function ih(name) {
        /* Allows to make shorter paths to images */
        return STATIC_URL + 'images/640/' + name + '.png';
    }

    return {
        // Backgrounds
        'crustLayer2': new SpriteList(ih('background/crust/layer_2_segment_%i'), 5),
        'crustLayer3': new SpriteList(ih('background/crust/layer_3_segment_%i'), 5),
        'crustLayer4': new SpriteList(ih('background/crust/layer_4_segment_%i'), 5),
        'crustLayer5': new SpriteList(ih('background/crust/layer_5_segment_%i'), 4),
        'crustLayer6': new SpriteList(ih('background/crust/layer_6_segment_%i'), 5),

        'mantleLayer2': new SpriteList(ih('background/mantle/layer_2_segment_%i'), 5),
        'mantleLayer3': new SpriteList(ih('background/mantle/layer_3_segment_%i'), 5),
        'mantleLayer4': new SpriteList(ih('background/mantle/layer_4_segment_%i'), 5),
        'mantleLayer5': new SpriteList(ih('background/mantle/layer_5_segment_%i'), 4),
        'mantleLayer6': new SpriteList(ih('background/mantle/layer_6_segment_%i'), 5),

        'coreLayer2': new SpriteList(ih('background/core/layer_2_segment_%i'), 5),
        'coreLayer3': new SpriteList(ih('background/core/layer_3_segment_%i'), 5),
        'coreLayer4': new SpriteList(ih('background/core/layer_4_segment_%i'), 5),
        'coreLayer5': new SpriteList(ih('background/core/layer_5_segment_%i'), 3),
        'coreLayer6': new SpriteList(ih('background/core/layer_6_segment_%i'), 5),

        'layer1': new SpriteList(ih('background/layer_1_segment_%i'), 3),
        'mushrooms': new Spritesheet(ih('background/mushrooms'), 80, 180),
        'spores': new Spritesheet(ih('background/spores'), 17, 17),
        'fog': new Spritesheet(ih('background/fog'), 512, 256),
        'fire': new Spritesheet(ih('fire'), 32, 32),

        // Player weapons
        'playerWeapons': new Spritesheet(ih('weapons/player_weapons'), 80, 48),

        // Enemy weapons
        'enemyWeapons1': new Spritesheet(ih('weapons/enemy_weapons_1'), 96, 48),
        'enemyWeapons2': new Spritesheet(ih('weapons/enemy_weapons_2'), 96, 32),
        'enemyWeapons3': new Spritesheet(ih('weapons/enemy_weapons_3'), 64, 64),
        'enemyWeapons4': new Spritesheet(ih('weapons/enemy_weapons_4'), 32, 48),
        'enemyWeapons5': new Spritesheet(ih('weapons/enemy_weapons_5'), 48, 64),
        'turretCartPlasmaWeapon': new Spritesheet(ih('weapons/turret_plasma_left'), 128, 64),

        // Projectiles
        'rocket': new Sprite(ih('projectiles/rocket')),
        'plasma': new Spritesheet(ih('projectiles/plasma'), 64, 64),
        'laser': new Spritesheet(ih('projectiles/laser'), 48, 48),
        'flak': new Spritesheet(ih('projectiles/flak'), 14, 14),
        'electroHit': new Sprite(ih('projectiles/electro_hit')),

        // Power-ups
        'powerUps': new Spritesheet(ih('power_ups'), 48, 48),

        // Ships and turrets
        'mines': new Spritesheet(ih('enemies/mines'), 128, 128),
        'swarm': new Spritesheet(ih('enemies/swarm'), 96, 96),
        'fighter': new Spritesheet(ih('enemies/fighter'), 160, 128),
        'teleporter': new Spritesheet(ih('enemies/teleporter'), 128, 96),
        'electrician': new Spritesheet(ih('enemies/electrician'), 160, 128),
        'tank': new Spritesheet(ih('enemies/tank'), 160, 160),
        'frigate': new Spritesheet(ih('enemies/frigate'), 256, 192),

        'turrets': new Spritesheet(ih('enemies/turrets'), 160, 192),
        'cartTurret': new Spritesheet(ih('enemies/turret_3_left'), 192, 192),
        'cartTurretRail': new Sprite(ih('enemies/rail')),

        'player': new Spritesheet(ih('player'), 128, 128),

        // HUD
        'fontBig': new Font(ih('hud/font_big'),
                            {'chars': '-x+0123456789 ', 'colors': 4, 'spacing': -3, 'widths': {
                             'x': 21, '+': 18, '0': 18, '1': 14, '2': 18, '3': 18, '4': 19, '5': 18, '6': 18, '7': 17,
                             '8': 18, '9': 18, '-': 17, ' ': 8}}),
        'fontSmall': new Font(ih('hud/font_small'),
                            {'chars': 'x+0123456789 ', 'colors': 3, 'spacing': -2, 'widths': {
                             'x': 14, '+': 12, '0': 12, '1': 10, '2': 12, '3': 12, '4': 12, '5': 12, '6': 12, '7': 11,
                             '8': 12, '9': 12, ' ': 4}}),
        'HUDScoreIcons': new Spritesheet(ih('hud/score'), 53, 53),
        'HUDPowerUp': new Sprite(ih('hud/power_up')),
        'HUDWeapons': new Spritesheet(ih('hud/weapons'), 96, 96),
        'HUDWeaponBackground': new Sprite(ih('hud/weapon_background')),
        'HUDWeaponLevel': new Spritesheet(ih('hud/weapon_level'), 88, 16),
        'HUDHealthBars': new Spritesheet(ih('hud/health_bars'), 151, 10),
        'HUDHealthBackground': new Sprite(ih('hud/health_background')),
        'HUDHealthIcons': new Spritesheet(ih('hud/health_icons'), 53, 53),
        'HUDLevelProgress': new Sprite(ih('hud/level_progress')),
        'HUDPause': new Sprite(ih('hud/pause')),

        // Hints
        'hintMoving': new Sprite(ih('hint_moving')),
        'hintWeapons': new Sprite(ih('hint_weapons')),
        'hintTouchscreen': new Sprite(ih('hint_touchscreen')),

        // Sound effects
        'soundPowerUpCollect': new Sound(sh('Powerup_points'), 100),
        'soundPowerUpScoreMultiplier': new Sound(sh('Powerup_multiplier')),
        'soundPowerUpDamageMultiplier': new Sound(sh('Powerup_extra_firepower')),
        'soundPowerUpWeaponUpgrade': new Sound(sh('Powerup_weapon')),
        'soundPowerUpShieldUpgrade': new Sound(sh('Powerup_shield')),
        'soundPowerUpInvincibility': new Sound(sh('Powerup_immune')),
        'soundPowerUpRepair': new Sound(sh('Powerup_repair')),
        'soundPowerUpLife': new Sound(sh('Powerup_1up')),
        'soundPlayerWeaponChange': new Sound(sh('Weapon_change'), 200),
        'soundPlayerExplosion': new Sound(sh('Ship_destroyed_respawn')),
        'soundPlayerLowLife': new Sound(sh('Warning_life')),
        'soundPlayerInvincibility': new Sound(sh('Shield_on_loop')),
        'soundPlayerPlasma': new Sound(sh('Fire1')),
        'soundPlayerStorm': new Sound(sh('Fire_triple2')),
        'soundPlayerFlak': new Sound(sh('Fire_flac')),
        'soundPlayerRay': new Sound(sh('Fire_ray')),
        'soundPlayerRocket': new Sound(sh('Fire_rocket_launch')),
        'soundPlayerElectro': new Sound(sh('Fire_electric')),
        'soundEnemyPlasma': new Sound(sh('Enemy_plasma'), 75),
        'soundEnemyLaser': new Sound(sh('Enemy_laser'), 75),
        'soundEnemyFlak': new Sound(sh('Enemy_flac Enemy_flac_alt1 Enemy_flac_alt2'), 75),
        'soundEnemyElectro': new Sound(sh('Enemy_ray_electric')),
        'soundRocketFlying': new Sound(sh('rocket_fly')),
        'soundExplosionSmall': new Sound(sh('Explosion_small Explosion_small1 Explosion_small2 Explosion_small3'), 75),
        'soundExplosionMedium': new Sound(sh('Explosion_medium Explosion_medium1 Explosion_medium2'), 75),
        'soundExplosionBig': new Sound(sh('Explosion_big'), 75),
        'soundMineAlarm': new Sound(sh('mine_approach_loop')),
        'soundShipTeleport': new Sound(sh('Enemy_teleport'), 75),
    };
});
