describe("utils", function() {
    "use strict";

    var utils = require("../src/utils");

    describe("forEach", function(){
        it("should iterate items in array", function(){
            var array = [1,2,3];
            var items = [];
            var indices = [];

            utils.forEach(array, function(item, index, iterated) {
                items.push(item);
                indices.push(index);

                expect(array).toBe(iterated);
            });

            expect(array).toEqual(items);
            expect(indices).toEqual([0,1,2]);
        });

        it("should iterate keys in object", function(){
            var obj = {"a": 1, "b": 2, "c": null};
            var keys = [];
            var values = [];

            utils.forEach(obj, function(value, key, iterated){
                values.push(value);
                keys.push(key);

                expect(obj).toBe(iterated);
            });

            expect(keys).toEqual(["a", "b", "c"]);
            expect(values).toEqual([1,2, null]);
        });

        it("should break from iteration of an array", function(){
            var array = [1,2,3];
            var items = [];

            utils.forEach(array, function(item) {
                items.push(item);
                return false;
            });

            expect(items).toEqual([1]);
        });

        it("should break from iteration of an object", function(){
            var obj = {"a": 1, "b": 2, "c": null};
            var values = [];

            utils.forEach(obj, function(value) {
                values.push(value);
                return false;
            });

            expect(values).toEqual([1]);
        });

        it("should return obj", function() {
            var obj = {};
            expect(utils.forEach(obj, function(){})).toBe(obj);
        });

        it("should not throw error for null object", function(){
            utils.forEach(null);
        });

        it("should not throw error for undefined object", function() {
            utils.forEach(undefined);
        });

        it("should throw error for null iterator", function() {
            expect(function() {
                utils.forEach({a: 1, b: 2}, null);
            }).toThrow();
        });

        it("should throw error for undefined iterator", function() {
            expect(function() {
                utils.forEach({a: 1, b: 2}, undefined);
            }).toThrow();
        });
    });

    describe("isArray", function() {
        var array;

        it("should detect empty array", function() {
            array = [];
            expect(utils.isArray(array)).toEqual(true);
        });

        it("should detect array with items", function() {
            array = [1, 2];
            expect(utils.isArray(array)).toEqual(true);
        });

        it("should detect new Array()", function() {
            array = new Array(); // jshint ignore:line
            expect(utils.isArray(array)).toEqual(true);
        });

        it("should not detect undefined", function() {
            expect(utils.isArray(undefined)).toEqual(false);
        });

        it("should not detect function arguments", function(){
            function test(){
                expect(utils.isArray(arguments)).toEqual(false);
            }

            test();
        });
    });

    describe("isFunction", function() {
        it("should detect functions", function(){
            expect(utils.isFunction(describe)).toEqual(true);
        });

        it("should detect anonymous function", function() {
            expect(utils.isFunction(function(){})).toEqual(true);
        });

        it("should not detect undefined", function() {
            expect(utils.isFunction(undefined)).toEqual(false);
        });

        it("should not detect arrays", function(){
            expect(utils.isFunction([1,2])).toEqual(false);
        });

        it("should not detect strings", function(){
            expect(utils.isFunction("sebastien")).toEqual(false);
        });
    });

    describe("assert", function(){
        it("should throw for false", function(){
            expect(function(){
                utils.assert(false);
            }).toThrow();
        });

        it("should throw for null", function(){
            expect(function(){
                utils.assert(null);
            }).toThrow();
        });

        it("should throw for undefined", function(){
            expect(function(){
                utils.assert(undefined);
            }).toThrow();
        });

        it("should throw for 0", function(){
            expect(function(){
                utils.assert(0);
            }).toThrow();
        });

        it("should throw for an empty string", function(){
            expect(function(){
                utils.assert("");
            }).toThrow();
        });

        it("should not throw for true", function(){
            utils.assert(true);
        });

        it("should not throw for an object", function(){
            utils.assert({a:1});
        });

        it("should not throw for an empty object", function(){
            utils.assert({});
        });

        it("should throw an error", function(){
            expect(function(){
                utils.assert(false);
            }).toThrow(new Error(""));
        });

        it("should include message", function(){
            expect(function(){
                utils.assert(false, "message");
            }).toThrow(new Error("message"));
        });
    });

    describe("argumentsToArray", function(){
        var array;
        function test(){
            array = utils.argumentsToArray(arguments);
        }

        beforeEach(function(){
            array = null;
        });

        it("should convert empty arguments", function(){
            test();
            expect(array).toEqual([]);
        });

        it("should convert non empty arguments", function(){
            test("a", "b");
            expect(array).toEqual(["a", "b"]);
        });

        it("should convert non empty arguments", function(){
            function testSliceFirst(){
                array = utils.argumentsToArray(arguments, 1);
            }

            testSliceFirst("a", "b");
            expect(array).toEqual(["b"]);
        });
    });
});