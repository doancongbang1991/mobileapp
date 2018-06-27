

////////////////////////////////////////////////////////////
// BOX2D
////////////////////////////////////////////////////////////
var boxW=0;
var boxH=0;
var boxScale=30;
var box2dCanvasHolder="box2dCanvas";
var box2dPause=true;

var   b2Vec2
	,  b2AABB
	,	b2BodyDef
	,	b2Body
	,	b2FixtureDef
	,	b2Fixture
	,	b2World
	,	b2MassData
	,	b2PolygonShape
	,	b2CircleShape
	,	b2DebugDraw
	,  b2MouseJointDef
	;
 
var world
var fixDef
var bodyDef
var box2dInterval
var b2Listener

var defaultFPS = 60;
var curFPS = defaultFPS;
var worldGravity=50;
var worldHit=5;
var worldHitDouble=7
var worldHitMax=30;

/*!
 * 
 * START BOX2D - This is the function that runs to setup box2d
 * 
 */
function initBox2D(w,h){
	boxW=w;
	boxH=h;
	
	b2Vec2 = Box2D.Common.Math.b2Vec2
	b2AABB = Box2D.Collision.b2AABB
	b2BodyDef = Box2D.Dynamics.b2BodyDef
	b2Body = Box2D.Dynamics.b2Body
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	b2Fixture = Box2D.Dynamics.b2Fixture
	b2World = Box2D.Dynamics.b2World
	b2MassData = Box2D.Collision.Shapes.b2MassData
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
 
	world = new b2World(
		   new b2Vec2(0, 50)    //gravity
		,  true                 //allow sleep
	 );
	 
	fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 1.0;
	fixDef.radius = 20;
	fixDef.restitution = 1;
	
	bodyDef = new b2BodyDef;
	
	b2Listener = Box2D.Dynamics.b2ContactListener;
	setCollision()
	
	world.SetContactListener(b2Listener);
	
	resetFPS();
	updateWorldSetting();
}

/*!
 * 
 * RESET FPS - This is the function that runs to set default fps speed
 * 
 */
function resetFPS(){
	curFPS = defaultFPS;	
}


/*!
 * 
 * UPDATE FPS - This is the function that runs to update fps speed
 * 
 */
function updateFPS(num){
	curFPS -= num;
}

/*!
 * 
 * BOX2D GRAVITY - This is the function that runs for box2d gravity
 * 
 */
function updateWorldSetting(){
	var gravity = new b2Vec2( 0, worldGravity);
	world.SetGravity(gravity);
}

/*!
 * 
 * BUILD BOX2D WALL - This is the function that runs to setup box2d wall
 * 
 */
function createBox2DWall() {
	var edge=5;
	
	//create ground
	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(boxW/boxScale, 10/boxScale);
	bodyDef.position.Set(0, (boxH/100*105)/boxScale);
	bodyDef.userData = 'bottom'
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(0, 0-((boxW/100*20)/boxScale));
	bodyDef.userData = 'top'
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	fixDef.shape.SetAsBox(10/boxScale, boxH/boxScale);
	bodyDef.position.Set(0-((boxW/100*edge)/boxScale), 0);
	bodyDef.userData = 'left'
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set((boxW/boxScale)+((boxW/100*edge)/boxScale), 0);
	bodyDef.userData = 'right'
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	 
	//setup debug draw
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById(box2dCanvasHolder).getContext("2d"));
	debugDraw.SetDrawScale(30.0);
	debugDraw.SetFillAlpha(.5);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	world.SetDebugDraw(debugDraw);
	box2dInterval = setInterval(updateBox2d, 1000 / 60);
};

/*!
 * 
 * REMOVE BOX2D - This is the function that runs to remove box2d
 * 
 */
function removeBox2D(){
	clearInterval(box2dInterval);
	removeAllBody();
}


/*!
 * 
 * BOX2D COLLISION - This is the function that runs for box2d collision
 * 
 */
 function setCollision(){
	 	b2Listener.BeginContact = function(contact) {
						
		}
		b2Listener.EndContact = function(contact) {
			for(n=0; n<ballnumber_arr.length; n++){
				var tNumber = ballnumber_arr[n];
				
				if (contact.GetFixtureA().GetBody().GetUserData()==('left')&&contact.GetFixtureB().GetBody().GetUserData()=='soccerBall'+tNumber) {
					playSound('soundBallHit',false);
				}
				
				if (contact.GetFixtureA().GetBody().GetUserData()==('right')&&contact.GetFixtureB().GetBody().GetUserData()=='soccerBall'+tNumber) {
					playSound('soundBallHit',false);
				}
				
				if (contact.GetFixtureA().GetBody().GetUserData()==('playerbody')&&contact.GetFixtureB().GetBody().GetUserData()=='soccerBall'+tNumber) {
					setHitVelocity(contact.GetFixtureA().GetBody().GetPosition().x, contact.GetFixtureB().GetBody().GetPosition().x, tNumber)
					playSound('soundBallHit',false);
					playSound('soundScore',false);
					updateScore(gameScore, tNumber);
				}
			}
		}
		b2Listener.PostSolve = function(contact, impulse) {
			
		}
		b2Listener.PreSolve = function(contact, oldManifold) {
			
		}
 }

/*!
 * 
 * BOX2D LOOP - This is the function that runs for box2d loop
 * 
 */
