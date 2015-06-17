"use strict";

var assert = require("assert"),
    comingSoon = require('../../app/comingsoon');

describe("Coming Soon", function () {

    it("should return an object", function () {
        comingSoon.should.be.an.instanceOf(Object);
    });

    it("should have a title of 'Coming Soon'", function () {
        comingSoon.should.have.property("title", "Coming Soon");
    });

});
