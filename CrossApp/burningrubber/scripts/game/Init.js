(function() {
	// init game
	var res;
	var device = new Phaser.Device();
	if (device.desktop) res = [640, 960];
	else Phaser.Device.isAndroidStockBrowser() ? res = [400, 600] : res = [480, 720];
	device = null;
	game = new Phaser.Game(res[0], res[1], Phaser.CANVAS, 'game');
	// add states
	game.state.add('Boot', States.Boot);
	game.state.add('Preloader', States.Preloader);
	game.state.add('Menu', States.Menu);
	game.state.add('Level', States.Level);
	// start the boot state/scene
	game.state.start('Boot');
})();