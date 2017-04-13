Enemy9 = function(game, x, y)
{
	// jarak dekat
	Phaser.Sprite.call(this, game, x, y, 'enemy_9');
	this.anchor.setTo(0.5, 1);
	this.frameName = 'enemy_9/walk_00';

	this.animations.add('walk', Phaser.Animation.generateFrameNames('enemy_9/walk_', 0, 10, '', 2), 13, true);
	
	var animDie = this.animations.add('die', Phaser.Animation.generateFrameNames('enemy_9/die_', 0, 12, '', 2), 18);
	animDie.onComplete.add(this.setDestroy, this);

	var animHit = this.animations.add('hit', Phaser.Animation.generateFrameNames('enemy_9/hit_', 0, 9, '', 2), 15);
	animHit.onComplete.add(this.onHitComplete, this);

	this.data = DataEnemy[8];

	this.init();
};

Enemy9.inherit({

}, Enemy3)