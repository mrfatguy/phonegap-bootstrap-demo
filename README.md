PhoneGap Demo Bootstrap
=======================
This is a simple PhoneGap application based on Twitter Bootstrap library. It should be ready for _PhoneGap Build_. Use or fork it, if you want to see, how Bootstrap framework works and looks inside a mobile application or if you need a base app for building PhoneGap applications using Bootstrap.


Important notice
----------------
This project is written, using nearly-newest [PhoneGap 2.9.0 API](http://docs.phonegap.com/en/2.9.0/index.html), while Ripple Emulator has very old [2.0.0 API](http://docs.phonegap.com/en/2.0.0/index.html) behind, so it **some parts of this demo will not work in desktop computer browser**, even if you run it with Ripple Emulator. You have to compile it and test it on mobile device, if you want to see all implemented things in action.

Battery demo part has some unfixed bugs and is not working. Reffer to my [pg-demo-battery project](https://github.com/trejder/pg-demo-battery) to see this fixed.

Plus, it uses AJAX loading of key parts (tab contents), which may fail in certain situations (on some browsers and devices, including desktop computers and mobile devices). It sounded like a good idea, when I first time designed it, but finally it turned out to be not so cool and causing some problems, especially on some old hardware (Android 2.x).

In general, I dropped this project, because it turned out, that apps written with Bootstrap are very, very slow on most mobile devices with Android. This project was planned as base for all my apps, but I abandoned this idea for performance reasons. Right now, I'm building all my apps from scratch, without using Bootstrap or any other framework, as they turn out to be too much for PhoneGap-based apps.


Includes
--------
This demo contains or includes following things:

* Twitter Bootstrap itself and examples of using it,

* Font Awesome font library along with some cool examples,

* Some examples of using AJAX / JSON calls from PhoneGap application,

* Very cool and superb customizable digital display, purely in Javascript, from [3quarks.com](http://www.3quarks.com/en/SegmentDisplay/index.html).

* Simple theme (stylesheet switcher) allowing dynamic (client-side) look change plus all the free Bootstrap themes / styles from Bootswatch.com.

* Multi-language, application auto-translation system, based on [i18next](http://i18next.com/) library. Some example locales (English, Polish, German and Chinese) included.

* Heavily modified version of [Boostrap Slider](http://www.eyecon.ro/bootstrap-slider/). My modifications includes theming (slider will adapt to any Bootswatch style), adding some new features and fixing many small bugs.

As you can see, there are a lot of things here, which makes application big and slow. In most projects, however, you'll only need part of them, so don't worry. This is only an example.


Tests
-----
Tested on five different devices and five Android versions:

- Sony Xperia E with Android 4.1.1,
- GSmart Rola G1317D with Android 2.2.2.
- Kiano Core 10.1 tablet with Android 4.1.1,
- LG GT540 with Android 2.3.3 and CyanogenMod 7,
- Samsung Galaxy Nexus with Android 4.3 (previously on 4.2.2).

Seems fine on all of them (see below notice for devices with Android 2.x on-board).


Notice
------
For clarity of quite large code (many Bootstrap, Javascript and PhoneGap examples), one large HTML file (`index.html`) is split into three tabs. Contents of each tab are loaded via AJAX upon app's startup. It was proven, that on some devices (mostly Android 2.x.x) this can fail, with a system-level error message and immediate application shutdown.

Don't be confused with this, as such solution is meant for this demo only. In real-life application, that you will be designing, if you decide to split content into separate files, these will be separate pages (like main app windows, configuration, log, etc.), accessible via normal links, not AJAX loads. This way, they won't be affected by above mentioned problem.

You may leave AJAX-based conent load only, if you decide to drop support for Android 2.x.x entirely.
