Enemy3 = function(game, x, y)
{
	// jarak dekat
	Phaser.Sprite.call(this, game, x, y, 'enemy_3');
	this.anchor.setTo(0.5, 1);
	this.frameName = 'enemy_3/walk_00';

	this.animations.add('walk', Phaser.Animation.generateFrameNames('enemy_3/walk_', 0, 10, '', 2), 13, true);
	
	var animDie = this.animations.add('die', Phaser.Animation.generateFrameNames('enemy_3/die_', 0, 12, '', 2), 18);
	animDie.onComplete.add(this.setDestroy, this);

	var animHit = this.animations.add('hit', Phaser.Animation.generateFrameNames('enemy_3/hit_', 0, 9, '', 2), 15);
	animHit.onComplete.add(this.onHitComplete, this);

	this.data = DataEnemy[2];

	this.init();
	// trace("ENEMY DISTANCE", this.distance);
};

Enemy3.inherit({
	onHitComplete: function()
	{
		// trace("ENEMY HIT COMPLETE");
		game.curstate.player.getHit(this.hit);
		if(game.curstate.player.hp <= 0) {
			this.isStop = true;
			this.isHit = false;
		}
	},
}, Enemy1)