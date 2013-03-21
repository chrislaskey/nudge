var request_history_parser;

module('Application - RequestHistoryParser', {
	setup: function(){
		request_history_parser = new RequestHistoryParser();
	},
	teardown: function(){

	}
});

test('setHistory and returnHistory tests', function(){
	var input,
		set_method = request_history_parser.setHistory,
		get_method = request_history_parser.returnHistory,
		expected,
		result;

	input = {'history': 'value'};
	expected = input;
	set_method(input);
	result = get_method();
	deepEqual(result, expected, 'Set and return basic object value');

	input = returnCompleteHistoryObject();
	expected = input;
	set_method(input);
	result = get_method();
	deepEqual(result, expected, 'Set and return stub history object value');
});

test('returnVisitCount tests', function(){
	var input_history,
		input_pattern,
		set_method = request_history_parser.setHistory,
		get_method = request_history_parser.returnVisitCount,
		expected,
		result;

	input_history = returnCompleteHistoryObject();
	set_method(input_history);

	input_pattern = 'default';
	expected = 2;
	result = get_method(input_pattern);
	equal(result, expected, 'Return count from a history with two timestamps');

	input_pattern = 'example.com';
	expected = 0;
	result = get_method(input_pattern);
	equal(result, expected, 'Return count from a history with no timestamps');

	input_pattern = 'test.com';
	expected = 0;
	result = get_method(input_pattern);
	equal(result, expected, 'Return count from a non-existant pattern');

	input_pattern = '.*test.co.uk';
	expected = 1;
	result = get_method(input_pattern);
	equal(result, expected, 'Return count from a history with one timestamp');
});

test('returnLastVisitTimestamp tests', function(){
	var input_history,
		input_pattern,
		set_method = request_history_parser.setHistory,
		get_method = request_history_parser.returnLastVisitTimestamp,
		expected,
		result;

	input_history = returnCompleteHistoryObject();
	set_method(input_history);

	input_pattern = '.*test.co.uk';
	result = get_method(input_pattern);
	ok(result, expected, 'Return a last timestamp');

	input_pattern = 'default';
	result = get_method(input_pattern);
	ok(result, 'Return a last timestamp in an item with multiple entries.');

	input_pattern = 'example.com';
	expected = 0;
	result = get_method(input_pattern);
	equal(result, expected, 'Return timestamp of existing pattern with no timestamps');

	input_pattern = 'test.com';
	expected = 0;
	result = get_method(input_pattern);
	equal(result, expected, 'Return timestamp of a non existing pattern');
});
