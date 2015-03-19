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
