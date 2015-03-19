/*!
recurve-event-emitter.js - v0.1.1
Created by Sebastien Couture on 2015-03-18.

git://github.com/sebastiencouture/recurve-event-emitter.git

The MIT License (MIT)

Copyright (c) 2015 Sebastien Couture

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EventEmitter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Signal = require("./signal");
var utils = require("./utils");

module.exports = EventEmitter;

function EventEmitter() {
    this._signals = {};
}

EventEmitter.prototype = {
    /**
     * Add listener(s). The callback will be called each time the event is triggered.
     *
     * Multiple event names can be specified by separating them by a space.
     *
     * If a listener for the event, callback and context already exists then this method will do nothing. Duplicate
     * listeners will not be added.
     *
     * @param event name of the event or events. Multiple events can be specified by separating them by a space.
     * @param callback method to call when the event is triggered
     * @param context context of the callback. Options
     * @throws Error if event name is not set
     * @throws Error if callback is not a function
     */
    on: function(event, callback, context) {
        utils.assert(event, "event must exist");
        utils.assert(utils.isFunction(callback), "callback must exist");

        utils.forEach(event.split(" "), function(name) {
            var signal = createSignal(name, this._signals);
            signal.on(callback, context);
        }, this);
    },

    /**
     * Add listener(s). The callback will only be called once and will then be removed.
     *
     * Multiple event names can be specified by separating them by a space.
     *
     * If a listener for the event, callback and context already exists then this method will do nothing. Duplicate
     * listeners will not be added.
     *
     * @param event name of the event or events. Multiple events can be specified by separating them by a space.
     * @param callback method to call when the event is triggered
     * @param context context of the callback. Optional
     * @throws Error if event name is not set
     * @throws Error if callback is not a function
     */
    once: function(event, callback, context) {
        utils.assert(event, "event must exist");
        utils.assert(utils.isFunction(callback), "callback must exist");

        utils.forEach(event.split(" "), function(name) {
            var signal = createSignal(name, this._signals);
            signal.once(callback, context);
        }, this);
    },

    /**
     * Remove listener(s)
     *
     * If an event, callback and context are specified then the listener with matching event, callback and context is removed
     * If only an event and callback is specified then the listener with matching event and callback is removed
     * If only an event is specified then all listeners for the event are removed
     * If only a callback is specified then the listener for the callback is removed
     * If only a context is specified then all listeners for the context are removed
     * If no event, callback or context are specified then all are listeners are removed (equivalent to clear)
     * @param event name of the event
     * @param callback
     * @param context
     */
    off: function(event, callback, context) {
        if (event) {
            if (!callback && !context) {
                delete this._signals[event];
            }
            else {
                var signal = getSignal(event, this._signals);
                if (signal) {
                    signal.off(callback, context);
                }
            }
        }
        else {
            if (!callback && !context) {
                this._signals = {};
            }
            else {
                utils.forEach(this._signals, function(signal) {
                    signal.off(callback, context);
                });
            }
        }
    },

    /**
     * Triggers the event or events. Arguments passed into the method will be passed as parameters to all listeners
     *
     * @param event name of the event
     * @throws Error if event name is not set
     */
    trigger: function(event) {
        utils.assert(event, "event must exist");

        if (this._disabled) {
            return;
        }

        var signal = getSignal(event, this._signals);
        if (signal) {
            var args = utils.argumentsToArray(arguments, 1);
            signal.trigger.apply(signal, args);
        }
    },

    /**
     * Clear out all listeners
     */
    clear: function() {
        this.off();
    },

    /**
     * Disable or enable all listeners from being called when any event is triggered
     *
     * @param value boolean. Defaults to true
     */
    disable: function(value) {
        if (undefined === value) {
            value = true;
        }

        this._disabled = value;
    }
};

function createSignal(event, signals) {
    var signal = getSignal(event, signals);
    if (!signal) {
        signal = new Signal();
        signals[event] = signal;
    }

    return signal;
}

