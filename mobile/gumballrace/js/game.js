var DEBUG = false;
var input;
var stage;

var assets = [];
var loader;
var spriteSheets = {};

function initialize() {
	stage = new createjs.Stage("myCanvas");
	createjs.Ticker.timingMode = createjs.Ticker.RAF;
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

	var titleLabel = new createjs.Text(localization.title, "50px gameFont", "#7269a8");
	titleLabel.name = "titleLabel";
	titleLabel.x = 240;
	titleLabel.y = 95;
	titleLabel.textAlign = "center";
	titleLabel.textBaseline = 'middle';
	titleLabel.lineHeight = 0;
	main.addChild(titleLabel);

	var loadingLabel = new createjs.Text(localization.loading, "40px gameFont", "#ffffff");
	loadingLabel.name = "loadingLabel";
	loadingLabel.x = 240;
	loadingLabel.y = 290;
	loadingLabel.textAlign = "center";
	loadingLabel.textBaseline = "middle";
	main.addChild(loadingLabel);

	var manifest = [{
		src: "assets/gumball.png",
		id: "gumballBMP"
	}, {
		src: "assets/obstacles.png",
		id: "obstaclesBMP"
	}, {
		src: "assets/ui.png",
		id: "uiBMP"
	}, {
		src: "assets/gumball.json",
		id: "gumballData"
	}, {
		src: "assets/obstacles.json",
		id: "obstaclesData"
	}, {
		src: "assets/ui.json",
		id: "uiData"
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

	setTimeout(function() {
		spriteSheets["ui"] = new createjs.SpriteSheet(JSON.parse(loader.getResult("uiData", true)));
		spriteSheets["gumball"] = new createjs.SpriteSheet(JSON.parse(loader.getResult("gumballData", true)));
		spriteSheets["obstacles"] = new createjs.SpriteSheet(JSON.parse(loader.getResult("obstaclesData", true)));
		spriteSheets["ui"].getAnimation("tutorial").speed = 0.033;

		var mainMenu = stage.getChildByName("mainMenu");
		mainMenu.getChildByName("loadingLabel").visible = false;

		var playBtn = createButton(spriteSheets["ui"], localization.play, createTutorial);
		playBtn.x = 240;
		playBtn.y = 290;
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

	var tutorialLabel = new createjs.Text(localization.tutorial, "50px gameFont", "#7269a8");
	tutorialLabel.name = "tutorialLabel";
	tutorialLabel.x = 240;
	tutorialLabel.y = 85;
	tutorialLabel.textAlign = "center";
	tutorialLabel.textBaseline = 'middle';
	tutorialLabel.lineHeight = 0;
	tutorial.addChild(tutorialLabel);

	tutorial.addEventListener("click", function() {});
	tutorial.alpha = 0;
	createjs.Tween.get(tutorial)
		.to({
			alpha: 1
		}, 500, createjs.Ease.backOut)
		.call(function() {
			tutorial.addEventListener("click", createGame);
		});
}

function createGame(event) {
	playSound("music");

	input = {
		mouseDown: false
	}

	//------------------------------------------------------------------
	// Game
	//------------------------------------------------------------------
	var ces = new CES();
	ces.addSystem(new InputSystem());
	ces.addSystem(new Gravity());
	ces.addSystem(new RunnerSystem());
	ces.addSystem(new DisplacementSystem());
	ces.addSystem(new Collision());

	var onRunFunc = function(score) {
		guiLayer.getChildByName("scoreValue").text = score
	};

	var onDieFunc = function(score) {
		stopSound("music");
		guiLayer.getChildByName("gameOverContainer").visible = true;
		guiLayer.getChildByName("gameOverContainer").getChildByName("gameOverScore").text = score;
		createjs.Tween.get(guiLayer.getChildByName("gameOverContainer"))
			.wait(1250)
			.to({
				alpha: 1
			}, 500, createjs.Ease.backOut)
			.call(function() {
				ces.stop();
			});
	};

	ces.addSystem(new PlayerActionCheck(onRunFunc, onDieFunc));
	ces.addSystem(new InfiniteFloorSystem());
	ces.addSystem(new CameraSystem());
	ces.addSystem(new SpawnSystem());
	ces.addSystem(new RenderSystem(stage));

	//------------------------------------------------------------------
	// Creation
	//------------------------------------------------------------------
	var mouseCacher = new createjs.Shape();
	mouseCacher.graphics.beginFill("rgba(150, 150, 255, 1)");
	mouseCacher.graphics.rect(0, 0, 480, 320);
	mouseCacher.graphics.endFill();
	mouseCacher.addEventListener("mousedown", onMouseDown);

	var game = new createjs.Container();
	game.name = "game";
	game.alpha = event ? 0 : 1;

	var skyLayer = new createjs.Container();
	var backgroundLayer = new createjs.Container();
	var floorLayer = new createjs.Container();
	var gameLayer = new createjs.Container();
	var foregroundLayer = new createjs.Container();
	var guiLayer = new createjs.Container();

	addBgTiles(skyLayer, spriteSheets["obstacles"], ["bg_tile"]);
	addBgTiles(backgroundLayer, spriteSheets["obstacles"], ["2nd_tile"], new Vec2(0, 127));
	addBgTiles(floorLayer, spriteSheets["obstacles"], ["grass_tile01", "grass_tile02"], new Vec2(0, 254));

	stage.addChild(game);
	game.addChild(mouseCacher);
	game.addChild(skyLayer);
	game.addChild(backgroundLayer);
	game.addChild(floorLayer);
	game.addChild(gameLayer);
	game.addChild(foregroundLayer);
	game.addChild(guiLayer);

	createGUI(ces, guiLayer);

	createPlayer(ces, gameLayer, new Vec2(-200, 160), guiLayer);
	createFloorTile(ces, gameLayer);
	createCamera(ces, foregroundLayer, gameLayer, floorLayer, backgroundLayer, skyLayer);
	createObstacleSpawner(ces, gameLayer);

	ces.start();

	createjs.Tween.get(game)
		.to({
			alpha: 1
		}, 1000, createjs.Ease.backOut)
		.call(function() {
			var tutorialContainer = stage.getChildByName("tutorial");
			stage.removeChild(tutorialContainer);
		});
}

function onMouseDown(event) {
	input.mouseDown = true;
}

function createGUI(ces, layer) {
	// Pause button
	var rectPause = spriteSheets["ui"].getFrame(spriteSheets["ui"].getAnimation("pause_btn").frames[0]).rect;
	var pauseBtn = new createjs.Sprite(spriteSheets["ui"]);
	pauseBtn.name = "pauseBtn";
	pauseBtn.snapToPixel = true;
	pauseBtn.gotoAndStop("pause_btn");
	pauseBtn.regX = rectPause.width / 2;
	pauseBtn.regY = rectPause.height / 2;
	pauseBtn.x = 34.5;
	pauseBtn.y = 34.5;
	pauseBtn.cursor = "pointer";
	pauseBtn.addEventListener("click", function(e) {
		playSound("button");
		layer.getChildByName("pauseContainer").visible = true;
		createjs.Tween.get(layer.getChildByName("pauseContainer")).to({
			alpha: 1
		}, 500, createjs.Ease.backOut);
		ces.stop();
	});
	layer.addChild(pauseBtn);

	// Score
	var rectBg = spriteSheets["ui"].getFrame(spriteSheets["ui"].getAnimation("score_container").frames[0]).rect;
	var scoreBg = new createjs.Sprite(spriteSheets["ui"]);
	scoreBg.snapToPixel = true;
	scoreBg.gotoAndStop("score_container");
	scoreBg.regX = rectBg.width / 2;
	scoreBg.regY = rectBg.height / 2;
	scoreBg.x = 405;
	scoreBg.y = 35;
	layer.addChild(scoreBg);

	var scoreLabel = new createjs.Text(localization.score, "20px gameFont", "#ffffff");
	scoreLabel.name = "scoreLabel";
	scoreLabel.x = 405;
	scoreLabel.y = 15;
	scoreLabel.textAlign = "center";
	scoreLabel.alpha = 0.5;
	scoreLabel.textBaseline = "top";
	layer.addChild(scoreLabel);

	var scoreValue = new createjs.Text("0", "26px gameFont", "#ffffff");
	scoreValue.name = "scoreValue";
	scoreValue.x = 405;
	scoreValue.y = 31;
	scoreValue.textAlign = "center";
	scoreValue.alpha = 0.8;
	scoreValue.textBaseline = "top";
	layer.addChild(scoreValue);

	// Pause popup
	var pauseContainer = new createjs.Container();
	pauseContainer.name = "pauseContainer";
	layer.addChild(pauseContainer);

	var pauseBg = new createjs.Sprite(spriteSheets["ui"]);
	pauseBg.snapToPixel = true;
	pauseBg.gotoAndStop("pause_container");
	pauseBg.addEventListener("click", function(e) {});
	pauseContainer.addChild(pauseBg);

	var pauseLabel = new createjs.Text(localization.pause, "45px gameFont", "#ffffff");
	pauseLabel.name = "pauseLabel";
	pauseLabel.x = 240;
	pauseLabel.y = 50;
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
		muteBtn.addEventListener("click", function(e) {
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
		unmuteBtn.addEventListener("click", function(e) {
			pauseContainer.getChildByName("muteBtn").visible = true;
			pauseContainer.getChildByName("unmuteBtn").visible = false;
			createjs.Sound.setVolume(1);
			playSound("button");
		});
		pauseContainer.addChild(unmuteBtn);
	}

	var backBtn = createButton(spriteSheets["ui"], localization.back, function(e) {
		playSound("button");
		ces.start();
		createjs.Tween.get(layer.getChildByName("pauseContainer"))
			.to({
				alpha: 0
			}, 500, createjs.Ease.backOut)
			.call(function() {
				layer.getChildByName("pauseContainer").visible = false;
			});
	});

	backBtn.x = 240;
	backBtn.y = 210;
	pauseContainer.addChild(backBtn);

	var exitBtn = createButton(spriteSheets["ui"], localization.exit, function(e) {
		playSound("button");
		stopSound("music");
		ces = null;
		var game = stage.getChildByName("game");
		createjs.Tween.get(game)
			.to({
				alpha: 0
			}, 500, createjs.Ease.backOut)
			.call(function() {
				stage.removeChild(game);
			});
	});

	exitBtn.x = 240;
	exitBtn.y = 260;
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
	pauseBg.addEventListener("click", function(e) {});
	gameOverContainer.addChild(gameOverBg);

	var gameOverLabel = new createjs.Text(localization.score, "45px gameFont", "#ffffff");
	gameOverLabel.name = "gameOverLabel";
	gameOverLabel.x = 240;
	gameOverLabel.y = 50;
	gameOverLabel.textAlign = "center";
	gameOverLabel.textBaseline = "top";
	gameOverLabel.alpha = 0.5;
	gameOverContainer.addChild(gameOverLabel);

	var gameOverScore = new createjs.Text("0", "60px gameFont", "#ffffff");
	gameOverScore.name = "gameOverScore";
	gameOverScore.x = 240;
	gameOverScore.y = 100;
	gameOverScore.textAlign = "center";
	gameOverScore.textBaseline = "top";
	gameOverScore.alpha = 0.8;
	gameOverContainer.addChild(gameOverScore);

	var exitGameOverBtn = createButton(spriteSheets["ui"], localization.replay, function(e) {
		stopSound("music");
		playSound("button");
		ces = null;
		var game = stage.getChildByName("game");
		stage.removeChild(game);
		createGame(null);
	});

	exitGameOverBtn.x = 240;
	exitGameOverBtn.y = 260;
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

	var label = new createjs.Text(text, "30px gameFont", "#ffe88d");
	label.name = "label";
	label.x = 0;
	label.y = 0;
	label.textAlign = "center";
	label.textBaseline = "middle";
	btn.addChild(label);

	return btn;
}

function createPlayer(ces, container, position, guiLayer) {
	var id = ces.getNewEntityId();

	var transform = new Transform();
	transform.position = position;
	ces.addComponentToEntity(transform, id);

	var rigidBody = new RigidBody();
	rigidBody.velocity = new Vec2(400, 0);
	ces.addComponentToEntity(rigidBody, id);

	var runner = new Runner();
	runner.acceleration = new Vec2(5, -10);
	ces.addComponentToEntity(runner, id);

	var collider = new Collider();
	collider.size = new Vec2(32, 52);
	ces.addComponentToEntity(collider, id);

	spriteSheets["gumball"].getAnimation("run").speed = 0.5;
	spriteSheets["gumball"].getAnimation("jump_in").next = false;
	spriteSheets["gumball"].getAnimation("jump_in").speed = 0.25;
	spriteSheets["gumball"].getAnimation("jump_out").next = false;
	var rect = spriteSheets["gumball"].getFrame(spriteSheets["gumball"].getAnimation("run").frames[0]).rect;

	var bitmapAnimation = new createjs.Sprite(spriteSheets["gumball"]);
	bitmapAnimation.regX = rect.width / 2;
	bitmapAnimation.regY = rect.height / 2;
	bitmapAnimation.snapToPixel = true;
	bitmapAnimation.gotoAndPlay("run");
	ces.addComponentToEntity(new View(bitmapAnimation, collider, container), id);

	ces.addComponentToEntity(new Player(), id);
}

function createObstacle(ces, container, position, name, colliderSize, colliderCenter) {
	var id = ces.getNewEntityId();

	var transform = new Transform();
	transform.position = position;
	ces.addComponentToEntity(transform, id);

	var collider = new Collider();
	collider.size = colliderSize;
	collider.center = colliderCenter || new Vec2();
	ces.addComponentToEntity(collider, id);

	var rect = spriteSheets["obstacles"].getFrame(spriteSheets["obstacles"].getAnimation(name).frames[0]).rect;
	var bitmapAnimation = new createjs.Sprite(spriteSheets["obstacles"]);
	bitmapAnimation.regX = rect.width / 2;
	bitmapAnimation.regY = rect.height / 2;
	bitmapAnimation.snapToPixel = true;
	bitmapAnimation.gotoAndStop(name);
	ces.addComponentToEntity(new View(bitmapAnimation, collider, container), id);
}

function addBgTiles(container, spriteSheet, bitmapsName, offset) {
	var offset = offset || new Vec2();

	for (var i = 0; i < 3; i++) {
		var index = Math.floor(Math.random() * bitmapsName.length);
		var bitmapAnimation = new createjs.Sprite(spriteSheet);
		bitmapAnimation.snapToPixel = true;
		bitmapAnimation.gotoAndStop(bitmapsName[index]);
		bitmapAnimation.x = offset.x;
		bitmapAnimation.y = offset.y;
		container.addChild(bitmapAnimation);
		offset.x += 479;
	}
}

function createFloorTile(ces, container) {
	var id = ces.getNewEntityId();
	var transform = new Transform();
	transform.position = new Vec2(240, 300);
	ces.addComponentToEntity(transform, id);

	var collider = new Collider();
	collider.size = new Vec2(4800, 40);
	ces.addComponentToEntity(collider, id);

	ces.addComponentToEntity(new InfiniteFloor(), id);
	ces.addComponentToEntity(new View(new createjs.Shape(), collider, container), id);
}

function createCamera(ces, foregroundLayer, gameLayer, floorLayer, backgroundLayer, skyLayer) {
	var id = ces.getNewEntityId();
	ces.addComponentToEntity(new Camera(foregroundLayer, gameLayer, floorLayer, backgroundLayer, skyLayer), id);
}

function createObstacleSpawner(ces, gameLayer) {
	var id = ces.getNewEntityId();
	ces.addComponentToEntity(new ObstacleSpawner(ces, gameLayer, 2, 1), id);
}