function updateBox2d() {	
	if(box2dPause){
		var targetBall=getBox2dData('soccerBall');
		if(targetBall!=null){
			var speed = targetBall.GetLinearVelocity().Length();
			var maxSpeed=30;
			if(speed>maxSpeed){
				var velX = targetBall.GetLinearVelocity().x;
				var velY = targetBall.GetLinearVelocity().y;
				if(velX>maxSpeed){
					velX=maxSpeed;
				}else if(velX<0-(maxSpeed)){
					velX=0-(maxSpeed);
				}
				if(velY>maxSpeed){
					velY=maxSpeed;
				}else if(velY<0-(maxSpeed)){
					velY=0-(maxSpeed);
				}
				targetBall.SetLinearVelocity(new b2Vec2(velX, velY));
			}
		}
		
		world.Step(1 / curFPS, 10, 10);
		world.DrawDebugData();
		world.ClearForces();
	}
};

/*!
 * 
 * BOX2D BODY RETRIEVE - This is the function that runs to get box2d bodies by data
 * 
 */
function getBox2dData(data){
	for (b = world.GetBodyList(); b; b = b.GetNext()) {
		if(b.GetUserData()==data){
			return b;
		}
	}
}

/*!
 * 
 * BOX2D BALL UPDATE - This is the function that runs to update box2d ball position
 * 
 */
function updateBox2dBallPos(posX, posY){
	var target=getBox2dData('soccerBall');
	if(target!=null){
		target.SetPosition (new b2Vec2(posX/boxScale,posY/boxScale));
	}
}

/*!
 * 
 * BOX2D PLAYER UPDATE - This is the function that runs to update box2d player position
 * 
 */
function updateBox2dPlayerPos(left,top){
	top=top-180;
	var controlHead=getBox2dData('playerbody');
	if(controlHead!=null){
		controlHead.SetPosition (new b2Vec2((left/boxScale),((top+170)/boxScale)));
	}
}

/*!
 * 
 * CREATE BOX2D PLAYER - This is the function that runs to create box2d player
 * 
 */
function drawBox2dPlayer(){
	var target=getBox2dData('playerbody');
	if(target!=null){
		world.DestroyBody(target);
	}
	
	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(3,4);
	bodyDef.userData='playerbody';
	world.CreateBody(bodyDef).CreateFixture(fixDef);	
}

/*!
 * 
 * CREATE BOX2D BALL - This is the function that runs to create box2d ball
 * 
 */
function drawBox2dBall(num){
	var target=getBox2dData('soccerBall'+num);
	var targetX=((boxW/100*30)/boxScale)+Math.round(Math.random()*((boxW/100*40)/boxScale));
	var targetY=-((boxH/100*5)/boxScale);
	var velX=0;
	var velY=0;
	if(target!=null){
		world.DestroyBody(target);
	}
	var ballWidth=1.8;
	bodyDef.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2CircleShape(ballWidth);
	bodyDef.position.x = targetX;
	bodyDef.position.y = targetY;
	bodyDef.userData = 'soccerBall'+num;
	world.CreateBody(bodyDef).CreateFixture(fixDef);
	
	var targetBall=getBox2dData('soccerBall'+num);
	var newVelocity = createVelocity(targetX,velY);
	targetBall.SetLinearVelocity(newVelocity);
}

/*!
 * 
 * BOX2D VELOCITY - This is the function that runs to get bodies to move at constant speed
 * 
 */
function createVelocity(velX, velY){
	var velXChange=velX<((boxW/2)/boxScale)?false:true;
	var newSpeed=0;
	velY=-5;
	velX=Math.round(Math.random()*(worldGravity/100*15));
	if(!velXChange){
		velX=0-velX;
	}
	return new b2Vec2(velX, velY);
}

/*!
 * 
 * BOX2D COLLISION VELOCITY - This is the function that runs to get bodies to move at constant speed when hit
 * 
 */
function setHitVelocity(playerX, ballX, num){
	var target=getBox2dData('soccerBall'+num);
	var newX,newY,newSpeed=0;
	if(target!=null){
		newX=target.GetLinearVelocity().x;
		newY=target.GetLinearVelocity().y;
	}
	
	var randomX = Math.round(Math.random()*10);
	if(ballX>playerX){
		newX+=randomX;
	}else{
		newX-=randomX;
	}
	
	if(playerJump==2){
		newY-=worldHit;	
	}else if(playerJump==3){
		newY-=worldHitDouble;
	}
	newY=newY<-worldHitMax?-worldHitMax:newY;
	var newVelocity = new b2Vec2(newX,newY);
	target.SetLinearVelocity(newVelocity);
}


/*!
 * 
 * REMOVE BOX2D BODY - This is the function that runs to remove bo2d body
 * 
 */
function removeBody(targetname){
	var target=getBox2dData(targetname);
	if(target!=null){
		world.DestroyBody(target);
	}
}

/*!
 * 
 * REMOVE ALL BOX2D BODIES - This is the function that runs to remove all bo2d bodies
 * 
 */
function removeAllBody(){
	for (b = world.GetBodyList(); b; b = b.GetNext()) {
		world.DestroyBody(b)
	}
}

/*!
 * 
 * TOGGLE BOX2D WORLD - This is the function that runs to start or stop box2d loop
 * 
 */
function toggleBox2dWorld(con){
	box2dPause=con
}