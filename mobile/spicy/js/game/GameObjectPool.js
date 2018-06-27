/**
 * @author Mat Groves
 */

var GAME = GAME || {};

GAME.GameObjectPool = function(classType, cook)
{
	this.classType = classType;
	this.pool = [];
	
	var cookAmount = cook || 20;
	
	for (var i=0; i < cookAmount; i++) {
	  
	  	this.pool.push(new this.classType());
	};
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





