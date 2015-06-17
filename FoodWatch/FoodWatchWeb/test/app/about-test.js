"use strict";

var assert = require("assert"),
    about = require('../../app/about');

describe("About", function () {

    it("should return an object", function () {
        about.should.be.an.instanceOf(Object);
    });

    it("should have a title of 'About'", function () {
        about.should.have.property("title", "About");
    });

});
