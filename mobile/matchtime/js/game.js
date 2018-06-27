var DEBUG = false;
var input;
var stage;

var assets = [];
var spriteSheets = {};
var loader;

var mouseTolerance = 20;
var mouseTimeClick = 0.15;

function initialize() {
    stage = new createjs.Stage("myCanvas");
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.setFPS(60);
    createjs.Touch.enable(stage);
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
    createjs.Sound.alternateExtensions = ["ogg"];

    var manifest = [{
        src: "assets/main_screen.jpg",
        id: "mainMenu"
 }];

    loader = new createjs.LoadQueue(true);
    loader.installPlugin(createjs.Sound);
    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("complete", createLoader);
    loader.loadManifest(manifest);
}

function createLoader() {
    loader.removeAllEventListeners("fileload");
    loader.removeAllEventListeners("complete");

    var main = new createjs.Container();
    main.name = "mainMenu";
    stage.addChild(main);

    var img = loader.getResult("mainMenu");
    var bg = new createjs.Bitmap(img);
    main.addChild(bg);

    var titleDesc = new createjs.Text(localization.titleDesc, "10px titleFont", "#381c11");
    titleDesc.name = "titleDesc";
    titleDesc.x = 235;
    titleDesc.y = 20;
    titleDesc.textAlign = "center";
    titleDesc.textBaseline = 'middle';
    titleDesc.lineHeight = 0;
    titleDesc.alpha = 0.9;
    main.addChild(titleDesc);

    var titleLabel = new createjs.Text(localization.title, "30px titleFont", "#381c11");
    titleLabel.name = "titleLabel";
    titleLabel.x = 235;
    titleLabel.y = 40;
    titleLabel.textAlign = "center";
    titleLabel.textBaseline = 'middle';
    titleLabel.lineHeight = 28;
    titleLabel.alpha = 0.9;
    main.addChild(titleLabel);

    var loadingLabel = new createjs.Text(localization.loading, "16px titleFont", "#d2fce2");
    loadingLabel.name = "loadingLabel";
    loadingLabel.x = 240;
    loadingLabel.y = 292;
    loadingLabel.textAlign = "center";
    loadingLabel.textBaseline = "middle";
    main.addChild(loadingLabel);

    var manifest = [{
        src: "assets/ui.png",
        id: "uiBMP"
 }, {
        src: "assets/ui.json",
        id: "uiData"
 }, {
        src: "assets/assets.png",
        id: "assetsBMP"
 }, {
        src: "assets/assets.json",
        id: "assetsData"
 }];

    for (var key in sounds) {
        manifest.push({
            id: key,
            src: sounds[key].src
        });
    }

    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("progress", onProgress);
    loader.addEventListener("complete", createMainMenu);
    loader.loadManifest(manifest);
}

function onProgress(event) {
    stage.getChildByName("mainMenu").getChildByName("loadingLabel").text = localization.loading + ": " + Math.round(event.progress * 100);
}

function handleFileLoad(event) {
    assets.push(event.item);
}

function createMainMenu() {
    loader.removeAllEventListeners("fileload");
    loader.removeAllEventListeners("complete");
    loader.removeAllEventListeners("progress");

    setTimeout(function () {
        spriteSheets["ui"] = new createjs.SpriteSheet(JSON.parse(loader.getResult("uiData", true)));
        spriteSheets["ui"].getAnimation("tutorial").speed = 0.03;

        spriteSheets["assets"] = new createjs.SpriteSheet(JSON.parse(loader.getResult("assetsData", true)));
        spriteSheets["assets"].getAnimation("finn").speed = 0.1;
        spriteSheets["assets"].getAnimation("bubblegum").speed = 0.1;
        spriteSheets["assets"].getAnimation("jake").speed = 0.1;
        spriteSheets["assets"].getAnimation("tree_trunks").speed = 0.1;
        spriteSheets["assets"].getAnimation("marceline").speed = 0.1;
        spriteSheets["assets"].getAnimation("flame").speed = 0.1;
        spriteSheets["assets"].getAnimation("fx01").speed = 0.33;
        spriteSheets["assets"].getAnimation("fx01").next = "";
        spriteSheets["assets"].getAnimation("fx02").speed = 0.33;
        spriteSheets["assets"].getAnimation("fx02").next = "";

        var mainMenu = stage.getChildByName("mainMenu");
        mainMenu.getChildByName("loadingLabel").visible = false;

        var playBtn = createTitleButton(spriteSheets["ui"], localization.play, createTutorial);
        playBtn.x = 240;
        playBtn.y = 295;
        mainMenu.addChild(playBtn);
    }, 250);
}

