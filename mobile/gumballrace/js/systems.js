//------------------------------------------------------------------
// Systems
//------------------------------------------------------------------
function DisplacementSystem() {
}

DisplacementSystem.prototype = new System();

DisplacementSystem.prototype.update = function (dt) {
	var transformList = this.ces.getListOfComponent(Transform);
	var rigidBodyList = this.ces.getListOfComponent(RigidBody);

	for (var entityId in rigidBodyList) {
		if (transformList[entityId]) {
			var transform = transformList[entityId];
			var rigidBody = rigidBodyList[entityId];

			transform.prevPosition = transform.position;

			var scaledVelocity = rigidBody.velocity.scale(dt);
			var rotatedVelocity = scaledVelocity.rotate(transform.rotation)

			transform.position = transform.position.add(rotatedVelocity);
		}
	}
}

function Gravity() {
	this.gravityForce = new Vec2(0, 1100);
}

Gravity.prototype = new System();

Gravity.prototype.update = function (dt) {
	var transformList = this.ces.getListOfComponent(Transform);
	var rigidBodyList = this.ces.getListOfComponent(RigidBody);

	for (var entityId in rigidBodyList) {
		if (transformList[entityId]) {
			var transform = transformList[entityId];
			var rigidBody = rigidBodyList[entityId];

			rigidBody.velocity = rigidBody.velocity.add(this.gravityForce.scale(dt));
		}
	}
}

function Collision() {
}

Collision.prototype = new System();

Collision.prototype.update = function (dt) {
	var transformList = this.ces.getListOfComponent(Transform);
	var rigidBodyList = this.ces.getListOfComponent(RigidBody);
	var colliderList = this.ces.getListOfComponent(Collider);

	for (var entityIdA in colliderList) {
		if (rigidBodyList[entityIdA] && colliderList[entityIdA]) {
			var transformA = transformList[entityIdA];
			var rigidBodyA = rigidBodyList[entityIdA];
			var colliderA = colliderList[entityIdA];

			colliderA.side = "";

			for (var entityIdB in colliderList) {
				// Previous Position
				var pp = transformA.prevPosition.add(colliderA.center);
				// Current Position
				var cp = transformA.position.add(colliderA.center);

				var transformB = transformList[entityIdB];
				var colliderB = colliderList[entityIdB];
				if (colliderA == colliderB) continue;

				var bMin = colliderB.getMin();
				var bMax = colliderB.getMax();
				var top = transformB.position.y + bMin.y - colliderA.size.y / 2;
				var right = transformB.position.x + bMax.x + colliderA.size.x / 2;
				var bottom = transformB.position.y + bMax.y + colliderA.size.y / 2;
				var left = transformB.position.x + bMin.x - colliderA.size.x / 2;

				if (cp.y < top) continue;
				if (cp.x > right) continue;
				if (cp.y > bottom) continue;
				if (cp.x < left) continue;

				// Interpolated Position;
				var ix = cp.x;
				var iy = cp.y;
				var side = "";

				if (side == "" && cp.y >= top && top >= pp.y) {
					ix = this.getXAxisEquation(pp.x, pp.y, cp.x, cp.y, top);
					if (left < ix && ix < right) {
						iy = top;
						side = "top";
					}
				}
				
				if (side == "" && cp.x <= right && right <= pp.x) {
					iy = this.getYAxisEquation(pp.x, pp.y, cp.x, cp.y, right);
					if (top < iy && iy < bottom) {
						ix = right;
						side = "right";
					}
				} 

				if (side == "" && cp.y <= bottom && bottom <= pp.y) {
					ix = this.getXAxisEquation(pp.x, pp.y, cp.x, cp.y, bottom);
					if (left < ix && ix < right) {
						iy = bottom;
						side = "bottom";
					}
				} 

				if (side == "" && cp.x >= left && left >= pp.x) {
					iy = this.getYAxisEquation(pp.x, pp.y, cp.x, cp.y, left);
					if (top < iy && iy < bottom) {
						ix = left;
						side = "left";
					}
				}

				if (side != "") {
					if (side == "top" || side == "bottom") {
						colliderA.side = side == "top" ? "bottom" : "top";
						rigidBodyA.velocity = new Vec2(rigidBodyA.velocity.x, rigidBodyA.velocity.y * -0.1);
					} else if (side == "left" || side == "right") {
						colliderA.side = side == "left" ? "right" : "left";
						rigidBodyA.velocity = new Vec2(rigidBodyA.velocity.x * -0.1, rigidBodyA.velocity.y);
					}

					colliderB.side = side;
					transformA.position = new Vec2(ix, iy).sub(colliderA.center).add(rigidBodyA.velocity.scale(dt));
				}
			}
		}
	}
}

