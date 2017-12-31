

> This is a fork of great [jStorage](https://github.com/andris9/jStorage) library with minor modifications and latest updates available in NPM for those who still need to deal with old IE browser versions (as **jstorage** NPM package is no longer maintained) 
----

# Yet Another JS Storage (ya-js-storage)

**ya-js-storage** is a cross-browser key-value store database to store data locally in the browser - ya-js-storage supports all major browsers, both in **desktop** (yes - even Internet Explorer 6) and in **mobile**.

yaStorage supports storing Strings, Numbers, JavaScript objects, Arrays and even native XML nodes which kind of makes it a JSON storage. yaStorage also supports setting TTL values for auto expiring stored keys and - best of all - notifying other tabs/windows when a key has been changed, which makes yaJsStorage also a local PubSub platform for web applications.

yaJsStorage is pretty small, about 7kB when minified, 3kB gzipped.

## Function reference

### set(key, value[, options])

```javascript
$.yaJsStorage.set(key, value, options)
```

Saves a value to local storage. key needs to be string otherwise an exception is thrown. value can be any JSONeable value, including objects and arrays or a XML node.
Currently XML nodes can't be nested inside other objects: `$.yaJsStorage.set("xml", xml_node)` is OK but `$.yaJsStorage.set("xml", {xml: xml_node})` is not.

Options is an optional options object. Currently only available option is options.TTL which can be used to set the TTL value to the key `$.yaJsStorage.set(key, value, {TTL: 1000})`. NB - if no TTL option value has been set, any currently used TTL value for the key will be removed.

### get(key[, default])

```javascript
value = $.yaJsStorage.get(key)
value = $.yaJsStorage.get(key, "default value")
```

get retrieves the value if key exists, or default if it doesn't. key needs to be string otherwise an exception is thrown. default can be any value.

### deleteKey(key)

```javascript
$.yaJsStorage.deleteKey(key)
```

Removes a key from the storage. key needs to be string otherwise an exception is thrown.

### setTTL(key, ttl)

```javascript
$.yaJsStorage.set("mykey", "keyvalue");
$.yaJsStorage.setTTL("mykey", 3000); // expires in 3 seconds
```

Sets a TTL (in milliseconds) for an existing key. Use 0 or negative value to clear TTL.

### getTTL(key)

```javascript
ttl = $.yaJsStorage.getTTL("mykey"); // TTL in milliseconds or 0
```

Gets remaining TTL (in milliseconds) for a key or 0 if not TTL has been set.

### flush()

```javascript
$.yaJsStorage.flush()
```

Clears the cache.

### index()

```javascript
$.yaJsStorage.index()
```

Returns all the keys currently in use as an array.

```javascript
var index = $.yaJsStorage.index();
console.log(index); // ["key1","key2","key3"]
```

### storageSize()

```javascript
$.yaJsStorage.storageSize()
```

Returns the size of the stored data in bytes

### currentBackend()

```javascript
$.yaJsStorage.currentBackend()
```

Returns the storage engine currently in use or false if none

### reInit()

```javascript
$.yaJsStorage.reInit()
```

Reloads the data from browser storage

### storageAvailable()

```javascript
$.yaJsStorage.storageAvailable()
```

Returns true if storage is available

### subscribe(channel, callback)

```javascript
$.yaJsStorage.subscribe("ch1", function(channel, payload){
    console.log(payload+ " from " + channel);
});
```

Subscribes to a Publish/Subscribe channel (see demo)

### publish(channel, payload)

```javascript
$.yaJsStorage.publish("ch1", "data");
```

Publishes payload to a Publish/Subscribe channel (see demo)

### listenKeyChange(key, callback)

```javascript
$.yaJsStorage.listenKeyChange("mykey", function(key, action){
    console.log(key + " has been " + action);
});
```

Listens for updates for selected key. NB! even updates made in other windows/tabs are reflected, so this feature can also be used for some kind of publish/subscribe service.

If you want to listen for any key change, use `"*"` as the key name

```javascript
$.yaJsStorage.listenKeyChange("*", function(key, action){
    console.log(key + " has been " + action);
});
```

### stopListening(key[, callback])

```javascript
$.yaJsStorage.stopListening("mykey"); // cancel all listeners for "mykey" change
```

Stops listening for key change. If callback is set, only the used callback will be cleared, otherwise all listeners will be dropped.

## Features

yaJsStorage supports the following features:

  * store and retrieve data from browser storage using any JSON compatible data format (+ native XML nodes)
  * set TTL values to stored keys for auto expiring
  * publish and subscribe to cross-window/tab events
  * listen for key changes (update, delete) from the current or any other browser window
  * use any browser since IE6, both in desktop and in mobile

## Browser support

Current availability: yaJsStorage supports all major browsers - Internet Explorer 6+, Firefox 2+,
Safari 4+, Chrome 4+, Opera 10.50+

If the browser doesn't support data caching, then no exceptions are raised - yaJsStorage can still
be used by the script but nothing is actually stored.

## License

[Unlicense](http://unlicense.org/)