function createTutorial() {
    playSound("button");

    var tutorial = new createjs.Container();
    tutorial.name = "tutorial";
    stage.addChild(tutorial);

    var bitmapAnimation = new createjs.Sprite(spriteSheets["ui"]);
    bitmapAnimation.gotoAndPlay("tutorial");

    tutorial.addChild(bitmapAnimation);

    var tutorialLabel = new createjs.Text(localization.tutorial, "45px gameFont", "#0a5b10");
    tutorialLabel.name = "tutorialLabel";
    tutorialLabel.x = 245;
    tutorialLabel.y = 80;
    tutorialLabel.textAlign = "center";
    tutorialLabel.textBaseline = 'top';
    tutorialLabel.lineHeight = 0;
    tutorial.addChild(tutorialLabel);

    tutorial.addEventListener("click", function () {});
    tutorial.alpha = 0;
    createjs.Tween.get(tutorial)
        .to({
            alpha: 1
        }, 500, createjs.Ease.backOut)
        .call(function () {
            tutorial.addEventListener("click", createGame);
        });
}

function createGame(event) {
    playSound("music");

    input = {
        rotate: false,
        left: false,
        right: false,
        down: false,
        mouseDown: false,
        prevMouseX: 0,
        prevMouseY: 0,
        mouseDownTime: 0
    }

    //------------------------------------------------------------------
    // Creation
    //------------------------------------------------------------------
    var mouseCacher = new createjs.Shape();
    mouseCacher.graphics.beginFill("rgba(255, 255, 255, 1)");
    mouseCacher.graphics.rect(0, 0, 480, 320);
    mouseCacher.graphics.endFill();
    mouseCacher.addEventListener("mousedown", onMouseDown);

    var game = new createjs.Container();
    game.name = "game";
    game.alpha = event ? 0 : 1;
    stage.addChild(game);

    var boardLayer = new createjs.Container();
    var helperLayer = new createjs.Shape();
    var gameLayer = new createjs.Container();
    var fxLayer = new createjs.Container();
    var guiLayer = new createjs.Container();

    game.addChild(mouseCacher);
    game.addChild(boardLayer);
    game.addChild(helperLayer);
    game.addChild(gameLayer);
    game.addChild(fxLayer);
    game.addChild(guiLayer);

    //------------------------------------------------------------------
    // Game
    //------------------------------------------------------------------
    var ces = new CES();
    var onGameOver = function (score) {
        stopSound("music");
        playSound("youlose");

        guiLayer.getChildByName("gameOverContainer").visible = true;
        guiLayer.getChildByName("gameOverContainer").getChildByName("gameOverScore").text = score;
        createjs.Tween.get(guiLayer.getChildByName("gameOverContainer"))
            .wait(1250)
            .to({
                alpha: 1
            }, 500, createjs.Ease.backOut)
            .call(function () {
                ces.stop();
            });
    };

    var onMatch = function (score) {
        guiLayer.getChildByName("scoreValue").text = score
    };

    var onChainExplode = function (chain, score) {
        for (var i = 0; i < chain.length; i++) {
            var transform = ces.getListOfComponent(Transform)[chain[i].entityId];
            var assetName = "combo_" + score;
            var rect = spriteSheets["assets"].getFrame(spriteSheets["assets"].getAnimation(assetName).frames[0]).rect;
            var scoreBitmap = new createjs.Sprite(spriteSheets["assets"]);
            scoreBitmap.gotoAndPlay(assetName);
            scoreBitmap.regX = Math.round(rect.width / 2);
            scoreBitmap.regY = Math.round(rect.height / 2);
            scoreBitmap.snapToPixel = true;
            scoreBitmap.x = transform.position.x;
            scoreBitmap.y = transform.position.y;

            fxLayer.addChild(scoreBitmap);

            createjs.Tween.get(scoreBitmap)
                .to({
                    alpha: 0,
                    y: scoreBitmap.y - 30
                }, 2000, createjs.Ease.backOut)
                .call(function () {
                    fxLayer.removeChild(scoreBitmap);
                });
        }
    };

    ces.addSystem(new InputSystem());
    ces.addSystem(new TokenFall());
    ces.addSystem(new TokenMatch(onMatch, onChainExplode));
    ces.addSystem(new TokenSpawner(spriteSheets["assets"], gameLayer));
    ces.addSystem(new PositionConvert());
    ces.addSystem(new GameOver(onGameOver));
    ces.addSystem(new RenderSystem(stage));
    ces.addSystem(new HelperSystem(helperLayer));

    createGUI(ces, guiLayer);
    createBackground(spriteSheets["assets"], boardLayer);
    createBoard(ces);

    ces.start();

    createjs.Tween.get(game)
        .to({
            alpha: 1
        }, 1000, createjs.Ease.backOut)
        .call(function () {
            var tutorialContainer = stage.getChildByName("tutorial");
            stage.removeChild(tutorialContainer);
        });
}

