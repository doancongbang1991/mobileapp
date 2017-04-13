States.Menu = function(game){
	brakeAvailable = false;
};

States.Menu.prototype = {
	create: function(){

		//globalScale = this.world.width/640;
		sfx = game.add.audio('SoundEffects');
		this.AddSoundMarkers();

		// init main menu
		this.InitMainMenu();

		cheatText = "";
		this.input.keyboard.onDownCallback = function(e)
		{
			cheatText = cheatText + String.fromCharCode(e.keyCode);
		}
		var cheatKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		cheatKey.onDown.add(this.CheatUnlockEverything, this);

		// cheat!
		if (Globals.cheats)
		{
		 	cheatText = "XFORMISTHEBEST";
			this.CheatUnlockEverything();
		}

	},

	CheatUnlockEverything: function()
	{
		if (cheatText == "XFORMISTHEBEST")
		{
			Globals.unlockedCars = Globals.availableCars;
			Globals.unlockedWeapons = Globals.availableWeapons;
		}
		cheatText = "";
	},

	PlaySFX: function(audioName)
	{
		sfx.play(audioName);
	},

	AddSoundMarkers: function()
	{
		sfx.addMarker(	   'MainMenu',  0.026, 6.9);
		sfx.addMarker(   'PlayButton',  7.026, 2.9);
		sfx.addMarker('VehicleSelect', 10.026, 2.9);
		sfx.addMarker( 'WeaponSelect', 13.026, 2.9);
		sfx.addMarker( 'TouchToStart', 16.026, 2.9);
	},

	InitMainMenu: function(){
		this.PlaySFX('MainMenu');
		// create the main menu group
		// (PIETER) I am still unsure if this is the way to go
		// perhaps we must add these groups to a global object, so they don't convolute the rest....
		mainMenuGroup = this.add.group();

		// background image
		var background = this.add.sprite(0, 0, 'MainMenuBackground');
		background.scale.setTo(1.0*globalScale, 1.0*globalScale);
		mainMenuGroup.add(background);

		// footer
		var footer = game.add.bitmapText(0, 0,  'Impact', Localization.Footer, 20*globalScale);
		footer.align = 'center';
		footer.updateText(); // update it so we know the width of text
		footer.x = this.world.centerX - footer.textWidth*0.5;
		footer.y = this.world.height - (footer.textHeight+20*globalScale);

		// add the button that will start the game
		var buttonGroup = this.add.group();
		// button
		var button = this.add.button(0, 0, 'MainButton', this.InitCarSelect, this, 1, 0, 2);
		button.scale.setTo(1.0*globalScale, 1.0*globalScale);
		button.anchor.setTo(0.5, 1.2); // is this anchor to the complete sprite sheet?
		buttonGroup.add(button); // add to group
		// button text
		var buttonText = game.add.bitmapText(0, 0,  'Impact', Localization.StartButton, 128*globalScale);
		buttonText.updateText(); // update so we know the width
		buttonText.x = button.x - buttonText.textWidth*0.5 + 5*globalScale; // wth, but center to button
		buttonText.y = button.y - buttonText.textHeight*1.2 - 8*globalScale; // wth, but center to button
		buttonGroup.add(buttonText); // add to button group
		// place button
		buttonGroup.x = this.world.centerX;
		buttonGroup.y = this.world.height - (128*globalScale) - 32;
		mainMenuGroup.add(buttonGroup);

		// branding
		var branding = this.add.sprite(0, 0, 'Branding');
		branding.scale.setTo(0.5*globalScale, 0.5*globalScale);
		branding.x = this.world.centerX - (branding.width/2);
		branding.y = footer.y - branding.height;
		branding.inputEnabled = true;
		branding.input.useHandCursor = true;
		branding.events.onInputDown.add(this.OpenBrandingSite, this);

		var highScore = game.add.bitmapText(0, 0,  'Impact', Localization.Highscore + Globals.bestScore, 32*globalScale);
		highScore.updateText();
		highScore.x = game.world.centerX - highScore.textWidth*0.5;
		highScore.y = 10*globalScale;
		mainMenuGroup.add(highScore);

		var totalScore = game.add.bitmapText(0, 0,  'Impact', Localization.TotalScore + Globals.totalScore, 32*globalScale);
		totalScore.updateText();
		totalScore.x = game.world.centerX - totalScore.textWidth*0.5;
		totalScore.y = totalScore.textHeight + 14*globalScale;
		mainMenuGroup.add(totalScore);

		var bestDistance = game.add.bitmapText(0, 0,  'Impact',  Localization.BestDistance + Globals.bestDistance + "m", 44*globalScale);
		bestDistance.updateText();
		bestDistance.x = game.world.centerX - bestDistance.textWidth*0.5;
		bestDistance.y = bestDistance.textHeight + 36*globalScale;
		mainMenuGroup.add(bestDistance);


		// cheat
		if (Globals.cheats)
		{
			// group
			/*var cheatButtonGroup = this.add.group();
			// cheatButton
			var cheatButton = game.add.button(0, 0,  'WeaponButton', this.CheatUnlockEverything, this, 1, 0, 2);
			cheatButton.width = 64;
			cheatButton.height = 64;
			cheatButton.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
			cheatButtonGroup.add(cheatButton); // add to group
			// tet
			var cheatText = game.add.bitmapText(0, 0,  'Impact', "X", 64);
			cheatText.updateText(); // update so we know the width
			cheatText.x = button.x - cheatText.textWidth*0.5 + 1; // wth, but center to button
			cheatText.y = button.y - cheatText.textHeight*0.5 - 5; // wth, but center to button
			cheatButtonGroup.add(cheatText); // add to button group

			// place button
			cheatButtonGroup.x = 50;
			cheatButtonGroup.y = this.world.height - 50
			mainMenuGroup.add(cheatButtonGroup);
			*/
		}

		// muteButton
		// off 2, 0, 4, 0
		// on  3, 1, 5, 1
		soundButton = this.add.button(0, 0, 'SoundButton', this.MuteLevel, this, 2, 0, 4, 0);
		soundButton.scale.setTo(1.0*globalScale, 1.0*globalScale);
		soundButton.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
		soundButton.x = game.world.width - soundButton.width*0.5;
		soundButton.y = soundButton.height - 30*globalScale;
		soundButton.bringToTop();
		if (!Globals.music && !Globals.sfx) soundButton.setFrames(2, 0, 4, 0)
		else soundButton.setFrames(3, 1, 5, 1)

		var muteKey  = this.input.keyboard.addKey(Phaser.Keyboard.M);
		muteKey.onDown.add(this.MuteLevel, this);



		// forward
		//var skipKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		//skipKey.onDown.add(this.InitCarSelect, this);

	},

	OpenBrandingSite: function(){
		window.open(Globals.brandingUrl);
	},

	MuteLevel: function(){
		Globals.music = !Globals.music;
		Globals.sfx = !Globals.sfx;
		this.sound.mute = !this.sound.mute;
		// update icon
		if (!Globals.music && !Globals.sfx) soundButton.setFrames(2, 0, 4, 0)
		else soundButton.setFrames(3, 1, 5, 1)
	},


	InitCarSelect: function(){
		this.PlaySFX('PlayButton');

		// hide the main menu group
		mainMenuGroup.visible = false;

		// create the car select group
		carSelectGroup = this.add.group();

		// background image
		var background = this.add.sprite(0, 0, "DefaultMenuBackground")
		background.scale.setTo(1.0*globalScale, 1.0*globalScale);
		carSelectGroup.add(background);

		// header text
		var header = game.add.bitmapText(0, 0,  'Impact', Localization.SelectCarHeader, 96*globalScale);
		header.tint = 0xCD2323;
		header.updateText();
		header.x = game.world.centerX - header.textWidth*0.5;
		//carSelectGroup.add(header);

		// create the buttons in a loop
		for (var i = 0; i < 6; i++)
	    {
	        // car
	        var car = Globals.availableCars[i];

	        // button group
	        var buttonGroup = this.add.group();
	        // button
	        var button = this.add.button(0, 0, 'CarButton', this.SelectCar, this, 1, 0, 2, 0)
	        button.anchor.setTo(0.5, 0.5);
	        button.name = car; // very important; we use this to check which button/car is selected
	        buttonGroup.add(button); // add to group

	        // car image
	        var carImage = this.add.sprite(0, 0, 'MenuCars');
	        carImage.frameName = 'MenuCar'+car+'.png';
	        carImage.anchor.setTo(0.5, 0.5);
	        carImage.x = button.x;
	        carImage.y = button.y;
	        buttonGroup.add(carImage);

	       // new?
	       if (Globals.unlockedCars.indexOf(car) > -1)
	        {
	        	// car name
	        	var carName = game.add.bitmapText(0, 0,  'Impact', Localization[car+'Name'], 75);
	        	//carName.align = 'right'; DOESNT WORK WITH SINGLE LINE TEXT
	        	carName.updateText();
	        	carName.x = button.x - carName.textWidth + button.width*0.5 - 12;
	        	carName.y = button.y - carName.textHeight*0.5 - 25;
	        	buttonGroup.add(carName);
	        	// car specs text

	        	var armorBackground = this.add.sprite(0, 0, 'InterfaceItems');
				armorBackground.frameName = 'InterfaceArmorIcon.png';
				armorBackground.anchor.setTo(0.5, 0.5);
				armorBackground.scale.setTo(0.5, 0.5);
				armorBackground.position.setTo(button.x + armorBackground.width * 4.25, button.y + armorBackground.height / 1.75);
				buttonGroup.add(armorBackground);

	        	var carSpecsText = Localization.Speed + Localization[car+'Speed'] + '   ' + Localization.Armor + '' + Data.Cars[car].Armor + '';
	        	var carSpecs = game.add.bitmapText(0, 0,  'Impact', carSpecsText, 40);
				carSpecs.x = button.x - carSpecs.textWidth + button.width*0.5 - 15;
	        	carSpecs.y = button.y - carSpecs.textHeight*0.5 + 32;
	        	buttonGroup.add(carSpecs);
	        	// new?
	        	if (Globals.newCars.indexOf(car) > -1)
	        	{
	        		var newIcon = this.add.sprite(0, 0, 'NewIcon');
	        		newIcon.anchor.setTo(0.5, 0.5);
	        		newIcon.x = button.x + button.width*0.5 - 15;
	        		newIcon.y = button.y - button.height*0.5 + 15;
	        		// scale tween
	        		var s = game.add.tween(newIcon.scale);
    				s.to({x: 2, y:2}, 200, Phaser.Easing.Linear.None);
    				s.to({x: 1, y:1}, 200, Phaser.Easing.Linear.None);
    				s.loop();
    				s.start();
    				// add ot group
	        		buttonGroup.add(newIcon);
	        	}
	        } else {
	        	// Locked!
	        	button.input.enabled = false; // disable button
	        	carImage.tint = 0x222222; // tint carimage to black
	        	// locked text
	        	var lockedText = game.add.bitmapText(0, 0,  'Impact', Localization.LockedCar, 75);
	        	lockedText.tint = 0x666666;
	        	lockedText.updateText();
	        	lockedText.x = button.x - lockedText.textWidth + button.width*0.5 - 12;
	        	lockedText.y = button.y - lockedText.textHeight*0.5 - 25;
	        	buttonGroup.add(lockedText);
	        	// locked score
	        	var lockedSpecs = Localization.ScoreCar + Data.Cars[car].UnlockScore;
	        	var lockedScore = game.add.bitmapText(0, 0,  'Impact', lockedSpecs, 40);
	        	lockedScore.tint = 0x666666;
	        	lockedScore.updateText();
				lockedScore.x = button.x - lockedScore.textWidth + button.width*0.5 - 15;
	        	lockedScore.y = button.y - lockedScore.textHeight*0.5 + 32;
	        	buttonGroup.add(lockedScore);
	        }

	        buttonGroup.scale.setTo(1.0*globalScale, 1.0*globalScale);
	        buttonGroup.x = game.world.centerX - 640*globalScale - i*(200*globalScale);
	        buttonGroup.y = (128 + 50)*globalScale + (138*i)*globalScale;

	        // testing
	        game.add.tween(buttonGroup).to( { x: game.world.centerX }, 550, Phaser.Easing.Exponential.Out, true);



	        // set and align button
	        // buttonGroup.x = game.world.centerX;
	        // buttonGroup.y = 128 + 50 + (138*i);
	    }

	   //carSelectGroup.scale.setTo(0.5, 0.5);
	},

	SelectCar: function(button){
		if (carSelectGroup.visible)
		{
			// Incoming object is the button.
			// Button has name, use that as tag
			Globals.currentCar = button.name; // Select the car

			// Remove from new list
			if(Globals.newCars.indexOf(Globals.currentCar) > - 1) Globals.newCars.splice(Globals.newCars.indexOf(Globals.currentCar));

			// Save
			xManager.SaveData();

			// go to other screen
			this.InitWeaponSelect();
		}
	},

	InitWeaponSelect: function(){
		this.PlaySFX('VehicleSelect');

		// Hide car select
		carSelectGroup.visible = false;
		// create weaponselect group
		weaponSelectGroup = game.add.group();

		// background image
		var background = this.add.sprite(0, 0, "DefaultMenuBackground")
		background.scale.setTo(1.0*globalScale, 1.0*globalScale);
		weaponSelectGroup.add(background);

		// header text
		var header = game.add.bitmapText(0, 0,  'Impact', Localization.SelectWeaponHeader, 80*globalScale);
		header.tint = 0xCD2323;
		header.updateText();
		header.x = game.world.centerX - header.textWidth*0.5;

		// create the buttons in a loop
		var counter = -1;
		for (var i = 0; i < 4; i++)
	    {
	    	for (var j = 0; j < 2; j++)
	    	{
	    		// next one, needed as we have loop in loop
	    		counter++;
	    		// weapon
	    		var weapon = Globals.availableWeapons[counter];
	    		// new group
	    		var buttonGroup = this.add.group();
	    		// new button
	    		var button = this.add.button(0, 0, 'WeaponButton', this.SelectWeapon, this, 1, 0, 2, 0);
	        	button.anchor.setTo(0.5, 0.5);
		        button.name = weapon; // very important; we use this to actually select the weapon
		        buttonGroup.add(button);

		    	// image (on top)
		        var weaponImage = this.add.sprite(0, 0, 'MenuWeapons');
		        weaponImage.frameName = 'MenuWeapon'+weapon+'.png';
		        weaponImage.anchor.setTo(0.5, 0.5);
		        weaponImage.x = button.x;
		        weaponImage.y = button.y;
		        buttonGroup.add(weaponImage);

		    	// new?
		    	if (Globals.unlockedWeapons.indexOf(weapon) > -1)
		        {
		        	// weapon name
		        	var weaponName = game.add.bitmapText(0, 0,  'Impact', Localization[weapon+'Name'], 55);
		        	weaponName.align = 'right';
		        	weaponName.updateText();
		        	weaponName.x = button.x - weaponName.textWidth + button.width*0.5 - 12;
		        	weaponName.y = button.y + button.height*0.5 - weaponName.textHeight - 10;
		        	buttonGroup.add(weaponName);
		        	// new?
		        	var newIconAvailable = false;
		        	if (Globals.newWeapons.indexOf(weapon) > -1)
		        	{
		        		newIconAvailable = true;
		        		var newIcon = this.add.sprite(0, 0, 'NewIcon');
		        		newIcon.anchor.setTo(0.5, 0.5);
		        		newIcon.x = button.x + button.width*0.5 - 15;
		        		newIcon.y = button.y - button.height*0.5 + 15;
		           		// scale tween
		        		s = game.add.tween(newIcon.scale);
	    				s.to({x: 2, y:2}, 200, Phaser.Easing.Linear.None);
	    				s.to({x: 1, y:1}, 200, Phaser.Easing.Linear.None);
	    				s.loop();
	    				s.start();
	    				// add ot group
		        		buttonGroup.add(newIcon);
		        	}
		        } else {
		        	// Locked!
		        	button.input.enabled = false; // disable button
		        	weaponImage.tint = 0x222222; // tint weapon to black
		        	// locked text
		        	var lockedText = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("LockedWeapon"), 55);
		        	lockedText.tint = 0x666666;
		        	lockedText.updateText();
		        	lockedText.x = button.x - lockedText.textWidth + button.width*0.5 - 12;
		        	lockedText.y = button.y - 10;
		        	buttonGroup.add(lockedText);
		        	// locked scores
		        	var lockedSpecs = window.famobi.__("ScoreWeapon") + Data.Weapons[weapon].UnlockScore;
		        	var lockedScore = game.add.bitmapText(0, 0,  'Impact', lockedSpecs, 38);
		        	lockedScore.tint = 0x666666;
		        	lockedScore.updateText();
					lockedScore.x = button.x - lockedScore.textWidth + button.width*0.5 - 12;
		        	lockedScore.y = button.y - lockedScore.textHeight*0.5 + 64;
		        	buttonGroup.add(lockedScore);
		        }

		        // update z
		        //weaponImage.bringToTop();
		        if (newIconAvailable) this.world.bringToTop(buttonGroup);

		        buttonGroup.scale.setTo(1.0*globalScale, 1.0*globalScale);

		        // position button group
				buttonGroup.x = game.world.centerX - 300*0.5 + j*300;
				buttonGroup.x = buttonGroup.x - (640*globalScale) * (counter+1) + (j*290)*globalScale;
		        buttonGroup.y = (128 + 70)*globalScale + (204*i)*globalScale;

		        var endPositionX = game.world.centerX - (300*0.5)*globalScale + (j*300)*globalScale;
		        var endPositionY = (128 + 70)*globalScale + (204*i)*globalScale;

		        game.add.tween(buttonGroup).to( { x: endPositionX, y: endPositionY }, 550, Phaser.Easing.Exponential.Out, true);

	    	}
	    }
	},

	SelectWeapon: function(button) {
		// Incoming object is the button.
		// Button has name, use that as tag
		Globals.currentWeapon = button.name;

		// Remove from new list
		if(Globals.newWeapons.indexOf(Globals.currentWeapon) > - 1) Globals.newWeapons.splice(Globals.newWeapons.indexOf(Globals.currentWeapon));

		// Save
		xManager.SaveData();

		// go to other screen
		this.InitHelpScreen();
	},

	InitHelpScreen: function()
	{
		this.PlaySFX('WeaponSelect');
		weaponSelectGroup.visible = false;

		helpScreenGroup = this.add.group();

		//Start game button
		var startGame = this.add.button(0, 0, 'DefaultMenuBackground', this.StartGame, this);
		startGame.scale.setTo(1.0*globalScale, 1.0*globalScale);
		startGame.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
		helpScreenGroup.add(startGame);

		var controlImage = this.add.sprite(0, 0, 'HelpScreenControls');
		controlImage.anchor.setTo(0.5, 0.5);
		controlImage.scale.setTo(1.0*globalScale, 1.0*globalScale);
		//controlImage.y += 30*globalScale;
		helpScreenGroup.add(controlImage);

		var controlText = game.add.bitmapText(0, 0, 'Impact', window.famobi.__("HelpControls"), 160*globalScale);
		controlText.tint = 0xCD2323;
		controlText.y -= 435*globalScale;
		controlText.x -= controlText.textWidth*0.5;
		helpScreenGroup.add(controlText);

		var touch1 = game.add.bitmapText(0, 0, 'Impact', window.famobi.__("HelpTouchLeft"), 50*globalScale);
		touch1.align = 'left';
		touch1.y -= 210*globalScale;
		touch1.x -= 175*globalScale + touch1.textWidth*0.5;
		helpScreenGroup.add(touch1);

		var touch2 = game.add.bitmapText(0, 0, 'Impact', window.famobi.__("HelpTouchRight"), 50*globalScale);
		touch2.align = 'right';
		touch2.y -= 210*globalScale;
		touch2.x += 175*globalScale - touch2.textWidth*0.5;
		helpScreenGroup.add(touch2);

		if (brakeAvailable)
		{
			var touchToBrake = game.add.bitmapText(0, 0, 'Impact', Localization.HelpTouchBrake, 40*globalScale);
			touchToBrake.y += 190*globalScale;
			touchToBrake.x -= touchToBrake.textWidth*0.5;
			helpScreenGroup.add(touchToBrake);
		}

		var touchToStart = game.add.bitmapText(0, 0, 'Impact', Localization.HelpTouchToStart, 80*globalScale);
		touchToStart.y += 340*globalScale;
		touchToStart.x -= touchToStart.textWidth*0.5;
		helpScreenGroup.add(touchToStart);

		helpScreenGroup.x = this.world.centerX;
		helpScreenGroup.y = this.world.centerY;
	},

	StartGame: function() {
		// destroy all groups, inc. children
		mainMenuGroup.destroy(true);
		carSelectGroup.destroy(true);
		weaponSelectGroup.destroy(true);
		helpScreenGroup.destroy(true);

		if (sfx != null) sfx.destroy();

		// stop music
		//menuMusic.stop();
		//menuMusic.destroy();

		music = game.add.audio('Music', 0.8, true);
		music.play();
		musicEnabled = true;

		// start the Game state
		this.state.start('Level');
	}
};