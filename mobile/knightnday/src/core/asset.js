Asset = {};

Asset.baseUrl = 'assets/';
Asset.audioUrl = 'assets/audio/';
Asset.fontUrl = 'assets/fonts/';
Asset.imgUrl = 'assets/img/';

Asset.image = function (name, filename, abs) {
	if (!abs)
		game.load.image(name,this.imgUrl+filename);
	else
		game.load.image(name,filename);
};


Asset.jpg = function (name, filename) {
	if (!filename) filename = name;
	game.load.image(name,this.imgUrl+filename+'.jpg');
}

Asset.png = function (name, filename) {
	if (!filename) filename = name;
	game.load.image(name,this.imgUrl+filename+'.png');
}

Asset.bitmapFont = function (name, filename) {
	if (!filename) filename = name;
	game.load.bitmapFont(name, this.fontUrl+filename+'.png', this.fontUrl+filename+'.xml');
};

Asset.atlaspng = function (name, filename) {
	if (!filename) filename = name;
	game.load.atlas(name, this.imgUrl+filename+'.png', this.imgUrl+filename+'.json');
	
	if (game.cache.checkJSONKey(name) == false) 
		game.load.json(name, this.imgUrl+filename+'.json');
}

Asset.audio = function(name, filename) {
	if (!filename) filename = name;
	game.load.audio(name, [this.audioUrl+filename+'.mp3', this.audioUrl+filename+'.ogg']);
}