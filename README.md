# PhoneGap + Bootstrap Demo

This is a simple PhoneGap application based on Twitter Bootstrap 2.3.x library. It should be ready to compile through [PhoneGap Build](http://build.phonegap.com). Use or fork it, if you want to see, how Bootstrap 2.3.x styled apps works & looks inside a mobile apps or if you need a base app for building PhoneGap applications with Bootstrap.

## Important notices, before you start

**I dropped this project, because it turned out, that apps written with Bootstrap are very, very slow on most mobile devices with Android. This project was planned as base for all my apps, but I abandoned this idea for performance reasons. Right now, I'm building all my apps from scratch, without using Bootstrap or any other framework, as I haven't found any with good performance in PhoneGap apps. Should you find one of such, drop me a line at _tomasz_ at _trejderowski_ period _pl_ or open a new issue.**

This project is written, using [PhoneGap 2.9.0 API](http://docs.phonegap.com/en/2.9.0/index.html), while Ripple Emulator has very old [2.0.0 API](http://docs.phonegap.com/en/2.0.0/index.html) behind, so it **some parts of this demo will not work in desktop computer browser**, even if you run it with Ripple Emulator. You have to compile it and test it on mobile device, if you want to see all implemented things in action.

Battery demo has some bugs and isn't working. For working example, refer to my _PhoneGap Battery Events Demo_, somewhere around.

This demo / application uses AJAX for loading key parts (tab contents). This may fail in certain situations. It sounded like a good idea, when I first time designed it, but finally it turned out to be causing some problems. Especially on some old hardware (Android 2.x) and old mobiles browsers. See _AJAX Problems_ section below for more information.

## Includes

This demo contains or includes following things:

* [Twitter Bootstrap 2.3.x](http://getbootstrap.com/2.3.2/) and examples of using it,

* [Font Awesome](http://fortawesome.github.io/Font-Awesome/) library along with some cool examples,

* some examples of using AJAX / JSON calls from PhoneGap application,

* nice looking and very customizable [pure Javascript digital display](http://www.3quarks.com/en/SegmentDisplay/index.html) from _3quarks.com_,

* simple theme (stylesheet switcher) allowing dynamic (client-side) look change plus all free [Bootswatch](http://bootswatch.com/) themes,

* multi-language, application auto-translation system, based on [i18next](http://i18next.com/) library plus some example locales (English, Polish, German and Chinese),

* heavily modified version of [Boostrap Slider](http://www.eyecon.ro/bootstrap-slider/); modifications includes theming (slider will adapt to any Bootswatch style), adding some new features and fixing many small bugs.

As you can see, there are a lot of things here, which makes application big, clunky and slow. In most projects, however, you'll only need part of them, so don't worry. This is only an example.

# AJAX Problems

For clarity of quite large code (many Bootstrap, Javascript and PhoneGap examples), one large HTML file (`index.html`) is split into tabs. Contents of each tab are loaded via AJAX upon app's startup. It was proven, that on some devices (mostly Android 2.x.x) this can fail, with a system-level error message and immediate application shutdown.

Don't be confused with this, as such solution is meant for this demo only. In real-life application, that you will be designing, if you decide to split content into separate files, these will be separate pages (like main app windows, configuration, log, etc.), accessible via normal links, not AJAX loads. This way, they won't be affected by above mentioned problem.

Note, that you may leave AJAX-based conent loading, if you decide to drop support for Android 2.x.x entirely.

# Tests

This application was tested on five different devices and five Android versions:

- Sony Xperia E with Android 4.1.1,
- GSmart Rola G1317D with Android 2.2.2,
- Kiano Core 10.1 tablet with Android 4.1.1,
- LG GT540 with Android 2.3.3 and CyanogenMod 7,
- Samsung Galaxy Nexus with Android 4.3 (previously on 4.2.2).

Seems fine on all of them (see notice for devices with Android 2.x on-board).

Tested **only** as compiled through [PhoneGap Build](http://build.phonegap.com). Never compiled locally or tested after such build.

# TO-DO

The only thing, that is left, is a test-add of ads from inMobi. The InMobi Developers Wiki's article "[Integrating Using InMobi JavaScript SDK](http://developer.inmobi.com/wiki/index.php?title=Integrating_Using_JavaScript_Ad_Code)" may be useful, especially last section, titled "[Utilizing Geolocation](http://developer.inmobi.com/wiki/index.php?title=Integrating_Using_JavaScript_Ad_Code#Utilizing_Geolocation)".