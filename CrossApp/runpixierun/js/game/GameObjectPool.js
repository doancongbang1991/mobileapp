/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.GameObjectPool = function(classType)
{
	this.classType = classType;
	this.pool = [];
}

// constructor
GAME.GameObjectPool.constructor = GAME.GameObjectPool;

GAME.GameObjectPool.prototype.getObject = function()
{
	var object = this.pool.pop();
	if(!object)
	{
		object =  new this.classType();
		
	}
	return object;
}

GAME.GameObjectPool.prototype.returnObject = function(object)
{
	//this.pool.push(object);
}





