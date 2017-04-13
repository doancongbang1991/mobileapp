
var GAME = GAME || {};

World = function()
{
	this.floorColors = [];
	this.underfloorColors = [];
	this.leftWallColors = [];
	this.rightWallColors = [];
	
	this.floorAlpha = 1
	this.leftAlpha = 1 ;
	this.rightAlpha = 1;
	
	this.background = new Image();
	this.background.crossOrigin = '';
	
	this.leftPosts = [];
	this.rightPosts = [];
	
	this.leftStump = [];
	this.rightStump = [];
	
	// particle debris?
}

World.prototype.process = function(callback)
{
	this.callback = callback;
	
	this.allImages = [];
	this.loadCount = 0;
	
	this.processUrls(this.leftStump);
	this.processUrls(this.rightStump);
	this.processUrls(this.walls);
	this.processUrls(this.baddy);
	this.processUrls(this.extras);
	this.processUrls(this.dust);
	
	this.dropEdge = this.extras[1]
}

World.prototype.processUrls = function(data)
{
	for (var i=0; i < data.length; i++) {
	  	
	  var url = data[i];
	  var image = new Image();
	  image.crossOrigin = '';
	  image.src = REMOTE_PATH + url
	  data[i] = image;
	  
	  this.allImages.push(image);
	  image.onload = function()
	  {
	  		this.loadCount++;
	  		if(this.loadCount == this.allImages.length)
	  		{
	  			console.log("LOADED")
	  			if(this.callback )this.callback();
	  		}
	  		
	  }.bind(this);
	  
	};
}

World.ice = new World();
World.ice.background.src = REMOTE_PATH + "img/snowWorld/snow_BG.jpg";
World.ice.floorColors = ["#61dafe", "#32b7fc", "#9fb0ff", "#32ffd3", "#6ebbeb", "#61dafe", "#00ffe5"];
World.ice.rightWallColors = ["#9fedff", "#59d7fe", "#d9dbff", "#59fffa", "#aee0f9", "#9fedff", "#00fcff"];
World.ice.leftWallColors = ["#0084d8", "#0047d5", "#4a50d9", "#00d9c1", "#015cbb", "#0084d8", "#0047d5"];
World.ice.floorAlpha = 0.7;
World.ice.leftAlpha = 0.9 ;
World.ice.rightAlpha = 0.9;
World.ice.rightStump = ["img/snowWorld/iceHorn_left_01.png", "img/edgeTuftLeft.png"];
World.ice.leftStump = ["img/snowWorld/iceHorn_right_01.png", "img/edgeTuft.png"];
World.ice.walls = ["img/snowWorld/iceWall_small.png", "img/snowWorld/iceWall_mid.png"];
World.ice.dust = ["img/snowTriangle_01.png", 
				  "img/snowTriangle_02.png",
				  "img/snowTriangle_03.png"];
World.ice.baddy = ["img/snowWorld/snowDude.png"];
World.ice.extras = ["img/snowWorld/snowArch.png", 
					"img/snowWorld/drop_edge_face.png",
					"img/snowWorld/floatingIsland.png"];

World.ice.bgColor = 0x1f2750;


World.jungle = new World();
World.jungle.background.src = REMOTE_PATH + "img/treetopWorld/background_JUNGLE.jpg";
World.jungle.floorColors = ["#87be32", "#5cb51c", "#7cd07b", "#b8ae1c", "#6fac3e", "#87be32", "#a4b31c"];
World.jungle.rightWallColors = ["#b7e2a0", "#8bdd76", "#c9e7d5", "#c8df76", "#addca6", "#b7e2a0", "#acda41"];
World.jungle.leftWallColors = ["#567824", "#3d7423", "#598d59", "#777224", "#466b29", "#567824", "#3d7423"];
World.jungle.floorAlpha = 0.8;
World.jungle.leftAlpha = 1;
World.jungle.rightAlpha = 1;
World.jungle.walls = ["img/treetopWorld/killBush_mid.png", "img/treetopWorld/killBush_wide.png"];
World.jungle.baddy = ["img/treetopWorld/treeStump_right.png"];
World.jungle.extras = ["img/treetopWorld/checkpointArch.png", 
						"img/treetopWorld/drop_edge_face.png",
						"img/treetopWorld/floatingIsland.png"];

World.jungle.leftStump = ["img/jungleEdgeMarkerLeft.png", "img/jungleEdgeMarkerLeft.png"];
World.jungle.rightStump = ["img/jungleEdgeMarkerRight.png", "img/jungleEdgeMarkerRight.png"];
World.jungle.dust = ["img/treetopWorld/dust01.png", 
				  "img/treetopWorld/dust02.png",
				  "img/treetopWorld/dust03.png"];