Collision.prototype.getXAxisEquation = function(x1, y1, x2, y2, y) {
	var m = (y1 - y2) / (x1 - x2);
	var c = x1 - (y1 / m);
	var x = (y / m) + c;

	return x;
}

Collision.prototype.getYAxisEquation = function(x1, y1, x2, y2, x) {
	var m = (y1 - y2) / (x1 - x2);
	var b = y1 - (m * x1);
	var y = (m * x) + b;

	return y;
}

function RunnerSystem() {
}

RunnerSystem.prototype = new System();

RunnerSystem.prototype.update = function (dt) {
	var rigidBodyList = this.ces.getListOfComponent(RigidBody);
	var runnerList = this.ces.getListOfComponent(Runner);
	var colliderList = this.ces.getListOfComponent(Collider);

	for (var entityId in runnerList) {
		if (rigidBodyList[entityId] && colliderList[entityId]) {
			var rigidBody = rigidBodyList[entityId];
			var runner = runnerList[entityId];
			var collider = colliderList[entityId];

			if (collider.side == "bottom") {
				var friction = rigidBody.velocity.scale(dt * 3);

				if (runner.acceleration.getLengthSquared() > 0) {
					rigidBody.velocity = rigidBody.velocity.add(runner.acceleration.scale(dt));
				} else {
					rigidBody.velocity = rigidBody.velocity.sub(friction);
				}
			}
		}
	}
}

function InputSystem() {
}

InputSystem.prototype = new System();

InputSystem.prototype.update = function (dt) {
	var playerList = this.ces.getListOfComponent(Player);
	var transformList = this.ces.getListOfComponent(Transform);
	var rigidBodyList = this.ces.getListOfComponent(RigidBody);

	for (var entityId in playerList) {
		if (transformList[entityId] && rigidBodyList[entityId]) {
			var transform = transformList[entityId];
			var rigidBody = rigidBodyList[entityId];
			var player = playerList[entityId];

			if (player.die) continue;

			if (input.mouseDown && !player.jumping) {
				player.jumping = true;
				rigidBody.velocity = new Vec2(rigidBody.velocity.x, -500);
				playSound("jump");
			}

			input.mouseDown = false;
		}	
	}
}

function PlayerActionCheck(onRun, onDie) {
	this.onDie = onDie;
	this.onRun = onRun;
}

PlayerActionCheck.prototype = new System();

PlayerActionCheck.prototype.update = function (dt) {
	var playerList = this.ces.getListOfComponent(Player);
	var colliderList = this.ces.getListOfComponent(Collider);
	var viewList = this.ces.getListOfComponent(View);
	var rigidBodyList = this.ces.getListOfComponent(RigidBody);
	var runnerList = this.ces.getListOfComponent(Runner);

	for (var entityId in playerList) {
		if (colliderList[entityId]) {
			var collider = colliderList[entityId];
			var player = playerList[entityId];
			var view = viewList[entityId];
			var rigidBody = rigidBodyList[entityId];
			var runner = runnerList[entityId];

			if (collider.side == "bottom" && view.sprite.currentAnimation == "hit_in") 
				view.sprite.gotoAndPlay("hit_out");

			if (player.die) continue;

			player.score += dt;
			var score = Math.min(Math.floor(player.score * 10), 999999);
			this.onRun(score);

			if (player.jumping) {
				if (rigidBody.velocity.y < 0) {
					if (view.sprite.currentAnimation != "jump_in") {
						view.sprite.gotoAndPlay("jump_in");
					}
				} else {
					if (view.sprite.currentAnimation != "jump_out")
						view.sprite.gotoAndPlay("jump_out");
				}				
			}

			if (collider.side == "bottom") {
				player.jumping = false;

				if (view.sprite.currentAnimation != "run")
					view.sprite.gotoAndPlay("run");
			} else if (collider.side == "right") {
				rigidBody.velocity = new Vec2(-100, -200);
				runner.acceleration = new Vec2();
				player.die = true;
				playSound("crash");
				this.onDie(score);

				if (view.sprite.currentAnimation != "hit_in")
					view.sprite.gotoAndPlay("hit_in");
			} else if (collider.side == "" && rigidBody.velocity.y > 100) {
				player.jumping = true;
			}
		}	
	}
}

