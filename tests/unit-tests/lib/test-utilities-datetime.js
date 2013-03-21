var datetime;

module('Utilities - DateTime Tests', {
	setup: function(){
		datetime = new DateTime();
	},
	teardown: function(){

	}
});

test('returnDate tests', function(){
	var input,
		method = datetime.returnDate,
		expected,
		result;

	input = '11-15-2012';
	expected = '2012.11.15';
	result = method(input);
	equal(result, expected, 'Date Format "mm-dd-yyyy" Conversion');

	input = '11/15/2012';
	expected = '2012.11.15';
	result = method(input);
	equal(result, expected, 'Date Format "mm/dd/yyyy" Conversion');

	input = 'Monday, November 26, 2012';
	expected = '2012.11.26';
	result = method(input);
	equal(result, expected, 'Date Format "Weekday, Month Day, Year" Conversion');

	input = '2012-11-26T9:25:26';
	expected = '2012.11.26';
	result = method(input);
	equal(result, expected, 'Date Format ISO-8601 "YYYY-MM-DDTHH:mm:ss" Conversion');

	input = 1353906000 * 1000; // JS uses milliseconds 
	expected = '2012.11.26';
	result = method(input);
	equal(result, expected, 'Date Format JS Timestamp Conversion');
});

test('returnUnixTimestamp tests', function(){
	var input,
		method = datetime.returnUnixTimestamp,
		expected,
		result;

	input = '2012-11-26T00:00:00';
	expected = '1353906000';
	result = method(input);
	equal(result, expected, 'Date to Unix Timestamp Conversion');

	input = '2012-11-26T00:00:00 -0500';
	expected = '1353906000';
	result = method(input);
	equal(result, expected, 'Date to Unix Timestamp with explicit timezone Conversion');

	input = 1353906000 * 1000; // JS uses milliseconds
	expected = '1353906000';
	result = method(input);
	equal(result, expected, 'JS Timestamp (ms) to Unix Timestamp (s)');

	input = '1353906000';
	expected = NaN;
	result = method(input);
	equal(isNaN(result), true, 'Unix Timestamp will fail. Needs special conversion.');
});

test('returnUnixTimestampDifferenceInMinutes tests', function(){
	var input,
		method = datetime.returnUnixTimestampDifferenceInMinutes,
		expected,
		result;

	input_one = '1353906120';
	input_two = '1353906000';
	expected = '2';
	result = method(input_one, input_two);
	equal(result, expected, 'Unix Timestamp');

	input_one = '1353906000';
	input_two = '1353906120';
	expected = '2';
	result = method(input_one, input_two);
	equal(result, expected, 'Time difference is absolute, input order does not matter.');
});
