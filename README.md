recurve-event-emitter [![Build Status](https://secure.travis-ci.org/sebastiencouture/recurve-event-emitter.png?branch=master)](https://travis-ci.org/sebastiencouture/recurve-event-emitter)
===

Event emitter library for the browser.

Take a look at [recurve-signal](http://github.com/sebastiencouture/recurve-signal) for an alternative approach.

## Usage

### Example

```javascript
var eventEmitter = new EventEmitter();

// Add some listeners
eventEmitter.on("start", onStartA);
eventEmitter.on("start", onStartB);

// Trigger the event. onStartA and onStartB will be called with "oh ya" as
// the message
eventEmitter.trigger("start", "oh ya");

// Remove a listener
eventEmitter.off("start", onStartA);

// onStartA will not be called, but onStartB will be called
eventEmitter.trigger("start", "oh no");
```

For more examples, take a look at the [unit tests](test/recurve-event-emitter.spec.js)

### Creating an Event Emitter

#### EventEmitter()

```javascript
var eventEmitter = new EventEmitter();
```

### Adding Listeners

#### on(event, callback, context)

Add listener(s). The callback will be called each time the event is triggered.

If a listener for the event, callback and context already exists then this method will do nothing. Duplicate
listeners will not be added.

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStart, this);
```

Multiple event names can be specified by separating them by a space.

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start update", onChange, this);
```

#### once(event, callback, context)

Add listener(s). The callback will only be called once and will then be removed.

If a listener for the callback and context already exists then this method will do nothing. Duplicate
listeners will not be added.

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStart, this);

eventEmitter.trigger("start"); // onStart will be called and then removed as a listener
eventEmitter.trigger("start"); // onStart will not be called
```
Multiple event names can be specified by separating them by a space.

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.once("start update", onChange, this);

eventEmitter.trigger("start"); // onStart will be called and then removed as a listener
eventEmitter.trigger("start"); // onStart will not be called
eventEmitter.trigger("update"); // onStart will be called and then removed as a listener
eventEmitter.trigger("update"); // onStart will not be called
```

### Trigger Event

#### trigger(event)

Triggers the event or events. Arguments passed into the method will be passed as parameters to all listeners

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", function(message) {
    // will be called with "oh ya" as the message
});

eventEmitter.trigger("start", "oh ya");
```

### Removing Listeners

#### off(event, callback, context)

If an event, callback and context are specified then the listener with matching event, callback and context is removed

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStartA, this);
eventEmitter.on("start", onStartB, this);
eventEmitter.off("start", onStartA, this); // only onStartA will be removed
```

If only an event and callback is specified then the listener with matching event and callback is removed

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStartA, this);
eventEmitter.on("start", onStartB, this);
eventEmitter.off("start", onStartA); // only onStartA will be removed
```

If only an event is specified then all listeners for the event are removed

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStartA, this);
eventEmitter.on("start", onStartB, this);
eventEmitter.off("start"); // onStartA and onStartB will be removed
```

If only a callback is specified then the listener for the callback is removed

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStartA, this);
eventEmitter.on("start", onStartB, this);
eventEmitter.off(null, onStartA); // only onStartA will be removed
```

If only a context is specified then all listeners for the context are removed

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStartA, this);
eventEmitter.on("start", onStartB, this);
eventEmitter.off(null, null, this); // onStartA and onStartB will be removed
```

If no event, callback or context are specified then all are listeners are removed (equivalent to clear)

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStartA, this);
eventEmitter.on("start", onStartB, this);
eventEmitter.off(); // onStartA and onStartB will be removed
```

#### clear()

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStart);
eventEmitter.clear();
```

### Disabling

#### disable(value)

Disable or enable all listeners from being called when any event is triggered

```javascript
var eventEmitter = new EventEmitter();
eventEmitter.on("start", onStart);
eventEmitter.disable();

eventEmitter.trigger("start"); // onStart will not be called
eventEmitter.disable(false);
eventEmitter.trigger("start"); // onStart will be called
```

## Running the Tests

```
grunt test
```

## Installation

The library is UMD compliant. Registers on `window.EventEmitter` for global.

```
npm install recurve-event-emitter
```

## Browser Support

IE6+

## License

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