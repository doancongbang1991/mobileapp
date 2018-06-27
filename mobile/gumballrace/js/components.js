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

function Collider() {
	this.size = new Vec2();
	this.center = new Vec2();
	this.side = "";
}

Collider.prototype.getMin = function() {
	return new Vec2(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2);
}

Collider.prototype.getMax = function() {
	return new Vec2(this.center.x + this.size.x / 2, this.center.y + this.size.y / 2);
}

function Player(guiLayer) {
	this.jumping = false;
	this.die = false;
	this.score = 0;
}

function InfiniteFloor() {
}

function Runner() {
	this.acceleration = new Vec2();
}

function RigidBody() {
	this.velocity = new Vec2();
}

function View(sprite, collider, container) {
	this.sprite = sprite;
	this.node = new createjs.Container();
	this.node.addChild(sprite);

	if (DEBUG) {	
		var colliderDebug = new createjs.Shape();
		var colliderMin = collider.getMin();

		colliderDebug.graphics.beginStroke("rgba(255, 0, 0, 0.5)");
		colliderDebug.graphics.beginFill("rgba(255, 0, 0, 0.25)");
		colliderDebug.graphics.rect(colliderMin.x, colliderMin.y, collider.size.x, collider.size.y);
		this.node.addChild(colliderDebug);
	}

	container.addChildAt(this.node, 0);
}

function ObstacleSpawner(ces, gameLayer, elapse, minElapse) {
	this.currentTime = 0;
	this.elapse = elapse || 1;
	this.minElapse = minElapse || 1;
	this.ces = ces;
	this.gameLayer = gameLayer;
}

ObstacleSpawner.prototype.getElapse = function() {
	return Math.max(this.elapse, this.minElapse);
}

function Camera(foregroundLayer, gameLayer, floorLayer, backgroundLayer, skyLayer) {
	this.layers = [];

	this.layers.push({"doc": foregroundLayer, "inc": 1.2});
	this.layers.push({"doc": gameLayer, "inc": 1});
	this.layers.push({"doc": floorLayer, "inc": 1});
	this.layers.push({"doc": backgroundLayer, "inc": 0.75});
	this.layers.push({"doc": skyLayer, "inc": 0.1});
}