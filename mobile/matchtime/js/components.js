//------------------------------------------------------------------
// Components
//------------------------------------------------------------------
function Transform() {
	this.prevPosition = new Vec2();
	this.position = new Vec2();
	this.scale = new Vec2(1, 1);
	this.rotation = 0;
	this.parent = null;
}

Transform.prototype.getAbsolutePosition = function() {
	var at = this.parent;
	var p = this.position;

	while (at != null) {
		p = p.rotate(at.rotation).add(at.position);
		at = at.parent;
	}

	return p;
}

Transform.prototype.getAbsoluteRotation = function() {
	var at = this.parent;
	var r = this.rotation;

	while (at != null) {
		r = r + at.rotation;
		at = at.parent;
	}

	return r;
}

function Token(type, column, row, controllable) {
	this.type = type;
	this.column = column || 0;
	this.row = row || 0;
	this.lock = false;
	this.controllable = controllable || false;
	this.visited = false;
}

function Board(columns, rows) {
	this.tiles = new Array(columns);

	for (var i = 0; i < columns; i ++) {
		this.tiles[i] = new Array(rows);
	}

	this.allLock = false;
	this.updateTime = 0.7; //0.35;
	this.currentTime = 0;
	this.dropTime = 0.25;
	this.currentDropTime = 0;
	this.controllableTokens = [];
	this.score = 0;
	this.tokens = 3;
	this.matches = 0;
	this.combo = 0;
	this.matchScore = 10;
}

function Player(guiLayer) {
}

function View(sprite, container) {
	this.sprite = sprite;
	this.node = new createjs.Container();
	this.node.addChild(sprite);

	container.addChildAt(this.node, 0);
}