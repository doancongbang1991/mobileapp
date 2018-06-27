
/**
 * @author matgroves
 */

var Spring = function(){
	
	this.x				 = 0;
	this.ax				 = 0;
	this.dx				 = 0;
	this.tx				 = 0;

	this.max			 = 60;
	
	this.damp			 = 0.25;
	this.springiness	 = 0.9
	
};

max = 30;
damp = 0.85;
springiness = 0.09;
/*
max = 36
damp = 0.72
springiness = 0.401

max = 13
damp = 0.63
springiness = 0.369
*/
	// C O N S T R U C T O R S ---------------------------------------//
		
	// P U B L I C ---------------------------------------------------//
	
Spring.prototype.update = function()
{
	//var damp = this.damp;
	
//	var springiness = this.springiness;
//	var max = this.max;
	
	this.ax=(this.tx-this.x)*springiness;
	
	this.dx+=this.ax;
	this.dx*=damp; 
	
	if(this.dx < -max)this.dx = -max;
	else if(this.dx > max)this.dx = max;
	
	//Math2.cap(dx, -max, max);
	
	this.x+=this.dx; 
}

Spring.prototype.reset = function() 
{
	this.x = 0;
	this.ax = 0;
	this.dx = 0;
	this.tx = 0;
}