function createBackground(spriteSheet, container) {
    var bitmapAnimation = new createjs.Sprite(spriteSheet);
    bitmapAnimation.gotoAndPlay("bg");

    container.addChild(bitmapAnimation);
}

function createBoard(ces) {
    var id = ces.getNewEntityId();

    ces.addComponentToEntity(new Board(10, 10), id);
}

function onMouseDown(event) {
    event.addEventListener("mouseup", onMouseUp);
    event.addEventListener("mousemove", onMouseMove);
    input.mouseDown = true;
    input.prevMouseX = event.stageX;
    input.prevMouseY = event.stageY;
    input.mouseDownTime = new Date();
}

function onMouseUp(event) {
    input.mouseDown = false;
    var now = new Date();
    var dt = (now - input.mouseDownTime) / 1000;

    if (Math.abs(input.prevMouseX - event.stageX) > (mouseTolerance / 2)) return;

    if (Math.abs(input.prevMouseY - event.stageY) < (mouseTolerance / 2) && dt < mouseTimeClick) {
        input.rotate = true;
    } else if ((input.prevMouseY - event.stageY < -mouseTolerance * 2) && dt < mouseTimeClick) {
        input.down = true;
    }
}

function onMouseMove(event) {
    var now = new Date();
    var dt = (now - input.mouseDownTime) / 1000;

    if (dt < mouseTimeClick) return;

    if (input.mouseDown) {
        if (input.prevMouseX - event.stageX > mouseTolerance) {
            input.prevMouseX = event.stageX;
            input.left = true;
        } else if (input.prevMouseX - event.stageX < -mouseTolerance) {
            input.prevMouseX = event.stageX;
            input.right = true;
        }
    }
}

