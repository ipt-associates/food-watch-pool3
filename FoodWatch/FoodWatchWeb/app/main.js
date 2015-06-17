requirejs.config({
    timeout: 0,
    paths: {
        'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
        'durandal': '../bower_components/durandal/js',
        'jquery': '../bower_components/jquery-1.11.1/dist/jquery.min',
        'expander': '../bower_components/jquery-expander/jquery.expander.min',
        'knockout': '../bower_components/knockout/dist/knockout',
        'plugins': '../bower_components/durandal/js/plugins',
        'kodelegated': '../bower_components/knockout-delegatedEvents/build/knockout-delegatedEvents.min',
        'async': '../bower_components/requirejs-plugins/src/async',
        'goog': '../bower_components/requirejs-plugins/src/goog',
        'text': '../bower_components/requirejs-text/text',
        'moment': '../bower_components/moment/min/moment.min',
        'propertyParser': '../bower_components/requirejs-plugins/src/propertyParser',
        'transitions': '../bower_components/durandal/js/transitions'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        },
        'expander': ['jquery']
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'knockout', 'jquery', 'bootstrap', 'kodelegated', 'expander'], function (system, app, viewLocator) {

    "use strict";

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Food Watch Pool 3';

    //specify which plugins to install and their configuration
    app.configurePlugins({
        router: true,
        dialog: true,
        widget: {
            kinds: ['expander']
        }
    });



    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot('shell');
    });

});