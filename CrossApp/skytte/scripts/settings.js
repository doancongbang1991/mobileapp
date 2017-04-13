define('settings', {
    'DEBUG': false,
    'GAME_SPEED': 1.5,
    'MUSIC_VOLUME': .49,
    'PLAYER_PLASMA_VOLUME': .273,
    'PLAYER_STORM_VOLUME': .273,
    'PLAYER_RAY_VOLUME': .753,
    'PLAYER_ROCKETS_VOLUME': .333,
    'PLAYER_FLAK_VOLUME': .433,
    'PLAYER_ELECTRO_VOLUME': .383,
    'WEAPON_CHANGE_VOLUME': .5,
    'LOW_LIFE_VOLUME': 1,
    'ENEMY_LASER_VOLUME': .333,
    'ENEMY_ELECTRO_VOLUME': .333,
    'ENEMY_FLAK_VOLUME': .333,
    'POWERUP_SCORE_VOLUME': 1,
    'POWERUP_SCORE_MULTIPLIER_VOLUME': 1,
    'POWERUP_DAMAGE_MULTIPLIER_VOLUME': 1,
    'POWERUP_REPAIR_VOLUME': 1,
    'POWERUP_LIFE_VOLUME': 1,
    'POWERUP_INVINCIBILITY_VOLUME': 1,  // Power-up pickup only, see also the SHIP_INVINCIBILITY_VOLUME setting.
    'POWERUP_SHIELD_UPGRADE_VOLUME': 1,
    'POWERUP_WEAPON_UPGRADE_VOLUME': 1,
    'ROCKET_EXPLODE_VOLUME': .5,  // Rocket hits something.
    'ROCKET_FLYING_VOLUME': .1,
    'MINE_APPROACH_VOLUME': .05,  // Also volume is scaled down when player is far from any mine.
    'SHIP_EXPLODE_VOLUME': 1,  // Includes detonated mine and player's ship explosion too.
    'SHIP_INVINCIBILITY_VOLUME': .9,
    'PLASMA_EXPLODE_VOLUME': .333,  // Plasma projectile hitting other object.
});
