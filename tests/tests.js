
test( "backend" , function(){
	ok(!!$.yaJsStorage.currentBackend(), $.yaJsStorage.currentBackend())
});

test( "flush/index", function() {
	ok($.yaJsStorage.flush());
	$.yaJsStorage.set("test", "value");
	deepEqual($.yaJsStorage.index(), ["test"]);
	ok($.yaJsStorage.flush());
	deepEqual($.yaJsStorage.index(), []);
	ok(!$.yaJsStorage.get("test"));
});

module( "set" );

test("missing", function() {
  	ok($.yaJsStorage.get("test") === null);
  	$.yaJsStorage.flush();
});

test("use default", function() {
	$.yaJsStorage.set("value exists", "value");
  	ok($.yaJsStorage.get("no value", "def") === "def");
  	ok($.yaJsStorage.get("value exists", "def") === "value");
  	$.yaJsStorage.flush();
});

test("string", function() {
	ok($.yaJsStorage.set("test", "value") == "value");
  	ok($.yaJsStorage.get("test") == "value");
  	$.yaJsStorage.flush();
});

test("boolean", function() {
	ok($.yaJsStorage.set("test true", true) === true);
  	ok($.yaJsStorage.get("test true") === true);
  	ok($.yaJsStorage.set("test false", false) === false);
  	ok($.yaJsStorage.get("test false") === false);
  	$.yaJsStorage.flush();
});

test("number", function() {
	ok($.yaJsStorage.set("test", 10.01) === 10.01);
  	ok($.yaJsStorage.get("test") === 10.01);
  	$.yaJsStorage.flush();
});

test("obejct", function() {
	var testObj = {arr:[1,2,3]};
	deepEqual($.yaJsStorage.set("test", testObj), testObj);
	deepEqual($.yaJsStorage.get("test"), testObj);
	ok($.yaJsStorage.get("test") != testObj);
  	$.yaJsStorage.flush();
});

asyncTest("TTL", function() {
	expect(2);
	$.yaJsStorage.set("ttlkey", "value", {TTL:500});
	setTimeout(function(){
		ok($.yaJsStorage.get("ttlkey") == "value");
		setTimeout(function(){
			ok($.yaJsStorage.get("ttlkey") === null);
			$.yaJsStorage.flush();
			start();
		}, 500);
	}, 250);
});

module();

asyncTest("setTTL", function() {
	expect(2);
	$.yaJsStorage.set("ttlkey", "value");
	$.yaJsStorage.setTTL("ttlkey", 500);
	setTimeout(function(){
		ok($.yaJsStorage.get("ttlkey") == "value");
		setTimeout(function(){
			ok($.yaJsStorage.get("ttlkey") === null);
			$.yaJsStorage.flush();
			start();
		}, 500);
	}, 250);
});

asyncTest("getTTL", function() {
	expect(2);
	$.yaJsStorage.set("ttlkey", "value", {TTL: 500});
	setTimeout(function(){
		ok($.yaJsStorage.getTTL("ttlkey") > 0);
		setTimeout(function(){
			ok($.yaJsStorage.getTTL("ttlkey") === 0);
			$.yaJsStorage.flush();
			start();
		}, 500);
	}, 250);
});

test("deleteKey", function() {
	deepEqual($.yaJsStorage.index(), []);
	$.yaJsStorage.set("test", "value");
	deepEqual($.yaJsStorage.index(), ["test"]);
	ok($.yaJsStorage.deleteKey("test"));
	ok(!$.yaJsStorage.deleteKey("test"));
	deepEqual($.yaJsStorage.index(), []);
  	$.yaJsStorage.flush();
});

asyncTest("publish/subscribe", function() {
	expect(2);
	$.yaJsStorage.subscribe("testchannel", function(channel, payload){
		ok(channel == "testchannel");
		deepEqual(payload, {arr: [1,2,3]});
		$.yaJsStorage.flush();
	    start();
	});

	setTimeout(function(){
		$.yaJsStorage.publish("testchannel", {arr: [1,2,3]});
	}, 100);
});

module("listenKeyChange");

asyncTest("specific key - updated", function() {
	$.yaJsStorage.listenKeyChange("testkey", function(key, action){
		ok(key == "testkey");
		ok(action == "updated");
		$.yaJsStorage.stopListening("testkey");
	    start();
	});

	setTimeout(function(){
		$.yaJsStorage.set("testkey", "value");
	}, 100);
});

asyncTest("specific key - deleted", function() {
	$.yaJsStorage.listenKeyChange("testkey", function(key, action){
		ok(key == "testkey");
		ok(action == "deleted");
		$.yaJsStorage.stopListening("testkey");
		$.yaJsStorage.flush();
	    start();
	});

	setTimeout(function(){
		$.yaJsStorage.deleteKey("testkey");
	}, 100);
});

asyncTest("all keys - updated", function() {
    $.yaJsStorage.listenKeyChange("*", function(key, action){
        ok(key == "testkey");
        ok(action == "updated");
        $.yaJsStorage.stopListening("*");
        start();
    });

    setTimeout(function(){
        $.yaJsStorage.set("testkey", "value");
    }, 100);
});

asyncTest("specific key - deleted", function() {
    $.yaJsStorage.listenKeyChange("*", function(key, action){
        ok(key == "testkey");
        ok(action == "deleted");
        $.yaJsStorage.stopListening("*");
        $.yaJsStorage.flush();
        start();
    });

    setTimeout(function(){
        $.yaJsStorage.deleteKey("testkey");
    }, 100);
});