function InfiniteFloorSystem() {
}

InfiniteFloorSystem.prototype = new System();

InfiniteFloorSystem.prototype.update = function (dt) {
	var infiniteFloorList = this.ces.getListOfComponent(InfiniteFloor);
	var playerList = this.ces.getListOfComponent(Player);
	var transformList = this.ces.getListOfComponent(Transform);

	for (var entityId in infiniteFloorList) {
		var infiniteFloorTransform = transformList[entityId];
		
		for (var playerId in playerList) {
			var playerTransform = transformList[playerId];

			infiniteFloorTransform.position.x = playerTransform.position.x;
		}
	}
}

function SpawnSystem() {
}

SpawnSystem.prototype = new System();

SpawnSystem.prototype.update = function (dt) {
	var spawnerList = this.ces.getListOfComponent(ObstacleSpawner);
	var playerList = this.ces.getListOfComponent(Player);
	var transformList = this.ces.getListOfComponent(Transform);

	for (var entityId in spawnerList) {
		var spawner = spawnerList[entityId];

		for (var playerId in playerList) {
			var player = playerList[playerId];
			var playerTransform = transformList[playerId];

			if (player.die) return;

			if (spawner.currentTime > spawner.getElapse()) {
				spawner.elapse -= (dt / 2);
				spawner.currentTime = (Math.random() * spawner.getElapse()) * 0.25;

				var obstacleX = playerTransform.position.x + 960;
				var ces = spawner.ces;
				var gameLayer = spawner.gameLayer;

				var random = Math.random();

				if (random > 0.6) 
					createObstacle(ces, gameLayer, new Vec2(obstacleX, 250), "balloon", new Vec2(50, 30));
				else if (random > 0.2) 
					createObstacle(ces, gameLayer, new Vec2(obstacleX, 245), "recyclebin", new Vec2(40, 30), new Vec2(2, 5));
				else if (random > 0.1)
					createObstacle(ces, gameLayer, new Vec2(obstacleX, 237), "obstacle_marvin", new Vec2(45, 70), new Vec2(-12, 0));
				else if (random > 0.05)
					createObstacle(ces, gameLayer, new Vec2(obstacleX, 100), "tobias", new Vec2(30, 40), new Vec2(0, 55));
				else 
					createObstacle(ces, gameLayer, new Vec2(obstacleX, 160), "hector", new Vec2(270, 80), new Vec2(-105, -10));	

			} else {
				spawner.currentTime += dt;
			}
		}
	}
}

function CameraSystem() {
}

CameraSystem.prototype = new System();

CameraSystem.prototype.update = function (dt) {
	var cameraList = this.ces.getListOfComponent(Camera);
	var playerList = this.ces.getListOfComponent(Player);
	var transformList = this.ces.getListOfComponent(Transform);

	for (var entityId in cameraList) {
		for (var playerId in playerList) {
			var camera = cameraList[entityId];
			var playerTransform = transformList[playerId];

			for (var key in camera.layers) {
				var layer = camera.layers[key];
				layer.doc.x = Math.floor(Math.min(-playerTransform.position.x + 75, 0) * layer.inc);

				for (var childIndex = 0; childIndex < layer.doc.getNumChildren(); childIndex ++) {
					if (layer.doc.getChildAt(childIndex).localToGlobal(0, 0).x < -719)
						layer.doc.getChildAt(childIndex).x += 479 * 3;
				}
				
			}
		}
	}
}

function RenderSystem() {
}

RenderSystem.prototype = new System();

RenderSystem.prototype.update = function (dt) {
	var viewList = this.ces.getListOfComponent(View);
	var transformList = this.ces.getListOfComponent(Transform);

	for (var entityId in viewList) {
		if (transformList[entityId]) {
			var view = viewList[entityId];
			var transform = transformList[entityId];
			var absolutePosition = transform.getAbsolutePosition();

			view.node.x = Math.floor(absolutePosition.x);
			view.node.y = Math.floor(absolutePosition.y);
			view.node.rotation = transform.getAbsoluteRotation() * 180 / Math.PI;
		}
	}
}