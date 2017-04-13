Data = {};

// add value hp, mp, stamina, attack, defend
Data.valueGems = 5;
Data.valueCoins = 1;

Data.addValue = [
	8, 8, 8, 8, 8,	
];

Data.maxPuzzle = [5, 6, 7];

Data.revivePrice = 5;

Data.unlockPrice = [
	0, 500, 500
];

// price upgrade level spell/special
Data.upgradePrice = [
	[100, 250, 400, 600, 800],
	[100, 250, 400, 600, 800],
	[100, 250, 400, 600, 800],
];

Data.skillPrice = [2, 2, 2, 2, 2, 1];
Data.upgradeSkill = [3, 3, 3, 3, 3];

DataPlayer = {
	isTutorGame: true,
	// isTutorGame: false,
	isTutorArmor: true,
	isTutorBubble: true,
	isTutorMP: true,
	// isTutorBubble: false,
	isTutorHorVert: false,
	isTutorGems: true,
	stage: 1,
	// stage: 11,
	lastStage: 1,
	// lastStage: 30,
	coins: 0,
	// coins: 700,
	gems: 0,
	// gems: 100,
	// skill: [50, 10, 50, 10, 20],			// hp, mp, stamina, attack, defend
	skill: [50, 50, 10, 20, 10],			// hp, stamina, attack, defend, mp
	// skill: [5000, 1000, 100, 75, 200],			// hp, mp, stamina, attack, defend
	upgradeLv: [0, -1, -1],					// dash, shield, berserk
	totalRoulette: 0,
	totalKill: 0,
	achievement: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	score: 0,
};

Data.checkAchievement = function(idx)
{
	if(DataPlayer.achievement[idx] == 1)
		return false;

	DataPlayer.achievement[idx] = 1;
	Data.save();
	return true;
};

Data.addScore = function(value) {
	if (!DataPlayer.score)DataPlayer.score = 0;
	DataPlayer.score += value;
	// trace("addScore", value, DataPlayer.score);
	Data.save();
}

Data.save = function()
{
	// return;
	bake_cookie("Player", DataPlayer);
};

Data.load = function()
{
	// return;
	var test = read_cookie("Player");
	if (test == null) {
		Data.save();
		return;
	}

	DataPlayer = read_cookie("Player");
};