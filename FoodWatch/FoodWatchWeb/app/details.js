define(function (require) {

    "use strict";

    var $ = require('jquery'),
        ko = require('knockout'),
        moment = require('moment');

    require('goog!visualization,1,packages:[geochart]');

    require('async!http://maps.google.com/maps/api/js?key=AIzaSyCyXJ3myVx6K8Iv9bgdxJcS17H3X4z9ScE!callback');

    var states = ["AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "FM", "GA",
       "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MH", "MI", "MN", "MO", "MP",
       "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "PW", "RI", "SC", "SD", "TN",
       "TX", "UM", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];

    var item = ko.observable();
    var pattern = ko.observableArray();

    function geoChart() {


        var array = [['State']];

        $.each(states, function (i, state) {
            var distributionPatternArray = item().distribution_pattern.replace(/[.,]/g, " ").split(" ");
            $.each(distributionPatternArray, function (i, word) {
                if (word === state) {
                    pattern.push(state);
                }
            });
            
        });

        $.each(pattern(), function (i, val) {
            array.push([val])
        });

        var data = google.visualization.arrayToDataTable(array);

        var options = {
            region: 'US',
            resolution: 'provinces',
            enableRegionInteractivity: true
        };

        if (document.getElementById('details_regions_div')) {
            var chart = new google.visualization.GeoChart(document.getElementById('details_regions_div'));

            chart.draw(data, options);

            window.onresize = function () {
                chart.draw(data, options);
            };
        }
    }


    function getLocation(city, state) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCyXJ3myVx6K8Iv9bgdxJcS17H3X4z9ScE&address=" + city + ', ' + state;

        return $.ajax({
            url: url,
            dataType: 'json'
        }).then(function (data) {
            if (data.results.length > 0) {
                return data.results[0].geometry.location;
            }
        });
    }

    return {
        title: 'Details',
        item: item,
        mapSource: ko.pureComputed(function () {
            return 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCyXJ3myVx6K8Iv9bgdxJcS17H3X4z9ScE' +
                '&q=' + item().city + ', ' + item().state;
        }, this),
        activate: function (recallNumber) {
            var self = this;
            var url = 'https://api.fda.gov/food/enforcement.json?api_key=HlA31zEdViNanxLQKZmMhpeSEF3Ks8V7NDGuAGwC&limit=1&search=event_id:"' + recallNumber+ '"';
            return $.ajax({
                url: url,
                dataType: 'json'
            }).done(function (data) {
                var result = data.results[0];
                result.recall_initiation_date_pretty = moment(result.recall_initiation_date, "YYYYMMDD").format("MMM Do YYYY");
                result.report_date_pretty = moment(result.report_date, "YYYYMMDD").format("MMM Do YYYY");
                self.item(result);
            });
        },
        attached: function () {
            geoChart();

            return getLocation(item().city, item().state).done(function (data) {

                if (data) {
                    var mapOptions = {
                        center: data,
                        zoom: 5
                    };
                    var map = new google.maps.Map(document.getElementById('map-canvas'),
                        mapOptions);

                    var marker = new google.maps.Marker({
                        position: data,
                        map: map
                    });

                    var content = '<address>'
                       + '<strong>'+ item().recalling_firm +'</strong><br>'
                        + item().city + ', ' + item().state + ' ' + item().country
                        +'</address>'

                    var infowindow = new google.maps.InfoWindow({
                        content: content
                    });

                    google.maps.event.addListener(marker, 'click', function () {
                        infowindow.open(map, marker);
                    });

                    infowindow.open(map, marker);
                }
            });
        }
    }
});