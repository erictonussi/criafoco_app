'use strict';

angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.services',
  'ngMaterial',
  'ngCordova',
  'pascalprecht.translate',
  'LocalStorageModule',
  'ngOpenFB',
  'ion-floating-menu'
])

.run(function ($ionicPlatform, $translate, $cordovaGlobalization, $state, $rootScope, ngFB, Config) {
    ngFB.init({appId: Config.ENV.facebook.appId});

    function getSuitableLanguage(language) {
        for (var index = 0; index < Config.ENV.languages.available.length; index++) {
            if (Config.ENV.languages.available[index] === language) {
                return Config.ENV.languages.available[index];
            }
        }

        return Config.ENV.languages.default
    }

    function setApplicationLanguage() {
        if (typeof navigator.globalization !== "undefined") {
            $cordovaGlobalization.getPreferredLanguage().then(function (result) {
                var language = getSuitableLanguage(result.value);
                $translate.use(language);
            });
        }
    }

    function createCustomStyle(stateName) {
        var customStyle = "";

        if (stateName == "tab.facts") {
            customStyle = ".bar.bar-custom, .bar.bar-custom .button {border-color: #b71c1c; background-color: #b53926; color: #fff}";
            customStyle += ".bar.bar-custom {background-image: linear-gradient(0deg, #b71c1c, #b71c1c 50%, transparent 50%)}";
            customStyle += "ion-tabs.tabs-color-active-positive .tab-item.tab-item-active {color: #b53926}";
            customStyle += "ion-tabs.tabs-striped.tabs-color-active-positive .tab-item.tab-item-active {border-color: #b53926; color: #b53926}";
            customStyle += ".md-button.md-primary.md-fab {background-color: #b71c1c}";
            customStyle += ".md-button.md-primary.md-fab:not([disabled]):hover {background-color: #b71c1c}";
            customStyle += ".md-button.md-warn.md-fab {background-color: #d50000}";
            customStyle += ".md-button.md-warn.md-fab:not([disabled]):hover {background-color: #d50000}";
        } else if (stateName == "tab.notes") {
            customStyle = ".bar.bar-custom, .bar.bar-custom .button {border-color: #303f9f; background-color: #086cb3; color: #fff}";
            customStyle += ".bar.bar-custom {background-image: linear-gradient(0deg, #303f9f, #303f9f 50%, transparent 50%)}";
            customStyle += "ion-tabs.tabs-color-active-positive .tab-item.tab-item-active {color: #086cb3}";
            customStyle += "ion-tabs.tabs-striped.tabs-color-active-positive .tab-item.tab-item-active {border-color: #086cb3; color: #086cb3}";
            customStyle += ".md-button.md-primary.md-fab {background-color: #303f9f}";
            customStyle += ".md-button.md-primary.md-fab:not([disabled]):hover {background-color: #303f9f}";
            customStyle += ".md-button.md-warn.md-fab {background-color: #303f9f}";
            customStyle += ".md-button.md-warn.md-fab:not([disabled]):hover {background-color: #303f9f}";
        } else if (stateName == "tab.creation") {
            customStyle = ".bar.bar-custom, .bar.bar-custom .button {border-color: #dbab52; background-color: #ebc57e; color: #fff}";
            customStyle += ".bar.bar-custom {background-image: linear-gradient(0deg, #dbab52, #dbab52 50%, transparent 50%)}";
            customStyle += "ion-tabs.tabs-color-active-positive .tab-item.tab-item-active {color: #ebc57e}";
            customStyle += "ion-tabs.tabs-striped.tabs-color-active-positive .tab-item.tab-item-active {border-color: #ebc57e; color: #ebc57e}";
            customStyle += ".md-button.md-primary.md-fab {background-color: #dbab52}";
            customStyle += ".md-button.md-primary.md-fab:not([disabled]):hover {background-color: #dbab52}";
            customStyle += ".md-button.md-warn.md-fab {background-color: #dbab52}";
            customStyle += ".md-button.md-warn.md-fab:not([disabled]):hover {background-color: #dbab52}";
        } else if (stateName == "tab.usage") {
            customStyle = ".bar.bar-custom, .bar.bar-custom .button {border-color: #088b85; background-color: #18a69f; color: #fff}";
            customStyle += ".bar.bar-custom {background-image: linear-gradient(0deg, #088b85, #088b85 50%, transparent 50%)}";
            customStyle += "ion-tabs.tabs-color-active-positive .tab-item.tab-item-active {color: #18a69f}";
            customStyle += "ion-tabs.tabs-striped.tabs-color-active-positive .tab-item.tab-item-active {border-color: #18a69f; color: #18a69f}";
            customStyle += ".md-button.md-primary.md-fab {background-color: #088b85}";
            customStyle += ".md-button.md-primary.md-fab:not([disabled]):hover {background-color: #088b85}";
            customStyle += ".md-button.md-warn.md-fab {background-color: #088b85}";
            customStyle += ".md-button.md-warn.md-fab:not([disabled]):hover {background-color: #088b85}";
        } else if (stateName == "tab.script") {
            customStyle = ".bar.bar-custom, .bar.bar-custom .button {border-color: #e16205; background-color: #f27921; color: #fff}";
            customStyle += ".bar.bar-custom {background-image: linear-gradient(0deg, #e16205, #e16205 50%, transparent 50%)}";
            customStyle += "ion-tabs.tabs-color-active-positive .tab-item.tab-item-active {color: #f27921}";
            customStyle += "ion-tabs.tabs-striped.tabs-color-active-positive .tab-item.tab-item-active {border-color: #f27921; color: #f27921}";
            customStyle += ".md-button.md-primary.md-fab {background-color: #e16205}";
            customStyle += ".md-button.md-primary.md-fab:not([disabled]):hover {background-color: #e16205}";
            customStyle += ".md-button.md-warn.md-fab {background-color: #e16205}";
            customStyle += ".md-button.md-warn.md-fab:not([disabled]):hover {background-color: #e16205}";
        }

        return customStyle;
    }

    $ionicPlatform.ready(function () {
        setApplicationLanguage();

        if (window.cordova && window.cordova.plugins) {
            // Hide the accessory bar by default
            if (window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
        }

        if (window.StatusBar && ionic.Platform.isAndroid()) {
            StatusBar.backgroundColorByHexString("#1c3aa9");
        }

        $rootScope.customStyle = createCustomStyle($state.current.name);

        $rootScope.$on('$ionicView.beforeEnter', function () {
            $rootScope.customStyle = createCustomStyle($state.current.name);

            if (window.StatusBar && ionic.Platform.isAndroid()) {
                switch ($state.current.name) {
                    case 'tab.facts':
                        StatusBar.backgroundColorByHexString("#b53926");
                        break;
                    case 'tab.notes':
                        StatusBar.backgroundColorByHexString("#086cb3");
                        break;
                    case 'tab.creation':
                        StatusBar.backgroundColorByHexString("#ebc57e");
                        break;
                    case 'tab.usage':
                        StatusBar.backgroundColorByHexString("#18a69f");
                        break;
                    case 'tab.script':
                        StatusBar.backgroundColorByHexString("#f27921");
                        break;
                    default: StatusBar.backgroundColorByHexString("#1c3aa9");
                        break;
                }
            }

            if ($state.current.name.includes('tab.') && $rootScope.projeto) {
                $rootScope.disableTabNotes = true;
                $rootScope.disableTabCreation = true;
                $rootScope.disableTabUsage = true;
                $rootScope.disableTabScript = true;

                var fase = $rootScope.projeto.fase;

                if (fase == 'note') {
                    $rootScope.disableTabNotes = false;
                } else if (fase == 'creation') {
                    $rootScope.disableTabNotes = false;
                    $rootScope.disableTabCreation = false;
                } else if (fase == 'usage') {
                    $rootScope.disableTabNotes = false;
                    $rootScope.disableTabCreation = false;
                    $rootScope.disableTabUsage = false;
                } else if (fase == 'script') {
                    $rootScope.disableTabNotes = false;
                    $rootScope.disableTabCreation = false;
                    $rootScope.disableTabUsage = false;
                    $rootScope.disableTabScript = false;
                }
            }
        });
    });

    $ionicPlatform.registerBackButtonAction(function(event) {
        if ($state.current.name == 'welcome' || $state.current.name.includes('tab.')) {
            navigator.app.exitApp();
        } else {
            navigator.app.backHistory();
        }
    }, 100);
})

// Internationalize and Localize
.config(function ($translateProvider, Config) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage(Config.ENV.languages.default);

    $translateProvider.useSanitizeValueStrategy('escapeParameters');
})

