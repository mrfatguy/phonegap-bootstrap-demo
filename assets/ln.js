var ln = 
{
    language:
    {
        code: '',
        local: 'English',
        international: '',
        fromLocalStorage: false
    },
    
    init: function()
	{
        /**
         * Check, if user has language stored in localStorage and use it, if so.
         */
        var storedLanguage = window.localStorage.getItem('settings.language');
        
        if(storedLanguage !== null)
        {
            ln.language.local = storedLanguage;
            ln.language.code = ln.localLanguageNameToISOCode(storedLanguage);
            ln.language.international = ln.localLanguageNameToEnglishName(storedLanguage);
            
            ln.updateLanguageSelector(storedLanguage);
            
            ln.language.fromLocalStorage = true;
        }
        
        /**
         * i18next -- http://i18next.com/
         * 
         * Upon init, application is pre-translated to default language (see above)
         * to not leave user with some dully "button.website"-like strings (if something
         * would go wrong). Right after init, application attempts to read language
         * currently set in system (see app.getLanguage() below) and then does another
         * translation, this time with actually selected language.
         */
        i18n.init
        ({
            lng: ln.localLanguageNameToISOCode(ln.language.local),
            ns: 'general',
            useCookie: false,
            fallbackLng: 'en',
            resGetPath: 'locales/__ns__.__lng__.json'
        }, function()
        {
            $('body').i18n();
            
            ln.getLanguage();
        });
    },
    
    getLanguage: function()
    {
        if(!ln.language.fromLocalStorage)
        {
            //Fix for nasty bug of Ripple having deadly old PhoneGap 2.0.0 behind!
            if(!app.debugMode)
            {
                navigator.globalization.getPreferredLanguage
                (
                    function(lang)
                    {
                        ln.setLanguage(lang.value);
                    },
                    function(){}
                );
            }
            else ln.setLanguage(ln.language.local);
        }
        else if(app.initMode) app.contentLoad();
    },
    
    setLanguage: function(lang)
    {
        ln.language.local = lang;
        ln.language.code = ln.localLanguageNameToISOCode(lang);
        ln.language.international = ln.localLanguageNameToEnglishName(lang);
                    
        i18n.setLng(ln.language.code, function()
        {
            $('body').i18n();
            
            app.updatePhonegapTab();
            ln.updateLanguageSelector(lang);
            
            window.localStorage.setItem('settings.language', lang);
            
            if(app.initMode) app.contentLoad();
        });
    },
    
    removeLanguageSetting: function()
    {
        window.localStorage.removeItem('settings.language');
        
        app.updatePhonegapTab();
    }, 
    
    updateLanguageSelector: function(lang)
    {
        $('.change-language-menu-item').css('font-weight', 'normal').find('i').removeClass('icon-arrow-right');
        $('.change-language-menu-item[data-language=' + lang + ']').css('font-weight', 'bold').find('i').addClass('icon-arrow-right');
    },

    localLanguageNameToISOCode: function(lang)
    {
        var
            dict = {},
            llang = lang.toLocaleLowerCase(),
            code = lang.toLocaleLowerCase().substring(0, 2);

        /**
         * Fix certain languages' codes
         * 
         * JavaScript escapes: http://www.rishida.net/tools/conversion/
         * More languages (ISO 639-1 codes): http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
         */
        dict["bahasa indonesia"] = "id"; //Indonesian
        dict["indonesian"] = "id"; //Indonesian
        dict["bahasa melayu"] = "ms"; //Malay
        dict["bosnian"] = "bs"; //Bosnian
        dict["filipino"] = "fil"; //Filipino
        dict["galego"] = "gl"; //Galician
        dict["\u00EDslenska"] = "is"; //Icelandic
        dict["javanese"] = "jv"; //Javanese
        dict["latvie\u0161u"] = "lv"; //Latvian
        dict["lietuvi\u0173"] = "lt"; //Lithuanian
        dict["magyar"] = "hu"; //Hungarian
        dict["nederlands"] = "nl"; //Dutch
        dict["norsk bokm\u00E5l"] = "nb"; //Norwegian Bokmal
        dict["polski"] = "pl"; //Polish
        dict["portugu\u00EAs"] = "pt"; //Portuguese
        dict["shqipe"] = "sq"; //Albanian
        dict["sloven\u010Dina"] = "sk"; //Slovak
        dict["suomi"] = "fi"; //Finnish
        dict["tagalog"] = "tl"; //Tagalog
        dict["t\u00FCrk\u00E7e"] = "tr"; //Turkish
        dict["ti\u1EBFng vi\u1EC7t"] = "vi"; //Vietnamese
        dict["\u010De\u0161tina"] = "cs"; //Czech
        dict["\u049B\u0430\u0437\u0430\u049B"] = "kk"; //Kazakh
        dict["\u043C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438"] = "mk"; //Macedonian
        dict["\u03B5\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC"] = "el"; //Modern Greek
        dict["\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438"] = "bg"; //Bulgarian
        dict["\u0440\u0443\u0441\u0441\u043A\u0438\u0439"] = "ru"; //Russian
        dict["\u0441\u0440\u043F\u0441\u043A\u0438"] = "sr"; //Serbian
        dict["\u092E\u0930\u093E\u0920\u0940"] = "mr"; //Marathi
        dict["\u0443\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430"] = "uk"; //Ukrainian
        dict["\u05E2\u05D1\u05E8\u05D9\u05EA"] = "he"; //Modern Hebrew
        dict["\u0627\u0644\u0639\u0631\u0628\u064A\u0629"] = "ar"; //Arabic
        dict["\u0641\u0627\u0631\u0633\u06CC"] = "fa"; //Persian
        dict["\u0E44\u0E17\u0E22"] = "th"; //Thai
        dict["\u4E2D\u6587"] = "zh"; //Chinese
        dict["\u65E5\u672C\u8A9E"] = "ja"; //Japanese
        dict["\uD55C\uAD6D\uC5B4"] = "ko"; //Korean

        for(key in dict)
        {
            if(dict.hasOwnProperty(key))
            {
                if(key === llang) code = dict[key];
            }
        }

        return code;
    },

    localLanguageNameToEnglishName: function(lang)
    {
        var
            dict = {},
            llang = lang.toLocaleLowerCase();

        /**
         * Fix certain languages' codes
         * 
         * JavaScript escapes: http://www.rishida.net/tools/conversion/
         * More languages: http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
         */
        dict["bahasa indonesia"] = "Indonesian";
        dict["indonesian"] = "Indonesian";
        dict["bahasa melayu"] = "Malay";
        dict["bosnian"] = "Bosnian";
        dict["filipino"] = "Filipino";
        dict["galego"] = "Galician";
        dict["\u00EDslenska"] = "Icelandic";
        dict["javanese"] = "Javanese";
        dict["latvie\u0161u"] = "Latvian";
        dict["lietuvi\u0173"] = "Lithuanian";
        dict["magyar"] = "Hungarian";
        dict["nederlands"] = "Dutch";
        dict["norsk bokm\u00E5l"] = "Norwegian Bokm\u00E5l";
        dict["polski"] = "Polish";
        dict["portugu\u00EAs"] = "Portuguese";
        dict["shqipe"] = "Albanian";
        dict["sloven\u010Dina"] = "Slovak";
        dict["suomi"] = "Finnish";
        dict["tagalog"] = "Tagalog";
        dict["t\u00FCrk\u00E7e"] = "Turkish";
        dict["ti\u1EBFng vi\u1EC7t"] = "Vietnamese";
        dict["\u010De\u0161tina"] = "Czech";
        dict["\u049B\u0430\u0437\u0430\u049B"] = "Kazakh";
        dict["\u043C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438"] = "Macedonian";
        dict["\u03B5\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC"] = "Modern Greek";
        dict["\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438"] = "Bulgarian";
        dict["\u0440\u0443\u0441\u0441\u043A\u0438\u0439"] = "Russian";
        dict["\u0441\u0440\u043F\u0441\u043A\u0438"] = "Serbian";
        dict["\u092E\u0930\u093E\u0920\u0940"] = "Marathi";
        dict["\u0443\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430"] = "Ukrainian";
        dict["\u05E2\u05D1\u05E8\u05D9\u05EA"] = "Modern Hebrew";
        dict["\u0627\u0644\u0639\u0631\u0628\u064A\u0629"] = "Arabic";
        dict["\u0641\u0627\u0631\u0633\u06CC"] = "Persian";
        dict["\u0E44\u0E17\u0E22"] = "Thai";
        dict["\u4E2D\u6587"] = "Chinese";
        dict["\u65E5\u672C\u8A9E"] = "Japanese";
        dict["\uD55C\uAD6D\uC5B4"] = "Korean";

        for(key in dict)
        {
            if(dict.hasOwnProperty(key))
            {
                if(key === llang) lang = dict[key];
            }
        }

        return lang;
    }
};