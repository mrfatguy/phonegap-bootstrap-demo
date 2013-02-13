var app = 
{
    init: function()
	{
        document.addEventListener('deviceready', app.deviceReadyHandler, false);
    },
	
    deviceReadyHandler: function()
	{
		setTimeout(function()
		{
			navigator.splashscreen.hide();
		},
		1000);
    }
};

app.init();