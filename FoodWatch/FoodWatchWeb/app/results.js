define(function (require) {
    $ = require('jquery'),
    ko = require('knockout'),
    moment = require('moment'),
    dialog = require('plugins/dialog');
    require('goog!visualization,1,packages:[geochart]');
    require('async!http://maps.google.com/maps/api/js?key=AIzaSyCyXJ3myVx6K8Iv9bgdxJcS17H3X4z9ScE!callback');

    var states = ["AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "FM", "GA",
        "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MP",
        "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN",
        "TX", "UM", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];

    var results = ko.observableArray(),
        resultsSummary = ko.observableArray(),
        limit = ko.observable(),
        skip = ko.observable(),
        total = ko.observable(),
        startPossition = ko.pureComputed(function () { 
            if (total() > 0) {
                return (skip() + 1);
            } else {
                return 0;
            };
        }),
        map,
        markers = [],
        active = false,
        resultsType = ko.observable('recent'),
        searchFood = ko.observable(''),
        searchVendor = ko.observable(''),
        searchState = ko.observable('');


    function search(recent, next, previous) {

        var self = this;
        var url = 'https://api.fda.gov/food/enforcement.json?api_key=HlA31zEdViNanxLQKZmMhpeSEF3Ks8V7NDGuAGwC&limit=10';

        url += '&search=';
        var first = true;
        if (recent) {
            var start = moment().subtract(60, 'days').format('YYYY-MM-DD');
            var end = moment().add(14, 'days').format('YYYY-MM-DD');
            var range = '[' + start + '+TO+' + end + ']'
            if (!first) {
                url += '+AND+';
            }
            url += 'report_date:' + range;
            first = false;
        }
        if (searchFood().length > 0) {
            if (!first) {
                url += '+AND+';
            }
            url += 'product_description:' + searchFood();
            first = false;
        }
        if (searchVendor().length > 0) {
            if (!first) {
                url += '+AND+';
            }
            url += 'recalling_firm:' + searchVendor();
            first = false;
        }
        if (searchState()) {
            if (!first) {
                url += '+AND+';
            }
            url += 'distribution_pattern:' + searchState();
            first = false;
        }

        var url2 = url + "&count=classification.exact";
        if (next) {
            url += '&skip=' + (skip() + limit());
        }
        if (previous) {
            url += '&skip=' + (skip() - limit());
        }

        var d1 = $.Deferred();

        $.ajax({
            url: url,
            dataType: 'json'
        }).then(function (data) {
            limit(+data.meta.results.limit);
            skip(+data.meta.results.skip);
            total(+data.meta.results.total);
            $.each(data.results, function (i, item) {
                item.initiation_date_pretty = moment(item.recall_initiation_date, "YYYYMMDD").fromNow();
            });

            results(data.results);
            geoChart();

        }).fail(function () {
            results([]);
            resultsSummary([]);
            limit(0);
            skip(0);
            total(0);
            geoChart();
            d1.resolve();
        }).then(function () {
            return $.ajax({
                url: url2,
                dataType: 'json'
            });
        }).then(function (data) {
            resultsSummary(data.results);
            d1.resolve();
        }, function (data) {
            resultsSummary([]);
            limit(0);
            skip(0);
            total(0);
            d1.resolve();
        });;
        return d1.promise();
    }

    function geoChart() {

        var array = [['State', 'Count']];

        $.each(states, function (i, state) {
            var count = 0;

            $.each(results(), function (j, item) {

                var distributionPatternArray = item.distribution_pattern.replace(/[.,]/g, " ").split(" ");
                $.each(distributionPatternArray, function (i, word) {
                    if (word === state) {
                        count++;
                    }
                });
            });
            if (count > 0) {
                array.push([state, count]);
            }
        });

        var data = google.visualization.arrayToDataTable(array);

        var options = {
            region: 'US',
            resolution: 'provinces',
            enableRegionInteractivity: true
        };

        if (document.getElementById('regions_div')) {
            var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

            chart.draw(data, options);

            google.visualization.events.addListener(chart, 'regionClick', function (arg, arg2) {
                results([]);
                resultsSummary([]);
                resultsType('search');
                searchState(arg.region.split("-")[1]);
            });

            window.onresize = function () {
                chart.draw(data, options);
            };
        }
    }

    function clearFields() {
        searchFood('');
        searchVendor('');
        searchState('');

        results([]);
        resultsSummary([]);
        limit(0);
        skip(0);
        total(0);
    }

    resultsType.subscribe(function (newValue) {
        clearFields();
        if (newValue === 'recent') {
            search(true);
        } else {
            results([]);
            geoChart();

        }
    });

    return {
        title: 'Results',
        limit: limit,
        skip: skip,
        total: total,
        startPossition: startPossition,
        states: states,
        clearFields: clearFields,
        previous: function () {
            search(resultsType() === 'recent', false, true);
        },
        next: function () {
            search(resultsType() === 'recent', true, false);
        },
        results: results,
        resultsSummary: resultsSummary,
        resultsType: resultsType,
        activate: function () {
            if (!active) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {

                    });
                } else {
                    x.innerHTML = "Geolocation is not supported by this browser.";
                }
                active = true;
                return search(true);


            }

        },
        searchFood: searchFood,
        searchVendor: searchVendor,
        searchState: searchState,
        search: function () {
            search();
        },
        viewDetails: function (item) {

        },
        attached: function () {
            $('#classificationHelp').tooltip()
            $("span.expander").expander({ slicePoint: 50 });

            geoChart();
        }
    }
});