function createGUI(ces, layer) {
    // Pause button
    var rectPause = spriteSheets["ui"].getFrame(spriteSheets["ui"].getAnimation("pause_btn").frames[0]).rect;
    var pauseBtn = new createjs.Sprite(spriteSheets["ui"]);
    pauseBtn.name = "pauseBtn";
    pauseBtn.snapToPixel = true;
    pauseBtn.gotoAndStop("pause_btn");
    pauseBtn.regX = Math.round(rectPause.width / 2);
    pauseBtn.regY = Math.round(rectPause.height / 2);
    pauseBtn.x = 480 - 34;
    pauseBtn.y = 320 - 34;
    pauseBtn.snapToPixel = true;
    pauseBtn.cursor = "pointer";
    pauseBtn.addEventListener("click", function (e) {
        playSound("button");

        layer.getChildByName("pauseContainer").visible = true;
        createjs.Tween.get(layer.getChildByName("pauseContainer")).to({
            alpha: 1
        }, 500, createjs.Ease.backOut);
        ces.stop();
    });
    layer.addChild(pauseBtn);

    //Score
    var rectBg = spriteSheets["ui"].getFrame(spriteSheets["ui"].getAnimation("score_container_normal").frames[0]).rect;
    var scoreBg = new createjs.Sprite(spriteSheets["ui"]);
    scoreBg.snapToPixel = true;
    scoreBg.gotoAndStop("score_container_normal");
    scoreBg.regX = rectBg.width / 2;
    scoreBg.regY = rectBg.height / 2;
    scoreBg.x = 400;
    scoreBg.y = 44;
    layer.addChild(scoreBg);

    var scoreLabel = new createjs.Text(localization.score, "18px gameFont", "#0a5b10");
    scoreLabel.name = "scoreLabel";
    scoreLabel.x = 401;
    scoreLabel.y = 24;
    scoreLabel.textAlign = "center";
    scoreLabel.alpha = 0.5;
    scoreLabel.textBaseline = "top";
    scoreLabel.rotation = 1;
    layer.addChild(scoreLabel);

    var scoreValue = new createjs.Text("0", "26px gameFont", "#0a5b10");
    scoreValue.name = "scoreValue";
    scoreValue.x = 401;
    scoreValue.y = 41;
    scoreValue.textAlign = "center";
    scoreValue.alpha = 0.8;
    scoreValue.textBaseline = "top";
    scoreValue.rotation = 1;
    layer.addChild(scoreValue);

    // Pause popup
    var pauseContainer = new createjs.Container();
    pauseContainer.name = "pauseContainer";
    layer.addChild(pauseContainer);

    var pauseBg = new createjs.Sprite(spriteSheets["ui"]);
    pauseBg.snapToPixel = true;
    pauseBg.gotoAndStop("pause_container");
    pauseBg.addEventListener("click", function (e) {});
    pauseContainer.addChild(pauseBg);

    var pauseLabel = new createjs.Text(localization.pause, "45px gameFont", "#0a5b10");
    pauseLabel.name = "pauseLabel";
    pauseLabel.x = 245;
    pauseLabel.y = 80;
    pauseLabel.textAlign = "center";
    pauseLabel.textBaseline = "top";
    pauseContainer.addChild(pauseLabel);

    if (!isChrome) {
        var rectMute = spriteSheets["ui"].getFrame(spriteSheets["ui"].getAnimation("sound_btn_on").frames[0]).rect;
        var muteBtn = new createjs.Sprite(spriteSheets["ui"]);
        muteBtn.name = "muteBtn";
        muteBtn.snapToPixel = true;
        muteBtn.gotoAndStop("sound_btn_on");
        muteBtn.regX = rectMute.width / 2;
        muteBtn.regY = rectMute.height / 2;
        muteBtn.x = 240;
        muteBtn.y = 150;
        muteBtn.cursor = "pointer";
        muteBtn.visible = createjs.Sound.getVolume() == 1;
        muteBtn.addEventListener("click", function (e) {
            pauseContainer.getChildByName("muteBtn").visible = false;
            pauseContainer.getChildByName("unmuteBtn").visible = true;
            createjs.Sound.setVolume(0);
        });
        pauseContainer.addChild(muteBtn);

        var unmuteBtn = new createjs.Sprite(spriteSheets["ui"]);
        unmuteBtn.name = "unmuteBtn";
        unmuteBtn.snapToPixel = true;
        unmuteBtn.gotoAndStop("sound_btn_off");
        unmuteBtn.regX = rectMute.width / 2;
        unmuteBtn.regY = rectMute.height / 2;
        unmuteBtn.x = 240;
        unmuteBtn.y = 150;
        unmuteBtn.cursor = "pointer";
        unmuteBtn.visible = createjs.Sound.getVolume() == 0;
        unmuteBtn.addEventListener("click", function (e) {
            pauseContainer.getChildByName("muteBtn").visible = true;
            pauseContainer.getChildByName("unmuteBtn").visible = false;
            createjs.Sound.setVolume(1);
            playSound("button");
        });
        pauseContainer.addChild(unmuteBtn);
    }

    var backBtn = createButton(spriteSheets["ui"], localization.back, function (e) {
        playSound("button");
        ces.start();
        createjs.Tween.get(layer.getChildByName("pauseContainer"))
            .to({
                alpha: 0
            }, 500, createjs.Ease.backOut)
            .call(function () {
                layer.getChildByName("pauseContainer").visible = false;
            });
    });

    backBtn.x = 193;
    backBtn.y = 215;
    pauseContainer.addChild(backBtn);

    var exitBtn = createButton(spriteSheets["ui"], localization.exit, function (e) {
        stopSound("music");
        playSound("button");

        ces = null;
        var game = stage.getChildByName("game");
        createjs.Tween.get(game)
            .to({
                alpha: 0
            }, 500, createjs.Ease.backOut)
            .call(function () {
                stage.removeChild(game);
            });
    });

    exitBtn.x = 293;
    exitBtn.y = 215;
    pauseContainer.addChild(exitBtn);
    pauseContainer.alpha = 0;
    pauseContainer.visible = false;

    // GameOver
    var gameOverContainer = new createjs.Container();
    gameOverContainer.name = "gameOverContainer";
    layer.addChild(gameOverContainer);

    var gameOverBg = new createjs.Sprite(spriteSheets["ui"]);
    gameOverBg.snapToPixel = true;
    gameOverBg.gotoAndStop("pause_container");
    pauseBg.addEventListener("click", function (e) {});
    gameOverContainer.addChild(gameOverBg);

    var gameOverLabel = new createjs.Text(localization.score, "45px gameFont", "#0a5b10");
    gameOverLabel.name = "gameOverLabel";
    gameOverLabel.x = 245;
    gameOverLabel.y = 80;
    gameOverLabel.textAlign = "center";
    gameOverLabel.textBaseline = "top";
    gameOverLabel.alpha = 0.5;
    gameOverContainer.addChild(gameOverLabel);

    var gameOverScore = new createjs.Text("0", "60px gameFont", "#0a5b10");
    gameOverScore.name = "gameOverScore";
    gameOverScore.x = 240;
    gameOverScore.y = 120;
    gameOverScore.textAlign = "center";
    gameOverScore.textBaseline = "top";
    gameOverScore.alpha = 0.8;
    gameOverContainer.addChild(gameOverScore);

    var exitGameOverBtn = createButton(spriteSheets["ui"], localization.replay, function (e) {
        playSound("button");
        ces = null;
        var game = stage.getChildByName("game");
        stage.removeChild(game);
        createGame(null);
    });

    exitGameOverBtn.x = 240;
    exitGameOverBtn.y = 215;
    gameOverContainer.addChild(exitGameOverBtn);
    gameOverContainer.alpha = 0;
    gameOverContainer.visible = false;
}

