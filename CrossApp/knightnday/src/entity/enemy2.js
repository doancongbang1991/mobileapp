Enemy2 = function(game, x, y)
{
	// jarak jauh
	Phaser.Sprite.call(this, game, x, y, 'enemy_2');
	this.anchor.setTo(0.5, 1);
	this.frameName = 'enemy_2/walk_00';
	
	this.animations.add('walk', Phaser.Animation.generateFrameNames('enemy_2/walk_', 0, 10, '', 2), 13, true);
	
	var animDie = this.animations.add('die', Phaser.Animation.generateFrameNames('enemy_2/die_', 0, 12, '', 2), 18);
	animDie.onComplete.add(this.setDestroy, this);

	var animHit = this.animations.add('hit', Phaser.Animation.generateFrameNames('enemy_2/hit_', 0, 10, '', 2), 15);
	this.animations.currentAnim.enableUpdate = true;
	this.animations.currentAnim.onUpdate.add(this.onHitComplete, this);
	// animHit.onComplete.add(this.onHitComplete, this);

	this.data = DataEnemy[1];
	this.init();
};

Enemy2.inherit({

}, Enemy1)