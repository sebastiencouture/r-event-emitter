"use strict";

function forEach(obj, iterator, context) {
    if (!obj) {
        return obj;
    }

    var index;

    if (obj.forEach && obj.forEach === Object.forEach) {
        obj.forEach(iterator, context);
    }
    else if (isArray(obj)) {
        for (index = 0; index < obj.length; index++) {
            if (false === iterator.call(context, obj[index], index, obj)) {
                break;
            }
        }
    }
    else {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (false === iterator.call(context, obj[key], key, obj)) {
                    break;
                }
            }
        }
    }

    return obj;
}

function isArray(value) {
    return value instanceof Array;
}

function isFunction(value) {
    return "[object Function]" === Object.prototype.toString.call(value);
}

function assert(condition, message) {
    if (!!condition) {
        return;
    }

    throw new Error(message);
}

function argumentsToArray(args, sliceCount) {
    if (undefined === sliceCount) {
        sliceCount = 0;
    }

    return sliceCount < args.length ? Array.prototype.slice.call(args, sliceCount) : [];
}

module.exports = {
    forEach: forEach,
    isArray: isArray,
    isFunction: isFunction,
    assert: assert,
    argumentsToArray: argumentsToArray
};