World.jungle.bgColor = 0x1768e8;


World.rainbow = new World();
World.rainbow.background.src = REMOTE_PATH + "img/dessertWorld/desert_BG.jpg";
World.rainbow.floorColors = ["#802b77", "#c9385a", "#f1666a", "#f29a6f", "#f3e773", "#dce477",
							"#a6cf6e", "#91ba9a", "#7ea5c9", "#9280ba", "#8860a9", "#603492"];






World.desert = new World();
World.desert.background.src =REMOTE_PATH +  "img/desertWorld/desert_BG.jpg";
World.desert.floorColors = ["#f1aa4d", "#ff8551", "#f67d11", "#eb6133", "#ff8527", "#ffa32c", "#fc9751"];
World.desert.leftWallColors = ["#89612c", "#914c2e", "#8c470a", "#914c34", "#914c16", "#915d19", "#8f562e"];
World.desert.rightWallColors = ["#f8d776", "#ffc67c", "#fbbf1a", "#ffc68d", "#ffc63c", "#ffd443", "#fece7c"];
World.desert.floorAlpha = 0.8;
World.desert.leftAlpha = 1 ;
World.desert.rightAlpha = 1;
World.desert.rightStump = ["img/desertWorld/trackPost.png", "img/edgeTuftLeft.png"];
World.desert.leftStump = ["img/desertWorld/trackPost.png", "img/edgeTuft.png"];
World.desert.walls = ["img/desertWorld/midWall.png", "img/desertWorld/bigWall.png"];
World.desert.baddy = ["img/desertWorld/cactus.png"];
World.desert.extras = ["img/desertWorld/arch.png", 
					"img/desertWorld/drop_edge_face.png",
					"img/desertWorld/floatingIsland.png"];

World.desert.dust = ["img/desertWorld/dust01.png", 
				  "img/desertWorld/dust02.png",
				  "img/desertWorld/dust03.png"];
World.desert.bgColor = 0xf53626;

World.rainbow.rightWallColors = ["#802b77", "#c9385a", "#f1666a", "#f29a6f", "#f3e773", "#dce477",
							"#a6cf6e", "#91ba9a", "#7ea5c9", "#9280ba", "#8860a9", "#603492"];
World.rainbow.leftWallColors = ["#802b77", "#c9385a", "#f1666a", "#f29a6f", "#f3e773", "#dce477",
							"#a6cf6e", "#91ba9a", "#7ea5c9", "#9280ba", "#8860a9", "#603492"];
							
World.rainbow.floorAlpha = 0.8//0.7;
World.rainbow.leftAlpha = 0.5//0.8;
World.rainbow.rightAlpha = 1//0.6;
World.rainbow.leftStump = ["img/jungleEdgeMarkerLeft.png", "img/jungleEdgeMarkerLeft.png"];
World.rainbow.rightStump = ["img/jungleEdgeMarkerRight.png", "img/jungleEdgeMarkerRight.png"];
World.rainbow.walls = ["img/snowWorld/iceWall_mid.png", "img/treetopWorld/killBush_wide.png"];
World.rainbow.baddy = ["img/snowWorld/snowDude.png"];
World.rainbow.extras = ["img/treetopWorld/checkpointArch.png", 
						"img/treetopWorld/drop_edge_face.png",
						"img/treetopWorld/floatingIsland.png"];
World.rainbow.dust = ["img/desertWorld/dust01.png", 
				  "img/desertWorld/dust02.png",
				  "img/desertWorld/dust03.png"];




World.testWorld = new World();
World.testWorld.background.src = REMOTE_PATH +  "img/desertWorld/desert_BG.jpg";
World.testWorld.floorColors = ["red"];
World.testWorld.leftWallColors = ["white"];
World.testWorld.rightWallColors = ["black"];

World.processAll = function(callback)
{
	this.callback = callback;
	
	this.worlds = [World.ice, World.desert, World.rainbow, World.jungle];
	this.position = 0;
	
	var onLoaded = this.onWorldLoaded.bind(this);
	
	World.ice.process(onLoaded);
	World.desert.process(onLoaded);
	World.rainbow.process(onLoaded);
	World.jungle.process(onLoaded);
	
	this.total = World.ice.allImages.length + World.desert.allImages.length +  World.rainbow.allImages.length +  World.jungle.allImages.length;
	
}


World.percentLoaded = function()
{
	if(!this.total)return 0;
	var loadCount = World.ice.loadCount + World.desert.loadCount + World.rainbow.loadCount + World.jungle.loadCount;
	
	
	return loadCount / this.total;
}

World.onWorldLoaded = function()
{
	this.position++;
	if(this.position == this.worlds.length)
	{
		if(this.callback)this.callback();
	}
}
//World.sand
//World.tree
//World.space