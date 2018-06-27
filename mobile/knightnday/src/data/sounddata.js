SoundData = {
	atlasKey: "global",  // set NULL if not using atlas
	soundOn: "global/btn_sound_on",
	soundOff: "global/btn_sound_off",
	bgmVolume: 0.8,
	sfxVolume: 1,
	mobileSFX: true,
	bgm: [
		'bgm',
	],
	sfx: [
		'achievement',
	    'berserk',
	    'bomb',
	    'click',
	    'coins',
	    'dash',
	    'decrease',
	    'enemy_die',
	    'failed',
	    'gems',
	    'increase',
	    'match',
	    'roulette',
	    'shield',
	    'shuffle',
	    'skill',
	    'success',
	    'sword',
	    'weapon',
	    'select',
	],
	init: function() {
    
		csound.achievement = function() {
		    csound.sfx('achievement');
		}

		csound.berserk = function() {
		    csound.sfx('berserk');
		}

		csound.bomb = function() {
		    csound.sfx('bomb');
		}

		csound.click = function() {
		    csound.sfx('click');
		}

		csound.coins = function() {
		    csound.sfx('coins');
		}

		csound.dash = function() {
		    csound.sfx('dash');
		}

		csound.decrease = function() {
		    csound.sfx('decrease');
		}

		csound.enemyDie = function() {
		    csound.sfx('enemy_die');
		}

		csound.failed = function() {
		    csound.sfx('failed');
		}

		csound.gems = function() {
		    csound.sfx('gems');
		}

		csound.increase = function() {
		    csound.sfx('increase');
		}

		csound.match = function() {
		    csound.sfx('match', 0.5);
		}

		csound.roulette = function() {
		    csound.sfx('roulette');
		}

		csound.shield = function() {
		    csound.sfx('shield');
		}

		csound.shuffle = function() {
		    csound.sfx('shuffle');
		}

		csound.skill = function() {
		    csound.sfx('skill');
		}

		csound.success = function() {
		    csound.sfx('success');
		}

		csound.sword = function() {
		    csound.sfx('sword');
		}

		csound.weapon = function() {
		    csound.sfx('weapon');
		}

		csound.select = function() {
		    csound.sfx('select');
		}
	}
}