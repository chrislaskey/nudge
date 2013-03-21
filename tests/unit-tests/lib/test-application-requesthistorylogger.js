var request_history_logger;

module('Application - RequestHistoryLogger', {
	setup: function(){
		var history_object = {};
		history_object['site-visit-limiter-history'] = returnCompleteHistoryObject();
		chrome.storage.local = returnChromeStorageLocalStub();
		chrome.storage.local.set(history_object);
		request_history_logger = new RequestHistoryLogger();
	},
	teardown: function(){

	}
});

test('asyncReturnHistory tests', function(){
	var method = request_history_logger.asyncReturnHistory,
		result_object,
		result;

	method(function(result_object){
		result = result_object.hasOwnProperty('2012.12.02');
		ok(result_object, 'Verify default history is returned');
		ok(result, 'Verify default history returns default date');
	});
});

test('asyncSaveItem tests', function(){
	var input,
		set_method = request_history_logger.asyncSaveItem,
		get_method = request_history_logger.asyncReturnHistory,
		date = new DateTime().returnDate(),
		expected_count,
		result_count;

	var returnPatternVisitCount = function(storage_object, key){
		var count = 0;
		if( storage_object[date] && storage_object[date][input] ){
			count = storage_object[date][input].length;
		}
		return count;
	};

	input = 'example.com';
	expected_count = 2;
	set_method(input, function(){
		set_method(input, function(){ // Add a total of 2 visits
			get_method(function(result){
				result_count = returnPatternVisitCount(result, input);
				equal(result_count, expected_count, 'Verify default history returned');
			});
		});
	});

	input = 'new.example.com';
	expected_count = 1;
	set_method(input, function(){
		get_method(function(result){
			result_count = returnPatternVisitCount(result, input);
			equal(result_count, expected_count, 'Set then verify new pattern visit is logged');
		});
	});
});
