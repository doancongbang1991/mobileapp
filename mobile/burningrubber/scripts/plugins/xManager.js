//----------------------------------------------------------------------------------------------
// xManager as plung
// Please note: this can only work properly when having globals!
//----------------------------------------------------------------------------------------------
Phaser.Plugin.xManager = function (game, parent) {
	// register?
	Phaser.Plugin.call(this, game, parent);
	// do Xform stuff
    Globals = JSON.parse(game.cache.getText('Globals'));
    Data    = JSON.parse(game.cache.getText('Data'));
    var Languages = JSON.parse(game.cache.getText('Localization'));
    Localization = Languages[Globals.language];
};

//	Extends the Phaser.Plugin template, setting up values we need
Phaser.Plugin.xManager.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.xManager.prototype.constructor = Phaser.Plugin.xManager;

//----------------------------------------------------------------------------------------------
// Function to loadfiles from json, and passing them through for actual loading
// Please note: run this inside a preload state
//----------------------------------------------------------------------------------------------
Phaser.Plugin.xManager.prototype.LoadFiles = function(){

     var key;
     var url;
     var fileName;
     var data;

     var loadingArray = JSON.parse(game.cache.getText('LoadingArray'));
     if (Globals.development || Globals.debug) LoadingArray = loadingArray; // Make global during development

     for(var prop in loadingArray)
     {
         switch(prop){
             case 'sprites':
                 for(key in loadingArray.sprites) 
                 {
                    url =  loadingArray.sprites[key];
                    if (url.indexOf('+') > -1) // still testiung this!
                    {
                        data = url.split('+');
                        url = data[0] + eval(data[1]) + data[2];
                    }
                    game.load.image(key, url);
                 }
                 break;

             case 'spriteSheet':
                 for(key in loadingArray.spriteSheet)
                 {
                    url = loadingArray.spriteSheet[key];
                    data = url.split('/');
                    data = data[data.length-1].split('.')[0];
                    data = data.split('_')[1];
                    data = data.split('x');
                    game.load.spritesheet(key, url, parseInt(data[0]), parseInt(data[1])); //data[0], data[1]);
                 }
                 break;

             case 'atlasXML':
                for(key in loadingArray.atlasXML)
                 {
                     url = loadingArray.atlasXML[key];
                     data = url.split('/');
                     fileName = data[data.length-1].split('.')[0];
                     game.load.atlasXML(key, url, data[0] + '/' + data[1] + '/' + fileName + '.xml');
                 }
                 break; 
             
             case 'bitmapFont':
                 for(key in loadingArray.bitmapFont)
                 {
                     url = loadingArray.bitmapFont[key];
                     data = url.split('/');
                     fileName = data[data.length-1].split('.')[0];
                     game.load.bitmapFont(key, url, 'assets/fonts/' + fileName + '.xml');
                 }
                 break;      

             case 'audio':
                 for(key in loadingArray.audio)
                 {
                   
                    // burnin rubber exception
                    //if (Phaser.Device.isAndroidStockBrowser() && key == 'Music') continue;
                    
                    url =  loadingArray.audio[key];
                    if (url.indexOf('+') > -1) // still testiung this!
                    {
                        data = url.split('+');
                        url = data[0] + eval(data[1]);
                    }
                    game.load.audio(key, url, true);
                 }
                 break;  

         }
     }
};

//----------------------------------------------------------------------------------------------
// Saving data to localStorage
//----------------------------------------------------------------------------------------------
Phaser.Plugin.xManager.prototype.SaveData = function(){
     // Please NOTE there is NO anti-cheat stuff implemented
        if (!Globals.saveData)
        {
           if (Globals.debug) console.log('[Warning] Saving data has been disabled.');
            return;
        }

        var saveList = {};
        for (index in Globals.saveList)
        {
            //console.log(Globals.saveList[key]);
            saveList[Globals.saveList[index]] = Globals[Globals.saveList[index]];
        }
        localStorage[Globals.name+'SaveData'] = JSON.stringify(saveList);
        if (Globals.debug) console.log('[Message] Data has been saved!');
};

//----------------------------------------------------------------------------------------------
// Loading data from localStorage
//----------------------------------------------------------------------------------------------
Phaser.Plugin.xManager.prototype.LoadData = function(){
     // Please NOTE there is anti-cheat stuff implemented
        if (!Globals.loadData)
        {
            if (Globals.debug) console.log('[Warning] Loading data has been disabled.');
            return;
        }
        
        var saveList = localStorage[Globals.name+'SaveData'];
        var deleteData = false;
        var dataLoaded = false;
        if (saveList != undefined)
        {
            saveList = JSON.parse(saveList);
            // we're missing some stuff here, but it should work for now
            // ....
            // check version
            if(saveList.version != Globals.version) deleteData = true;

        } else
        {
            if (Globals.debug) console.log('[Warning] Couldn\'t load data. Either parsing failed or no data at all.');
            return;
        }

        // globals override?
        if (Globals.deleteData || deleteData) deleteData = true
        else {
            // process it
            for (index in Globals.saveList)
            {
                Globals[Globals.saveList[index]] = saveList[Globals.saveList[index]];
            }
            if (Globals.debug) console.log('[Message] Data has been loaded!');
        } 

        // delete?
        // Still need to get me some more JS xp.
        if (deleteData) xManager.DeleteData(); 
};

//----------------------------------------------------------------------------------------------
// Delete data from localStorage
//----------------------------------------------------------------------------------------------
Phaser.Plugin.xManager.prototype.DeleteData = function(){
    if (Globals.debug) console.log('[Warning] Data has been deleted.');
    localStorage.removeItem(Globals.name+'SaveData');
};

Phaser.Plugin.xManager.prototype.enterIncorrectOrientation = function(){
    States.orientated = false;
    if (game.state.current == 'Level') game.state.callbackContext.PauseLevel();
    document.getElementById('orientation').style.display = 'block';        
    if (window.orientation == 90) document.getElementById('orientation').style.backgroundImage = "url('images/orientation90.jpg')";
    else document.getElementById('orientation').style.backgroundImage = "url('images/orientation.jpg')";
};

Phaser.Plugin.xManager.prototype.leaveIncorrectOrientation = function () {
    States.orientated = true;
    document.getElementById('orientation').style.display = 'none';
};
