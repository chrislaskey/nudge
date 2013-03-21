var chrome_storage;

module('Utilities - ChromeStorage Tests (using chrome.storage.local stub)', {
	setup: function(){
		chrome.storage.local = returnChromeStorageLocalStub();
		chrome.storage.local.set({'default_key': 'default_value'});
		chrome_storage = new ChromeStorage();
	},
	teardown: function(){

	}
});

test('asyncReturnKey tests', function(){
	var input,
		method = chrome_storage.asyncReturnKey,
		expected,
		result;

	input = 'default_key';
	expected = 'default_value';
	method(input, function(result){
		equal(result, expected, 'Return existing default key');
	});

	input = 'nonexistant_key';
	expected = undefined;
	method(input, function(result){
		equal(result, expected, 'Return nonexistant key');
	});
});

test('asyncReturnAll tests', function(){
	var method = chrome_storage.asyncReturnAll,
		expected,
		result;

	expected = {'default_key': 'default_value'};
	method(function(result){
		deepEqual(result, expected, 'Return all values');
	});
});

test('asyncSet tests', function(){
	var input_key,
		input_value,
		method = chrome_storage.asyncSet,
		expected;

	input_key = 'new_key';
	input_value = 'new_value';
	expected = input_value;
	method(input_key, input_value, function(){
		chrome_storage.asyncReturnKey(input_key, function(result){
			equal(result, expected, 'Set value, verify by key');
		});
	});
});

test('asyncSet tests', function(){
	var input_key,
		input_value,
		method = chrome_storage.asyncSet,
		expected;

	input_key = 'new_key';
	input_value = 'new_value';
	expected = {
		'new_key': input_value,
		'default_key': 'default_value'
	};
	method(input_key, input_value, function(){
		chrome_storage.asyncReturnAll(function(result){
			deepEqual(result, expected, 'Set value, verify by all values');
		});
	});

	input_key = '';
	input_value = 'new_value';
	throws(
		function(){
			method(input_key, input_value, function(){});
		},
		Error,
		'Set invalid key, empty string'
	);

	input_key = null;
	input_value = 'new_value';
	throws(
		function(){
			method(input_key, input_value, function(){});
		},
		Error,
		'Set invalid key, null'
	);

	input_key = undefined;
	input_value = 'new_value';
	throws(
		function(){
			method(input_key, input_value, function(){});
		},
		Error,
		'Set invalid key, undefined'
	);

	input_key = {'invalid': 'object'};
	input_value = 'new_value';
	throws(
		function(){
			method(input_key, input_value, function(){});
		},
		Error,
		'Set invalid key, object'
	);
});

test('asyncRemoveKey tests', function(){
	var input_key,
		input_value,
		method = chrome_storage.asyncRemoveKey,
		expected;

	input_key = 'new_key';
	input_value = 'new_value';
	expected = {'default_key': 'default_value'};
	chrome_storage.asyncSet(input_key, input_value, function(){
		method(input_key, function(){
			chrome_storage.asyncReturnAll(function(result){
				deepEqual(result, expected, 'Set, remove, then verify by entire object');
			});
		});
	});

	input_key = 'invalid_key';
	input_value = null;
	expected = {'default_key': 'default_value'};
	method(input_key, function(){
		chrome_storage.asyncReturnAll(function(result){
			deepEqual(result, expected, 'Removing invalid key returns no errors.');
		});
	});
});

test('asyncRemoveAll tests', function(){
	var input_key,
		input_value,
		method = chrome_storage.asyncRemoveAll,
		expected;

	input_key = 'new_key';
	input_value = 'new_value';
	expected = {};
	chrome_storage.asyncSet(input_key, input_value, function(){
		method(function(){
			chrome_storage.asyncReturnAll(function(result){
				deepEqual(result, expected, 'Set, remove, then verify by entire object');
			});
		});
	});
});