// Ionic configurations
.config(['$ionicConfigProvider', function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.text("");
}])

// Local Storage
.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('criafoco');
}])

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.views.transition('android');
    $ionicConfigProvider.tabs.style('android').position('top');
}])

// Router
.config(function ($stateProvider, $urlRouterProvider, Config) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('welcome', {
            url: '/',
            templateUrl: 'main/components/welcome/html/welcome.html',
            controller: 'WelcomeCtrl'
        })
        .state('start', {
            cache: false,
            url: '/start',
            templateUrl: 'main/components/start/html/start.html',
            controller: 'StartCtrl'
        })
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'main/components/tab/html/tab.html',
            controller: 'TabsCtrl'
        })
        .state('tab.facts', {
            cache: false,
            url: '/facts',
            views: {
                'tab-facts': {
                    templateUrl: 'main/components/tab/html/tab-facts.html',
                    controller: 'TabFactsCtrl'
                }
            }
        })
        .state('tab.notes', {
            cache: false,
            url: '/notes',
            views: {
                'tab-notes': {
                    templateUrl: 'main/components/tab/html/tab-notes.html',
                    controller: 'TabNotesCtrl'
                }
            }
        })
        .state('tab.creation', {
            cache: false,
            url: '/creation',
            views: {
                'tab-creation': {
                    templateUrl: 'main/components/tab/html/tab-creation.html',
                    controller: 'TabCreationCtrl'
                }
            }
        })
        .state('tab.usage', {
            cache: false,
            url: '/usage',
            views: {
                'tab-usage': {
                    templateUrl: 'main/components/tab/html/tab-usage.html',
                    controller: 'TabUsageCtrl'
                }
            }
        })
        .state('tab.script', {
            cache: false,
            url: '/script',
            views: {
                'tab-script': {
                    templateUrl: 'main/components/tab/html/tab-script.html',
                    controller: 'TabScriptCtrl'
                }
            }
        })
        .state('manager', {
            url: '/manager',
            templateUrl: 'main/components/manager/html/manager.html',
            controller: 'ManagerCtrl'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'main/components/manager/html/profile.html',
            controller: 'ProfileCtrl'
        })
        .state('archive', {
            url: '/archive',
            templateUrl: 'main/components/manager/html/archive.html',
            controller: 'ArchiveCtrl'
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(Config.ENV.startPage.url);
});
