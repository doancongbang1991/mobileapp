//------------------------------------------------------------------
// Vector2D
//------------------------------------------------------------------
function Vec2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vec2.prototype.getLength = function () {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vec2.prototype.getLengthSquared = function () {
	return this.x * this.x + this.y * this.y;
}

Vec2.prototype.getAngle = function () {
	return Math.atan2(this.y, this.x);
}

Vec2.prototype.normalize = function () {
	var length = this.getLengthSquared();

	if (length)
		return new Vec2(this.x / length, this.y / length);

	return new Vec2(0, 0);
}

Vec2.prototype.scale = function (scale) {
	return new Vec2(this.x * scale, this.y * scale);
}

Vec2.prototype.add = function (otherVec2) {
	return new Vec2(this.x + otherVec2.x, this.y + otherVec2.y);
}

Vec2.prototype.sub = function (otherVec2) {
	return new Vec2(this.x - otherVec2.x, this.y - otherVec2.y);
}

Vec2.prototype.rotate = function (angle) {
	var cosVal = Math.cos(angle);
	var sinVal = Math.sin(angle);

	return new Vec2(this.x * cosVal - this.y * sinVal, this.x * sinVal + this.y * cosVal);
}

Vec2.prototype.negate = function () {
	return new Vec2(-this.x, -this.y);
}