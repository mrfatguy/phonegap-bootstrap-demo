var app = 
{
    init: function()
	{
        document.addEventListener('deviceready', app.deviceReadyHandler, false);
        
        //Fix for nasty bug of Ripple not firing events!
        if(typeof('ripple') !== 'undefined') app.deviceReadyHandler();
    },
	
    deviceReadyHandler: function()
	{
        app.translateApplication();
        
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
            //Fix for nasty bug of Ripple having deadly old PhoneGap 2.0.0 behind!
			if(typeof('ripple') === 'undefined') navigator.splashscreen.hide();
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
                
                $('#btnCompassStop').click();
                $('#btnGeolocationStop').click();
                $('#btnAccelerationStop').click();

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
        console.log('BEGIN app.translateApplication();');
        
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
             * 
             * We're NOT using jQuery.fn.load(), but our own function. This is required
             * in any PhoneGap application, that loads data from local files via AJAX,
             * to handle request.status === 0, which is not handled by jQuery.fn.load().
             * 
             * Without this fix, loading local files in Android 2.x.x platform fails.
             * 
             * Details are discussed in Simon Mac Donald's blog (closer to end):
             * 
             * http://simonmacdonald.blogspot.com/2011/12/on-third-day-of-phonegapping-getting.html
             */
            $('body').i18n();
            
            console.log('END app.translateApplication();');
            
            app.contentLoad();
        });
    },
    
    contentLoad: function()
    {
        var tabNum = 0,
            tabCount = $("div.tab-pane").size();
    
        console.log('BEGIN app.contentLoad();');
        
        $("div.tab-pane").each(function()
        {
            var
                target = $(this),
                request = new XMLHttpRequest();

            request.open('GET', target.attr("data-url"), true);

            request.onerror = function(e)
            {
                target.html('Attempt to load contents of "' + target.attr("data-url") + '" file into #' + target.attr("id") + ' tab caused an error: "' + e.target.status + '".');
            };

            request.onreadystatechange = function()
            {
                if(request.readyState === 4)
                {
                    if(request.status === 200 || request.status === 0)
                    {
                        target.html(request.responseText);

                        console.log('$(#' + target.attr("id") + ').i18n();');
                        $('#' + target.attr("id")).i18n();

                        if(target.attr("data-url") === '_phonegap.html') app.updatePhonegapTab();

                        console.log('Loaded contents of #' + target.attr("id") + ' tab!');
                        
                        tabNum++;
                        if(tabNum === tabCount) console.log('END app.contentLoad();');
                    }
                    else target.html('Attempt to load contents of "' + target.attr("data-url") + '" file into #' + target.attr("id") + ' tab caused an error: "request.status is different than 200 or 0".');
                }
            };
            
            console.log('Loading contents of "' + target.attr("data-url") + '" file into #' + target.attr("id") + ' tab!');
            request.send();
        });  
    },
    
    writeEventLog: function(log)
    {
        var
            now = new Date(),
            logEntry = '[' + now.getTime() + '] ' + log;
        
        $('#eventLog').html($('#eventLog').html() + logEntry + "<br />");
        
        console.log(logEntry);
    },
            
    
    playAudio: function(file)
    {
        /**
         * Fix for Android platform
         * 
         * https://gist.github.com/alunny/2380994
         */
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