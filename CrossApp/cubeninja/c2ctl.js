	function ctlArcadeSaveScore(iScore){
        if(getParamValue('ctl-arcade') === "true"){
            parent.__ctlArcadeSaveScore({score:iScore});
		}
    }

    function ctlArcadeStartSession(){
        if(getParamValue('ctl-arcade') === "true"){
            parent.__ctlArcadeStartSession();
        }
    }

    function ctlArcadeEndSession(){
        if(getParamValue('ctl-arcade') === "true"){
            parent.__ctlArcadeEndSession();
        }
    }

    function ctlArcadeRestartLevel(){
        if(getParamValue('ctl-arcade') === "true"){
            parent.__ctlArcadeRestartLevel();
        }
    }
	
    function ctlArcadeStartLevel(){
        if(getParamValue('ctl-arcade') === "true"){
            parent.__ctlArcadeStartLevel();
        }
    }
	
    function ctlArcadeEndLevel(){
        if(getParamValue('ctl-arcade') === "true"){
            parent.__ctlArcadeEndLevel();
        }
    }

	function ctlArcadeShowInterlevelAD(){
        if(getParamValue('ctl-arcade') === "true"){
            parent.__ctlArcadeShowInterlevelAD();
        }
    }
	
	function ctlArcadeShareEvent(szImg, szTitle, szMsg, szMsgShare){
        if(getParamValue('ctl-arcade') === "true"){
            parent.__ctlArcadeShareEvent({ img : szImg, title: szTitle, msg : szMsg, msg_share: szMsgShare });
        }
    }
	
	function ctlArcadeResume(){
		c2_callFunction("c2ctlArcadeResume");
	}

	function ctlArcadePause(){
		c2_callFunction("c2ctlArcadePause");
	}