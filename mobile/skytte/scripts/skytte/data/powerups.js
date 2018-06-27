define('skytte.data.powerups', ['settings', 'skytte.bounding_box', 'skytte.entities.ship'], function(settings, BoundingBox, ShipEntity) {

    function multiplyWeaponsDamage(game, multiplier) {
        var weapon;
        for (var l = 0; l < game.allWeapons.length; l++)
            for (var i = 0; i < game.allWeapons[l].length; i++) {
                weapon = game.allWeapons[l][i];
                if (typeof weapon._originalDamage === 'undefined')
                    weapon._originalDamage = weapon.damage;
                weapon.damage *= multiplier;
            }
    }

    function restoreWeaponsDamage(game) {
        var weapon;
        for (var l = 0; l < game.allWeapons.length; l++)
            for (var i = 0; i < game.allWeapons[l].length; i++) {
                weapon = game.allWeapons[l][i];
                if (typeof weapon._originalDamage !== 'undefined') {
                    weapon.damage = weapon._originalDamage;
                    delete weapon._originalDamage;
                }
            }
    }

    var PLAYER_TEAM = 1;
    var ENEMY_TEAM = 2;
    var POWERUP_BOX = BoundingBox.fromString('12,12 24,24');
    var POWERUP_MASS = 40;

    var POWERUP_SCORE_1 = {
        'sprite': 'powerUps 8,0',
        'sound': 'soundPowerUpCollect',
        'soundVolume': settings('POWERUP_SCORE_VOLUME', 1),
        'score': 50,
        'vx': -80,
        'box': POWERUP_BOX,
        'mass': POWERUP_MASS,
        'team': PLAYER_TEAM
    };
    var POWERUP_SCORE_2 = {
        'sprite': 'powerUps 9,0',
        'sound': 'soundPowerUpCollect',
        'soundVolume': settings('POWERUP_SCORE_VOLUME', 1),
        'score': 150,
        'vx': -80,
        'box': POWERUP_BOX,
        'mass': POWERUP_MASS,
        'team': PLAYER_TEAM
    };
    var POWERUP_SCORE_3 = {
        'sprite': 'powerUps 10,0',
        'sound': 'soundPowerUpCollect',
        'soundVolume': settings('POWERUP_SCORE_VOLUME', 1),
        'score': 500,
        'vx': -80,
        'box': POWERUP_BOX,
        'mass': POWERUP_MASS,
        'team': PLAYER_TEAM
    };
    var POWERUP_REPAIR = {
        'sound': 'soundPowerUpRepair',
        'soundVolume': settings('POWERUP_REPAIR_VOLUME', 1),
        'sprite': 'powerUps 11,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game, powerUp) {
            game.player.health = game.player.maxHealth;
            game.player.shield = game.player.maxShield;
        }
    };
    var POWERUP_SCORE_MULTIPLIER_X2 = {
        'sound': 'soundPowerUpScoreMultiplier',
        'soundVolume': settings('POWERUP_SCORE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 12,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.multiplier += 2;
        },
        'activeFunc': function(game, timeDelta) {
            game.comboTime = 0;
        }
    };
    var POWERUP_SCORE_MULTIPLIER_X3 = {
        'sound': 'soundPowerUpScoreMultiplier',
        'soundVolume': settings('POWERUP_SCORE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 13,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.multiplier += 3;
        },
        'activeFunc': function(game, timeDelta) {
            game.comboTime = 0;
        }
    };
    var POWERUP_SCORE_MULTIPLIER_X4 = {
        'sound': 'soundPowerUpScoreMultiplier',
        'soundVolume': settings('POWERUP_SCORE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 14,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.multiplier += 4;
        },
        'activeFunc': function(game, timeDelta) {
            game.comboTime = 0;
        }
    };
    var POWERUP_DAMAGE_MULTIPLIER_X2 = {
        'sound': 'soundPowerUpDamageMultiplier',
        'soundVolume': settings('POWERUP_DAMAGE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 15,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            multiplyWeaponsDamage(game, 2);
        },
        'expiredFunc': restoreWeaponsDamage
    };
    var POWERUP_DAMAGE_MULTIPLIER_X3 = {
        'sound': 'soundPowerUpDamageMultiplier',
        'soundVolume': settings('POWERUP_DAMAGE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 16,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            multiplyWeaponsDamage(game, 3);
        },
        'expiredFunc': restoreWeaponsDamage
    };
    var POWERUP_DAMAGE_MULTIPLIER_X4 = {
        'sound': 'soundPowerUpDamageMultiplier',
        'soundVolume': settings('POWERUP_DAMAGE_MULTIPLIER_VOLUME', 1),
        'sprite': 'powerUps 17,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 15000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            multiplyWeaponsDamage(game, 4);
        },
        'expiredFunc': restoreWeaponsDamage
    };
    var POWERUP_LIFE = {
        'sound': 'soundPowerUpLife',
        'soundVolume': settings('POWERUP_LIFE_VOLUME', 1),
        'sprite': 'powerUps 1,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.lifes += 1;
        }
    };
    var POWERUP_INVINCIBILITY = {
        'sound': 'soundPowerUpInvincibility',
        'soundVolume': settings('POWERUP_INVINCIBILITY_VOLUME', 1),
        'sprite': 'powerUps 4,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'duration': 25000,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            game.player.invincibleTime += 20000;
        }
    };
    var POWERUP_KILL_ALL = {
        'sprite': 'powerUps 5,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            var entity;
            for (var i = 0; i < game.entities.length; i++) {
                entity = game.entities[i];
                if (entity instanceof ShipEntity && entity.team === game.ENEMY_TEAM) {
                    entity.health = 0;  // Reset health to add score.
                    entity.explode();
                }
            }
        }
    };
    var POWERUP_SHIELD_UPGRADE = {
        'sound': 'soundPowerUpShieldUpgrade',
        'soundVolume': settings('POWERUP_SHIELD_UPGRADE_VOLUME', 1),
        'sprite': 'powerUps 3,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            if (game.player.shieldLevel < 3) {
                game.player.shieldLevel++;
                game.player.shield = game.player.maxShield += 500;
            }
        }
    };
    var POWERUP_WEAPON_UPGRADE = {
        'sound': 'soundPowerUpWeaponUpgrade',
        'soundVolume': settings('POWERUP_WEAPON_UPGRADE_VOLUME', 1),
        'sprite': 'powerUps 2,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'collectFunc': function(game) {
            if (game.getCurrentWeapon().level < 3)
                // Upgrade current weapon
                game.upgradeWeapon(game.currentWeapon);
            else {
                // Upgrade first weapon that's not reached last upgrade level.
                for (var i = 0; i < game.weapons.length; i++)
                    if (game.weapons[i].level < 3) {
                        game.upgradeWeapon(i);
                        return
                    }

                // All weapons upgraded, so add score.
                game.makePowerUp(this.position.x, this.position.y, POWERUP_SCORE_3);
                this.dead = true;
            }
        }
    };
    var POWERUP_RANDOM = {
        'sprite': 'powerUps 0,0',
        'box': POWERUP_BOX,
        'team': PLAYER_TEAM,
        'vx': -80,
        'mass': POWERUP_MASS,
        'choices': [
            POWERUP_SCORE_3,
            POWERUP_SCORE_MULTIPLIER_X4,
            POWERUP_DAMAGE_MULTIPLIER_X4,
            POWERUP_LIFE,
            POWERUP_INVINCIBILITY,
            POWERUP_KILL_ALL,
            POWERUP_SHIELD_UPGRADE,
            POWERUP_WEAPON_UPGRADE
        ],
        'collectFunc': function(game) {
            var powerUpConfig = this.choices[Math.floor(Math.random() * this.choices.length)];
            game.makePowerUp(this.position.x, this.position.y, powerUpConfig);
            this.dead = true;
        }
    };

    return {
        'POWERUP_SCORE_1': POWERUP_SCORE_1,
        'POWERUP_SCORE_2': POWERUP_SCORE_2,
        'POWERUP_SCORE_3': POWERUP_SCORE_3,
        'POWERUP_REPAIR': POWERUP_REPAIR,
        'POWERUP_SCORE_MULTIPLIER_X2': POWERUP_SCORE_MULTIPLIER_X2,
        'POWERUP_SCORE_MULTIPLIER_X3': POWERUP_SCORE_MULTIPLIER_X3,
        'POWERUP_SCORE_MULTIPLIER_X4': POWERUP_SCORE_MULTIPLIER_X4,
        'POWERUP_DAMAGE_MULTIPLIER_X2': POWERUP_DAMAGE_MULTIPLIER_X2,
        'POWERUP_DAMAGE_MULTIPLIER_X3': POWERUP_DAMAGE_MULTIPLIER_X3,
        'POWERUP_DAMAGE_MULTIPLIER_X4': POWERUP_DAMAGE_MULTIPLIER_X4,
        'POWERUP_LIFE': POWERUP_LIFE,
        'POWERUP_INVINCIBILITY': POWERUP_INVINCIBILITY,
        'POWERUP_KILL_ALL': POWERUP_KILL_ALL,
        'POWERUP_SHIELD_UPGRADE': POWERUP_SHIELD_UPGRADE,
        'POWERUP_WEAPON_UPGRADE': POWERUP_WEAPON_UPGRADE,
        'POWERUP_RANDOM': POWERUP_RANDOM
    };
});
