States.Level = function(game){
	// we should define the vars here for clarity sakes
	// define needed variables for States.Level
	// not too happy with this though
	score = 0;
	distance = 0;
	newDistance = false;
	startBuilt = false;
	decoSkipped = false;
	armor = 5;
	rateOfFire = 1;
	weaponDamage = 1;
	gamePaused = false; // this is the one we use to actual pause


	sfxAllowed   = Phaser.Device.isAndroidStockBrowser() ? false : true;
	musicAllowed = Phaser.Device.isAndroidStockBrowser() ? false : true;
	scenery      = Phaser.Device.isAndroidStockBrowser() ? false : true;

	spawnList = [];
	wavesToSpawn = 0;

	// camera shake
	shakeIntensity = 0;

	// temp
	debugText = "";
};

States.Level.prototype = {

	create: function(){
		//globalScale = this.world.width/640;
		// reset vars?
		worldExtension = 20;
		// Maybe we should make a class and new it
		this.ResetVars();

		// init Level
		this.InitLevel();

		// init interface
		this.InitInterface();

		// init pause
		this.InitPause();

		// init result
		this.InitResults();

		// actual start Level?
		this.StartLevel();

		// add to functions to test losing focus
		game.onPause.add(this.OnGamePause, this);
		game.onResume.add(this.OnGameResume, this);

		//interval
		distanceInterval = 23; //setInterval(this.UpdateDistance, 300);

			// larger

		game.world.setBounds(0, 0, game.world.width+worldExtension, game.world.height+worldExtension);
		game.camera.x = 0;
		game.camera.y = 0;

		// speed var
		streetSpeed = (6 * (Data.Cars[Globals.currentCar].Speed * superSpeed)) * globalScale;



	},

	addJetPack: function()
	{
		//score += 1000;
		//scoreResult.text = this.GetScoreFormat();
		//scoreResult.updateText();
		//scoreResult.x = game.world.centerX - scoreResult.textWidth*0.5;

		currentPickup = "FireDash";
		powerButton.visible = true;
		powerButton.frameName = "Interface"+currentPickup+"Button.png";
	},

	addCameraShake: function(intensity)
	{
		shakeIntensity = Math.min(worldExtension, intensity);
	},

	update: function(){
		// deltatime
		var deltaTime = game.time.elapsed / 1000;

		// as tween (In the future)
		// if (resultGroup.visible)
		// {
		// 	unlockResultTimer -= game.time.elapsed / 1000;
		// 	if (unlockResultTimer < 0)
		// 	{
		// 		if (unlockResult.alpha == 1) { unlockResult.alpha = 0; unlockResultTimer = 0.2; }
		// 		else { unlockResult.alpha = 1; unlockResultTimer = 1; }
		// 	}
		// }

		// update your stuff here
		if (gamePaused) return;

		// shakey
		game.camera.x = Math.random()*shakeIntensity;
		game.camera.y = Math.random()*shakeIntensity;
		shakeIntensity *= 0.9;

		// ultra test
		if (spawnList.length > 0)
		{
			var waves = spawnList[0];
			var length = waves.length;
			var counter = 0;
			var wave = waves[counter];
			do
			{
				this.SpawnObstakel(wave[0], wave[1], wave[2]);
				counter++;
				wave = waves[counter];

			} while (counter<length);
			spawnList.splice(0, 1);
			wavesToSpawn -= 1;
		}
		//console.log(spawnList.length);

		// timer until results
		if (deathTimer > 0)
		{
			deathTimer -= deltaTime;
			if (deathTimer <= 0)
			{
				this.CarDead();
				return;
			}
		}

		// spawn stuff
		if (lastObject != null && spawnList.length == 0)
		{
			//console.log(lastObject.legendaMark);
			if (lastObject.y > -100*globalScale)
			{
				if (currentWave > currentLevel.length - 1) currentWave--;
				this.WaveSpawn(currentLevel[currentWave], currentWave);
				currentWave++;
			}
		}

		//debugText =  currentLevel[currentWave-1];

		this.MovementObject();

		bulletTimer += deltaTime;
		carCollisionTimer -= deltaTime;
		if (armor > 0)
		{

			if ((carCollisionTimer < 3.1 && carCollisionTimer > 3.0) ||
				(carCollisionTimer < 2.9 && carCollisionTimer > 2.8) ||
				(carCollisionTimer < 2.7 && carCollisionTimer > 2.6) ||
				(carCollisionTimer < 2.5 && carCollisionTimer > 2.4) ||
				(carCollisionTimer < 2.3 && carCollisionTimer > 2.2) ||
				(carCollisionTimer < 2.1 && carCollisionTimer > 2.0) ||
				(carCollisionTimer < 1.9 && carCollisionTimer > 1.8) ||
				(carCollisionTimer < 1.7 && carCollisionTimer > 1.6) ||
				(carCollisionTimer < 1.5 && carCollisionTimer > 1.4) ||
				(carCollisionTimer < 1.3 && carCollisionTimer > 1.2) ||
				(carCollisionTimer < 1.1 && carCollisionTimer > 1.0) ||
				(carCollisionTimer < 0.9 && carCollisionTimer > 0.8) ||
				(carCollisionTimer < 0.7 && carCollisionTimer > 0.6) ||
				(carCollisionTimer < 0.5 && carCollisionTimer > 0.4) ||
				(carCollisionTimer < 0.3 && carCollisionTimer > 0.2) ||
				(carCollisionTimer < 0.1 && carCollisionTimer > 0.0))
			{
				car.alpha = 0;
			}
			else if (carCollisionTimer > 0)
			{
				car.alpha = 0.5;
			}
			else
			{
				if (shieldTimer <= 0 && fireDashTimer <= 0) car.alpha = 1;
			}
		}

		// spinning
		if (lostControl > 0)
		{
			lostControl -= deltaTime;
			this.SpinCar();

		} else car.rotation = 0; // test this

		//debugText = "ToRadians: "+ car.angle + " - " + lostControl;

		if (powerButton.visible)
		{
			pickupScaleTimer -= deltaTime;
			if (pickupScaleTimer <= 0)
			{
				pickupScaleTimer = 0.5;
				if (powerButton.scale.x == 0.9) powerButton.scale.setTo(1*globalScale, 1*globalScale);
				else powerButton.scale.setTo(0.9*globalScale, 0.9*globalScale);
			}
		}

		var inBetweenTimer = 0.1;
		if (shieldTimer > 0)
		{
			if (shieldTimer < 2) inBetweenTimer = 0.05;
			if (shieldcurrentTimer - shieldTimer > inBetweenTimer)
			{
				shieldcurrentTimer = shieldTimer;
				if (car.alpha == 0) car.alpha = 0.5;
				else if (car.alpha == 0.5) car.alpha = 0;
			}
			shieldTimer -= deltaTime;
		}

		if (brakeTimer > 0)
		{
			brakeTimer -= deltaTime;
			if (brakeTimer <= 0)
			{
				brakeMultiplier = 1;
				brakeButton.alpha = 1;
			}
		}

		if (fireDashTimer > 0)
		{
			if (fireDashTimer < 2) inBetweenTimer = 0.05;
			if (fireDashCurrentTimer - fireDashTimer > inBetweenTimer)
			{
				fireDashCurrentTimer = fireDashTimer;
				if (car.alpha == 0) car.alpha = 0.5;
				else if (car.alpha == 0.5) car.alpha = 0;
			}
			fireDashTimer -= deltaTime;
			if (fireDashTimer <= 0) superSpeed = 1;
			else superSpeed = 4;
		}
		else if (jetPackTimer > 0)
		{
			jetPackTimer -= deltaTime;
			superSpeed = 6;

			var currentScale = car.scale.x;
			var targetScale = 1.5*globalScale;
			if (currentScale < targetScale) currentScale = Math.min(targetScale, currentScale*1.07);
			car.scale.setTo(currentScale, currentScale);

			if (jetPackTimer <= 0)
			{
				currentPickup = "Nuke";
				this.UsePickUp();
				superSpeed = 1;
				car.scale.setTo(1*globalScale, 1*globalScale);
				car.forEach(function(e)
				{
					if (e.frameName == 'CarSharedShadow.png' ||	(e.frameName == 'MuzzleFlashMachineGun.png' && e.angle == -180)) e.visible = false;
					//e.alpha = 0;

				});
				// bring stuff to top once!
				this.world.bringToTop(decorations);
				this.world.bringToTop(interfaceGroup);
			} else
			{
				car.forEach(function(e)
				{
					if (e.frameName == 'CarSharedShadow.png') e.visible = true;
					if (e.frameName == 'MuzzleFlashMachineGun.png' && e.angle == -180)
					{
						//e.alpha = 1;
						e.visible = true;
						e.scale.setTo(1, 1 + Math.random()*0.15);
					}
				});
				this.world.bringToTop(car);
			}

		}

		if (shieldTimer <= 0 && fireDashTimer <= 0 && jetPackTimer <= 0)
		{
			car.forEach(function(e)
			{
				if (e.frameName == 'Car'+Globals.currentCar+'Up1.png' && e.tint != e.realTint)
				{
					e.tint = e.realTint;
				}
			});
		}

		if (deadOverlay.alpha > 0) deadOverlay.alpha -= deltaTime * (Data.Cars[Globals.currentCar].Speed * superSpeed);
		if (deadOverlay.alpha < 0 || deadOverlay.alpha > 0.8) deadOverlay.alpha = 0 * (Data.Cars[Globals.currentCar].Speed * superSpeed);


		if (bulletTimer > 0.1)
		{
			car.forEach(function(e)
			{
				if (e.frameName == 'MuzzleFlash'+Globals.currentWeapon+'.png' && e.angle == 0)
				{
					//e.alpha = 0;
					e.visible = false;
				}
			});
		}

		this.Movement();

		if (jetPackTimer <= 0)
		{
			this.Fire();
			this.CollisionCheck();
		}

		if (game.input.activePointer.isDown)
		{
			if (!pressed)
			{
				var onButton = false;

				//With Pick up
				if (currentPickup != "")
				{
					if (game.input.x >= (game.world.centerX + (game.world.centerX / 1.3) - powerButton.width / 2)) // Powerup button
					{
						if (game.input.y <= game.world.centerY + powerButton.height / 2 &&
							game.input.y >= game.world.centerY - powerButton.height / 2) // Powerup button
						{
							onButton = true;
						}
					}
				}

				if (game.input.x >= (game.world.width - pauseButton.width*0.5+5) - pauseButton.width / 2) // Pause button
				{
					if (game.input.y <= (pauseButton.height/3 + 10) + pauseButton.height / 2) // Pause button
					{
						onButton = true;
					}
				}

				if (brakeAvailable)
				{
					var rectangle = new Phaser.Rectangle(brakeButton.x-brakeButton.width*0.5, brakeButton.y-brakeButton.height*0.5, brakeButton.width, brakeButton.height);
					if(rectangle.contains(game.input.activePointer.positionDown.x, game.input.activePointer.positionDown.y )) onButton = true;
				}

				if (!onButton)
				{
					if (game.input.x <= car.x) this.StearLeft();
					else if (game.input.x > car.x) this.StearRight();
					pressed = true;
				}
			}
		}
		else
		{
			pressed = false;
		}
	},

	// render: function()
	// {
	// 	if (!Globals.debug) return;
	// 	debugText = game.cache.getSound('Music').url;// + '\n' + debugText2;
	// 	//debugText = "FPS: " + game.time.fps; // + " - " + this.game.renderType;
	// 	//debugText = this.sound.usingAudioTag();
	// 	game.debug.text(debugText, 10, this.game.height - 75, null, '14pt Calibri');
 //        //this.game.debug.soundInfo(this.sound, 0, 500);

	// },

	CollisionCheck: function()
	{
		// Vars
		var i, j, bul, traf, stand;
		var carX = car.x;
		var carY = car.y;
		var yLimit = carY-128; // 128 is maxSize of var
		var xDelta, yDelta, xOffset, yOffset, xOffset2, yOffset2;

		//----------------------------------------
		//car with traffic collision
		//----------------------------------------
		i = trafficCars.length;
		xOffset = 64*globalScale;
		yOffset  = -30*globalScale;
		yOffset2 = -200*globalScale;
		while(i--)
		{
			traf = trafficCars.getAt(i);
			if (!traf.alive || traf.y < yLimit) continue;
			xDelta = carX - traf.x;
			if (xDelta < xOffset && xDelta > -xOffset)
			{
				yDelta = carY - traf.y;
				if (yDelta < yOffset && yDelta > yOffset2)
				{
					this.CollisionCarAndTraffic(car, traf);
					return; // stop this function
				}
			}
		}

		//----------------------------------------
		//car with standstillobjects collision
		//----------------------------------------
		i = standStillObjects.length;
		xOffset  = 48*globalScale;
		yOffset  = 64*globalScale;
		yOffset2 = -48*globalScale;
		while(i--)
		{
			stand = standStillObjects.getAt(i);
			if (!stand.alive || stand.y < yLimit) continue;
			xDelta = carX - stand.x;
			if (xDelta < xOffset && xDelta > -xOffset)
			{
				yDelta = carY - stand.y;
				if (yDelta < yOffset && yDelta > yOffset2)
				{
					this.CollisionCarAndTraffic(car, stand);
					return; // stop this function
				}
			}
		}

		//----------------------------------------
		// Bullets
		//----------------------------------------
		i = bullets.length;

		while(i--)
		{

			bul = bullets.getAt(i);
			if (!bul.bulActive) continue; // skip everything below when bullet is inactive.

			j = trafficCars.length;
			xOffset = 48*globalScale;
			yOffset = 10*globalScale;
			while(j--)
			{
				traf = trafficCars.getAt(j);
				if(!traf.alive) continue; // skip the dead cars
				if (traf.y >= 0)
				{
					xDelta = bul.x - traf.x;
					if (xDelta < xOffset && xDelta > -xOffset)
					{
						yDelta = bul.y - traf.y
						if (yDelta < yOffset && yDelta > -yOffset)
						{
							this.CollisionBulletAndTraffic(bul, traf);
							break; // stop this loop (this bullet cannot hit other objects)
						}
					}
				}

			}

			if (!bul.bulActive) continue; // skip everything below when bullet is inactive.

			//Bullet with standstillobjects collision
			j = standStillObjects.length;
			xOffset = 48*globalScale;
			yOffset = 100*globalScale;
			while(j--)
			{
				stand = standStillObjects.getAt(j);
				if (!stand.alive) continue;
				if (stand.y >= 0)
				{
					xDelta = bul.x - stand.x;
					if (xDelta < xOffset && xDelta > -xOffset)
					{
						yDelta = bul.y - stand.y;
						if (yDelta < yOffset && yDelta > 0)
						{
							this.CollisionBulletAndStandStill(bul, stand);
							break;
						}
					}
				}

			}
		}



	},

	CollisionBulletAndStandStill: function(tempBullet, tempStandstill)
	{
		if (!this.CheckObjectNameForPickup(tempStandstill))
		{
			if (tempStandstill.frameName != 'MiscConcreteBarrier1.png')
			{
				tempStandstill.armor -= weaponDamage;
				if (tempStandstill.armor <= 0)
				{
					if (tempStandstill.frameName == 'MiscStopSign1.png')
					{
						this.StandStillEffectsSpawn(tempStandstill.x, tempStandstill.y, "MiscStopSignDebris");
					}
					else
					{
						this.ItemExplosion(tempStandstill.x, tempStandstill.y, 0.5, 0.5, tempStandstill.frameName);
						this.UpdateScore(Data.ObstakelLegenda[tempStandstill.legendaMark].Score);
					}
					tempStandstill.kill(); //.destroy(true);
				}
			}
			if (tempBullet.frameName != "ProjectileLaser.png")
			{
				tempBullet.bulActive = false;
				tempBullet.kill();
			}
		}
		else if (tempStandstill.frameName == 'MiscPickupCrate.png')
		{
			this.StandStillEffectsSpawn(tempStandstill.x, tempStandstill.y, "MiscCrateDebris");

			this.PickUpSpawn(tempStandstill.x, tempStandstill.y, Math.floor((Math.random() * 10) + 6));

			tempStandstill.kill(); //.destroy(true);

			if (tempBullet.frameName != "ProjectileLaser.png")
			{
				tempBullet.bulActive = false;
				tempBullet.kill();
			}
		}
	},

	CollisionBulletAndTraffic: function(tempBullet, tempTraffic)
	{
		tempTraffic.armor -= weaponDamage;
		if (tempTraffic.armor <= 0)
		{
			this.ItemExplosion(tempTraffic.x, tempTraffic.y, 0.5, 1.75, tempTraffic.frameName);

			this.UpdateScore(Data.CarLegenda[tempTraffic.legendaMark].Score);
			this.PlaySFX('ExplosionOpponent');
			tempTraffic.frameName = 'Car'+Data.CarLegenda[tempTraffic.legendaMark].Type+'Up1.png';
			tempTraffic.tint = 0xFFFFFF;
			tempTraffic.kill(); //.destroy(true);
		}
		else
		{
			tempTraffic.frameCount = 4;
			tempTraffic.frameName = 'Car'+Data.CarLegenda[tempTraffic.legendaMark].Type+'Up1.png';
			tempTraffic.tint = 0xFF0000;
		}

		if (tempBullet.frameName != "ProjectileLaser.png")
		{
			tempBullet.bulActive = false;
			tempBullet.kill();
		}
	},

	CollisionCarAndTraffic: function(tempCar, tempTraffic)
	{
		if (carCollisionTimer <= 0 && !this.CheckObjectNameForPickup(tempTraffic))
		{
			if (shieldTimer <= 0 && fireDashTimer <= 0 && jetPackTimer <= 0)
			{
				this.ItemExplosion(car.x, car.y, 0.5, 0.5, "");
				this.UpdateArmor(-1);
				this.PlaySFX('ExplosionPlayer');
				//shake
				this.addCameraShake(worldExtension);

				if (armor > 0)
				{
					deadOverlay.alpha = 0.8;
					this.world.bringToTop(deadOverlay);
					carCollisionTimer = 3.1;
					if (tempTraffic.frameName != "MiscConcreteBarrier1.png" &&
						tempTraffic.frameName != "MiscOilSpill1.png")
					{
						tempTraffic.kill(); //.destroy(true);
					}
				}
				else
				{
					carCollisionTimer = 5;
					if (tempTraffic.frameName != "MiscConcreteBarrier1.png" &&
						tempTraffic.frameName != "MiscOilSpill1.png")
					{
						tempTraffic.kill(); //.destroy(true);
					}
					deathTimer = 1;
				}
			}
			else if (fireDashTimer > 0) //shieldTimer > 0 ||
			{

				//console.log(tempTraffic.frameName + " - " + tempCar.frameName);
				if (tempTraffic.frameName != "MiscConcreteBarrier1.png" &&
					tempTraffic.frameName != "MiscOilSpill1.png")
				{

					this.ItemExplosion(car.x, car.y, 0.5, 0.5, "");
					// add score when using firedash & shield & play SFX
					if (tempTraffic.legendaMark in Data.CarLegenda) this.UpdateScore(Data.CarLegenda[tempTraffic.legendaMark].Score);
					if (tempTraffic.legendaMark in Data.ObstakelLegenda)
					{
						this.UpdateScore(Data.ObstakelLegenda[tempTraffic.legendaMark].Score);
						//console.log('updating score from obstrakellegenda');
					}
					this.PlaySFX('ExplosionOpponent');
					tempTraffic.kill(); //.destroy(true);
					//shake
					this.addCameraShake(worldExtension);
				}
			}
		}
		else if (carCollisionTimer <= 0 && tempTraffic.frameName == 'MiscOilSpill1.png')
		{
			if (lostControl <= 0 && shieldTimer <= 0 && jetPackTimer <= 0 && fireDashTimer <= 0)
			{
				this.StandStillEffectsSpawn(tempTraffic.x, tempTraffic.y, "MiscOilSpillParticles");
				lostControl = 1.5;
			}
		}
		else
		{
			switch(tempTraffic.frameName)
			{
			case 'MiscPickupArmor.png':
				this.UpdateArmor(1);
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupScore10.png':
				this.UpdateScore(10);
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupScore50.png':
				this.UpdateScore(50);
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupScore100.png':
				this.UpdateScore(100);
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupScore250.png':
				this.UpdateScore(250);
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupScore1000.png':
				this.UpdateScore(1000);
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupNuke.png':
				currentPickup = "Nuke";
				powerButton.visible = true;
				powerButton.frameName = "InterfaceNukeButton.png";
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupJetpack.png':
				currentPickup = "Jetpack";
				powerButton.visible = true;
				powerButton.frameName = "InterfaceJetpackButton.png";
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupShield.png':
				currentPickup = "Shield";
				powerButton.visible = true;
				powerButton.frameName = "InterfaceShieldButton.png";
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			case 'MiscPickupFiredash.png':
				currentPickup = "FireDash";
				powerButton.visible = true;
				powerButton.frameName = "InterfaceFiredashButton.png";
				tempTraffic.kill(); //.destroy(true);
				this.PlaySFX('PickUp');
				break;
			}
			if (tempTraffic != null)
			{
				if (tempTraffic.frameName != 'MiscStopSignDebris.png' &&
					tempTraffic.frameName != 'MiscCrateDebris.png' && tempTraffic.frameName != 'MiscOilSpillParticles.png')
				{
					//if (carCollisionTimer <= 0 && shieldTimer <= 0 && fireDashTimer <= 0) this.PlaySFX('PickUp');
					if (carCollisionTimer <= 0)
					{
						this.PlaySFX('PickUp');
						tempTraffic.kill(); //.destroy(true);
					}
				}
			}
		}
	},

	CheckObjectNameForPickup: function(tempTraffic)
	{
		if (tempTraffic.frameName != 'MiscOilSpill1.png' && tempTraffic.frameName != 'MiscPickupArmor.png' &&
			tempTraffic.frameName != 'MiscPickupScore10.png' && tempTraffic.frameName != 'MiscPickupNuke.png' &&
			tempTraffic.frameName != 'MiscPickupScore100.png' && tempTraffic.frameName != 'MiscPickupScore50.png' &&
			tempTraffic.frameName != 'MiscPickupScore1000.png' && tempTraffic.frameName != 'MiscPickupScore250.png' &&
			tempTraffic.frameName != 'MiscPickupCrate.png' && tempTraffic.frameName != 'MiscPickupJetpack.png' &&
			tempTraffic.frameName != 'MiscPickupShield.png' && tempTraffic.frameName != 'MiscPickupFiredash.png' &&
			tempTraffic.frameName != 'MiscStopSignDebris.png' && tempTraffic.frameName != 'MiscCrateDebris.png' &&
			tempTraffic.frameName != 'MiscOilSpillParticles.png')
		{
			return false;
		}
		else return true;
	},

	ItemExplosion: function(xPos, yPos, xAnchor, yAnchor, frameName)
	{
		var explosion;

		explosion = explosions.getFirstExists(false);

		if (explosion)
		{
			explosion.anchor.setTo(0.5, 0.5);
			explosion.angle = Math.random() * 360;
			explosion.animations.add('Explosion');
			explosion.animations.play('Explosion', 16, true);

			if (frameName == 'CarTruckUp1.png' ||
				frameName == 'MiscOilDrum1.png')
			{
				explosion.scale.setTo(1.5*globalScale, 1.5*globalScale);
				explosion.reset(xPos, yPos);
				this.addCameraShake(worldExtension*0.5);
			}
			else
			{
				explosion.scale.setTo(1.0*globalScale, 1.0*globalScale)
				explosion.reset(xPos, yPos-128*globalScale);
			}

		}
	},

	Brake: function(){

		if (brakeTimer>0) return;
		brakeMultiplier = 0.4;
		brakeTimer = 1.3;
		brakeButton.alpha = 0.5;
		this.PlaySFX("Brake");
	},

	UsePickUp: function()
	{
		switch(currentPickup)
		{
		case "Nuke":
			var destroyArray = [];
			var count = 0;
			var tempTraffic;
			for (var i = 0; i < trafficCars.length; i++)
			{
				tempTraffic = trafficCars.getAt(i);
				if (tempTraffic.alive && tempTraffic.y > -64)
				{
					this.UpdateScore(Data.CarLegenda[tempTraffic.legendaMark].Score);
					this.ItemExplosion(tempTraffic.x, tempTraffic.y, 0.5, 1.5, tempTraffic.frameName);
					destroyArray[count] = tempTraffic;
					count++;
				}
			}
			var tempStandstill;
			for (var i = 0; i < standStillObjects.length; i++)
			{
				tempStandstill = standStillObjects.getAt(i);
				if (tempStandstill.alive && tempStandstill.y > -64)
				{
					if (!this.CheckObjectNameForPickup(tempStandstill))
					{
						this.UpdateScore(Data.ObstakelLegenda[tempStandstill.legendaMark].Score);
						this.ItemExplosion(tempStandstill.x, tempStandstill.y, 0.5, 0.5, tempStandstill.frameName);

						destroyArray[count] = tempStandstill;
						count++;
					}
				}
			}
			for(var i = 0; i < destroyArray.length; i++)
			{
				destroyArray[i].kill(); //.destroy();
			}
			//shake
			this.addCameraShake(worldExtension);

			break;
		case "Shield":
			shieldTimer = 5;
			shieldcurrentTimer = shieldTimer;
			car.forEach(function(e)
			{
				if (e.frameName == 'Car'+Globals.currentCar+'Up1.png')
				{
					//e.tint = 0x2E9AFE;
					car.alpha = 0.5;
				}
			});
			break;
		case "FireDash":
			fireDashTimer = 5;
			fireDashCurrentTimer = fireDashTimer;
			car.forEach(function(e)
			{
				if (e.frameName == 'Car'+Globals.currentCar+'Up1.png')
				{
					e.tint = 0xFF0000;
					car.alpha = 0.5;
				}
			});
			break;
		case "Jetpack":
			jetPackTimer = 5;
			break;
		}
		lostControl = 0;
		car.angle = 0;
		this.PlaySFX('ActivatePickUp');
		powerButton.visible = false;
		currentPickup = "";
	},

	PickUpSpawn: function(posX, posY, legendaMark)
	{
		var standStillObject;
		
		standStillObject =  standStillObjects.getFirstDead(); //standStillObjects.create(0, 0, 'GameObjects');
		standStillObject.anchor.setTo(0.5, 0.5);
		standStillObject.frameName = "Misc"+Data.ObstakelLegenda[legendaMark].Type+".png";
		standStillObject.legendaMark = legendaMark;
		standStillObject.armor = Data.ObstakelLegenda[legendaMark].Armor;
		standStillObject.reset(posX, posY);
		standStillObject.scale.setTo(1.0*globalScale, 1.0*globalScale);
	},

	CarDead: function()
	{
		for (var i = 0; i < explosions.length; i++)
		{
			if (explosions.getAt(i).alive)
			{
				explosions.getAt(i).kill();
			}
		}
		//--------------------------------------------
		// call famobi to submit hs
		//--------------------------------------------
		window.famobi.submitHighscore(level, distance); // submit distance now!

		// we're done
		gamePaused = true;
		this.ShowInterface(false);
		this.ShowResults(true);
	},

	UnlockCarsInGlobals: function()
	{
		var arrayCount = 0;
		var cars = [];
		for (var key in Data.Cars)
		{
			cars[arrayCount] = key;
			arrayCount++;
		}
		for (var j = 0; j < Globals.newCars.length; j++)
		{
			Globals.newCars.splice(0, Globals.newCars.length);
		}
		for (var i = 0; i < cars.length; i++)
		{
			if (Data.Cars[cars[i]].UnlockScore <= score)
			{
				var unlocked = false;
				for (var j = 0; j < Globals.unlockedCars.length; j++)
				{
					if (cars[i] == Globals.unlockedCars[j])
					{
						unlocked = true;
					}
				}
				if (!unlocked)
				{
					Globals.unlockedCars.push(cars[i]);
					Globals.newCars.push(cars[i]);
				}
			}
		}
	},

	UnlockWeaponsInGlobals: function()
	{
		var arrayCount = 0;
		var weps = [];
		for (var key in Data.Weapons)
		{
			weps[arrayCount] = key;
			arrayCount++;
		}
		for (var j = 0; j < Globals.newWeapons.length; j++)
		{
			Globals.newWeapons.splice(0, Globals.newWeapons.length);
		}
		for (var i = 0; i < weps.length; i++)
		{
			if (Data.Weapons[weps[i]].UnlockScore <= Globals.totalScore)
			{
				var unlocked = false;
				for (var j = 0; j < Globals.unlockedWeapons.length; j++)
				{
					if (weps[i] == Globals.unlockedWeapons[j])
					{
						unlocked = true;
					}
				}
				if (!unlocked)
				{
					Globals.unlockedWeapons.push(weps[i]);
					Globals.newWeapons.push(weps[i]);
				}
			}
		}
	},

	TrafficSpawn: function(laneNumber, yPosition, legendaMark)
	{
		var traffic;
		
		//traffic = trafficCars.getFirstDead();
		traffic = trafficCars.create(0, 0, 'GameCars');
		//if (traffic == null) return;
		//console.log(traffic);
		traffic.scale.setTo(1.0*globalScale, 1.0*globalScale);
		traffic.anchor.setTo(0.5, 1.5);
		traffic.frameName = 'Car'+Data.CarLegenda[legendaMark].Type+'Up1.png';
		traffic.tint = 0xFFFFFF;
		traffic.realTint = traffic.tint;
		traffic.frameCount = 4;
		traffic.legendaMark = legendaMark;
		traffic.speed = Data.CarLegenda[legendaMark].Speed;
		traffic.armor = Data.CarLegenda[legendaMark].Armor;
		traffic.reset(lanes[laneNumber], yPosition);
		//traffic.revive();
		lastObject = traffic;
		// trafficBuilt++;
	},

	StandStillObjectsSpawn: function(laneNumber, yPosition, legendaMark)
	{
		var standStillObject;
		
		standStillObject = standStillObjects.getFirstDead(); //standStillObjects.create(0, 0, 'GameObjects');
		if (standStillObject == null) return;
		//console.log(standStillObject);
		standStillObject.revive();
		standStillObject.tint = 0xFFFFFF;
		standStillObject.scale.setTo(1.0*globalScale, 1.0*globalScale);
		standStillObject.anchor.setTo(0.5, 0.5);
		standStillObject.frameName = "Misc"+Data.ObstakelLegenda[legendaMark].Type+".png";
		standStillObject.legendaMark = legendaMark;
		standStillObject.armor = Data.ObstakelLegenda[legendaMark].Armor;
		standStillObject.reset(lanes[laneNumber], yPosition);
		lastObject = standStillObject;
		// standStillBuilt++;
	},

	StandStillEffectsSpawn: function(xPosition, yPosition, name)
	{
		var standStillObject;

		standStillObject = standStillObjects.getFirstDead(); //standStillObjects.create(0, 0, 'GameObjects');
		if (standStillObject == null) return;
		//console.log(standStillObject);
		standStillObject.revive();
		standStillObject.tint = 0xFFFFFF;
		standStillObject.scale.setTo(1.5*globalScale, 1.5*globalScale);
		standStillObject.anchor.setTo(0.5, 0.5);
		standStillObject.frameName = name+".png";
		standStillObject.reset(xPosition, yPosition);
		// standStillBuilt++;
	},

	DecorationSpawn: function(laneNumber, yPosition, legendaMark)
	{
		var decoration;

		decoration = decorations.getFirstDead(); //decorations.create(0, 0, 'GameObjects');
		if (decoration == null) return;
		//console.log(decoration);
		decoration.revive();
		decoration.tint = 0xFFFFFF;
		decoration.scale.setTo(1.0*globalScale, 1.0*globalScale);
		decoration.anchor.setTo(0.5, 0.5);
		decoration.frameName = "Misc"+Data.DecorationLegenda[legendaMark].Type+".png";
		if (laneNumber == "L")	decoration.reset(this.world.centerX - 200*globalScale, yPosition);
		else if (laneNumber == "M")	decoration.reset(this.world.centerX, yPosition);
		else if (laneNumber == "R")	decoration.reset(this.world.centerX + 200*globalScale, yPosition);
		// decorationBuilt++;
	},

	WaveSpawn: function(waveName, waveNumber)
	{

		var waveSize = -1;
		var posDist = 400*globalScale;


		if (waveName.indexOf('*') > -1) waveName = waveName.substring(0, waveName.length - 1) + Math.floor(Math.random() * 3 + 1);
		//debugText2 = waveName;
		//console.log(debugText2);
		// if (waveName == "Easy*") 		waveName = waveName.substring(0, waveName.length - 1) + "" + Math.floor(Math.random() * 3 + 1);
		// else if (waveName == "Medium*") waveName = waveName.substring(0, waveName.length - 1) + "" + Math.floor(Math.random() * 3 + 1);
		// else if (waveName == "Hard*") 	waveName = waveName.substring(0, waveName.length - 1) + "" + Math.floor(Math.random() * 3 + 1);

		for (var key in Data[waveName]) waveSize++;

		var tempArray = [];
		var calcPosition;

		// trafficBuilt = 0;
		// decorationBuilt = 0;
		// standStillBuilt = 0;


		var subWaveList;
		var obstacleList;
		var replaceDeco = false;
		if (waveName.indexOf("Start")>-1) replaceDeco = true;

		for (var i = 0; i <= waveSize; i++)
		{
			//console.log(waveName);
			subWaveList = [];
			obstacleList = [];
			tempArray[i] =  Data[waveName]["Position"+i]; //  eval("Data." + waveName + "['Position' + i]");

			//calcPosition =  i * posDist + posDist + 100;
			calcPosition =  (i * posDist) + posDist + 128;
			//console.log(calcPosition);

			// // ALL IN ONE GO!
			// if (replaceDeco)
			// {
			// 	if (sourceWave["Position"+i].LaneLeft != "-") 	this.SpawnObstakel(sourceWave["Position"+i].LaneLeft, "L", calcPosition);
			// } else if (tempArray[i].LaneLeft != "-") 	this.SpawnObstakel(tempArray[i].LaneLeft, "L", calcPosition);
			// if (tempArray[i].Lane1 != "-") 		this.SpawnObstakel(tempArray[i].Lane1, 		0, calcPosition);
			// if (tempArray[i].Lane2 != "-") 		this.SpawnObstakel(tempArray[i].Lane2, 		1, calcPosition);
			// if (tempArray[i].LaneMid != "-") 	this.SpawnObstakel(tempArray[i].LaneMid,  "M", calcPosition);
			// if (tempArray[i].Lane3 != "-") 		this.SpawnObstakel(tempArray[i].Lane3, 		2, calcPosition);
			// if (tempArray[i].Lane4 != "-") 		this.SpawnObstakel(tempArray[i].Lane4, 		3, calcPosition);
			// if (replaceDeco)
			// {
			// 	if (sourceWave["Position"+i].LaneRight != "-") 	this.SpawnObstakel(sourceWave["Position"+i].LaneRight,"R", calcPosition);
			// } else if (tempArray[i].LaneRight != "-") 	this.SpawnObstakel(tempArray[i].LaneRight,"R", calcPosition);


			// SPAWNBALANCING
			// NEEDS OPTIMALIZATION
			// if (replaceDeco)
			// {
			// 	if (sourceWave["Position"+i].LaneLeft != "-") 	subWaveList.push('this.SpawnObstakel(' + '\"' + sourceWave["Position"+i].LaneLeft.toString()  + '\"'   + ', "L", ' + calcPosition + ')');
			// } else if (tempArray[i].LaneLeft != "-") 	subWaveList.push('this.SpawnObstakel(' + '\"' + tempArray[i].LaneLeft.toString()  + '\"'   + ', "L", ' + calcPosition + ')');
			// if (tempArray[i].Lane1 != "-") 		subWaveList.push('this.SpawnObstakel(' + '\"' + tempArray[i].Lane1.toString()     + '\"'   + ', 	0,  ' + calcPosition + ')');
			// if (tempArray[i].Lane2 != "-") 		subWaveList.push('this.SpawnObstakel(' + '\"' + tempArray[i].Lane2.toString()     + '\"'   + ',  1,  ' + calcPosition + ')');
			// if (tempArray[i].LaneMid != "-") 	subWaveList.push('this.SpawnObstakel(' + '\"' + tempArray[i].LaneMid.toString()   + '\"'   + ', "M", ' + calcPosition + ')');
			// if (tempArray[i].Lane3 != "-") 		subWaveList.push('this.SpawnObstakel(' + '\"' + tempArray[i].Lane3.toString()     + '\"'   + ',  2,  ' + calcPosition + ')');
			// if (tempArray[i].Lane4 != "-") 		subWaveList.push('this.SpawnObstakel(' + '\"' + tempArray[i].Lane4.toString()     + '\"'   + ', 	3,  ' + calcPosition + ')');
			// if (replaceDeco)
			// {
			// 	if (sourceWave["Position"+i].LaneRight != "-")  subWaveList.push('this.SpawnObstakel(' + '\"' + sourceWave["Position"+i].LaneRight.toString() + '\"'   + ', "R", ' + calcPosition + ')');
			// } else if (tempArray[i].LaneRight != "-")  subWaveList.push('this.SpawnObstakel(' + '\"' + tempArray[i].LaneRight.toString() + '\"'   + ', "R", ' + calcPosition + ')');


			if (replaceDeco)
			{
				if (sourceWave["Position"+i].LaneLeft != "-") 	subWaveList.push([sourceWave["Position"+i].LaneLeft.toString(), "L", calcPosition]);
			} else if (tempArray[i].LaneLeft != "-") 	subWaveList.push([tempArray[i].LaneLeft.toString(), "L", calcPosition]);

			if (tempArray[i].Lane1 != "-") 		subWaveList.push([tempArray[i].Lane1.toString(),    0,  calcPosition]);
			if (tempArray[i].Lane2 != "-") 		subWaveList.push([tempArray[i].Lane2.toString(),    1,  calcPosition]);
			if (tempArray[i].LaneMid != "-") 	subWaveList.push([tempArray[i].LaneMid.toString(), "M", calcPosition]);
			if (tempArray[i].Lane3 != "-") 		subWaveList.push([tempArray[i].Lane3.toString(),    2,  calcPosition]);
			if (tempArray[i].Lane4 != "-") 		subWaveList.push([tempArray[i].Lane4.toString(), 	3,  calcPosition]);

			if (replaceDeco)
			{
				if (sourceWave["Position"+i].LaneRight != "-")  subWaveList.push([sourceWave["Position"+i].LaneRight.toString(), "R", calcPosition]);
			} else if (tempArray[i].LaneRight != "-")  subWaveList.push([tempArray[i].LaneRight.toString(), "R", calcPosition]);
			if (subWaveList.length > 0) spawnList.push(subWaveList);
		}

		wavesToSpawn += spawnList.length;

		//console.log(spawnList);
		//debugger;
		// console.log("Traffic built: " + trafficBuilt);
		// console.log("Decoration built: " + decorationBuilt);
		// console.log("Standstill stuff built: " + standStillBuilt);
		// console.log("Total built: " + (trafficBuilt + decorationBuilt + standStillBuilt));
	},

	SpawnObstakel: function(legendaMark, laneNumber, ypos)
	{
		//console.log(legendaMark+' - ' +laneNumber+' - ' +ypos);
		//console.log(wavesToSpawn);
		ypos -= streetSpeed * wavesToSpawn;

		if (laneNumber == 0 || laneNumber == 1 || laneNumber == 2 || laneNumber == 3)
		{
			// console.log(legendaMark);
			// console.log(carLegendaMarks.indexOf(legendaMark));
			if (carLegendaMarks.indexOf(legendaMark) > -1) this.TrafficSpawn(laneNumber, 0 - ypos, legendaMark);
			if (standstillLegendaMarks.indexOf(legendaMark) > -1) this.StandStillObjectsSpawn(laneNumber, 0 - ypos, legendaMark);
		}
		else if (laneNumber == "L" || laneNumber == "M" || laneNumber == "R" )
		{

			if (decorationLegendaMarks.indexOf(legendaMark) > -1)
			{
				if (legendaMark == "Start")
				{
				  if (!startBuilt)
				  {
				  	startBuilt = true;
				   	this.DecorationSpawn(laneNumber, 0 - ypos, legendaMark);
				  }
				  else return;
				}

				if (legendaMark == "Deco1" && !decoSkipped)
				{
					decoSkipped = true;

					return;
				} else if (decoSkipped)
				{
					if (!scenery) this.DecorationSpawn(laneNumber, 0 - ypos, legendaMark);
				}

				if (scenery) this.DecorationSpawn(laneNumber, 0 - ypos, legendaMark);
			}
		}
	},

	// ----------------------------------
	// Movement
	// ----------------------------------
	MovementObject: function()
	{

		var currentSpeed = streetSpeed;
		var targetSpeed  = (6 * (Data.Cars[Globals.currentCar].Speed*brakeMultiplier) * superSpeed) * globalScale;

		if (targetSpeed < currentSpeed)
		{
			currentSpeed *= 0.9;
			if (currentSpeed <= targetSpeed) currentSpeed = targetSpeed
		}
		else if (targetSpeed > currentSpeed) {
			currentSpeed *= 1.1;
			if (currentSpeed >= targetSpeed) currentSpeed = targetSpeed
		}
		streetSpeed = currentSpeed;

		//streetSpeed = (6 * (Data.Cars[Globals.currentCar].Speed * superSpeed)) * globalScale;
		street.y +=  streetSpeed;
		if (street.y >= 960*globalScale) street.y -= 960*globalScale;

		// update distance score
		var distanceScore = Math.max(0.5, streetSpeed/9);
		distance += Math.round(distanceScore);
		//console.log(distanceScore + " - " + distance);
		distanceInterval -= 1;
		if (distanceInterval <= 0)
		{
			if (jetPackTimer > 0 || fireDashTimer > 0) distanceInterval = 3;
			else distanceInterval = 23;
			if (Phaser.Device.isAndroidStockBrowser()) distanceInterval = Math.round(distanceInterval*1.5);
			this.UpdateDistance();
		}

		// best disatnce?
		if (distance >= Globals.bestDistance && !newDistance && Globals.bestDistance > 0)
		{
			newDistance = true;
			distanceHeader.tint = 0xCD2323;
			this.UpdateDistance();
			distanceBlinker = 20;
		} /*else if (newDistance)
		{
			distanceBlinker -= 1;
			if (distanceBlinker <= 0)
			{
				distanceHeader.visible = !distanceHeader.visible;
				distanceText.visible = !distanceText.visible;
				distanceBlinker = 20;
			}
		}*/

		var deleteOffset = 960*globalScale;

		// loop vars
		var spriteHolder, i;

		// decorations
		i = decorations.length; //-1;
		while(i--)
		{
			spriteHolder = decorations.getAt(i);
			if (!spriteHolder.alive) continue;
			if (spriteHolder.y > deleteOffset+spriteHolder.height) spriteHolder.kill();
			else spriteHolder.y += streetSpeed;
		}

		// bullets
		i = bullets.length; //-1;
		while(i--)
		{
			spriteHolder = bullets.getAt(i);
			if (!spriteHolder.alive) continue;
			spriteHolder.y -= 9*globalScale;
			if (spriteHolder.y < 64) spriteHolder.kill();
		}

		// stand still onbjects
		i = standStillObjects.length; //-1;
		while(i--)
		{
			spriteHolder = standStillObjects.getAt(i);
			if (!spriteHolder.alive) continue;
			if (spriteHolder.y > deleteOffset+spriteHolder.height) spriteHolder.kill();
			else spriteHolder.y += streetSpeed;
		}

		// traffic
		var tempTraffic;
		var trafficSpeed = streetSpeed/6;
		i = trafficCars.length; //-1;
		while(i--)
		{
			tempTraffic = trafficCars.getAt(i);
			if (!tempTraffic.alive) continue;

			if (tempTraffic.frameCount > 0)
			{
				tempTraffic.frameCount -= 1
				if (tempTraffic.frameCount == 0) tempTraffic.tint = 0xFFFFFF;
			}
			// if (tempTraffic.y >= 0) tempTraffic.y += (tempTraffic.speed * (Data.Cars[Globals.currentCar].Speed * superSpeed))*globalScale;
			// else tempTraffic.y += streetSpeed;
			if (tempTraffic.y >= 0)  tempTraffic.y += ((tempTraffic.speed) * trafficSpeed);//*globalScale;
			else tempTraffic.y += streetSpeed;
			if (tempTraffic.y > deleteOffset+tempTraffic.height) tempTraffic.destroy(); //destroy(true); \\tempTraffic.destroy(true);
		}

		// explosions update
		i = explosions.length; //-1;
		while(i--)
		{

			spriteHolder = explosions.getAt(i);
			if (!spriteHolder.alive) continue;
			if (spriteHolder != null)
			{
				spriteHolder.y += streetSpeed;
				if (spriteHolder.animations.currentFrame.index == 15) spriteHolder.kill();
			}
		}

	},

	Movement: function()
	{
		if (lostControl <= 0)
		{
			if (keyArrowLeft.timeDown != 0 && keyArrowLeft.isUp)
			{
				keyArrowLeft.timeDown = 0;
				if (currentlane > 0)
				{
					currentlane -= 1;
				}
			}
			else if (keyArrowRight.timeDown != 0 && keyArrowRight.isUp)
			{
				keyArrowRight.timeDown = 0;
				if (currentlane < 3)
				{
					currentlane += 1;
				}
			}

			if (car.x > lanes[currentlane])
			{
				car.x -= (8 * (Data.Cars[Globals.currentCar].Speed * superSpeed))*globalScale;
				if (car.x - lanes[currentlane] < 10 || car.x < lanes[currentlane])
				{
					car.x = lanes[currentlane];
				}
			}
			else if (car.x < lanes[currentlane])
			{
				car.x += (8 * (Data.Cars[Globals.currentCar].Speed * superSpeed))*globalScale;
				if (lanes[currentlane] - car.x < 10 || car.x > lanes[currentlane])
				{
					car.x = lanes[currentlane];
				}
			}

			if (deathTimer > 0)
			{
				//car.y += 6 * (Data.Cars[Globals.currentCar].Speed * superSpeed);
				car.alpha = 0;
			}
		}
	},

	Fire: function()
	{
		var bullet;

		if (lostControl <= 0 && deathTimer <= 0)
		{
			if (bulletTimer >= (0.5 / rateOfFire))
			{
				//keySpaceBar.isDown = false;
				bullet = bullets.getFirstExists(false);

				if (bullet)
				{
					bullet.bulActive = true;
					bullet.reset(car.x, car.y);
					bulletTimer = 0;

					car.forEach(function(e)
					{
						if (e.frameName == 'MuzzleFlash'+Globals.currentWeapon+'.png' && e.angle == 0)
						{
							//e.alpha = 1;
							e.visible = true;
							e.scale.setTo(1, 1 + Math.random()*0.15);
						}
					});
				}
			}
		}
	},

	SpinCar: function()
	{
		if (lostControl <= 1.5 && lostControl > 0.1)
		{

			var degrees = (lostControl - 0.1) * (360 * 1.5);
			var radians = degrees * 0.0175;
			//car.angle = (lostControl - 0.1) * (360 * 1.5);
			//car.angle += 1;
			car.rotation = radians;

		}
		else if (lostControl <= 0.1)
		{
			car.rotation = 0;
		}



	},

	PlaySFX: function(audioName)
	{
		if (!sfxAllowed) return;
		sfx.play(audioName);
	},

	AddSoundMarkers: function()
	{
		//sfx.addMarker(	        'MainMenu',  0.026, 6.9);
		//sfx.addMarker(        'PlayButton',  7.026, 2.9);
		//sfx.addMarker(     'VehicleSelect', 10.026, 2.9);
		//sfx.addMarker(      'WeaponSelect', 13.026, 2.9);
		sfx.addMarker(      'TouchToStart', 16.026, 2.9);
		sfx.addMarker(           'Results', 19.026, 2.9);
		sfx.addMarker(            'Resume', 22.026, 2.9);
		sfx.addMarker(             'Pause', 25.026, 2.9);
		sfx.addMarker( 'ExplosionOpponent', 28.026, 1.9);
		sfx.addMarker(   'ExplosionPlayer', 30.026, 1.9);
		sfx.addMarker( 			  'PickUp', 32.026, 0.9);
		sfx.addMarker(    'ActivatePickUp', 33.026, 1.9);
		sfx.addMarker(    'Brake',          36.026, 0.8);
	},

	FireButton: function()
	{
		keySpaceBar.isDown = true;
		this.Fire();
	},
	StearLeft: function()
	{
		keyArrowLeft.timeDown = 1;
		keyArrowLeft.isUp = true;
	},
	StearRight: function()
	{
		keyArrowRight.timeDown = 1;
		keyArrowRight.isUp = true;
	},

	// ----------------------------------
	// Level
	// ----------------------------------
	InitLevel: function(){
		var arrayCount = 0;
		keyArrowLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		keyArrowRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		keySpaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		keySpaceBar.onDown.add(this.UsePickUp, this);
		if (brakeAvailable)
		{
			keyZ = game.input.keyboard.addKey(Phaser.Keyboard.Z);
			keyZ.onDown.add(this.Brake, this);
		}
		lanes = [this.world.centerX - 128*globalScale,
				 this.world.centerX - 64*globalScale,
				 this.world.centerX + 64*globalScale,
				 this.world.centerX + 128*globalScale];
		currentlane = 0;
		bulletTimer = 0;
		carCollisionTimer = 0;
		lostControl = 0;
		lostControlRotation = 0;
		deathTimer = 0;
		armor = Data.Cars[Globals.currentCar].Armor;
		rateOfFire = Data.Weapons[Globals.currentWeapon].RateOfFire;
		weaponDamage = Data.Weapons[Globals.currentWeapon].Damage;
		lastObject = null;
		currentWave = 0;
		pressed = false;
		currentLevel = "";
		currentPickup = "";
		pickupScaleTimer = 0;
		shieldcurrentTimer = 0;
		shieldTimer = 0;
		fireDashTimer = 0;
		fireDashCurrentTimer = 0;
		jetPackTimer = 0;
		superSpeed = 1;
		brakeTimer = 0;
		brakeMultiplier = 1;


		// musicEnabled = false;
		// if (musicAllowed)
		// {
		// 	// music = game.add.audio('Music'); //, 0.8, true);
		// 	// music.addMarker('RealMusic', 0, 12.47, 0.8, true);
		// 	// music.play('RealMusic');

		// 	music = game.add.audio('Music', 0.8, true);
		// 	music.play();

		// 	musicEnabled = true;
		// }

		// define sfx
		if (sfxAllowed)
		{
			sfx = game.add.audio('SoundEffects');
			this.AddSoundMarkers();
		}
		this.PlaySFX("TouchToStart");
		//---------------------------------------------------------------------------------------------------------------
		//Street and Background
		//---------------------------------------------------------------------------------------------------------------
		var streetname = "";
		/*switch(Globals.currentCar)
		{
		case "Viper":
			level = 1;
			currentLevel = Data.WaveSystem["WaveSystem"].Level1;
			streetname = "StreetCanyon";
			break;
		case "Vice":
			level = 2;
			currentLevel = Data.WaveSystem["WaveSystem"].Level2
			streetname = "StreetGrass";
			break;
		case "Macari":
			level = 3;
			currentLevel = Data.WaveSystem["WaveSystem"].Level3;
			streetname = "StreetWater";
			break;
		case "Rebel":
			level = 4;
			currentLevel = Data.WaveSystem["WaveSystem"].Level4;
			streetname = "StreetCity";
			break;
		case "Panini":
			level = 5;
			currentLevel = Data.WaveSystem["WaveSystem"].Level5;
			streetname = "StreetDesert";
			break;
		case "Tsunami":
			level = 6;
			currentLevel = Data.WaveSystem["WaveSystem"].Level6;
			streetname = "StreetSnow";
			break;
		}
		*/

		// Override
		// only play level 7
		level = 7;


		var backgrounds = ["Canyon", "Grass", "Water", "City", "Desert", "Snow"]
		randomInt = randomInt = Math.round(Math.random() * (Globals.randomLevels.length-1));
		randomInt = Globals.randomLevels[randomInt];
		var index = Globals.randomLevels.indexOf(randomInt);
		Globals.randomLevels.splice(index, 1);

		if (Globals.randomLevels.length == 0) Globals.randomLevels = [0, 1, 2, 3, 4, 5];
		backGroundInt = backgrounds[randomInt];
		sourceWave = Data["Level"+(backgrounds.indexOf(backGroundInt)+1)+"Start"];
		streetname = "Street"+backGroundInt;

		// one big level
		var tempLevel;
		var holder;
		randomInt += 1; // correct this as we dont start counting at 0 in Data
		var waveSystem = Data.WaveSystem["WaveSystem"];
		for (var i = 1; i <= 6; i++) {
			tempLevel = waveSystem["Level"+i];
			var regExp = new RegExp("Level"+i, "g");  // regex pattern string
			holder = tempLevel; //.replace(regExp, "Level"+randomInt.toString());
			currentLevel = currentLevel + holder;
			if (i < 6) currentLevel +=","
		}
		currentLevel = currentLevel.split(",");

		//console.log(currentLevel);
		//debugger;

		street = this.add.group();
		for(var i = 0; i < 2; i++)
		{
			var streetImage = this.add.sprite(0, 0, streetname);
			streetImage.anchor.setTo(0.5, 0.5);
			//streetImage.scale.setTo(1.0*globalScale, 1.0*globalScale);
			streetImage.y = ((-480) + (960*i)) * globalScale;
			street.add(streetImage);
		}
		street.x = this.world.centerX;
		street.y = this.world.centerX;

		//street.scale.setTo(globalScale, globalScale);

		//---------------------------------------------------------------------------------------------------------------
		//Car, Bullet, Explosion, Obstakels
		//---------------------------------------------------------------------------------------------------------------

		standStillObjects = this.add.group();
		standStillObjects.createMultiple(20, 'GameObjects');
		standStillObjects.setAll('alive', false);

		trafficCars = this.add.group();
		//trafficCars.createMultiple(30, 'GameCars');
		//trafficCars.setAll('alive', false);

		car = this.add.group();
		//JetPack Shadow Image
		var carJetpackShadow = this.add.sprite(0, 0, 'GameCars');
		carJetpackShadow.frameName = 'CarSharedShadow.png';
		carJetpackShadow.anchor.setTo(0, 0);
		carJetpackShadow.scale.setTo(0.75, 0.6);
		//carJetpackShadow.alpha = 0;
		carJetpackShadow.visible = false;
		//Car Image
		carImage = this.add.sprite(0, 0, 'GameCars');
		carImage.frameName = 'Car'+Globals.currentCar+'Up1.png';
		carImage.realTint = carImage.tint;
		carImage.anchor.setTo(0.5, 0.5);
		//Weapon Images
		var wepImage = this.add.sprite(0, 0, 'GameWeapons');
		wepImage.frameName = 'Weapon'+Globals.currentWeapon+'.png';
		wepImage.anchor.setTo(0.5, 1);
		var muzzleImage = this.add.sprite(0, 0, 'GameEffects');
		muzzleImage.frameName = 'MuzzleFlash'+Globals.currentWeapon+'.png';
		muzzleImage.anchor.setTo(0.5, 1.8);
		//muzzleImage.alpha = 0;
		muzzleImage.blendMode = 1;
		muzzleImage.visible = false;
		//JetpackEffect Image
		var carJetpackEffect = this.add.sprite(0, 0, 'GameEffects');
		carJetpackEffect.frameName = 'MuzzleFlashMachineGun.png';
		carJetpackEffect.angle = 180;
		carJetpackEffect.anchor.setTo(0.5, 1.2);
		carJetpackEffect.blendMode = 1;
		//carJetpackEffect.alpha = 0;
		carJetpackEffect.visible = false;
		//car position and collision
		//car.enableBody = true;
		//car.physicsBodyType = Phaser.Physics.ARCADE;
		car.scale.setTo(1.0*globalScale, 1.0*globalScale);
		car.position.setTo(lanes[currentlane], this.world.centerY + (300*globalScale));
		//Add Images to group
		car.add(carJetpackShadow);
		car.add(carImage);
		car.add(muzzleImage);
		car.add(wepImage);
		car.add(carJetpackEffect);

		bullets = this.add.group();
		if (Globals.currentWeapon == "GrenadeLauncher" || Globals.currentWeapon == "RocketLauncher")
		{
			bullets.createMultiple(30, 'GameWeapons', 'Projectile'+Globals.currentWeapon+'.png');
			bullets.setAll('blendMode', 0);
		}
		else
		{
			bullets.createMultiple(30, 'GameEffects', 'Projectile'+Globals.currentWeapon+'.png');
			bullets.setAll('blendMode', 1);
		}
		bullets.setAll('scale.x', 1.0*globalScale)
		bullets.setAll('scale.y', 1.0*globalScale)
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1.5);
		//bullets.setAll('outOfBoundsKill', true);
		//bullets.setAll('checkWorldBounds', true);

		explosions = this.add.group();
		explosions.createMultiple(30, 'Explosion1');
		explosions.setAll('anchor.x', 0.5);
		explosions.setAll('anchor.y', 1.5);
		explosions.setAll('blendMode', 1);
		explosions.setAll('visible', false);

		//---------------------------------------------------------------------------------------------------------------
		//Clouds, Decoration
		//---------------------------------------------------------------------------------------------------------------
		decorations = this.add.group();
		decorations.createMultiple(20, 'GameObjects');
		decorations.setAll('alive', false);



		//---------------------------------------------------------------------------------------------------------------
		//WaveSystem
		//---------------------------------------------------------------------------------------------------------------
		arrayCount = 0;
		carLegendaMarks = [];
		for (var key in Data.CarLegenda)
		{
			carLegendaMarks[arrayCount] = key;
			arrayCount++;
		}
		arrayCount = 0;
		standstillLegendaMarks = [];
		for (var key in Data.ObstakelLegenda)
		{
			standstillLegendaMarks[arrayCount] = key;
			arrayCount++;
		}
		arrayCount = 0;
		decorationLegendaMarks = [];
		for (var key in Data.DecorationLegenda)
		{
			decorationLegendaMarks[arrayCount] = key;
			arrayCount++;
		}

		// build first wave
		this.WaveSpawn(currentLevel[currentWave], currentWave);
		currentWave++;



	},

	ClearLevel: function()
	{
		//streetBackground.destroy();
		street.destroy();
		standStillObjects.destroy();
		trafficCars.destroy();
		car.destroy();
		bullets.destroy();
		explosions.destroy();
		decorations.destroy();
		//streetCloud.destroy();
	},

	DestroyLevel: function(){
		// destroy stuff
		this.DestroyInterface();
		this.DestroyResults();
		this.DestroyPause();
		// stop the music
		if (musicEnabled) music.destroy();
	},

	StartLevel: function(){
		// show interface
		this.ShowInterface(true);
	},

	// Level end or game over
	EndLevel: function(){
		gamePaused = true;
		this.ShowResults(true);
	},

	// Retry this level
	RetryLevel: function(){
		xManager.SaveData();
		// stop the music
		//if (musicEnabled) music.destroy();
		game.world.setBounds(0, 0, game.world.width-worldExtension, game.world.height-worldExtension);
		game.camera.x = 0;
		game.camera.y = 0;

		this.ClearLevel();
		this.InitLevel();
		// reset vars
		this.ResetVars();
		// clear stuff?
		this.ShowPause(false);
		this.ShowResults(false);
		// updates (resets)
		this.UpdateScore(0);
		this.UpdateArmor(0);
			// larger
		worldExtension = 20;
		game.world.setBounds(0, 0, game.world.width+worldExtension, game.world.height+worldExtension);
		game.camera.x = 0;
		game.camera.y = 0;
		// start again
		this.StartLevel();
	},

	// Quit and return to main menu
	QuitLevel: function(){
		// if (!resultGroup.visible)
		// {
		// 	if (score > Globals.bestScore) Globals.bestScore = score;
		// 	if (distance > Globals.bestDistance) Globals.bestDistance = distance;
		// 	Globals.totalScore += score;
		// 	this.UnlockCarsInGlobals();
		// 	this.UnlockWeaponsInGlobals();
		// }

		xManager.SaveData();
		// Clear
		this.ClearLevel();
		// Destroy Level
		this.DestroyLevel();
		// very important
		game.world.setBounds(0, 0, game.world.width-worldExtension, game.world.height-worldExtension);
		game.camera.x = 0;
		game.camera.y = 0;
		// Back to main menu
		this.state.start('Menu');
	},

	// not to happy with this
	ResetVars: function(){
		armor = Data.Cars[Globals.currentCar].Armor;
		score = 0;
		distance = 0;
		newDistance = false;
		gamePaused = false;
		startBuilt = false;
		decoSkipped = false;
	},

	// ----------------------------------
	// SOUND
	// ----------------------------------
	MuteLevel: function(){
		Globals.music = !Globals.music;
		Globals.sfx = !Globals.sfx;
		this.sound.mute = !this.sound.mute;
		// update icon
		if (!Globals.music && !Globals.sfx) soundButton.setFrames(2, 0, 4, 0)
		else soundButton.setFrames(3, 1, 5, 1)
	},

	// ----------------------------------
	// INTERFACE
	// ----------------------------------
	InitInterface: function(){
		//group
		interfaceGroup = this.add.group();

		deadOverlay = this.add.sprite(0, 0, 'DeadOverlay');
		deadOverlay.width = this.world.width+worldExtension;
		deadOverlay.height = this.world.height+worldExtension;
		deadOverlay.alpha = 0;


		// livesHeader
		var header = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("LivesHeader"), 40*globalScale);
		header.position.setTo(15*globalScale, 5*globalScale);
		interfaceGroup.add(header); // add to button group

		var armorBackground = this.add.sprite(0, 0, 'InterfaceItems');
		armorBackground.frameName = 'InterfaceArmorIcon.png';
		armorBackground.anchor.setTo(0.5, 0.5);
		armorBackground.scale.setTo(1.0*globalScale, 1.0*globalScale);
		armorBackground.position.setTo(game.world.centerX - (game.world.centerX / 1.25), game.world.centerY - (game.world.centerY / 1.3));
		interfaceGroup.add(armorBackground);

		armorText = game.add.bitmapText(0, 0,  'Vipna', ""+armor, 100*globalScale);
		if (armor == 1) armorText.text = " " + armor;
		else armorText.text = "" + armor;
		armorText.position.setTo(game.world.centerX - (game.world.centerX / 1.125), game.world.centerY - (game.world.centerY / 1.075));
		interfaceGroup.add(armorText);

		// scoreHeader
		header = game.add.bitmapText(0, 0,  'Impact', Localization.ScoreHeader, 40*globalScale);
		header.updateText(); // update so we know the width
		header.position.setTo(20*globalScale, 170*globalScale);
		interfaceGroup.add(header); // add to button group

		// scoreText
		scoreText = game.add.bitmapText(0, 0,  'Vipna', this.GetScoreFormat(), 40*globalScale);
		scoreText.updateText(); // update so we know the width
		// scoreText.x = game.world.centerX - scoreText.textWidth*0.5;
		// scoreText.y = 10;
		scoreText.position.setTo(9*globalScale, 205*globalScale);
		interfaceGroup.add(scoreText);


		// distanceHeader
		header = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("DistanceHeader"), 40*globalScale);
		header.updateText(); // update so we know the width
		header.x = game.world.centerX - header.textWidth*0.5;
		header.y = 5*globalScale;
		interfaceGroup.add(header); // add to button group
		distanceHeader = header;

		// distanceText
		distanceText = game.add.bitmapText(0, 0,  'Vipna', this.GetDistanceFormat(), 85*globalScale);
		distanceText.updateText(); // update so we know the width
		distanceText.x = game.world.centerX - distanceText.textWidth*0.5;
		distanceText.y = 15;
		interfaceGroup.add(distanceText);

		// pauseButton
		pauseButton = this.add.button(0, 0, 'PauseButton', this.PauseLevel, this, 1, 0, 2, 0);
		pauseButton.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
		pauseButton.x = game.world.width - pauseButton.width*0.5+5;
		pauseButton.y = pauseButton.height/3 + 10;
		interfaceGroup.add(pauseButton);
		//pauseButton.input.useHandCursor = true;

		//PowerupButton
		powerButton = this.add.button(0, 0, 'InterfaceItems', this.UsePickUp, this);
		powerButton.frameName = 'InterfaceFiredashButton.png';
		powerButton.anchor.setTo(0.5, 0.5);
		powerButton.scale.setTo(1.0*globalScale, 1.0*globalScale);
		powerButton.position.setTo(game.world.centerX + (game.world.centerX / 1.3), game.world.centerY);
		powerButton.visible = false;
		interfaceGroup.add(powerButton);

		// Brake button
		if (brakeAvailable)
		{
			brakeButton = this.add.button(0, 0, 'BrakeButton', this.Brake, this);
			brakeButton.anchor.setTo(0.5, 0.5);
			brakeButton.scale.setTo(1.5*globalScale, 1.5*globalScale);
			brakeButton.position.setTo(100*globalScale, this.world.height-(100*globalScale));
			brakeButton.position.setTo(game.world.centerX + (game.world.centerX / 1.3), game.world.centerY + (130*globalScale));
			interfaceGroup.add(brakeButton);
		}

		// hide the group
		interfaceGroup.visible = false;
	},

	DestroyInterface: function(){
		// destroy it
		interfaceGroup.destroy(true);
	},

	ShowInterface: function(state){
		if (state) this.world.bringToTop(interfaceGroup);
		interfaceGroup.visible = state;
	},

	UpdateScore: function(amount){
		score += amount;
		scoreText.text = this.GetScoreFormat();
	},


	UpdateDistance: function(){
		//	distanceText.text = this.GetDistanceFormat();
		var distanceAsString = distance.toString();
		if (distanceAsString.length < 5)
		{
			var diff = 5-distanceAsString.length;
			for (var i = 0; i < diff; i++) {
				distanceAsString = '0'+distanceAsString;
			}
		}
		distanceText.text = distanceAsString+"m";
		if (newDistance) distanceText.tint = 0xCD2323;
	},

	UpdateArmor: function(amount){
		armor += amount;
		if (armor == 1) armorText.text = " " + armor;
		else armorText.text = "" + armor;
	},

	GetScoreFormat: function()
	{
		var scoreAsString = score.toString();
		if (scoreAsString.length < 5)
		{
			var diff = 5-scoreAsString.length;
			for (var i = 0; i < diff; i++) {
				scoreAsString = '0'+scoreAsString;
			}
		}
		return scoreAsString;
	},

	GetDistanceFormat: function()
	{
		var distanceAsString = distance.toString();
		if (distanceAsString.length < 5)
		{
			var diff = 5-distanceAsString.length;
			for (var i = 0; i < diff; i++) {
				distanceAsString = '0'+distanceAsString;
			}
		}
		return distanceAsString+"m";
	},

	// ----------------------------------
	// PAUSE
	// ----------------------------------
	OnGamePause: function(){
		//console.log('losing focus');
		if (!gamePaused) this.PauseLevel(); // check because we could already be in pause
	},

	OnGameResume: function(){
		//console.log('gaining focus');
		// just for reference here
	},

	InitPause: function(){
		// group
		pauseGroup = this.add.group();
		// screen
		var pauseScreen = this.add.sprite(0, 0, 'DefaultOverlay');
		pauseScreen.scale.setTo(16*globalScale, 16*globalScale);
		pauseGroup.add(pauseScreen);
		// branding
		var branding = this.add.sprite(5*globalScale, 5*globalScale, 'Branding');
		branding.scale.setTo(0.8*globalScale, 0.8*globalScale);
		branding.x = game.world.centerX - (branding.width/2);
		branding.y = game.world.height - branding.height;
		branding.inputEnabled = true;
		branding.input.useHandCursor = true;
		branding.events.onInputDown.add(this.OpenBrandingSite, this);
		pauseGroup.add(branding);
		//header
		// header text
		var header = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("PauseHeader"), 144*globalScale);
		header.tint = 0xCD2323;
		header.updateText();
		header.x = game.world.centerX - header.textWidth*0.5;
		header.y = game.world.centerY - 256*globalScale;
		pauseGroup.add(header);

		// resume button
		var buttonGroup = this.add.group();
		// button
		var button = this.add.button(0, 0, 'MainButton', this.UnPauseLevel, this, 1, 0, 2, 0);
		button.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
		button.scale.setTo(1.0*globalScale, 1.0*globalScale);
		buttonGroup.add(button); // add to group
		// button text
		var buttonText = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("ResumeButton"), 100*globalScale);
		buttonText.updateText(); // update so we know the width
		buttonText.x = button.x - buttonText.textWidth*0.5 + (5*globalScale); // wth, but center to button
		buttonText.y = button.y - buttonText.textHeight*0.5 - (8*globalScale); // wth, but center to button
		buttonGroup.add(buttonText); // add to button group
		// place button
		buttonGroup.x = this.world.centerX;
		buttonGroup.y = this.world.centerY;
		// add to group
		pauseGroup.add(buttonGroup);

		// quit button
		var quitButtonGroup = this.add.group();
		// button
		var quitButton = this.add.button(0, 0, 'MainButton', this.QuitLevel, this, 1, 0, 2, 0);
		quitButton.scale.setTo(1.0*globalScale, 1.0*globalScale);
		quitButton.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
		quitButtonGroup.add(quitButton); // add to group
		// button text
		quitButtonText = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("QuitButton"), 100*globalScale);
		quitButtonText.updateText(); // update so we know the width
		quitButtonText.x = quitButton.x - quitButtonText.textWidth*0.5 + 5*globalScale; // wth, but center to button
		quitButtonText.y = quitButton.y - quitButtonText.textHeight*0.5 - 8*globalScale; // wth, but center to button
		quitButtonGroup.add(quitButtonText); // add to button group
		// place button
		quitButtonGroup.x = this.world.centerX;
		quitButtonGroup.y = this.world.centerY+(128+32)*globalScale;
		// add to group
		pauseGroup.add(quitButtonGroup);

		// muteButton
		// off 2, 0, 4, 0
		// on  3, 1, 5, 1
		soundButton = this.add.button(0, 0, 'SoundButton', this.MuteLevel, this, 2, 0, 4, 0);
		soundButton.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
		soundButton.scale.setTo(1.0*globalScale, 1.0*globalScale);
		soundButton.x = game.world.width - soundButton.width / 2;
		soundButton.y = soundButton.height/3 + 10;
		pauseGroup.add(soundButton);
		if (!Globals.music && !Globals.sfx) soundButton.setFrames(2, 0, 4, 0)
		else soundButton.setFrames(3, 1, 5, 1)

		// hide
		pauseGroup.visible = false;
	},

	OpenBrandingSite: function(){
		if(window.famobi.__("more_games_url") == null) return false;
		window.open(Globals.brandingUrl);
	},

	DestroyPause: function(){
		// force unpause
		gamePaused = false;
		// screen
		//pauseGroup.destroy(true); // destroy group & children
	},

	ShowPause: function(state){
		// lower music
		//if(Globals.music)
		//{
			//if (state) levelMusic.volume = 0.3;
			//else levelMusic.volume = 1.0;
		//}
		// show the actual screen
		if (state) this.world.bringToTop(pauseGroup);
		pauseGroup.visible = state;
		if (musicEnabled)
		{
			if (state) music.volume = 0.3;
			else music.volume = 0.8;
		}

	},

	PauseLevel: function(){
		if (!gamePaused)
		{
			this.PlaySFX("Pause");
			// tag it
			gamePaused = true;
			// Hide interface
			this.ShowInterface(false);
			// Show pause screen
			this.ShowPause(true);

			// clear all explosions
			for (var i = 0; i < explosions.length; i++)
			{
				if (explosions.getAt(i).alive)
				{
					var explo = explosions.getAt(i);
					if (explo != null)
					{
						explo.kill();
					}
				}
			}
		}
	},

	UnPauseLevel: function(){
		if (gamePaused)
		{
			this.PlaySFX("Resume");
			// tag it
			gamePaused = false;
			// Hide pause screen
			this.ShowPause(false);
			// Show interface
			this.ShowInterface(true);
		}
	},

	// ----------------------------------
	// RESULTS
	// ----------------------------------
	InitResults: function(){
		// group
		resultGroup = this.add.group();
		// screen
		var resultsScreen = this.add.sprite(0, 0, 'DefaultOverlay');
		resultsScreen.scale.setTo(16*globalScale, 16*globalScale);
		resultGroup.add(resultsScreen);
		// branding
		var branding = this.add.sprite(5, 5, 'Branding');
		branding.scale.setTo(0.8*globalScale, 0.8*globalScale);
		branding.x = game.world.centerX - (branding.width/2);
		branding.y = game.world.height - branding.height;
		branding.inputEnabled = true;
		branding.input.useHandCursor = true;
		branding.events.onInputDown.add(this.OpenBrandingSite, this);
		resultGroup.add(branding);

		//header
		var header = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("ResultsHeader"), 144*globalScale);
		header.tint = 0xCD2323;
		header.updateText();
		header.x = game.world.centerX - header.textWidth*0.5;
		header.y = game.world.centerY - 380*globalScale;
		resultGroup.add(header);

		// scoreHeader
		var scoreHeader = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("ResultsScore"), 70*globalScale);
		scoreHeader.updateText();
		scoreHeader.x = game.world.centerX - scoreHeader.textWidth*0.5;
		scoreHeader.y = game.world.centerY - 210*globalScale;
		resultGroup.add(scoreHeader);

		// scoreResult
		scoreResult = game.add.bitmapText(0, 0,  'Vipna', this.GetDistanceFormat, 130*globalScale);
		scoreResult.updateText();
		scoreResult.x = game.world.centerX - scoreResult.textWidth*0.5;
		scoreResult.y = game.world.centerY-scoreResult.textHeight-50*globalScale;
		resultGroup.add(scoreResult);

		// resume button
		var buttonGroup = this.add.group();
		// button
		var button = this.add.button(0, 0, 'MainButton', this.RetryLevel, this, 1, 0, 2, 0);
		button.scale.setTo(1.0*globalScale, 1.0*globalScale);
		button.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
		buttonGroup.add(button); // add to group
		// button text
		var buttonText = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("RetryButton"), 100*globalScale);
		buttonText.updateText(); // update so we know the width
		buttonText.x = button.x - buttonText.textWidth*0.5 + 5*globalScale; // wth, but center to button
		buttonText.y = button.y - buttonText.textHeight*0.5 - 8*globalScale; // wth, but center to button
		buttonGroup.add(buttonText); // add to button group
		// place button
		buttonGroup.x = this.world.centerX;
		buttonGroup.y = this.world.centerY+50*globalScale;
		// add to group
		resultGroup.add(buttonGroup);

		// quit button
		var quitButtonGroup = this.add.group();
		// button
		var quitButton = this.add.button(0, 0, 'MainButton', this.QuitLevel, this, 1, 0, 2, 0);
		quitButton.scale.setTo(1.0*globalScale, 1.0*globalScale);
		quitButton.anchor.setTo(0.5, 0.5); // is this anchor to the complete sprite sheet?
		quitButtonGroup.add(quitButton); // add to group
		// button text
		var quitButtonText = game.add.bitmapText(0, 0,  'Impact', window.famobi.__("QuitButton"), 100*globalScale);
		quitButtonText.updateText(); // update so we know the width
		quitButtonText.x = quitButton.x - quitButtonText.textWidth*0.5 + 5*globalScale; // wth, but center to button
		quitButtonText.y = quitButton.y - quitButtonText.textHeight*0.5 - 8*globalScale; // wth, but center to button
		quitButtonGroup.add(quitButtonText); // add to button group
		// place button
		quitButtonGroup.x = this.world.centerX;
		quitButtonGroup.y = this.world.centerY+210*globalScale;
		// add to group
		resultGroup.add(quitButtonGroup);

		// scoreResult
		unlockResultTimer = 0;
		unlockResult = game.add.bitmapText(0, 0,  'Impact', "Test", 70*globalScale);
		unlockResult.tint = 0xCD2323;
		unlockResult.updateText();
		unlockResult.x = this.world.centerX - unlockResult.textWidth*0.5;
		unlockResult.y = this.world.centerY+300*globalScale;
		resultGroup.add(unlockResult);

		// hide
		resultGroup.visible = false;
	},

	DestroyResults: function(){
		//resultGroup.destroy();
	},

	ShowResults: function(state){
		// Reset the pickup
		currentPickup = "";
		powerButton.visible = false;
		// play sfx
		if (state) { this.world.bringToTop(resultGroup); this.PlaySFX('Results'); }
		// update score
		if (score > Globals.bestScore) Globals.bestScore = score;
		if (distance > Globals.bestDistance) Globals.bestDistance = distance;
		Globals.totalScore += score;
		scoreResult.text = this.GetDistanceFormat();
		scoreResult.updateText();
		scoreResult.x = game.world.centerX - scoreResult.textWidth*0.5;

		// update unlock
		this.UnlockCarsInGlobals();
		this.UnlockWeaponsInGlobals();


		var unlockText = "";
		if (Globals.newCars.length > 0)
		{
			unlockText = unlockText + window.famobi.__("ResultsNewCar");
		}
		if (unlockText.length > 1) unlockText = unlockText + "\n";

		if (Globals.newWeapons.length > 0)
		{
			unlockText = unlockText + window.famobi.__("ResultsNewWeapon");
			//unlockText = "     " + unlockText;
		}
		unlockResult.text = unlockText;
		unlockResult.align = "center";
		unlockResult.updateText();
		unlockResult.x = this.world.centerX - unlockResult.textWidth*0.5;

		if (musicEnabled)
		{
			if (state) music.volume = 0.3;
			else music.volume = 0.8;
		}

		// show
		resultGroup.visible = state;
	}
};