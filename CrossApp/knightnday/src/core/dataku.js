dataku = {};

dataku.setPosX = function(percent) {
	return Math.floor((BasicGame.gameWidth) * (percent / 100));	
}

dataku.setPosY = function(percent) {
	return Math.floor((BasicGame.gameHeight) * (percent / 100));
}

dataku.alignLeft = function(percent) {
	return global.left + Math.floor((global.viewWidth) * (percent / 100));
}

dataku.alignTop = function(percent) {
	return global.top + Math.floor((global.viewHeight) * (percent / 100));
}

dataku.setWordWrap = function(size) {
	return (size*BasicGame.gameWidth/1020);
}

dataku.setFont = function(size) {
	return (size*BasicGame.gameWidth/1020);
}

dataku.Distance = function(x1, y1 , x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

dataku.AngleOfTwoDots = function(x1, y1, x2, y2) {
	var dx = x1 - x2;
	var dy = y1 - y2;
	return Math.atan2(dy, dx);
}

dataku.RadToDeg = function(rad) {
	return rad * 180 / Math.PI;
}

dataku.checkOverlap = function(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

dataku.fileComplete = function(progress, cacheKey, success, totalLoaded, totalFiles) {

    //this.text.setText("File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles);
    if (this.loading_hati == null){

        this.loading_hati = game.add.sprite(0,0,'loading_bar'); 
        this.loading_hati.x = BasicGame.viewWidth/2-this.loading_hati.width/2;       
        this.loading_hati.y = BasicGame.viewY + BasicGame.viewHeight/2;
        
        //this.loading_hati.anchor.set(0,0.5);
        this.text_loading = game.add.text( this.loading_hati.x+this.loading_hati.width/2,this.loading_hati.y+this.loading_hati.height+25, progress+"%", {
            font:"31px Times New Roman", fill:"#FFFFFF",fontWeight:"bold", align:"center"});  
        this.text_loading.anchor.set(0.5)

        this.loading_hati.temp_width = this.loading_hati.width
        this.loading_hati.width = 0
        
    }
    this.loading_hati.width = this.loading_hati.temp_width * (progress/100)
    this.text_loading.setText(progress+"%")
    if (progress == 100){
    	this.text_loading.destroy()
    	this.loading_hati.destroy()
    	this.loading_hati = null
    }
};

dataku.frameSound = 1;
dataku.music = null;
dataku.world_level = 1;
dataku.flag_tutor = false;
dataku.scaleX = 1;
dataku.scaleY = 1;

dataku.world_wave1 =  [
				{musuh:["zombie1"], jumlah:[1], waktu_game:20, speed:[0.5, 1.2]},
				{musuh:["zombie2"], jumlah:[3], waktu_game:20, speed:[0.5, 1.2]},
				{musuh:["zombie1","zombie2"], jumlah:[4,1], waktu_game:20, speed:[0.5, 1.2]}
]

dataku.world_wave2 =  [
				{musuh:["zombie1"], jumlah:[3], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["zombie1"], jumlah:[4], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["zombie1","zombie2","zombie3"], jumlah:[4,1,1], waktu_game:30, speed:[0.5, 1.2]}
]
dataku.world_wave3 =  [
				{musuh:["zombie3",'ranger1'], jumlah:[3,1], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger2"], jumlah:[4], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger1","zombie2"], jumlah:[5,1], waktu_game:30, speed:[0.5, 1.2]}
]

dataku.world_wave4 =  [
				{musuh:["ranger1",'ranger2',"ranger3"], jumlah:[1,2,1], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["zombie3",'zombie2'], jumlah:[1,2], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger2"], jumlah:[4], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger1","zombie2"], jumlah:[5,1], waktu_game:30, speed:[0.5, 1.2]}
]

dataku.world_wave5 =  [
				{musuh:["ranger1",'ranger2',"ranger3"], jumlah:[1,2,1], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["zombie3",'zombie2'], jumlah:[1,2], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger2"], jumlah:[4], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger1","zombie2"], jumlah:[5,1], waktu_game:30, speed:[0.5, 1.2]}
]
dataku.world_wave6 =  [
				{musuh:["ranger1",'ranger2',"ranger3"], jumlah:[1,2,1], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["zombie3",'zombie2'], jumlah:[1,2], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger2"], jumlah:[4], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger1","zombie2"], jumlah:[5,1], waktu_game:30, speed:[0.5, 1.2]}
]
dataku.world_wave7 =  [
				{musuh:["ranger1",'ranger2',"ranger3"], jumlah:[1,2,1], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["zombie3",'zombie2'], jumlah:[1,2], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger2"], jumlah:[4], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger1","zombie2"], jumlah:[5,1], waktu_game:30, speed:[0.5, 1.2]}
]
dataku.world_wave8 =  [
				{musuh:["ranger1",'ranger2',"ranger3"], jumlah:[1,2,1], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["zombie3",'zombie2'], jumlah:[1,2], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger2"], jumlah:[4], waktu_game:30, speed:[0.5, 1.2]},
				{musuh:["ranger1","zombie2"], jumlah:[5,1], waktu_game:30, speed:[0.5, 1.2]}
]

dataku.musuh = {
				zombie1	: {armor:1, damage:10, score:5, coin:5},
				zombie2	: {armor:1, damage:10, score:10, coin:15},
				zombie3	: {armor:1, damage:10, score:20, coin:25},
				ranger1	: {armor:1, damage:10, score:5, coin:5},
				ranger2	: {armor:1, damage:10, score:10, coin:15},
				ranger3	: {armor:1, damage:10, score:20, coin:25}
			   }

dataku.shop = {
				maxhealth : 	{harga:[10,20,30,40,50,60,70,80],increase:[1,1,1,1,1,1,1,2],level:0},
				punch_damage : 	{harga:[10,20,30,40,50,60,70,80],increase:[1,1,1,2,2,2,3,3],level:0},
				power_rifle : 	{harga:[10,20,30,40,50,60,70,80],increase:[5,5,5,5,5,5,5,5],level:0},
				ammo_rifle : 	{harga:[10,20,30,40,50,60,70,80],increase:[1,2,3,4,5,6,7,8],level:0},
				power_launcher :{harga:[10,20,30,40,50,60,70,80],increase:[5,5,5,5,5,5,5,5],level:0},
				ammo_launcher : {harga:[10,20,30,40,50,60,70,80],increase:[1,2,3,4,5,6,7,8],level:0}
			  }

dataku.boss1 = {speed:2,damage_on_melee:10,damage_on_range:10,damage_off_melee:10,armor:10,coin:3,lama_off:600,waktu_muncul_tower:600,lama_idle_or_walk:[200,300],score:3,tower_armor:1};
dataku.boss2 = {speed:2,damage_atk_melee:10,damage_atk_range:10,damage_atk_special:10,armor:20,speed_peluru: 5,coin:3,score:3,lama_idle:[200,300]};

dataku.default_player = {hp:161,speed:400,damage_pukulan:20,damage_rifle:25,damage_missile:60, max_bullet:10,max_missile:2,score:0,coin:0,life:3,armor:1};
dataku.player = {hp:161,speed:400,damage_pukulan:20,damage_rifle:25,damage_missile:60, max_bullet:10,max_missile:2,score:0,coin:0,life:3,armor:1};
dataku.waktu_spawn_totem = [400,800]
