define(["echo"], function(Echo) {
    "use strict";

    function Stats(environment, counterName) {

        var echoChamberTrace = null;//"OGPlaypen"; // Set to a string if you want to inspect stats events in Echo Chamber
        var echo = initEcho(environment, echoChamberTrace);

        // Send the initial View event for the playpen page. (Subsequent calls to logAction are for events occurring while on this page.):
        echo.viewEvent(counterName);

        var eventMap = {
            //our key:  {standard GamesGrid/iStats labels & values}. See https://confluence.dev.bbc.co.uk/display/gamesgrid/Games+Grid+iStats+Guide
            "initOk": { action_name: "init",  action_type: "complete", name: counterName },

            "unityFirstInstall":   {action_name: "init",  action_type: "error", name: counterName, game_unity_plugin_status: "first_install" },
            "unityDownloadPlugin": {action_name: "init",  action_type: "error", name: counterName, game_unity_plugin_status: "request_download" }
        };

        var errorEventMap = {
            "404": {},
            "500": {},

            "init": { name: counterName },

            "js":    { name: counterName },
            "flash": { name: counterName },
            "unity": { name: counterName },
            "unityMissing":     { name: counterName, game_unity_plugin_status: "missing" },
            "unityBroken":      { name: counterName, game_unity_plugin_status: "broken" },
            "unityUnsupported": { name: counterName, game_unity_plugin_status: "unsupported" }
        };
        
        function logAction(name) {
            var params = eventMap[name];
            if (params) {
                echo.userActionEvent(params.action_type, params.action_name, params);
            }
        }

        function logError(name, exception) {
            var params = errorEventMap[name];
            if (params) {
                echo.errorEvent(exception || new Error(name), params);
            }
        }

        return {
            logAction: logAction,
            logError: logError
        };
    }
    
    function initEcho(environment, echoChamberTrace) {
        var Media = Echo.Media,             // Media class
            EchoClient = Echo.EchoClient,   // Echo Client class
            Enums = Echo.Enums,             // Enums
            ConfigKeys = Echo.ConfigKeys,   // Key names to use in config
            Environment = Echo.Environment; // Class to allow overriding default behaviour
        
        if (environment !== "live" && environment !== "stage") Echo.Debug.enable();

        var echoChamberBase = 'http://data.bbc.co.uk/v1/analytics-echo-chamber-inbound/';
        var echoConf = {};
        if (echoChamberTrace) {
            // Send events to EchoChamber
            echoConf[ConfigKeys.COMSCORE.URL] = echoChamberBase + 'comscore';
            echoConf[ConfigKeys.RUM.URL] = echoChamberBase + 'rum';
            // Set "trace" so we can find events in EchoChamber
            echoConf[ConfigKeys.ECHO.TRACE] = echoChamberTrace;
        }
        else {
            var istatsPath = (environment === "live") ? "bbc" : environment;
            echoConf[ConfigKeys.COMSCORE.URL] = 'http://sa.bbc.co.uk/bbc/'+istatsPath+'/s';
            echoConf[ConfigKeys.RUM.URL] = 'http://ingest.rum.bbc.co.uk';
        }

        var appName = "open_games_playpen_" + environment;

        var echo = new EchoClient(
            appName,
            Enums.ApplicationType.WEB, 
            echoConf);

        if (window.bbccookies && !window.bbccookies.isAllowed("ckpf_whatever")) {
            //Call this method if the user has opted out of (performance) cookies
            echo.optOutOfCookies();
        }
        
        return echo;
    }
    
    
    return Stats;
});
