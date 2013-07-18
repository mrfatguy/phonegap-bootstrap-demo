PhoneGap Demo Bootstrap
=======================
This is a simple PhoneGap application based on Twitter Bootstrap library. It should be ready for _PhoneGap Build_.

This demo contains or includes following things:

* Twitter Bootstrap itself and examples of using it,

* Font Awesome font library along with some cool examples,

* Some examples of using AJAX / JSON calls from PhoneGap application,

* Very cool and superb customizable digital display, purely in Javascript, from [3quarks.com](http://www.3quarks.com/en/SegmentDisplay/index.html),

* Simple theme (stylesheet switcher) allowing dynamic (client-side) look change plus all the free Bootstrap themes / styles from Bootswatch.com.

Use or fork it, if you want to see, how Bootstrap framework works and looks inside a mobile application or if you need a base app for building PhoneGap applications using Bootstrap.

To get started: fork this repo, modify the config.xml to match your needs, and go building!


Notice
------
For clarity of quite large code (many Bootstrap, Javascript and PhoneGap examples), one large HTML file (`index.html`) is split into three tabs. Contents of each tab are loaded via AJAX upon app's startup. It was proven, that on some devices (mostly Android 2.x.x) this can fail, with a system-level error message and immediate application shutdown.

Don't be confused with this, as such solution is meant for this demo only. In real-life application, that you will be designing, if you decide to split content into separate files, these will be separate pages (like main app windows, configuration, log, etc.), accessible via normal links, not AJAX loads. This way, they won't be affected by above mentioned problem.

You may leave AJAX-based conent load only, if you decide to drop support for Android 2.x.x entirely.