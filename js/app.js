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
		//Don't force programmatic application exit ever or your app won't be published to Apple Store!
        navigator.notification.confirm
		(
            'Are you sure, you want to exit?', //Message body.
            app.onExitConfirm, //Callback after button is tapped.
            'Exit application?', //Message title.
            'Exit,Stay'//Buttons -- Will be shown in reversed order!
        );
    },
	
	onExitConfirm: function(button)
	{
		//Don't force programmatic application exit ever or your app won't be published to Apple Store!
		if (button == 1) navigator.app.exitApp();
	}
};

app.init();