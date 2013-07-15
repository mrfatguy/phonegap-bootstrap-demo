var app = 
{
    init: function()
	{
        document.addEventListener('deviceready', app.deviceReadyHandler, false);
    },
	
    deviceReadyHandler: function()
	{
        document.addEventListener("backbutton", app.backButtonHandler, true);
        
		setTimeout(function()
		{
			navigator.splashscreen.hide();
		},
		1000);
    },
	
    backButtonHandler: function()
	{
        apprise(i18n.t("messages.exit"), {'verify':true, 'textOk':i18n.t("messages.yes"), 'textCancel':i18n.t("messages.no")}, function(r)
        {
            if(r) navigator.app.exitApp();
        });
    }
};

app.init();