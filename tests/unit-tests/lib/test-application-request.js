var request;

var setupStorageStub = function(){
	var rules_object = {},
		history_object = {};
	rules_object['site-visit-limiter-rules'] = returnCompleteRulesObject();
	history_object['site-visit-limiter-history'] = returnCompleteHistoryObject();
	chrome.storage.local = returnChromeStorageLocalStub();
	chrome.storage.local.set(rules_object);
	chrome.storage.local.set(history_object);
};

var testByCallback = function(callback){
	// Test is the mediator (central hub) of the independent classes.
	// It requires a complete setup before a test can be run.
	var requestHistoryLogger = new RequestHistoryLogger(),
		requestRulesLogger = new RequestRulesLogger();
	requestHistoryLogger.asyncReturnHistory(function(history){
		requestRulesLogger.asyncReturnRules(function(rules){
			var request = new Request();
			request.setHistory(history);
			request.setRules(rules);
			callback(request);
		});
	});
};

module('Application - Request', {
	setup: function(){
		setupStorageStub();
	},
	teardown: function(){

	}
});

test('isOverTheLimit visit count tests', function(){
	testByCallback(function(request){
		var set_method = request.setUri,
			get_method = request.isOverTheLimit,
			input,
			expected,
			result;

		input_uri = 'default';
		expected = false;
		set_method(input_uri);
		result = get_method();
		equal(result, expected, 'Return a URI with matching rule, but given an invalid partial URI which causes failure');

		input_uri = 'http://default';
		expected = true;
		set_method(input_uri);
		result = get_method();
		equal(result, expected, 'Return a URI with matching rule that is over the limit');

		input_uri = 'http://somesubdomain.test.co.uk';
		expected = false;
		set_method(input_uri);
		result = get_method();
		equal(result, expected, 'Return a URI with matching rule that is not over the limit');
	});
});

test('isOverTheLimit graceperiod tests', function(){
	testByCallback(function(request){
		var set_method = request.setUri,
			get_method = request.isOverTheLimit,
			input,
			expected,
			result;

		// Note: History object has been updated to be dynamic, adding in last
		// visit times based on relative time (30 minutes ago) as opposed to
		// fixed timestamps to allow easier testing.

		// TODO: Add graceperiod tests

		equal(true, false);
	});
});

test('isOverTheLimit cooldown tests', function(){
	testByCallback(function(request){
		var set_method = request.setUri,
			get_method = request.isOverTheLimit,
			input,
			expected,
			result;

		// Note: History object has been updated to be dynamic, adding in last
		// visit times based on relative time (30 minutes ago) as opposed to
		// fixed timestamps to allow easier testing.

		// TODO: Add cooldown tests

		equal(true, false);
	});
});
