define('skytte.main', ['jquery', 'settings', 'skytte.numbers', 'skytte.level', 'skytte.game', 'skytte.data.levels', 'skytte.data.resources'],
       function(jQuery, settings, numbers, Level, Game, levels, RESOURCES) {

    createjs.Sound.defaultInterruptBehavior = createjs.Sound.INTERRUPT_LATE;

    var screen = document.getElementById('screen');
    var game = new Game(screen, 1, settings('DEBUG', false), RESOURCES);
    var gameLevels = null;
    var currentLevel = -1;
    var highscore = loadHighscore('skytte.highscore');
    var audio = JSON.parse(localStorage.getItem('skytte.audio'));
    var music = JSON.parse(localStorage.getItem('skytte.music'));
    var musicTrack = document.getElementById('music');

    if (audio !== true && audio !== false)
        audio = true;
    if (music !== true && music !== false)
        music = true;
    jQuery('@toggle-audio').toggleClass('active', audio);
    jQuery('@toggle-music').toggleClass('active', music);
    musicTrack.volume = settings('MUSIC_VOLUME', 1);
    if (music)
        musicTrack.play();

    var menu = jQuery('.game>.menu');
    var mainMenu = jQuery('@menu-main');
    var loadingMenu = jQuery('@menu-loading');
    var pauseMenu = jQuery('@menu-pause');
    var restartMenu = jQuery('@menu-restart');
    var gameSummaryMenu = jQuery('@menu-game-summary');
    var levelSummaryMenu = jQuery('@menu-level-summary');

    updateStatsTables();
    mainMenu.show();
    mainMenu.find('@new-game').focus();
    loadingMenu.find('@play-game').hide();
    game.resume();
    game.releaseInput();

    function loadHighscore(keyName) {
        var localScore = JSON.parse(localStorage.getItem(keyName) || '{}');
        return {
            'score': parseInt(localScore.score, 10) || 0,
            'bestCombo': parseInt(localScore.bestCombo, 10) || 0,
            'bestMultiplier': parseInt(localScore.bestMultiplier, 10) || 1,
            'kills': parseInt(localScore.kills, 10) || 0,
            'distance': parseInt(localScore.distance, 10) || 0
        };
    }

    function saveHighscore(keyName, highscore) {
        localStorage.setItem(keyName, JSON.stringify(highscore));
    }

    function showMenuScreen(menuScreen) {
        game.releaseInput();
        menu.show().children().hide();
        menuScreen.show();
        menuScreen.find('a.button:first').focus();
        if (game.paused)
            createjs.Sound.setMute(true);
    }

    function hideMenuScreen() {
        game.acquireInput();
        menu.hide().children().hide();
        menu.find('a').blur();
        createjs.Sound.setMute(!audio);
    }

    function newGame() {
        gameLevels = levels.generateGame();
        currentLevel = -1;
        game.allResourcesLoaded.connect(onGameLoad);
        showMenuScreen(loadingMenu);
        game.load();
    }

    function onGameLoad() {
        loadingMenu.find('@play-game').show();
        loadingMenu.find('.progress').hide();
    }

    function playGame() {
        game.newGame();
        nextLevel();
        jQuery(screen).show();
        createjs.Sound.setMute(!audio);
        if (game.paused)
            game.resume();
    }

    function pauseGame() {
        game.pause();
        showMenuScreen(pauseMenu);
    }

    function resumeGame() {
        hideMenuScreen();
        game.resume();
    }

    function nextLevel() {
        if (currentLevel < gameLevels.length - 1) {
            currentLevel += 1;
            game.loadLevel(gameLevels[currentLevel]);
            hideMenuScreen();
            game.enableAutofire();
        }
    }

    function updateStatsTables() {
        jQuery('@player-score-game').text(numbers.format(game.score + game.combo));
        jQuery('@player-best-combo-game').text(numbers.format(game.bestCombo));
        jQuery('@player-best-multiplier-game').text(numbers.format(game.bestMultiplier));
        jQuery('@player-kill-count-game').text(numbers.format(game.kills));
        jQuery('@player-distance-game').text(numbers.format(Math.ceil(game.distance / 2000)));

        jQuery('@player-score-best').text(numbers.format(highscore.score));
        jQuery('@player-best-combo-best').text(numbers.format(highscore.bestCombo));
        jQuery('@player-best-multiplier-best').text(numbers.format(highscore.bestMultiplier));
        jQuery('@player-kill-count-best').text(numbers.format(highscore.kills));
        jQuery('@player-distance-best').text(numbers.format(Math.ceil(highscore.distance / 2000)));
    }

    function onLevelEnd() {
        game.disableAutofire();
        game.level.end();
        game.level = null;
        game.player.health = game.player.maxHealth;
        game.player.shield = game.player.maxShield;
        if (currentLevel === gameLevels.length - 1) {
            game.score += game.lifes * 50000;
            gameSummaryMenu.find('h1').text('Mission Complete');
        } else
            levelSummaryMenu.find('@level').text(currentLevel + 1);

        updateStatsTables();
        updateHighscore();
        saveHighscore('skytte.highscore', highscore);
        showMenuScreen(currentLevel < gameLevels.length - 1 ? levelSummaryMenu : gameSummaryMenu);
    }

    function updateHighscore() {
        highscore.score = Math.max(highscore.score, game.score + game.combo);
        highscore.bestCombo = Math.max(highscore.bestCombo, game.bestCombo);
        highscore.bestMultiplier = Math.max(highscore.bestMultiplier, game.bestMultiplier);
        highscore.kills = Math.max(highscore.kills, game.kills);
        highscore.distance = Math.max(highscore.distance, game.distance);
    }

    function onPlayerDied() {
        if (game.lifes === 0 || !game.player) {
            gameSummaryMenu.find('h1').text('Game Over');
            updateStatsTables();
            updateHighscore();
            saveHighscore('skytte.highscore', highscore);
            showMenuScreen(gameSummaryMenu);
        }
    }

    game.gamePaused.connect(function() {
        showMenuScreen(pauseMenu);
    });
    game.levelEnded.connect(onLevelEnd);
    game.playerDied.connect(onPlayerDied);

    game.afterDraw = function(game) {
        if (game.debug) {
            var text = 'FPS: ' + game.fps +
                       '    Kills: ' + game.kills +
                       '    Entities: ' + game.entities.length +
                       '    Score: ' + game.score +
                       '    Combo: ' + game.combo +
                       '    Multiplier: ' + game.multiplier +
                       '    Distance: ' + (game.distance / 2000).toFixed(1) + ' kilometers';
            game.context.font = '700 13px/16px sans-serif';
            game.context.fillStyle = '#000';
            game.context.fillText(text, 7, game.SCREEN.HEIGHT - 9);
            game.context.fillStyle = '#fff';
            game.context.fillText(text, 6, game.SCREEN.HEIGHT - 10);
        }
    };

    game.resourceLoaded.connect(function() {
        var percent = Math.round(game.loaded / game.toLoad * 100) + '%';
        jQuery('@load-progress').text(percent);
        jQuery('@load-progress-bar').width(percent);
    });

    menu.find('a').click(function(event) {
        event.preventDefault();
    });

    jQuery('@new-game').click(newGame);
    jQuery('@resume-game').click(resumeGame);
    jQuery('@play-game').click(playGame);
    jQuery('@next-level').click(nextLevel);
    jQuery('@restart-game').click(function() {
        showMenuScreen(restartMenu);
    });
    jQuery('@cancel-game-restart').click(function() {
        showMenuScreen(pauseMenu);
    });

    jQuery('@toggle-audio').click(function(event) {
        audio = !audio;
        jQuery('@toggle-audio').toggleClass('active', audio);
        localStorage.setItem('skytte.audio', JSON.stringify(audio));
    });

    jQuery('@toggle-music').click(function(event) {
        music = !music;
        jQuery('@toggle-music').toggleClass('active', music);
        localStorage.setItem('skytte.music', JSON.stringify(music));
        if (music)
            musicTrack.play();
        else
            musicTrack.pause();
    });


    /*
     * Simple touchscreen input implementation follows.
     */
    var touchD = 10;
    var touchMoveId = null;
    var touchMoveStart = null;
    var touchTapId = null;
    var touchTapStart = null;

    function enableTouch() {
        screen.addEventListener('touchstart', onTouchStart, false);
        screen.addEventListener('touchmove', onTouchMove, false);
        screen.addEventListener('touchend', onTouchEnd, false);
    }

    function onTouchStart(event) {
        event.preventDefault();
        var touch = event.changedTouches[0];

        if (touchMoveId === null) {
            touchMoveId = touch.identifier;
            touchMoveStart = {'x': touch.pageX, 'y': touch.pageY};
        }

        if (touchTapId === null) {
            touchTapId = touch.identifier;
            touchTapStart = {'x': touch.pageX, 'y': touch.pageY};
        }
    }

    function onTouchMove(event) {
        event.preventDefault();

        if (touchMoveId !== null) {
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];
                if (touch.identifier === touchMoveId) {
                    var touchX = touch.pageX - touchMoveStart.x;
                    var touchY = touch.pageY - touchMoveStart.y;
                    if (touchY > 0)
                        game.player.moveDown(Math.min(1, Math.abs(touchY) / touchD));
                    else if (touchY < 0)
                        game.player.moveUp(Math.min(1, Math.abs(touchY) / touchD));
                    if (touchX > 0)
                        game.player.moveRight(Math.min(1, Math.abs(touchX) / touchD));
                    else if (touchX < 0)
                        game.player.moveLeft(Math.min(1, Math.abs(touchX) / touchD));

                    touchMoveStart = {'x': touch.pageX, 'y': touch.pageY};
                    break;
                }
            }
        }

        if (touchTapId !== null)
            for (var i = 0; i < event.changedTouches.length; i++) {
                var touch = event.changedTouches[i];
                if (touch.identifier === touchTapId)
                    if (Math.abs(touch.pageX - touchTapStart.x) > 4 || Math.abs(touch.pageY - touchTapStart.y) > 4)
                        touchTapId = null;
            }
    }

    function onTouchEnd(event) {
        event.preventDefault();

        if (touchMoveId !== null)
            for (var i = 0; i < event.changedTouches.length; i++)
                if (event.changedTouches[i].identifier === touchMoveId) {
                    touchMoveStart = touchMoveId = null;
                    break;
                }

        if (touchTapId !== null) {
            var offset = jQuery(screen).offset();
            if (touchTapStart.x - offset.left > game.context.canvas.width - 53 && touchTapStart.y - offset.top < 53)
                pauseGame();
            else
                game.changeWeapon((game.currentWeapon + 1) % game.weapons.length);
            touchTapStart = touchTapId = null;
        }
    }

    if ('createTouch' in document)
        enableTouch();
    else
        jQuery(screen).click(pauseGame);

    return game;
});
