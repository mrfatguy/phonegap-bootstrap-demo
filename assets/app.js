var app = 
{
    init: function()
	{
        document.addEventListener('deviceready', app.deviceReadyHandler, false);
        
        app.translateApplication();
        
        app.writeEventLog('app.init();');
    },
	
    deviceReadyHandler: function()
	{
        /**
         * Actual handler, to handle app's exits.
         */
        document.addEventListener("backbutton", app.backButtonHandler, true);
        
        /**
         * Battery-related events.
         * 
         * Don't foreget about putting:
         * 
         * <feature name="http://api.phonegap.com/1.0/battery"/>
         * 
         * to your config.xml!
         */
        document.addEventListener('batterylow', app.batteryLowHandler, false);
        document.addEventListener('batterystatus', app.batteryStatusHandler, false);
        document.addEventListener('batterycritical', app.batteryCriticalHandler, false);
        
        /**
         * Demo purpose only events.
         */
        document.addEventListener('pause', app.pauseHandler, false);
        document.addEventListener('resume', app.resumeHandler, false);
        document.addEventListener('online', app.onlineHandler, false);
        document.addEventListener('offline', app.offlineHandler, false);
        document.addEventListener('menubutton', app.menuButtonHandler, false);
        document.addEventListener('searchbutton', app.searchButtonHandler, false);
        document.addEventListener('endcallbutton', app.endCallButtonHandler, false);
        document.addEventListener('startcallbutton', app.startCallButtonHandler, false);
        document.addEventListener('volumeupbutton', app.volumeUpButtonHandler, false);
        document.addEventListener('volumedownbutton', app.volumeDownButtonHandler, false);
        
		setTimeout(function()
		{
			navigator.splashscreen.hide();
		},
		1000);
        
        app.updatePhonegapTab();
        
        app.writeEventLog('app.deviceReadyHandler();');
    },
	
    /**
     * Demo purpose only events.
     */
    pauseHandler: function(){app.writeEventLog('app.pauseHandler();');},
    resumeHandler: function(){app.writeEventLog('app.resumeHandler();');},
    onlineHandler: function(){app.writeEventLog('app.onlineHandler();');},
    offlineHandler: function(){app.writeEventLog('app.offlineHandler();');},
    menuButtonHandler: function(){app.writeEventLog('app.menuButtonHandler();');},
    searchButtonHandler: function(){app.writeEventLog('app.searchButtonHandler();');},
    endCallButtonHandler: function(){app.writeEventLog('app.endCallButtonHandler();');},
    startCallButtonHandler: function(){app.writeEventLog('app.startCallButtonHandler();');},
    volumeUpButtonHandler: function(){app.writeEventLog('app.volumeUpButtonHandler();');},
    volumeDownButtonHandler: function(){app.writeEventLog('app.volumeDownButtonHandler();');},
    
    /**
     * Battery-related events.
     */
    batteryLowHandler: function(info){app.batteryHandler('low', info);},
    batteryStatusHandler: function(info){app.batteryHandler('status', info);},
    batteryCriticalHandler: function(info){app.batteryHandler('critical', info);},
	
    /**
     * General battery handler, to handle battery status updates
     */
    batteryHandler: function(type, info)
	{
        var
            status = (type === 'status' ? 'normal' : type),
            event = type.charAt(0).toUpperCase() + type.slice(1);
        
        $('#lblBatteryStatus').html(status);
        $('#lblBatteryLevel').html(info.level + '%');
        $('#lblBatteryPlugged').html((info.isPlugged) ? 'yes' : 'no');
        
        app.writeEventLog('app.battery' + event + 'Handler(level = ' + info.level +', isPlugged = ' + info.isPlugged + ');');
    },
	
    /**
     * Actual handler, to handle app's exits.
     */
    backButtonHandler: function()
	{
        app.writeEventLog('app.backButtonHandler();');
        
        apprise(i18n.t("messages.exit"), {'verify':true, 'textYes':i18n.t("messages.yes"), 'textNo':i18n.t("messages.no")}, function(r)
        {
            if(r)
            {
                app.writeEventLog('Aplication is shutting down!');

                navigator.app.exitApp();
            }
        });
    },
            
    checkConnection: function()
    {
        //Workaround for Ripple Emulator having very old PhoneGap (2.0.0) on-board...
        var networkState = ((navigator.connection) ? navigator.connection.type : ((navigator.network && navigator.network.connection) ? navigator.network.connection.type : 'unknown'));

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        return states[networkState];
    },
            
    updatePhonegapTab: function()
    {
        $('#connectionType').html(app.checkConnection());
    },            
    
    isConnected: function()
    {
        return !(navigator && navigator.connection && navigator.connection.type && navigator.connection.type === Connection.NONE);
    },
    
    openUrl: function(url)
    {
        window.open(url, '_system', 'location=yes');
    },
            
    translateApplication: function()
    {
        /**
         * Load application contents, Init translation engine and translate application.
         * 
         * Translation engine -- i18next: http://i18next.com/pages/doc_init.html
         */
        i18n.init
        ({
            lng: 'en-US',
            ns: 'general',
            useCookie: false,
            resGetPath: 'locales/__ns__.__lng__.json'
        }, function()
        {
            /**
             * Preload tabs' contents and then translate them...
             */
            $('body').i18n();

            $("div.tab-pane").each(function()
            {
                $(this).load($(this).attr("data-url"), function()
                {
                    console.log('Loaded contents of "' + $(this).attr("data-url") + '" file into #' + $(this).attr("id") + ' tab...');

                    $('#' + $(this).attr("id")).i18n();

                    app.updatePhonegapTab();
                });
            });
        });
    },
    
    writeEventLog: function(log)
    {
        var
            now = new Date(),
            logEntry = '[' + now.getTime() + '] ' + log;
        
        $('#eventLog').html($('#eventLog').html() + logEntry + "<br />");
        
        console.log('writeEventLog: ' + logEntry);
    },
            
    //https://gist.github.com/alunny/2380994  
    playAudio: function(file)
    {
            if(device.platform === 'Android') file = '/android_asset/www/' + file;
 
            var media = new Media(file, function(){}, function()
            {
                var errorMessage = 'app.playAudio() failed for "' + file + '"!';
                
                app.writeEventLog(errorMessage);
                apprise(errorMessage, {});
            });
 
            media.play();
    }
};

app.init();