"use strict";

var assert = require("assert"),
    welcome = require('../../app/welcome');

describe("Welcome", function () {

    it("should return an object", function () {
        welcome.should.be.an.instanceOf(Object);
    });

    it("should have a title of 'Welcome'", function () {
        welcome.should.have.property("title", "Welcome");
    });

});
