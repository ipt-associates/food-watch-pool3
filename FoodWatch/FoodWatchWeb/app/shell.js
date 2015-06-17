define(function (require) {

    "use strict";

    var router = require('plugins/router');

    return {
        router: router,
        activate: function () {
            return router.map([
                { route: ['', 'home', 'welcome'], moduleId: 'welcome', title: 'Home' },
                { route: 'results', moduleId: 'results', title: 'Results' },
                { route: 'details/:id', moduleId: 'details', title: 'Recall Details' },
                { route: 'about', moduleId: 'about', title: 'About' },
                { route: 'comingSoon', moduleId: 'comingSoon', title: 'Coming Soon' }
            ]).buildNavigationModel()
              .mapUnknownRoutes('home', 'not-found')
              .activate();
        }
    }
});