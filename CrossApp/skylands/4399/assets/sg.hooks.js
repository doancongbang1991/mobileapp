var SG_Hooks = {
    debug : true,
    
    getLanguage : function( supportedLanguages ){
	return SG.initLangs(supportedLanguages);
    },

    getGameConfig : function( ){
        return SG.getGameConfig();
    },

    isEnabledIncentiviseButton : function (){
        return SG.isEnabledIncentiviseButton();
    },
    
    start : function(){
        SG_Hooks.debug && console.log('game started');
        SG.trigger({type:'start'});
    },
    
    levelStarted : function( level ){
        SG_Hooks.debug && console.log('level started:' + level);
	SG.trigger({type:'levelStarted', level: level});
    },

    levelFinished : function( level, score ){
        SG_Hooks.debug && console.log('level finished:' + level+' score: '+score);
	SG.trigger({type:'levelFinished', level: level, score: score});
    },   
    
    levelUp : function( level, score, callback){
        SG_Hooks.debug && console.log('level up:' + level + '/' + score);
	SG.trigger({type:'levelUp', level:level, lastLevelScore:score}, callback);
    },
    
    gameOver : function( level, score, callback){
        SG_Hooks.debug && console.log('game over:' + level + '/' + score);
	SG.trigger({type:'gameOver', score:score}, callback);
    },
    
    gameCompleted : function( score, callback ){
        SG_Hooks.debug && console.log('game completed:' + score);
        SG.trigger({type:'gameCompleted', score:score}, callback);
    },
    
    gamePause : function( state, callback ){ // state: on|off
        SG_Hooks.debug && console.log('game pause:' + state);
        SG.trigger({type:'gamePause', state:state}, callback);
    },
    
    gameRestart : function( callback ){
        SG_Hooks.debug && console.log('game restart:');
        SG.trigger({type:'gameRestart'}, callback);
    },
    
    selectMainMenu : function(callback){
        SG_Hooks.debug && console.log('selectMainMenu:');
        SG.trigger({type:'selectMainMenu'}, callback);
    },
    
    selectLevel : function( level, callback ){
        SG_Hooks.debug && console.log('selectLevel:'+level);
        SG.trigger({type:'selectLevel', level:level}, callback);
    },
    
    setSound : function( state, callback ){ // state: on|off
        SG_Hooks.debug && console.log('setSound:'+state);
        SG.trigger({type:'gameCompleted', state:state}, callback);
    },
    
    triggerIncentivise : function(callback){
        SG_Hooks.debug && console.log('triggerIncentivise');
        SG.trigger({type:'incentiviseTriggered'}, callback);
    },
    
    setOrientationHandler : function( f ){
	SG.setOrientationHandler( f );
    },
    
    setResizeHandler: function ( f ){
	SG.setResizeHandler(f);
    },
    
    setPauseHandler: function ( f ){
	SG.setPauseHandler(f);
    },
    
    setUnpauseHandler: function ( f ){
	SG.setUnpauseHandler(f);
    },
    
    buildKey : function( key ){
        return SG.getGameId()+"."+key;
    },

    getStorageItem: function(key){
        var value;
        try {
            value = localStorage.getItem(SG_Hooks.buildKey(key));
        }
        catch(error){
            return undefined
        }
        if(value !== undefined){
            value = window.atob(value);
        }
        return value;
    },

    setStorageItem: function(key, value){
        var v = value;
        if(v !== undefined){
            v = window.btoa(v);
        }
        try{
            localStorage.setItem(SG_Hooks.buildKey(key), v);
            return value;
        }
        catch(error){
            return undefined;
        }
    }
};
