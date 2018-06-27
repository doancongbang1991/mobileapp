Weapon = function(game, x, y, id, hitPoints)
{
	Phaser.Sprite.call(this, game, x, y, 'weapon');
	this.anchor.setTo(0.5, 0.5);
	this.frameName = 'weapon/'+id;
	this.hitPoints = hitPoints;

	this.vx = 3;
	this.init();
};

Weapon.inherit({
	init: function()
	{
		this.isDestroy = false;
		game.physics.enable(this, Phaser.Physics.ARCADE);
		// this.body.setSize(this.width*0.2, this.height*0.5, -this.width*0.15, -this.height*0.18);
		this.body.setSize(this.width, this.height, -this.width*0.5, 0);
	},

	setDestroy: function()
	{
		this.isDestroy = true;
		var idx = game.curstate.arWeapon.indexOf(this);
		game.curstate.arWeapon.splice(idx, 1);
		this.destroy();
	},

	update: function()
	{
		if(this.isDestroy || game.curstate.isPause || game.curstate.isOver)
			return;

		if(this.body.x < 0) {
			this.destroy();
			return;
		}

		this.body.x -= this.vx;
		this.vx += 0.1;
		this.angle += 2;
	},
}, Phaser.Sprite);