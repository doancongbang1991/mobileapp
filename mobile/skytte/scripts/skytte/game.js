define('skytte.game', function() {
    var settings = require('settings');
    var Signal = require('skytte.signal');
    var numbers = require('skytte.numbers');
    var collision = require('skytte.collision');
    var FogEntity = require('skytte.entities.fog');
    var ShipEntity = require('skytte.entities.ship');
    var LabelEntity = require('skytte.entities.label');
    var Explosion = require('skytte.particles.explosion');
    var KEYS = require('skytte.keys');
    var BackgroundEntity = require('skytte.entities.background');
    var SpriteEntity = require('skytte.entities.sprite');
    var MushroomEmitter = require('skytte.particles.mushroom');
    var hud = require('skytte.entities.hud');
    var PowerUpEntity = require('skytte.entities.power_up');
    var TurretEntity = require('skytte.entities.turret');
    var CartEntity = require('skytte.entities.cart');
    var MineEntity = require('skytte.entities.mine');
    var SwarmEntity = require('skytte.entities.swarm');
    var TeleporterEntity = require('skytte.entities.teleporter');
    var MoveLeftAI = require('skytte.ai.move_left');
    var KamikazeAI = require('skytte.ai.kamikaze');
    var TeleporterAI = require('skytte.ai.teleporter');
    var FollowAI = require('skytte.ai.follow');
    var WaveAI = require('skytte.ai.wave');
    var CartAI = require('skytte.ai.cart');
    var Level = require('skytte.level');

    function Game(canvas, scale, debug, data) {
        this.COMBO_DELAY = 2500;

        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.debug = debug;
        this.data = data;
        this.toLoad = this.loaded = 0;
        this.paused = true;
        this.autofire = true;
        this._enemyCount = 0;

        this.fps = this._frame = this._fpsTime = 0;
        this._currentTimestamp = this._prevTimestamp = 0;

        this.NEUTRAL_TEAM = 0;
        this.PLAYER_TEAM = 1;
        this.ENEMY_TEAM = 2;

        this.WORLD = {
            'WIDTH': this.canvas.width,
            'HEIGHT': this.canvas.height - 60,  // Space accessible to ships.
            'FULL_HEIGHT': this.canvas.height,
            'SCALE': 1
        };

        this.SCREEN = {
            'WIDTH': this.canvas.width,
            'HEIGHT': this.canvas.height,
            'SCALE': scale
        };

        this.keys = {};
        this._clearKeyBuffer();

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        // Callbacks to customize look and behaviour.
        this.beforeDraw = this.afterDraw = null;
        this.beforeLogic = this.afterLogic = null;

        this._tickProxy = this._tick.bind(this);
        this._touchscreen = 'createTouch' in document;

        this.gamePaused = new Signal();
        this.gameResumed = new Signal();
        this.playerDied = new Signal();
        this.levelEnded = new Signal();
        this.resourceLoaded = new Signal();
        this.allResourcesLoaded = new Signal();

        this.newGame();
    }

    Game.prototype.getCurrentWeapon = function() {
        if (this.currentWeapon >= 0)
            return this.weapons[this.currentWeapon];
        return null;
    };

    Game.prototype._onResourceLoad = function() {
        this.loaded++;
        this.resourceLoaded.send(this);
        if (this.loaded === this.toLoad)
            this.allResourcesLoaded.send(this);
    };

    Game.prototype.load = function() {
        var resource;
        if (this.toLoad > 0 && this.loaded === this.toLoad) {
            this.allResourcesLoaded.send(this);
            return;
        }
        for (var name in this.data)
            if (this.data.hasOwnProperty(name)) {
                resource = this.data[name];
                if (!resource.hasLoaded) {
                    resource.loaded.connect(this._onResourceLoad.bind(this));
                    resource.load();
                    this.toLoad += 1;
                }
            }
        if (this.toLoad === 0)
            this.allResourcesLoaded.send(this);
    };

    Game.prototype.getResource = function(resource) {
        // `resource` should be: 'resourceName' or 'resourceName x,y'
        var parts = resource.split(' ');

        var name = parts[0];
        if (!(name in this.data))
            throw new Error('invalid resource name: "' + String(resource) + '"');

        if (parts.length === 1)
            return this.data[name];
        else if (parts.length === 2) {
            var pos = parts[1].split(',');
            var x = parseInt(pos[0], 10);
            var y = parseInt(pos[1], 10);
            return this.data[name].getSprite(x, y);
        } else
            throw new Error('invalid resource name: "' + String(resource) + '"');
    };

    Game.prototype.addBackground = function(entity) {
        this.backgrounds.push(entity);
    };

    Game.prototype.addForeground = function(entity) {
        this.foregrounds.push(entity);
    };

    Game.prototype.prependForeground = function(entity) {
        this.foregrounds.splice(0, 0, entity);
    };

    Game.prototype.prependEntity = function(entity, delay) {
        this._entitiesToAdd.push({'entity': entity, 'delay': delay || 0, 'where': 'prepend'});
    };

    Game.prototype.isEntityInGame = function(entity) {
        for (var i = 0; i < this.entities.length; i++)
            if (this.entities[i] === entity)
                return true;
        return false;
    };

    Game.prototype.addEntity = function(entity, delay) {
        this._entitiesToAdd.push({'entity': entity, 'delay': delay || 0, 'where': 'append'});
    };

    Game.prototype.addExplosion = function(x, y, radius, damage, team, delay) {
        this.shake = Math.min(6, this.shake + (radius + (damage || 0)) / 200);
        this.addEntity(new Explosion(this, x, y, {'radius': radius, 'damage': damage, 'team': team}), delay);
    };

    Game.prototype.addScoreLabel = function(killedEntity, score) {
        var center = killedEntity.getCenter();
        var label = new LabelEntity(this, center.x, center.y, {'font': 'fontSmall', 'text': '+' + score, 'life': 1000});
        this.foregrounds.splice(0, 0, label);
    }

    Game.prototype.addCombo = function(points) {
        points *= this.multiplier;
        this.combo += points;
        while (this.combo > Math.pow(this.multiplier, 2) * 250)
            this.multiplier += 1;
        this.comboTime = 0;
        return points;
    };

    Game.prototype.resetCombo = function() {
        this.score += this.combo;
        this.bestCombo = Math.max(this.combo, this.bestCombo);
        this.bestMultiplier = Math.max(this.multiplier, this.bestMultiplier);
        this.comboTime = this.combo = 0;
        this.multiplier = 1;
    };

    Game.prototype.makeScenery = function(scenery) {
        this.backgrounds = [];
        this.foregrounds = [];
        if (scenery.layer6)
            this.addBackground(new BackgroundEntity(this, scenery.layer6));
        if (scenery.layer5)
            this.addBackground(new BackgroundEntity(this, scenery.layer5));
        if (scenery.layer4)
            this.addBackground(new BackgroundEntity(this, scenery.layer4));
        if (scenery.layer3)
            this.addBackground(new BackgroundEntity(this, scenery.layer3));

        if (scenery.fog)
            for (var i = 0; i < 8; i++)
                this.addForeground(new FogEntity(this, scenery.fog));
        if (scenery.mushroom)
            for (var i = 0; i < (scenery.mushroom.count || 3); i++)
                this.addForeground(new MushroomEmitter(this, scenery.mushroom));
        if (scenery.layer2)
            this.addForeground(new BackgroundEntity(this, scenery.layer2));
        if (scenery.layer1)
            this.addForeground(new BackgroundEntity(this, scenery.layer1));
    };

    Game.prototype.makeHUD = function() {
        var x;
        var weaponsBackground = this.data.HUDWeaponsBackground;
        var weapon = new hud.Weapon(this, this.WORLD.WIDTH - 102 - 10 * this.SCREEN.SCALE,
                                    this.WORLD.HEIGHT - 103 + 50 * this.SCREEN.SCALE,
                                    {'background': 'HUDWeaponBackground', 'level': 'HUDWeaponLevel',
                                     'icons': 'HUDWeapons'});
        this.addForeground(weapon);

        var iconsSpritesheet = this.data.HUDHealthIcons;
        var heartIcon = iconsSpritesheet.getSprite(0, 0);
        var shieldIcon = iconsSpritesheet.getSprite(1, 0);
        x = this.WORLD.WIDTH - 270 - 4;
        if (this._touchscreen)
            x -= 53 + 8;
        var health = new hud.HealthBar(this, x, 4,
                                       {'bars': 'HUDHealthBars', 'background': 'HUDHealthBackground',
                                        'heartIcon': heartIcon, 'shieldIcon': shieldIcon, 'font': 'fontBig'});
        this.addForeground(health);

        var score = new hud.Score(this, 5, 5, {'font': 'fontBig', 'icons': 'HUDScoreIcons'});
        this.addForeground(score);

        x = this.WORLD.WIDTH - 270 - 53 - 8 - 4;
        if (this._touchscreen)
            x -= 53 + 8;
        var powerUp = new hud.PowerUp(this, x, 5,
                                      {'background': 'HUDPowerUp', 'icons': 'powerUps'});
        this.addForeground(powerUp);

        var levelProgress = new hud.LevelProgress(this, (this.WORLD.WIDTH - 480) / 2, this.WORLD.FULL_HEIGHT - 50,
                                                  {'sprite': 'HUDLevelProgress'});
        this.addForeground(levelProgress);

        if (this._touchscreen)
            this.addForeground(new SpriteEntity(this, this.WORLD.WIDTH - 57, 4, {'sprite': 'HUDPause'}));
    };

    Game.prototype.makePlayerWeapons = function(config) {
        var plasma = require('skytte.weapons.plasma');
        var storm = require('skytte.weapons.storm');
        var laser = require('skytte.weapons.laser');
        var ray = require('skytte.weapons.ray');
        var rockets = require('skytte.weapons.rockets');
        var flak = require('skytte.weapons.flak');
        var electro = require('skytte.weapons.electro');

        var weapon, x = 31, y = 48;
        var weaponNames = ['PLASMA', 'STORM', 'RAY', 'ROCKETS', 'FLAK', 'ELECTRO'];
        var weaponConstructors = [plasma.PlasmaWeapon, storm.StormWeapon, ray.RayWeapon, rockets.RocketsWeapon,
                                  flak.FlakWeapon, electro.ElectroWeapon];

        this.allWeapons = [];

        for (var l = 1; l < 4; l++) {
            this.allWeapons.push([]);
            for (var n = 0; n < weaponNames.length; n++) {
                weapon = new (weaponConstructors[n])(this, this.player, x, y, config[weaponNames[n] + '_' + l]);
                this.allWeapons[l - 1].push(weapon);
            }
        }

        this.weapons = this.allWeapons[0];
        this.currentWeapon = -1;
        this.changeWeapon(0);
    };

    Game.prototype.makePlayerShip = function(x, y, config) {
        this.player = new ShipEntity(this, x, y, config);
        this.changeWeapon(this.currentWeapon);
        this.addEntity(this.player);
    };

    Game.prototype.makePowerUp = function(x, y, config) {
        this.addEntity(new PowerUpEntity(this, x - (config.box.x + config.box.width) / 2,
                                         y - (config.box.y + config.box.height) / 2, config));
    };

    Game.prototype.makeHint = function(x, y, config) {
        this.addBackground(new SpriteEntity(this, x, y, config));
    };

    Game.prototype.makeShip = function(ShipClass, shipArgs, AIClass, aiArgs) {
        var weapon;

        shipArgs.unshift(null, this);
        var ship = new (ShipClass.bind.apply(ShipClass, shipArgs));

        if (AIClass) {
            if (!aiArgs)
                aiArgs = [];
            aiArgs.unshift(null, this, ship);
            ship.ai = new (AIClass.bind.apply(AIClass, aiArgs));
        }

        return ship;
    };

    Game.prototype.makeMine = function(x, y, config) {
        this.addEntity(this.makeShip(MineEntity, [x, y, config], config.ai || MoveLeftAI));
    };

    Game.prototype.makeAggressiveMine = function(x, y, config) {
        this.addEntity(this.makeShip(MineEntity, [x, y, config], config.ai || KamikazeAI, [this.player]));
    };

    Game.prototype.makeSwarmUnit = function(x, y, config) {
        this.addEntity(this.makeShip(SwarmEntity, [x, y, config], config.ai));
    };

    Game.prototype.makeSwarm = function(x, y, config, width, height, count, rotateSpeed) {
        for (var i = 0; i < count; i++)
            this.addEntity(this.makeShip(SwarmEntity, [x, y, config], config.ai || WaveAI,
                                         [x, y, width, height, i / count, rotateSpeed]));
    };

    Game.prototype.makeFighter = function(x, y, config) {
        this.addEntity(this.makeShip(ShipEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };

    Game.prototype.makeTeleporter = function(x, y, config) {
        this.addEntity(this.makeShip(TeleporterEntity, [x, y, config], config.ai || TeleporterAI, config.aiArgs || [config.AI]));
    };

    Game.prototype.makeElectrician = function(x, y, config) {
        this.addEntity(this.makeShip(ShipEntity, [x, y, config], config.ai || FollowAI, config.aiArgs || [this.player]));
    };

    Game.prototype.makeTank = function(x, y, config) {
        this.addEntity(this.makeShip(ShipEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };

    Game.prototype.makeFrigate = function(x, y, config) {
        this.addEntity(this.makeShip(ShipEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };

    Game.prototype.makeLaserTurretUp = function(x, config) {
        var y = this.WORLD.HEIGHT - config.box.y - config.box.height + 40;
        this.addEntity(this.makeShip(TurretEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };

    Game.prototype.makeLaserTurretDown = function(x, config) {
        this.addEntity(this.makeShip(TurretEntity, [x, 0, config], config.ai || MoveLeftAI, config.aiArgs));
    };

    Game.prototype.makeFlakTurretUp = function(x, config) {
        var y = this.WORLD.HEIGHT - config.box.y - config.box.height + 40;
        this.addEntity(this.makeShip(TurretEntity, [x, y, config], config.ai || MoveLeftAI, config.aiArgs));
    };

    Game.prototype.makeFlakTurretDown = function(x, config) {
        this.addEntity(this.makeShip(TurretEntity, [x, 0, config], config.ai || MoveLeftAI, config.aiArgs));
    };

    Game.prototype.makeCartTurret = function(x, y, config) {
        this.prependEntity(new SpriteEntity(this, x + 110, 0, {'sprite': 'cartTurretRail', 'vx': -config.speed}));
        this.addEntity(this.makeShip(CartEntity, [x, y, config], config.ai || CartAI, config.aiArgs || [{'direction': -1}]));
    };

    Game.prototype.collectPowerUp = function(powerUp) {
        if (powerUp.duration) {
            if (this.activePowerUp)
                this.activePowerUp.expired();
            this.activePowerUp = powerUp;
            this.activePowerUpTime = 0;
        }
        powerUp.collect();
    };

    Game.prototype.expireActivePowerUp = function() {
        if (this.activePowerUp) {
            this.activePowerUp.expired();
            this.activePowerUp = null;
            this.activePowerUpTime = 0;
        }
    };

    Game.prototype.findClosest = function(x, y, entityClass, minDistance, conditionFunc) {
        /*
         * Find closest entity of given type.
         */
        var target, targetCenter, targetCenterY, closestTarget = null, closestDistance = Number.MAX_VALUE, distance;

        // `minDistance` is used to search few closest objects.
        minDistance = minDistance || 0;

        for (var i = 0; i < this.entities.length; i++) {
            target = this.entities[i];
            if (!target.dead && target instanceof entityClass && (!conditionFunc || conditionFunc(target))) {
                targetCenter = target.getCenter();
                distance = Math.pow(targetCenter.x - x, 2) + Math.pow(targetCenter.y - y, 2);
                if (distance < closestDistance && distance > minDistance) {
                    closestDistance = distance;
                    closestTarget = target;
                }
            }
        }

        return {'target': closestTarget, 'distance': Math.sqrt(closestDistance)};
    };

    Game.prototype.newGame = function() {
        if (this.level)
            this.level.end();

        this.player = null;
        this.backgrounds = [];
        this.foregrounds = [];
        this.entities = [];
        this.allWeapons = [];  // All possible weapons with upgrades.
        this.weapons = [];  // Currently equipped weapons.
        this.currentWeapon = -1;
        this.lifes = 3;
        this.score = 0;
        this.combo = this.bestCombo = 0;
        this.multiplier = this.bestMultiplier = 1;
        this.kills = 0;
        this.comboTime = 0;
        this.distance = 0;  // Distance travelled by player in pixels.
        this.activePowerUp = null;
        this.activePowerUpTime = 0;
        this.shake = 0;
        this.level = null;
        this._entitiesToAdd = [];
    };

    Game.prototype.loadLevel = function(levelConfig) {
        if (this.level)
            this.level.end();

        this.score += this.combo;

        this.player = null;
        this.backgrounds = [];
        this.foregrounds = [];
        this.entities = [];
        this.combo = 0;
        this.multiplier = 1;
        this.comboTime = 0;
        this.activePowerUp = null;
        this.activePowerUpTime = 0;
        this.shake = 0;
        this.level = null;
        this._entitiesToAdd = [];

        this.level = new Level(this, levelConfig);
        if (!this._playerLowLifeSoundInstance)
            this._playerLowLifeSoundInstance = this.getResource('soundPlayerLowLife').getInstance();

        if (this.player && this.autofire)
            this.player.startShooting();
    };

    Game.prototype._clearKeyBuffer = function() {
        for (var name in KEYS)
            if (KEYS.hasOwnProperty(name))
                this.keys[KEYS[name]] = false;
    };

    Game.prototype.acquireInput = function() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    };

    Game.prototype.releaseInput = function() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        this._clearKeyBuffer();
    };

    Game.prototype.onKeyDown = function(event) {
        if (event.which in this.keys) {
            event.preventDefault();
            this.keys[event.which] = true;
        }
    };

    Game.prototype.onKeyUp = function(event) {
        if (event.which in this.keys)
            this.keys[event.which] = false;
    };

    Game.prototype.input = function() {
        if (!this.player)
            return;

        if (this.keys[KEYS.CHAR_P] || this.keys[KEYS.ESC] || this.keys[KEYS.PAUSE])
            this.pause();
        if (this.keys[KEYS.ARROW_UP])
            this.player.moveUp(.125);
        if (this.keys[KEYS.ARROW_DOWN])
            this.player.moveDown(.125);
        if (this.keys[KEYS.ARROW_LEFT])
            this.player.moveLeft(.125);
        if (this.keys[KEYS.ARROW_RIGHT])
            this.player.moveRight(.125);

        if (this.keys[KEYS.CHAR_1])
            this.changeWeapon(0);
        if (this.keys[KEYS.CHAR_2])
            this.changeWeapon(1);
        if (this.keys[KEYS.CHAR_3])
            this.changeWeapon(2);
        if (this.keys[KEYS.CHAR_4])
            this.changeWeapon(3);
        if (this.keys[KEYS.CHAR_5])
            this.changeWeapon(4);
        if (this.keys[KEYS.CHAR_6])
            this.changeWeapon(5);
    };

    Game.prototype.isPlayerShooting = function() {
        return this.player && this.player.hasWeapon() && this.player.weapons[0].shooting
    };

    Game.prototype.changeWeapon = function(index) {
        if (this.weapons[index] === this.player.weapons[0])
            return;

        var shooting = this.isPlayerShooting();
        if (shooting)
            this.player.stopShooting();

        if (this.currentWeapon !== -1)
            this.getResource('soundPlayerWeaponChange').play({'volume': settings('WEAPON_CHANGE_VOLUME', 1)});
        this.currentWeapon = index;
        var weapon = this.weapons[this.currentWeapon];
        this.player.weapons[0] = weapon;
        weapon.owner = this.player;

        if (shooting)
            this.player.startShooting();
    };

    Game.prototype.upgradeWeapon = function(index) {
        var weapon = this.weapons[index];
        if (weapon.level >= 3)
            return;

        var shooting = false;
        if (this.player.hasWeapon() && this.player.weapons[0] === weapon) {
            shooting = this.player.weapons[0].shooting;
            this.player.stopShooting();
        }

        this.weapons[index] = this.allWeapons[weapon.level][index];
        this.weapons[index].owner = this.player;

        if (this.player.weapons[0] === weapon) {
            this.player.weapons[0] = this.weapons[index];

            if (shooting)
                this.player.startShooting();
        }
    };

    Game.prototype.spawnQueuedEntities = function(timeDelta) {
        var i = this._entitiesToAdd.length, item;
        while (--i >= 0) {
            item = this._entitiesToAdd[i];
            item.delay -= timeDelta * 1000;
            if (item.delay <= 0) {
                if (item.where === 'prepend')
                    this.entities.splice(0, 0, item.entity);
                else
                    this.entities.push(item.entity);
                this._entitiesToAdd.splice(i, 1);
            }
        }
    };

    Game.prototype.checkCollisions = function() {
        var a, b, i, j, colliding, entityCount = this.entities.length;

        for (i = 0; i < entityCount - 1; i++) {
            a = this.entities[i];
            if (!a.dead)
                for (j = i + 1; j < entityCount; j++) {
                    b = this.entities[j];
                    if (!b.dead && (a.team !== b.team || ((a.collectible || b.collectible) && (a.team === b.team)))) {
                        colliding = false;

                        if (a.box && b.box && collision.testBoundingBoxes(a.position, a.box, b.position, b.box) && a.polygon && b.polygon)
                            colliding = collision.testPolygons(a.position, a.polygon, b.position, b.polygon);

                        if (colliding) {
                            a.collidesWith(b);
                            b.collidesWith(a);

                            if (a.dead)
                                break;
                        }
                    }
                }
        }
    };

    Game.prototype.logic = function(timeDelta) {
        var i, entity, points;

        if (this.beforeLogic)
            this.beforeLogic(this, timeDelta);

        if (this.level)
            this.level.logic(timeDelta);

        this.shake = Math.max(0, this.shake - 4 * timeDelta);

        if (this.activePowerUp) {
            this.activePowerUp.active(timeDelta);
            this.activePowerUpTime += timeDelta * 1000;
            if (this.activePowerUpTime >= this.activePowerUp.duration)
                this.expireActivePowerUp();
        }

        this.spawnQueuedEntities(timeDelta);
        this.checkCollisions();

        i = this.backgrounds.length;
        while (--i >= 0) {
            entity = this.backgrounds[i];
            if (!entity.dead)
                entity.logic(timeDelta);
            else
                this.backgrounds.splice(i, 1);
        }

        i = this.foregrounds.length;
        while (--i >= 0) {
            entity = this.foregrounds[i];
            if (!entity.dead)
                entity.logic(timeDelta);
            else
                this.foregrounds.splice(i, 1);
        }

        this._enemyCount = 0;
        i = this.entities.length;
        while (--i >= 0) {
            entity = this.entities[i];
            if (!entity.dead) {
                entity.logic(timeDelta);
                // `this._enemyCount` must be zero to end current level (no enemies and no power-ups).
                if (entity.team === this.ENEMY_TEAM || entity instanceof PowerUpEntity)
                    this._enemyCount += 1;
            } else {
                entity.onRemove();
                if (entity instanceof ShipEntity && entity.health <= 0 && entity.team !== this.PLAYER_TEAM) {
                    this.kills += 1;
                    if (entity.score)
                        this.addScoreLabel(entity, this.addCombo(entity.score));
                } else if (entity === this.player) {
                    this.playerDied.send(this);
                    this._playerLowLifeSoundInstance.stop();
                }
                this.entities.splice(i, 1);
            }
        }

        if (this.combo || this.multiplier > 1) {
            this.comboTime += timeDelta * 1000;
            if (this.comboTime >= this.COMBO_DELAY)
                this.resetCombo();
        }

        if (this.player && !this.player.dead && this.level) {
            this.distance += 80 * timeDelta;
            if (this.player.health / this.player.maxHealth <= .25) {
                if (this._playerLowLifeSoundInstance.playState !== createjs.Sound.PLAY_SUCCEEDED)
                    this._playerLowLifeSoundInstance.play({'volume': settings('LOW_LIFE_VOLUME', 1), 'loop': -1});
            } else
                this._playerLowLifeSoundInstance.stop();
        } else if (this._playerLowLifeSoundInstance)
            this._playerLowLifeSoundInstance.stop();

        if (this.level && this.level.hasEnded() && !this._enemyCount && this.player && !this.player.dead) {
            this.resetCombo();
            this.levelEnded.send(this);
        }
    };

    Game.prototype.draw = function() {
        if (this.beforeDraw)
            this.beforeDraw(this);

        var shakeX = (Math.random() - .5) * this.shake * 2 * this.SCREEN.SCALE;
        var shakeY = (Math.random() - .5) * this.shake * 2 * this.SCREEN.SCALE;

        for (i = 0; i < this.backgrounds.length; i++)
            this.backgrounds[i].draw(this.context, this.SCREEN.SCALE, shakeX*.75, shakeY*.75);

        for (var i = 0; i < this.entities.length; i++)
            this.entities[i].draw(this.context, this.SCREEN.SCALE, shakeX, shakeY);

        for (i = 0; i < this.foregrounds.length; i++)
            this.foregrounds[i].draw(this.context, this.SCREEN.SCALE, shakeX*-1.5, shakeY*-1.5);

        if (this.afterDraw)
            this.afterDraw(this);
    };

    Game.prototype._tick = function() {
        this._currentTimestamp = new Date();
        var milliseconds = this._currentTimestamp - this._prevTimestamp;
        this._prevTimestamp = this._currentTimestamp;
        var timeDelta = milliseconds / 1000 * settings('GAME_SPEED', 1);

        /*
         * Skip big time delays. Handle two situations:
         * 1. User switches away from game to an other browser tab and then returns.
         * 2. Lower CPU usage when running too slow.
         */
        if (timeDelta < .2) {
            this.input();
            this.logic(timeDelta);
            this.draw(timeDelta);
        }

        this._frame += 1;
        this._fpsTime += milliseconds;
        if (this._fpsTime >= 1000) {
            this.fps = this._frame;
            this._fpsTime = this._frame = 0;
        }

        if (!this.paused)
            requestAnimationFrame(this._tickProxy);
    };

    Game.prototype.enableAutofire = function() {
        this.autofire = true;
        if (this.player && !this.isPlayerShooting())
            this.player.startShooting();
    };

    Game.prototype.disableAutofire = function() {
        this.autofire = false;
        if (this.player && this.isPlayerShooting())
            this.player.stopShooting();
    };

    Game.prototype.resume = function() {
        if (this.paused) {
            this.paused = false;
            this.acquireInput();
            this._currentTimestamp = this._prevTimestamp = new Date();
            this._tick();
            this.gameResumed.send(this);
        }
    };

    Game.prototype.pause = function() {
        this.paused = true;
        this.releaseInput();
        this.gamePaused.send(this);
    };

    Game.prototype.getPanForPosition = function(position, centerX) {
        if (typeof centerX === 'undefined')
            centerX = this.WORLD.WIDTH/2;
        // Calculates panning from the center of the screen or given point. -1 is left, 1 is right.
        return numbers.clip(-1, (position.x - centerX) / this.WORLD.WIDTH * 2, 1);
    };

    return Game;
});
