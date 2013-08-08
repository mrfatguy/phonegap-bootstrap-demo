var app = 
{
    initMode: false,
    modalDialogDisplayed: false,
    debugMode: window.tinyHippos != undefined,
    
    init: function()
	{
        app.initMode = true;
        
        document.addEventListener('deviceready', app.deviceReadyHandler, false);
    },
	
    deviceReadyHandler: function()
	{
        /**
         * Display so called loader. Will be hidden by last AJAX end -- see index.html.
         */
        $.blockUI();
        
        /**
         * Actual handler, to handle app's exits (back button press).
         * 
         * With fix for nasty bug of Ripple having deadly old PhoneGap 2.0.0 behind!
         */
        if(!app.debugMode) document.addEventListener("backbutton", app.backButtonHandler, true);
        
        /**
         * Battery-related and menu button press events handlers.
         * 
         * Used as real events in this application -- i.e. has some function.
         * 
         * Add <feature name="http://api.phonegap.com/1.0/battery"/> to your config.xml!
         */
        document.addEventListener('menubutton', app.menuButtonHandler, false);
        
        document.addEventListener('batterylow', app.batteryLowHandler, false);
        document.addEventListener('batterystatus', app.batteryStatusHandler, false);
        document.addEventListener('batterycritical', app.batteryCriticalHandler, false);
        
        /**
         * Demo purpose only events handlers.
         * 
         * Meaningless in this application, just throwing info to console / event log.
         */
        document.addEventListener('pause', app.pauseHandler, false);
        document.addEventListener('resume', app.resumeHandler, false);
        document.addEventListener('online', app.onlineHandler, false);
        document.addEventListener('offline', app.offlineHandler, false);
        document.addEventListener('searchbutton', app.searchButtonHandler, false);
        document.addEventListener('endcallbutton', app.endCallButtonHandler, false);
        document.addEventListener('volumeupbutton', app.volumeUpButtonHandler, false);
        document.addEventListener('startcallbutton', app.startCallButtonHandler, false);
        document.addEventListener('volumedownbutton', app.volumeDownButtonHandler, false);
        
        /**
         * Content translation and rendering.
         */
        ln.init();
        app.updatePhonegapTab();
    },
    
    /**
     * Menu button press event handler to display current language.
     */
    menuButtonHandler: function()
    {
        var message = i18n.t
        (
            'messages.menu',
            {
                code: ln.language.code,
                local: ln.language.local,
                language: ln.language.international
            }
        );

        apprise(message, {});
    },
	
    /**
     * Demo purpose only events.
     */
    pauseHandler: function(){app.writeEventLog('app.pauseHandler();');},
    resumeHandler: function(){app.writeEventLog('app.resumeHandler();');},
    onlineHandler: function(){app.writeEventLog('app.onlineHandler();');},
    offlineHandler: function(){app.writeEventLog('app.offlineHandler();');},
    searchButtonHandler: function(){app.writeEventLog('app.searchButtonHandler();');},
    endCallButtonHandler: function(){app.writeEventLog('app.endCallButtonHandler();');},
    startCallButtonHandler: function(){app.writeEventLog('app.startCallButtonHandler();');},
    volumeUpButtonHandler: function(){app.writeEventLog('app.volumeUpButtonHandler();');},
    volumeDownButtonHandler: function(){app.writeEventLog('app.volumeDownButtonHandler();');},
    
    /**
     * Battery-related events.
     */
    batteryLowHandler: function(info){console.log(info); app.batteryHandler('low', info);},
    batteryStatusHandler: function(info){console.log(info); app.batteryHandler('status', info);},
    batteryCriticalHandler: function(info){console.log(info); app.batteryHandler('critical', info);},
	
    /**
     * General battery handler, to handle battery status updates
     */
    batteryHandler: function(type, info)
	{
        console.log('batteryHandler for "' + type + '" state:');
        console.log(info);
            
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
        if(app.modalDialogDisplayed) return false;
        
        app.modalDialogDisplayed = true;
        
        apprise(i18n.t("messages.exit"), {'verify':true, 'textYes':i18n.t("messages.yes"), 'textNo':i18n.t("messages.no")}, function(r)
        {
            if(r)
            {
                app.modalDialogDisplayed = false;
                
                $('#btnCompassStop').click();
                $('#btnGeolocationStop').click();
                $('#btnAccelerationStop').click();

                navigator.app.exitApp();
            }
            else app.modalDialogDisplayed = false;
        });
    },
            
    checkConnection: function()
    {
        /**
         * Ripple Emulator (used in debugging) has very, very old PhoneGap 2.0.0 
         * behind and checks connection type from different object.
         * 
         * Change from navigator.network.connection to navigator.connection was introduced
         * in PhoneGap 2.2.0.
         */
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
        
        $('#currentLanguage').html(window.localStorage.getItem('settings.language'));
    },            
    
    isConnected: function()
    {
        /**
         * See note for app.checkConnection();
         */
        var networkState = ((navigator.connection) ? navigator.connection.type : ((navigator.network && navigator.network.connection) ? navigator.network.connection.type : 'unknown'));
        
        return networkState !== 'unknown' && networkState !== 'none';
    },
    
    openUrl: function(url)
    {
        window.open(url, '_system', 'location=yes');
    },
    
    ensureValue: function(value, unit)
    {
        var
            unit = unit || '',
            value = value || 0;
        
        return value.toString() + unit;
    },

    contentLoad: function()
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
        $("div.tab-pane").each(function()
        {
            var
                target = $(this),
                request = new XMLHttpRequest();
                
            if(typeof(target.attr("data-url")) === 'undefined') return true;

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

                        $('#' + target.attr("id")).i18n();

                        if(target.attr("data-url") === '_phonegap.html') app.updatePhonegapTab();

                        console.log('Loaded contents of "' + target.attr("data-url") + '" file into #' + target.attr("id") + ' tab!');
                        
                        app.initMode = false;
                    }
                    else
                    {
                        var errorMessage = 'Error when loading contents of "' + target.attr("data-url") + '" file into #' + target.attr("id") + ' tab: "Value of request.status is different than 200 or 0. File is probably missing, is not accessible or has an invalid filename".';
                        
                        console.log(errorMessage);
                        target.html(errorMessage);
                    }
                }
            };
            
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