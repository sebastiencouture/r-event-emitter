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
