window.screenDims = window.calculateScreenMetrics(960,640,1);
// (function(){
	var game = new Phaser.Game(screenDims.gameWidth, screenDims.gameHeight, Phaser.AUTO);
	var states = {
		'Boot': EPT.Boot,
		'Preloader': EPT.Preloader,
		'MainMenu': EPT.MainMenu,
		'Story': EPT.Story,
		'Game': EPT.Game
	};
	for(var state in states)
		game.state.add(state, states[state]);
	game.state.start('Boot');
// })();
	window.__game = game;

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-30485283-17', 'auto');
  ga('send', 'pageview');