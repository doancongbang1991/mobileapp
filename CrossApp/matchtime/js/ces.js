//------------------------------------------------------------------
// CES
//------------------------------------------------------------------
function CES() {
	this.TICK = 1000 / 60;

	this.db = {};
	this.nextId = 0;
	this.systems = [];
	this.intervalId = 0;
	this.time = 0;
	this.paused = true;
}

CES.prototype.update = function (self) {
	var now = new Date();
	var dt = Math.min(now - self.time, self.TICK * 2) / 1000;
	self.time = now;

	for (var i = 0; i < self.systems.length; ++i) {
		self.systems[i].update(dt);
	}
}

CES.prototype.getNewEntityId = function () {
	return this.nextId ++;
}

CES.prototype.addComponentToEntity = function (component, entityId) {
	if (!this.db[component.constructor]) this.db[component.constructor] = {};
	this.db[component.constructor][entityId] = component;
	component.entityId = entityId;
}

CES.prototype.getListOfComponent = function (componentClass) {
	return this.db[componentClass];
}

CES.prototype.removeEntity = function (entityId) {
	for (componentClass in this.db) {
		if (this.db[componentClass][entityId]) {
			delete this.db[componentClass][entityId];
		}
	}
}

CES.prototype.addSystem = function (system) {
	system.ces = this;
	this.systems.push(system);
}

CES.prototype.start = function () {
	clearInterval(this.intervalId);
	this.intervalId = setInterval(this.update, this.TICK, this);
	this.paused = false;
}

CES.prototype.stop = function () {
	clearInterval(this.intervalId);
	this.paused = true;
}

//------------------------------------------------------------------
// System
//------------------------------------------------------------------
function System() {
	this.ces;
} 

System.prototype.update = function (dt) {
}