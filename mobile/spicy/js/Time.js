
Time = function()
{
	this.DELTA_TIME = 1;	
	this.lastTime = Date.now();
	this.frames = 0;
	this.speed = 1;
}

Time.constructor = Time;

Time.prototype.update = function()
{
	
	this.frames ++;

	//if(this.frames > 30)
	//{
		var time = Date.now();
		
		this.frames = 0;
		
		var currentTime =  time;
		var passedTime = currentTime - this.lastTime;
	//	console.log(passedTime)
		//if(passedTime > 3000)passedTime = 3000;
	
		///this.DELTA_TIME = passedTime ;
//				1 = 17  // 60??
		this.DELTA_TIME = ((passedTime) * 0.06);
		
		if(this.DELTA_TIME > 3)this.DELTA_TIME = 3;
		
		this.DELTA_TIME *= this.speed;
		
		
	//	console.log(this.DELTA_TIME);
//			trace(DELTA_TIME);
		// 60 ---> 1
		// 30 ---> 2
	//	this.DELTA_TIME =1//2.3;
		this.lastTime = currentTime;
	//}
	
}

// create an instance!
TIME = new Time();