function createButton(spriteSheet, text, handler) {
    var btn = new createjs.Container();
    btn.cursor = "pointer";
    btn.addEventListener("click", handler);

    var rectBg = spriteSheet.getFrame(spriteSheet.getAnimation("pause_screen_btn").frames[0]).rect;
    var btnBg = new createjs.Sprite(spriteSheet);
    btnBg.snapToPixel = true;
    btnBg.gotoAndStop("pause_screen_btn");
    btnBg.x = -rectBg.width / 2;
    btnBg.y = -rectBg.height / 2;
    btn.addChild(btnBg);

    var label = new createjs.Text(text, "24px gameFont", "#cffeda");
    label.name = "label";
    label.x = 0;
    label.y = 0;
    label.textAlign = "center";
    label.textBaseline = "middle";
    btn.addChild(label);

    return btn;
}

function createTitleButton(spriteSheet, text, handler) {
    var btn = new createjs.Container();
    btn.cursor = "pointer";
    btn.addEventListener("click", handler);

    var rectBg = spriteSheet.getFrame(spriteSheet.getAnimation("main_btn").frames[0]).rect;
    var btnBg = new createjs.Sprite(spriteSheet);
    btnBg.snapToPixel = true;
    btnBg.gotoAndStop("main_btn");
    btnBg.x = -rectBg.width / 2;
    btnBg.y = -rectBg.height / 2;
    btn.addChild(btnBg);

    var label = new createjs.Text(text, "16px titleFont", "#381c11");
    label.name = "label";
    label.x = 0;
    label.y = -3;
    label.textAlign = "center";
    label.textBaseline = "middle";
    label.alpha = 0.9;
    btn.addChild(label);

    return btn;
}