function getSignal(event, signals) {
    return signals[event];
}

},{"./signal":3,"./utils":4}],2:[function(require,module,exports){
"use strict";

module.exports = require("./event-emitter");
},{"./event-emitter":1}],3:[function(require,module,exports){
"use strict";

var utils = require("./utils");

module.exports = Signal;

function Signal() {
    this._listeners = [];
}

Signal.prototype = {
    /**
     * Add a listener. The callback will be called each time the signal is triggered.
     *
     * If a listener for the callback and context already exists then this method will do nothing. Duplicate
     * listeners will not be added.
     *
     * @param callback method to call when the signal is triggered
     * @param context context of the callback. Optional
     * @throws Error if callback is not a function
     */
    on: function(callback, context) {
        if (!utils.isFunction(callback)) {
            throw new Error("callback must exist");
        }

        if (listenerExists(this._listeners, callback, context)) {
            return;
        }

        this._listeners.push(new SignalListener(callback, context));
    },

    /**
     * Adds a listener callback that will only be called once and will then be removed.
     *
     * If a listener for the callback and context already exists then this method will do nothing. Duplicate
     * listeners will not be added.
     *
     * @param callback method to call when the signal is triggered
     * @param context context of the callback. Optional
     * @throws Error if callback is not a function
     */
    once: function(callback, context) {
        if (!utils.isFunction(callback)) {
            throw new Error("callback must exist");
        }

        if (listenerExists(this._listeners, callback, context)) {
            return;
        }

        this._listeners.push(new SignalListener(callback, context, true));
    },

    /**
     * Remove listeners
     *
     * If a callback and context are specified then the listener with matching callback and context is removed
     * If only a callback is specified then the listener for the callback is removed
     * If only a context is specified then all listeners for the context are removed
     * If no callback or context are specified then all listeners are removed (equivalent to clear)
     *
     * @param callback method that should be removed
     * @param context context of the removed method(s)
     */
    off: function(callback, context) {
        if (!callback && !context) {
            this.clear();
            return;
        }

        for (var index = this._listeners.length - 1; 0 <= index; index--) {
            var listener = this._listeners[index];
            var match;

            if (!callback) {
                if (listener.isSameContext(context)) {
                    match = true;
                }
            }
            else if (listener.isSame(callback, context)) {
                match = true;
            }
            else {
                // do nothing - no match
            }

            if (match) {
                this._listeners.splice(index, 1);

                // can only be one match if callback specified
                if (callback) {
                    return;
                }
            }
        }
    },

    /**
     * Triggers the signal. Arguments passed into the method will be passed as parameters to all listeners
     */
    trigger: function() {
        if (this._disabled) {
            return;
        }

        for (var index = this._listeners.length - 1; 0 <= index; index--) {
            var listener = this._listeners[index];

            listener.trigger(arguments);

            if (listener.onlyOnce) {
                this._listeners.splice(index, 1);
            }
        }
    },

    /**
     * Clear out all listeners
     */
    clear: function() {
        this._listeners = [];
    },

    /**
     * Disable or enable all listeners from being called when the signal is triggered
     *
     * @param value boolean. Defaults to true
     */
    disable: function(value) {
        if (undefined === value) {
            value = true;
        }

        this._disabled = value;
    }
};


function SignalListener(callback, context, onlyOnce) {
    this._callback = callback;
    this._context = context;
    this.onlyOnce = onlyOnce;
}

SignalListener.prototype = {
    isSame: function(callback, context) {
        if (!context) {
            return this._callback === callback;
        }

        return this._callback === callback && this._context === context;
    },

    isSameContext: function(context) {
        return this._context === context;
    },

    trigger: function(args) {
        this._callback.apply(this._context, args);
    }
};


function listenerExists(listeners, callback, context) {
    var exists = false;
    if (!listeners) {
        return exists;
    }

    utils.forEach(listeners, function(listener) {
        if (listener.isSame(callback, context)) {
            exists = true;
            return false;
        }
    });

    return exists;
}

},{"./utils":4}],4:[function(require,module,exports){
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
},{}]},{},[2])(2)
});